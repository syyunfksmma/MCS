using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using Microsoft.Extensions.Logging;

namespace MCMS.Infrastructure.Services;

public class OperationsAlertService : IOperationsAlertService
{
    private readonly ILogger<OperationsAlertService> _logger;

    public OperationsAlertService(ILogger<OperationsAlertService> logger)
    {
        _logger = logger;
    }

    public Task PublishAsync(string category, string message, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("[Operations:{Category}] {Message}", category, message);
        return Task.CompletedTask;
    }
}
