namespace MCMS.Core.Abstractions;

public interface IEspritAutomationService
{
    Task TriggerProgramGenerationAsync(Guid routingId, CancellationToken cancellationToken = default);
    Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default);
}
