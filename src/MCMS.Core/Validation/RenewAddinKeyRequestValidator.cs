using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class RenewAddinKeyRequestValidator : AbstractValidator<RenewAddinKeyRequest>
{
    public RenewAddinKeyRequestValidator()
    {
        RuleFor(x => x.ValidDays).GreaterThan(0).LessThanOrEqualTo(365).When(x => x.ValidDays.HasValue);
    }
}
