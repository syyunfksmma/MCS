using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class RejectRoutingRequestValidator : AbstractValidator<RejectRoutingRequest>
{
    public RejectRoutingRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        RuleFor(x => x.RejectedBy).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(2048);
        RuleFor(x => x.RejectedAt).NotEqual(default(DateTimeOffset));
    }
}
