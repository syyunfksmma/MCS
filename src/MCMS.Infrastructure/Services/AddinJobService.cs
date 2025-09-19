using System.Collections.Generic;
using FluentValidation;
using System.Text.Json;
using MCMS.CmdContracts.Commands;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Core.Validation;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class AddinJobService : IAddinJobService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly McmsDbContext _dbContext;
    private readonly ICommandQueue _commandQueue;
    private readonly AddinJobCreateRequestValidator _createValidator = new();
    private readonly AddinJobCompleteRequestValidator _completeValidator = new();

    public AddinJobService(McmsDbContext dbContext, ICommandQueue commandQueue)
    {
        _dbContext = dbContext;
        _commandQueue = commandQueue;
    }

    public async Task<AddinJobDto> EnqueueAsync(AddinJobCreateRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var routingExists = await _dbContext.Routings.AsNoTracking().AnyAsync(r => r.Id == request.RoutingId, cancellationToken);
        if (!routingExists)
        {
            throw new KeyNotFoundException("Routing을 찾을 수 없습니다.");
        }

        var entity = new AddinJob
        {
            RoutingId = request.RoutingId,
            ParametersJson = JsonSerializer.Serialize(request.Parameters ?? new Dictionary<string, string>(), SerializerOptions),
            CreatedBy = request.CreatedBy
        };

        _dbContext.AddinJobs.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<AddinJobDto?> DequeueAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var job = await _dbContext.AddinJobs
            .Where(j => j.Status == AddinJobStatus.Pending)
            .OrderBy(j => j.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (job is null)
        {
            return null;
        }

        job.Status = AddinJobStatus.InProgress;
        job.StartedAt = now;
        job.UpdatedAt = now;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Map(job);
    }

    public async Task<AddinJobDto> CompleteAsync(Guid jobId, AddinJobCompleteRequest request, CancellationToken cancellationToken = default)
    {
        await _completeValidator.ValidateAndThrowAsync(request, cancellationToken);

        var job = await _dbContext.AddinJobs.FirstOrDefaultAsync(j => j.Id == jobId, cancellationToken)
            ?? throw new KeyNotFoundException("작업을 찾을 수 없습니다.");

        if (job.Status == AddinJobStatus.Completed || job.Status == AddinJobStatus.Failed)
        {
            return Map(job);
        }

        var status = request.ResultStatus.Equals("failed", StringComparison.OrdinalIgnoreCase)
            ? AddinJobStatus.Failed
            : AddinJobStatus.Completed;

        job.Status = status;
        job.ResultStatus = request.ResultStatus;
        job.Message = request.Message;
        job.CompletedAt = DateTimeOffset.UtcNow;
        job.UpdatedAt = job.CompletedAt;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _commandQueue.EnqueueAsync(new AddinJobResultCommand(
            job.Id,
            job.RoutingId,
            job.ResultStatus ?? request.ResultStatus,
            job.Message), cancellationToken);

        return Map(job);
    }

    public async Task<AddinJobDto?> GetAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        var job = await _dbContext.AddinJobs.AsNoTracking().FirstOrDefaultAsync(j => j.Id == jobId, cancellationToken);
        return job is null ? null : Map(job);
    }

    private static AddinJobDto Map(AddinJob entity)
    {
        var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(entity.ParametersJson ?? "{}", SerializerOptions)
            ?? new Dictionary<string, string>();

        return new AddinJobDto(
            entity.Id,
            entity.RoutingId,
            entity.Status.ToString(),
            entity.CreatedAt,
            entity.StartedAt,
            entity.CompletedAt,
            parameters,
            entity.ResultStatus,
            entity.Message);
    }
}

