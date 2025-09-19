using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace MCMS.Core.Abstractions;

public interface IFileStorageService
{
    Task<FileSaveResult> SaveAsync(Stream content, string relativePath, CancellationToken cancellationToken = default);
    Task<Stream> OpenReadAsync(string relativePath, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string relativePath, CancellationToken cancellationToken = default);
    Task DeleteAsync(string relativePath, CancellationToken cancellationToken = default);
    Task WriteJsonAsync<T>(string relativePath, T payload, CancellationToken cancellationToken = default);
}
