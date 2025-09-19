using MCMS.CmdContracts.Commands;
using MCMS.Core.Abstractions;
using MCMS.Infrastructure.Services;

namespace MCMS.Workers;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly ICommandQueue _commandQueue;
    private readonly IEspritAutomationService _espritAutomationService;

    public Worker(ILogger<Worker> logger, ICommandQueue commandQueue, IEspritAutomationService espritAutomationService)
    {
        _logger = logger;
        _commandQueue = commandQueue;
        _espritAutomationService = espritAutomationService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var command in _commandQueue.DequeueAsync<EspritGenerationCommand>(stoppingToken))
        {
            try
            {
                _logger.LogInformation("Esprit 명령 실행 준비 - RoutingId={RoutingId}", command.RoutingId);
                await _espritAutomationService.TriggerProgramGenerationAsync(command.RoutingId, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Esprit 명령 실행 중 오류 발생 - RoutingId={RoutingId}", command.RoutingId);
            }
        }
    }
}

