using System.Threading;
using System.Threading.Tasks;

namespace MCMS.Core.Abstractions;

public interface IOperationsAlertService
{
    Task PublishAsync(string category, string message, CancellationToken cancellationToken = default);
}
