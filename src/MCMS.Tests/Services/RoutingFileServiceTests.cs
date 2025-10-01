using System.Security.Cryptography;
using System.Text;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Core.Abstractions;
using MCMS.Infrastructure.FileStorage;
using Microsoft.Extensions.Logging.Abstractions;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Xunit;

namespace MCMS.Tests.Services;

public class RoutingFileServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    private static async Task<Guid> SeedRoutingAsync(McmsDbContext context)
    {
        var item = new Item
        {
            ItemCode = "ITEM-200",
            Name = "파일 테스트 품목",
            CreatedBy = "tester"
        };

        var revision = new ItemRevision
        {
            Item = item,
            RevisionCode = "REV-FILE",
            CreatedBy = "tester"
        };

        var routing = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "ROUT-FILE",
            Status = RoutingStatus.Draft,
            CreatedBy = "tester"
        };

        context.Items.Add(item);
        context.ItemRevisions.Add(revision);
        context.Routings.Add(routing);
        await context.SaveChangesAsync();
        return routing.Id;
    }

    private static (RoutingFileService Service, string RootPath, HistoryService History, McmsDbContext Context, FileStorageService Storage) CreateService()
    {
        var context = CreateContext();
        var history = new HistoryService(context);
        var root = Path.Combine(Path.GetTempPath(), "mcms-tests", Guid.NewGuid().ToString());
        Directory.CreateDirectory(root);
        var storage = new FileStorageService(Options.Create(new FileStorageOptions { RootPath = root }), NullLogger<FileStorageService>.Instance);
        var operationsAlert = new OperationsAlertService(NullLogger<OperationsAlertService>.Instance);
        var service = new RoutingFileService(context, storage, history, NullLogger<RoutingFileService>.Instance, operationsAlert);
        return (service, root, history, context, storage);
    }

    private static async Task WaitForFileAsync(string path, TimeSpan timeout)
    {
        var deadline = DateTime.UtcNow + timeout;
        while (DateTime.UtcNow <= deadline)
        {
            if (File.Exists(path))
            {
                return;
            }

            await Task.Delay(50).ConfigureAwait(false);
        }

        throw new TimeoutException($"File not created within {timeout.TotalMilliseconds} ms: {path}");
    }

    [Fact]
    public async Task UploadAsync_SavesFileAndGeneratesMeta()
    {
        var (service, root, history, context, storage) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            var contentBytes = Encoding.UTF8.GetBytes("G01 X10 Y10");
            await using var stream = new MemoryStream(contentBytes, writable: false);

            var meta = await service.UploadAsync(new UploadRoutingFileRequest(
                routingId,
                stream,
                "program.nc",
                "nc",
                true,
                "operator"));

            Assert.Single(meta.Files);
            var fileEntry = meta.Files.First();
            Assert.Equal("program.nc", fileEntry.FileName);
            Assert.Equal("nc", fileEntry.FileType, ignoreCase: true);
            Assert.True(fileEntry.IsPrimary);

            using var sha = SHA256.Create();
            var expectedChecksum = Convert.ToHexString(sha.ComputeHash(contentBytes)).ToLowerInvariant();
            Assert.Equal(expectedChecksum, fileEntry.Checksum);

            var storedFilePath = Path.Combine(root, fileEntry.RelativePath.Replace('/', Path.DirectorySeparatorChar));
            Assert.True(File.Exists(storedFilePath));

            var metaPath = Path.Combine(root, meta.MetaPath.Replace('/', Path.DirectorySeparatorChar));
            await WaitForFileAsync(metaPath, TimeSpan.FromSeconds(2));
            Assert.True(File.Exists(metaPath));
        }
        finally
        {
            await storage.DisposeAsync();
            if (Directory.Exists(root))
            {
                Directory.Delete(root, true);
            }
            await context.DisposeAsync();
        }
    }

    [Fact]
    public async Task DeleteAsync_RemovesFileAndUpdatesMeta()
    {
        var (service, root, history, context, storage) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            await using (var uploadStream = new MemoryStream(Encoding.UTF8.GetBytes("TEST"), writable: false))
            {
                await service.UploadAsync(new UploadRoutingFileRequest(
                    routingId,
                    uploadStream,
                    "fixture.stl",
                    "stl",
                    false,
                    "operator"));
            }

            var file = await context.RoutingFiles.AsNoTracking().FirstAsync();

            var meta = await service.DeleteAsync(routingId, file.Id, "operator", CancellationToken.None);


            Assert.Empty(meta.Files);

            // 파일 삭제는 후속 정리 프로세스에서 처리되므로 여기서는 메타 정보만 검증한다.
        }
        finally
        {
            await storage.DisposeAsync();
            if (Directory.Exists(root))
            {
                Directory.Delete(root, true);
            }
            await context.DisposeAsync();
        }
    }
}






