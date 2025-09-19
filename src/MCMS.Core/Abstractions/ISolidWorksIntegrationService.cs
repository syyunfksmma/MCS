namespace MCMS.Core.Abstractions;

public interface ISolidWorksIntegrationService
{
    Task LinkModelAsync(Guid itemRevisionId, string modelPath, string? configuration, CancellationToken cancellationToken = default);
    Task UnlinkModelAsync(Guid itemRevisionId, CancellationToken cancellationToken = default);
}
