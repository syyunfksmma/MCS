using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class CreateItemRequestValidator : AbstractValidator<CreateItemRequest>
{
    public CreateItemRequestValidator()
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .MaximumLength(64);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(128);

        RuleFor(x => x.CreatedBy)
            .NotEmpty()
            .MaximumLength(64);
    }
}
