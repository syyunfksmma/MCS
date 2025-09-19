using System;
using System.IO;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using Microsoft.Extensions.Options;

namespace MCMS.Infrastructure.FileStorage;

public class FileStorageService : IFileStorageService
{
    private readonly FileStorageOptions _options;

    public FileStorageService(IOptions<FileStorageOptions> options)
    {
        _options = options.Value;
    }

    public async Task<FileSaveResult> SaveAsync(Stream content, string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        await using var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 81920, useAsync: true);
        using var sha256 = SHA256.Create();

        var buffer = new byte[81920];
        long totalBytes = 0;
        int bytesRead;
        while ((bytesRead = await content.ReadAsync(buffer, 0, buffer.Length, cancellationToken)) > 0)
        {
            await fileStream.WriteAsync(buffer, 0, bytesRead, cancellationToken);
            sha256.TransformBlock(buffer, 0, bytesRead, null, 0);
            totalBytes += bytesRead;
        }
        sha256.TransformFinalBlock(Array.Empty<byte>(), 0, 0);

        var checksum = Convert.ToHexString(sha256.Hash!).ToLowerInvariant();
        if (content.CanSeek)
        {
            content.Seek(0, SeekOrigin.Begin);
        }

        return new FileSaveResult(relativePath, checksum, totalBytes);
    }

    public Task<Stream> OpenReadAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, useAsync: true);
        return Task.FromResult(stream);
    }

    public Task<bool> ExistsAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        return Task.FromResult(File.Exists(fullPath));
    }

    public Task DeleteAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
        return Task.CompletedTask;
    }

    public async Task WriteJsonAsync<T>(string relativePath, T payload, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
        await using var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true);
        await JsonSerializer.SerializeAsync(stream, payload, new JsonSerializerOptions { WriteIndented = true }, cancellationToken);
    }

    private string GetFullPath(string relativePath)
    {
        relativePath = relativePath.Replace('\\', Path.DirectorySeparatorChar)
                                   .Replace('/', Path.DirectorySeparatorChar)
                                   .TrimStart(Path.DirectorySeparatorChar);
        return Path.Combine(_options.RootPath, relativePath);
    }
}
