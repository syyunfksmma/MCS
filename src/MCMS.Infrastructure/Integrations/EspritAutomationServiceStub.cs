using Microsoft.Extensions.Logging;
using MCMS.Core.Abstractions;

namespace MCMS.Infrastructure.Integrations;

public class EspritAutomationServiceStub : IEspritAutomationService
{
    private readonly ILogger<EspritAutomationServiceStub> _logger;

    public EspritAutomationServiceStub(ILogger<EspritAutomationServiceStub> logger)
    {
        _logger = logger;
    }

    public Task TriggerProgramGenerationAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[Stub] Esprit 프로그램 생성을 큐잉했습니다. RoutingId={RoutingId}", routingId);
        return Task.CompletedTask;
    }

    public Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(true);
    }
}

