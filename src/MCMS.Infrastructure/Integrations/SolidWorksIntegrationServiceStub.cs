using Microsoft.Extensions.Logging;
using MCMS.Core.Abstractions;

namespace MCMS.Infrastructure.Integrations;

public class SolidWorksIntegrationServiceStub : ISolidWorksIntegrationService
{
    private readonly ILogger<SolidWorksIntegrationServiceStub> _logger;

    public SolidWorksIntegrationServiceStub(ILogger<SolidWorksIntegrationServiceStub> logger)
    {
        _logger = logger;
    }

    public Task LinkModelAsync(Guid itemRevisionId, string modelPath, string? configuration, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[Stub] SolidWorks 모델을 연결했습니다. Revision={RevisionId}, Path={Path}, Configuration={Configuration}",
            itemRevisionId, modelPath, configuration);
        return Task.CompletedTask;
    }

    public Task UnlinkModelAsync(Guid itemRevisionId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("[Stub] SolidWorks 모델 연결을 해제했습니다. Revision={RevisionId}", itemRevisionId);
        return Task.CompletedTask;
    }
}

