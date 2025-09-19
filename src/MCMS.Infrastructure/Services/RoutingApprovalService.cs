using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MCMS.CmdContracts.Commands;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Enums;
using MCMS.Core.Validation;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class RoutingApprovalService : IRoutingApprovalService
{
    private static readonly string[] ApprovalHistoryChangeTypes =
    {
        "ApprovalRequested",
        "RoutingApproved",
        "RoutingRejected",
        "RoutingReviewed"
    };

    private readonly McmsDbContext _dbContext;
    private readonly IHistoryService _historyService;
    private readonly IRoutingService _routingService;
    private readonly ICommandQueue _commandQueue;
    private readonly RequestRoutingApprovalRequestValidator _requestValidator = new();
    private readonly ApproveRoutingRequestValidator _approveValidator = new();
    private readonly RejectRoutingRequestValidator _rejectValidator = new();

    public RoutingApprovalService(
        McmsDbContext dbContext,
        IHistoryService historyService,
        IRoutingService routingService,
        ICommandQueue commandQueue)
    {
        _dbContext = dbContext;
        _historyService = historyService;
        _routingService = routingService;
        _commandQueue = commandQueue;
    }

    public async Task<RoutingDto> RequestApprovalAsync(RequestRoutingApprovalRequest request, CancellationToken cancellationToken = default)
    {
        await _requestValidator.ValidateAndThrowAsync(request, cancellationToken);

        var routing = await _dbContext.Routings
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");

        if (routing.ApprovalStatus == ApprovalStatus.Pending)
        {
            throw new InvalidOperationException("?? ???? ?? ?? ?? ?????.");
        }

        var requestedAt = DateTimeOffset.UtcNow;
        routing.ApprovalStatus = ApprovalStatus.Pending;
        routing.ApprovalRequestedAt = requestedAt;
        routing.ApprovalRequestedBy = request.RequestedBy;
        routing.Status = RoutingStatus.PendingApproval;
        routing.UpdatedAt = requestedAt;
        routing.UpdatedBy = request.RequestedBy;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routing.Id,
            "ApprovalRequested",
            null,
            null,
            routing.Status.ToString(),
            ApprovalOutcome.Pending,
            requestedAt,
            request.RequestedBy,
            request.Comment), cancellationToken);

        return await _routingService.GetRoutingAsync(routing.Id, cancellationToken)
            ?? throw new InvalidOperationException("Routing ??? ??????.");
    }

    public async Task<RoutingDto> ApproveAsync(ApproveRoutingRequest request, CancellationToken cancellationToken = default)
    {
        await _approveValidator.ValidateAndThrowAsync(request, cancellationToken);

        var routing = await _dbContext.Routings
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");

        if (routing.ApprovalStatus != ApprovalStatus.Pending)
        {
            throw new InvalidOperationException("?? ??? ?? ??????.");
        }

        var previousStatus = routing.Status;
        routing.ApprovalStatus = ApprovalStatus.Approved;
        routing.Status = RoutingStatus.Approved;
        routing.UpdatedAt = request.ApprovedAt;
        routing.UpdatedBy = request.ApprovedBy;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routing.Id,
            "RoutingApproved",
            nameof(routing.Status),
            previousStatus.ToString(),
            routing.Status.ToString(),
            ApprovalOutcome.Approved,
            request.ApprovedAt,
            request.ApprovedBy,
            request.Comment), cancellationToken);

        await _commandQueue.EnqueueAsync(new EspritGenerationCommand(routing.Id), cancellationToken);

        return await _routingService.GetRoutingAsync(routing.Id, cancellationToken)
            ?? throw new InvalidOperationException("Routing ??? ??????.");
    }

    public async Task<RoutingDto> RejectAsync(RejectRoutingRequest request, CancellationToken cancellationToken = default)
    {
        await _rejectValidator.ValidateAndThrowAsync(request, cancellationToken);

        var routing = await _dbContext.Routings
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");

        if (routing.ApprovalStatus != ApprovalStatus.Pending)
        {
            throw new InvalidOperationException("??? ?? ??? ????.");
        }

        var previousStatus = routing.Status;
        routing.ApprovalStatus = ApprovalStatus.Rejected;
        routing.Status = RoutingStatus.Rejected;
        routing.UpdatedAt = request.RejectedAt;
        routing.UpdatedBy = request.RejectedBy;

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routing.Id,
            "RoutingRejected",
            nameof(routing.Status),
            previousStatus.ToString(),
            routing.Status.ToString(),
            ApprovalOutcome.Rejected,
            request.RejectedAt,
            request.RejectedBy,
            request.Reason), cancellationToken);

        return await _routingService.GetRoutingAsync(routing.Id, cancellationToken)
            ?? throw new InvalidOperationException("Routing ??? ??????.");
    }

    public async Task<IReadOnlyCollection<HistoryEntryDto>> GetApprovalHistoryAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        var history = await _historyService.GetHistoryForRoutingAsync(routingId, cancellationToken);
        return history
            .Where(entry => ApprovalHistoryChangeTypes.Contains(entry.ChangeType))
            .OrderBy(entry => entry.CreatedAt)
            .ToList();
    }
}
