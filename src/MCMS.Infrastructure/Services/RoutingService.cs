using FluentValidation;
using MCMS.CmdContracts.Commands;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Core.Exceptions;
using MCMS.Core.Validation;
using MCMS.Infrastructure.Persistence;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class RoutingService : IRoutingService
{
    private static readonly HashSet<string> AllowedFileTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "esprit", "nc", "wp", "stl", "mprj", "gdml", "meta", "solidworks", "other"
    };

    private readonly McmsDbContext _dbContext;
    private readonly IHistoryService _historyService;
    private readonly ICommandQueue _commandQueue;
    private readonly IEspritAutomationService _espritAutomationService;
    private readonly IMemoryCache _idempotencyCache;
    private readonly ILogger<RoutingService> _logger;

    private const string IdempotencyCacheKeyPrefix = "routing:create:";
    private static readonly TimeSpan IdempotencyCacheTtl = TimeSpan.FromMinutes(10);
    private readonly CreateRoutingRequestValidator _createValidator = new();
    private readonly UpdateRoutingRequestValidator _updateValidator = new();
    private readonly ReviewRoutingRequestValidator _reviewValidator = new();

    public RoutingService(
        McmsDbContext dbContext,
        IHistoryService historyService,
        ICommandQueue commandQueue,
        IEspritAutomationService espritAutomationService,
        IMemoryCache idempotencyCache,
        ILogger<RoutingService> logger)
    {
        _dbContext = dbContext;
        _historyService = historyService;
        _commandQueue = commandQueue;
        _espritAutomationService = espritAutomationService;
        _idempotencyCache = idempotencyCache;
        _logger = logger;
    }

    public async Task<RoutingDto> CreateRoutingAsync(CreateRoutingRequest request, CancellationToken cancellationToken = default)
    {
        await ValidateAsync(_createValidator, request, cancellationToken);
        EnsureFileTypesAreSupported(request.Files);

        var revision = await _dbContext.ItemRevisions
            .Include(r => r.Routings)
            .ThenInclude(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == request.ItemRevisionId, cancellationToken)
            ?? throw new KeyNotFoundException("Item Revision? ?? ? ????.");

        if (request.IsPrimary)
        {
            foreach (var existing in revision.Routings.Where(r => r.IsPrimary))
            {
                existing.IsPrimary = false;
            }
        }

        var entity = new Routing
        {
            ItemRevisionId = revision.Id,
            RoutingCode = request.RoutingCode,
            IsPrimary = request.IsPrimary,
            Status = RoutingStatus.PendingApproval,
            CamRevision = "1.0.0",
            CreatedBy = request.RequestedBy
        };

        foreach (var step in request.Steps.OrderBy(s => s.Sequence))
        {
            entity.Steps.Add(new RoutingStep
            {
                Sequence = step.Sequence,
                Machine = step.Machine,
                ProcessDescription = step.ProcessDescription,
                ToolInformation = step.ToolInformation,
                Notes = step.Notes,
                CreatedBy = request.RequestedBy
            });
        }

        foreach (var file in request.Files)
        {
            entity.Files.Add(new RoutingFile
            {
                FileName = file.FileName,
                RelativePath = file.RelativePath,
                FileSizeBytes = file.FileSizeBytes,
                Checksum = file.Checksum,
                FileType = MapFileType(file.FileType),
                IsPrimary = file.IsPrimary,
                CreatedBy = request.RequestedBy
            });
        }

        _dbContext.Routings.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            entity.Id,
            "RoutingCreated",
            null,
            null,
            null,
            ApprovalOutcome.Pending,
            entity.CreatedAt,
            entity.CreatedBy,
            null), cancellationToken);

        await _commandQueue.EnqueueAsync(new EspritGenerationCommand(entity.Id), cancellationToken);

        return await GetRoutingAsync(entity.Id, cancellationToken)
            ?? throw new InvalidOperationException("Routing? ???? ?????.");
    }

    private static string? GetCacheKey(string? clientRequestId)
    {
        if (string.IsNullOrWhiteSpace(clientRequestId))
        {
            return null;
        }

        return string.Concat(IdempotencyCacheKeyPrefix, clientRequestId.Trim());
    }

    private async Task<Routing?> FindExistingRoutingAsync(Guid itemRevisionId, string routingCode, CancellationToken cancellationToken)
    {
        return await _dbContext.Routings
            .Include(r => r.Steps)
            .Include(r => r.Files)
            .FirstOrDefaultAsync(r => r.ItemRevisionId == itemRevisionId && r.RoutingCode == routingCode, cancellationToken)
            .ConfigureAwait(false);
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException exception)
    {
        if (exception.InnerException is SqlException sqlException)
        {
            return sqlException.Number is 2601 or 2627;
        }

        return false;
    }

    public async Task<RoutingDto?> GetRoutingAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.Steps)
            .Include(r => r.Files)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken);

        if (entity is null)
        {
            return null;
        }

        var history = await _historyService.GetHistoryForRoutingAsync(routingId, cancellationToken);
        return Map(entity, history);
    }

    public async Task<IEnumerable<RoutingSummaryDto>> GetRoutingsForRevisionAsync(Guid itemRevisionId, CancellationToken cancellationToken = default)
    {
        var summaries = await _dbContext.Routings
            .AsNoTracking()
            .Where(r => r.ItemRevisionId == itemRevisionId)
            .Select(r => new RoutingSummaryDto(
                r.Id,
                r.RoutingCode,
                r.Status,
                r.CamRevision ?? "1.0.0",
                r.IsPrimary,
                r.ApprovalStatus,
                r.ApprovalRequestedAt,
                r.ApprovalRequestedBy,
                r.Steps.Count,
                r.Files.Count,
                r.UpdatedAt ?? r.CreatedAt,
                r.UpdatedBy))
            .OrderByDescending(r => r.UpdatedAt)
            .ToListAsync(cancellationToken);

        return summaries;
    }

    public async Task<RoutingDto> UpdateRoutingAsync(UpdateRoutingRequest request, CancellationToken cancellationToken = default)
    {
        await ValidateAsync(_updateValidator, request, cancellationToken);
        if (request.Files is not null)
        {
            EnsureFileTypesAreSupported(request.Files);
        }

        var entity = await _dbContext.Routings
            .Include(r => r.Steps)
            .Include(r => r.Files)
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");

        var previousCamRev = entity.CamRevision;

        if (request.CamRevision is not null)
        {
            entity.CamRevision = request.CamRevision;
        }

        if (request.IsPrimary.HasValue && request.IsPrimary.Value != entity.IsPrimary)
        {
            entity.IsPrimary = request.IsPrimary.Value;
            if (entity.IsPrimary)
            {
                var siblings = _dbContext.Routings.Where(r => r.ItemRevisionId == entity.ItemRevisionId && r.Id != entity.Id);
                await siblings.ExecuteUpdateAsync(setters => setters.SetProperty(r => r.IsPrimary, false), cancellationToken);
            }
        }

        if (request.Steps is not null)
        {
            _dbContext.RoutingSteps.RemoveRange(entity.Steps);
            entity.Steps.Clear();
            foreach (var step in request.Steps.OrderBy(s => s.Sequence))
            {
                entity.Steps.Add(new RoutingStep
                {
                    Sequence = step.Sequence,
                    Machine = step.Machine,
                    ProcessDescription = step.ProcessDescription,
                    ToolInformation = step.ToolInformation,
                    Notes = step.Notes,
                    CreatedBy = request.UpdatedBy
                });
            }
        }

        if (request.Files is not null)
        {
            _dbContext.RoutingFiles.RemoveRange(entity.Files);
            entity.Files.Clear();
            foreach (var file in request.Files)
            {
                entity.Files.Add(new RoutingFile
                {
                    FileName = file.FileName,
                    RelativePath = file.RelativePath,
                    FileSizeBytes = file.FileSizeBytes,
                    Checksum = file.Checksum,
                    FileType = MapFileType(file.FileType),
                    IsPrimary = file.IsPrimary,
                    CreatedBy = request.UpdatedBy
                });
            }
        }

        entity.UpdatedAt = DateTimeOffset.UtcNow;
        entity.UpdatedBy = request.UpdatedBy;
        entity.Status = RoutingStatus.PendingApproval;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            entity.Id,
            "RoutingUpdated",
            "CamRevision",
            previousCamRev,
            entity.CamRevision,
            ApprovalOutcome.Pending,
            entity.UpdatedAt!.Value,
            entity.UpdatedBy!,
            null), cancellationToken);

        await _commandQueue.EnqueueAsync(new EspritGenerationCommand(entity.Id), cancellationToken);

        return await GetRoutingAsync(entity.Id, cancellationToken)
            ?? throw new InvalidOperationException("Routing? ???? ?????.");
    }

    public async Task<RoutingDto> ReviewRoutingAsync(ReviewRoutingRequest request, CancellationToken cancellationToken = default)
    {
        await ValidateAsync(_reviewValidator, request, cancellationToken);

        var entity = await _dbContext.Routings
            .Include(r => r.Steps)
            .Include(r => r.Files)
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");

        entity.Status = request.Outcome switch
        {
            ApprovalOutcome.Approved => RoutingStatus.Approved,
            ApprovalOutcome.Rejected => RoutingStatus.Rejected,
            _ => RoutingStatus.PendingApproval
        };
        entity.UpdatedAt = DateTimeOffset.UtcNow;
        entity.UpdatedBy = request.ReviewedBy;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            entity.Id,
            "RoutingReviewed",
            nameof(entity.Status),
            null,
            entity.Status.ToString(),
            request.Outcome,
            entity.UpdatedAt.Value,
            entity.UpdatedBy!,
            request.Comment), cancellationToken);

        if (request.Outcome == ApprovalOutcome.Approved)
        {
            await _commandQueue.EnqueueAsync(new EspritGenerationCommand(entity.Id), cancellationToken);
        }

        var history = await _historyService.GetHistoryForRoutingAsync(entity.Id, cancellationToken);
        return Map(entity, history);
    }

    private static async Task ValidateAsync<T>(IValidator<T> validator, T request, CancellationToken cancellationToken)
        where T : class
    {
        var result = await validator.ValidateAsync(request, cancellationToken);
        if (!result.IsValid)
        {
            throw new ValidationException(result.Errors);
        }
    }

    private static RoutingDto Map(Routing routing, IEnumerable<HistoryEntryDto> history)
    {
        var steps = routing.Steps
            .OrderBy(s => s.Sequence)
            .Select(s => new RoutingStepDto(s.Id, s.Sequence, s.Machine, s.ProcessDescription, s.ToolInformation, s.Notes))
            .ToList();

        var files = routing.Files
            .Select(f => new RoutingFileDto(f.Id, f.FileType, f.FileName, f.RelativePath, f.FileSizeBytes, f.Checksum, f.IsPrimary, f.CreatedAt, f.CreatedBy))
            .ToList();

        return new RoutingDto(
            routing.Id,
            routing.ItemRevisionId,
            routing.RoutingCode,
            routing.Status,
            routing.CamRevision ?? "1.0.0",
            routing.IsPrimary,
            routing.ApprovalStatus,
            routing.ApprovalRequestedAt,
            routing.ApprovalRequestedBy,
            steps,
            files,
            history.ToList());
    }

    private static void EnsureFileTypesAreSupported(IEnumerable<RoutingFileWriteModel> files)
    {
        foreach (var file in files)
        {
            if (!AllowedFileTypes.Contains(file.FileType))
            {
                throw new ArgumentException($"???? ?? ?? ?????: {file.FileType}");
            }
        }
    }

    private static ManagedFileType MapFileType(string fileType)
    {
        return fileType.ToLowerInvariant() switch
        {
            "esprit" => ManagedFileType.Esprit,
            "nc" => ManagedFileType.Nc,
            "wp" => ManagedFileType.Workpiece,
            "stl" => ManagedFileType.Stl,
            "mprj" => ManagedFileType.MachineProject,
            "gdml" => ManagedFileType.Fixture,
            "meta" => ManagedFileType.Meta,
            "solidworks" => ManagedFileType.SolidWorks,
            _ => ManagedFileType.Other
        };
    }
}







