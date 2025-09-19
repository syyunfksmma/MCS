using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class ApproveRoutingRequestValidator : AbstractValidator<ApproveRoutingRequest>
{
    public ApproveRoutingRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        RuleFor(x => x.ApprovedBy).NotEmpty().MaximumLength(128);
        RuleFor(x => x.ApprovedAt).NotEqual(default(DateTimeOffset));
        RuleFor(x => x.Comment).MaximumLength(1024);
    }
}
