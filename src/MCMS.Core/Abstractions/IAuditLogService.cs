using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Contracts.Responses;

namespace MCMS.Core.Abstractions;

public interface IAuditLogService
{
    Task<AuditLogSearchResponse> SearchAsync(AuditLogQueryRequest request, CancellationToken cancellationToken = default);
    Task<AuditLogStatisticsDto> GetStatisticsAsync(AuditLogStatisticsRequest request, CancellationToken cancellationToken = default);
    Task RecordAsync(AuditLogEntryDto entry, CancellationToken cancellationToken = default);
    Task<byte[]> ExportCsvAsync(AuditLogQueryRequest request, CancellationToken cancellationToken = default);
}
