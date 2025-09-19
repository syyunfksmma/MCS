using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class RequestRoutingApprovalRequestValidator : AbstractValidator<RequestRoutingApprovalRequest>
{
    public RequestRoutingApprovalRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        RuleFor(x => x.RequestedBy).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Comment).MaximumLength(1024);
    }
}
