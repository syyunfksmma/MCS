using System.Data;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace MCMS.Infrastructure.Integrations;

public class ErpWorkOrderService : IErpWorkOrderService
{
    private readonly ICamWorkStatusService _camWorkStatusService;
    private readonly ILogger<ErpWorkOrderService> _logger;
    private readonly ErpOptions _options;

    public ErpWorkOrderService(
        IOptions<ErpOptions> options,
        ICamWorkStatusService camWorkStatusService,
        ILogger<ErpWorkOrderService> logger)
    {
        _options = options.Value;
        _camWorkStatusService = camWorkStatusService;
        _logger = logger;
    }

    public async Task<IReadOnlyList<ErpWorkOrderDto>> GetPendingWorkOrdersAsync(CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ConnectionString))
        {
            throw new InvalidOperationException("ERP 연결 문자열이 설정되지 않았습니다. 환경 변수를 확인하세요.");
        }

        var viewName = string.IsNullOrWhiteSpace(_options.WorkOrderViewName)
            ? "BI_OPERATION_VIEW"
            : _options.WorkOrderViewName.Trim();

        viewName = viewName.Replace("]", "]]", StringComparison.Ordinal);

        var query = $@"SELECT TOP (500)
    [WoNo],
    [ProcSeq],
    [ItemCd],
    [OrderQty],
    [JobCd],
    [MachNm],
    [OperStatusNm],
    [StartYn]
FROM [{viewName}]
ORDER BY [WoNo], [ProcSeq];";

        await using var connection = new SqlConnection(_options.ConnectionString);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);

        await using var command = new SqlCommand(query, connection)
        {
            CommandType = CommandType.Text
        };

        var rows = new List<ErpRow>();

        await using var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection, cancellationToken)
            .ConfigureAwait(false);

        while (await reader.ReadAsync(cancellationToken).ConfigureAwait(false))
        {
            rows.Add(new ErpRow(
                WoNo: ReadString(reader, 0),
                ProcSeq: ReadString(reader, 1),
                ItemCd: ReadString(reader, 2),
                OrderQty: reader.IsDBNull(3) ? 0m : reader.GetDecimal(3),
                JobCd: ReadString(reader, 4),
                MachNm: ReadString(reader, 5),
                OperStatusNm: ReadString(reader, 6),
                StartYn: ReadString(reader, 7)));
        }

        var statusLookup = await _camWorkStatusService
            .GetManyAsync(rows.Select(static row => (row.WoNo, row.ProcSeq)), cancellationToken)
            .ConfigureAwait(false);

        var result = new List<ErpWorkOrderDto>(rows.Count);

        foreach (var row in rows)
        {
            statusLookup.TryGetValue((row.WoNo, row.ProcSeq), out var status);
            var dto = new ErpWorkOrderDto(
                WoNo: row.WoNo,
                ProcSeq: row.ProcSeq,
                ItemCd: row.ItemCd,
                OrderQty: row.OrderQty,
                JobCd: row.JobCd,
                MachNm: row.MachNm,
                OperStatusNm: row.OperStatusNm,
                StartYn: row.StartYn,
                Is3DModeled: status?.Is3DModeled ?? false,
                IsPgCompleted: status?.IsPgCompleted ?? false);

            if (dto.Is3DModeled && dto.IsPgCompleted)
            {
                continue;
            }

            result.Add(dto);
        }

        _logger.LogInformation(
            "ERP 공정 조회 결과 {RowCount}건 중 CAM 작업 가능 {ResultCount}건을 반환했습니다.",
            rows.Count,
            result.Count);

        return result;
    }

    private static string ReadString(SqlDataReader reader, int ordinal)
    {
        if (reader.IsDBNull(ordinal))
        {
            return string.Empty;
        }

        var value = reader.GetValue(ordinal);
        return value switch
        {
            string text => text.Trim(),
            char ch => ch.ToString(),
            _ => Convert.ToString(value, System.Globalization.CultureInfo.InvariantCulture)?.Trim() ?? string.Empty
        };
    }

    private readonly record struct ErpRow(
        string WoNo,
        string ProcSeq,
        string ItemCd,
        decimal OrderQty,
        string JobCd,
        string MachNm,
        string OperStatusNm,
        string StartYn);
}
