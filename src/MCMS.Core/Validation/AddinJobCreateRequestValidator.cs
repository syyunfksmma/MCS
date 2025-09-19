using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class AddinJobCreateRequestValidator : AbstractValidator<AddinJobCreateRequest>
{
    public AddinJobCreateRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        RuleFor(x => x.CreatedBy).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Parameters).NotNull();
    }
}
