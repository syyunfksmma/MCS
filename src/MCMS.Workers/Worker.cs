
using MCMS.CmdContracts.Commands;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MCMS.Workers;

public class Worker : BackgroundService
{
    private const string SystemUser = "MCMS.Worker";

    private readonly ILogger<Worker> _logger;
    private readonly ICommandQueue _commandQueue;
    private readonly IEspritAutomationService _espritAutomationService;
    private readonly IServiceScopeFactory _scopeFactory;

    public Worker(
        ILogger<Worker> logger,
        ICommandQueue commandQueue,
        IEspritAutomationService espritAutomationService,
        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _commandQueue = commandQueue;
        _espritAutomationService = espritAutomationService;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var message in _commandQueue.DequeueAsync<object>(stoppingToken))
        {
            switch (message)
            {
                case EspritGenerationCommand generation:
                    await HandleGenerationAsync(generation, stoppingToken);
                    break;
                case AddinJobResultCommand result:
                    await HandleAddinResultAsync(result, stoppingToken);
                    break;
                default:
                    _logger.LogWarning("지원되지 않는 커맨드 타입 수신: {CommandType}", message.GetType().Name);
                    break;
            }
        }
    }

    private async Task HandleGenerationAsync(EspritGenerationCommand command, CancellationToken stoppingToken)
    {
        try
        {
            _logger.LogInformation("Esprit 프로그램 생성 준비 - RoutingId={RoutingId}", command.RoutingId);
            await _espritAutomationService.TriggerProgramGenerationAsync(command.RoutingId, stoppingToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Esprit 프로그램 생성 중 오류 발생 - RoutingId={RoutingId}", command.RoutingId);
        }
    }

    private async Task HandleAddinResultAsync(AddinJobResultCommand command, CancellationToken stoppingToken)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<McmsDbContext>();
        var historyService = scope.ServiceProvider.GetRequiredService<IHistoryService>();

        var routing = await dbContext.Routings.FirstOrDefaultAsync(r => r.Id == command.RoutingId, stoppingToken);
        if (routing is null)
        {
            _logger.LogWarning("Add-in 결과 처리 중 Routing 미존재 - JobId={JobId}, RoutingId={RoutingId}", command.JobId, command.RoutingId);
            return;
        }

        var normalizedStatus = command.ResultStatus?.ToLowerInvariant();
        var success = normalizedStatus == "completed";
        var changeType = success ? "AddinJobCompleted" : "AddinJobFailed";
        var outcome = success ? ApprovalOutcome.Pending : ApprovalOutcome.Rejected;
        var now = DateTimeOffset.UtcNow;

        routing.UpdatedAt = now;
        routing.UpdatedBy = SystemUser;

        await dbContext.SaveChangesAsync(stoppingToken);

        await historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            command.RoutingId,
            changeType,
            null,
            null,
            command.ResultStatus,
            outcome,
            now,
            SystemUser,
            command.Message), stoppingToken);

        if (success)
        {
            _logger.LogInformation("Add-in 작업 완료 - JobId={JobId}, RoutingId={RoutingId}", command.JobId, command.RoutingId);
        }
        else
        {
            _logger.LogError("Add-in 작업 실패 - JobId={JobId}, RoutingId={RoutingId}, Message={Message}", command.JobId, command.RoutingId, command.Message);
        }
    }
}
