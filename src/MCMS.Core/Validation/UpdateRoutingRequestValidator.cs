using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class UpdateRoutingRequestValidator : AbstractValidator<UpdateRoutingRequest>
{
    public UpdateRoutingRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        When(x => x.CamRevision is not null, () =>
        {
            RuleFor(x => x.CamRevision)
                .Matches(@"^\d+\.\d+\.\d+$")
                .WithMessage("CAM Rev는 semantic version 형식이어야 합니다.");
        });
        When(x => x.Steps is not null, () =>
        {
            RuleForEach(x => x.Steps!).SetValidator(new RoutingStepWriteModelValidator());
        });
        When(x => x.Files is not null, () =>
        {
            RuleForEach(x => x.Files!).SetValidator(new RoutingFileWriteModelValidator());
        });
        RuleFor(x => x.UpdatedBy).NotEmpty().MaximumLength(64);
    }
}
