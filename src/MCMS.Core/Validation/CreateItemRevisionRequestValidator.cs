using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class CreateItemRevisionRequestValidator : AbstractValidator<CreateItemRevisionRequest>
{
    public CreateItemRevisionRequestValidator()
    {
        RuleFor(x => x.ItemId).NotEmpty();
        RuleFor(x => x.RevisionCode)
            .NotEmpty()
            .MaximumLength(32);
        RuleFor(x => x.RequestedBy)
            .NotEmpty()
            .MaximumLength(64);
    }
}
