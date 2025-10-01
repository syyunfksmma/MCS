using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class CreateRoutingRequestValidator : AbstractValidator<CreateRoutingRequest>
{
    public CreateRoutingRequestValidator()
    {
        RuleFor(x => x.ItemRevisionId).NotEmpty();
        RuleFor(x => x.RoutingCode)
            .NotEmpty()
            .MaximumLength(64);
        RuleFor(x => x.RequestedBy)
            .NotEmpty()
            .MaximumLength(64);
        RuleFor(x => x.ClientRequestId)
            .MaximumLength(64);
        RuleFor(x => x.Steps)
            .NotEmpty()
            .Must(steps => steps.Select(s => s.Sequence).Distinct().Count() == steps.Count())
            .WithMessage("Sequence 값이 중복되면 안 됩니다.");

        RuleForEach(x => x.Steps).SetValidator(new RoutingStepWriteModelValidator());
        RuleForEach(x => x.Files).SetValidator(new RoutingFileWriteModelValidator());
    }
}

public class RoutingStepWriteModelValidator : AbstractValidator<RoutingStepWriteModel>
{
    public RoutingStepWriteModelValidator()
    {
        RuleFor(x => x.Sequence).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Machine).NotEmpty().MaximumLength(64);
        RuleFor(x => x.ProcessDescription).NotEmpty().MaximumLength(512);
    }
}

public class RoutingFileWriteModelValidator : AbstractValidator<RoutingFileWriteModel>
{
    public RoutingFileWriteModelValidator()
    {
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(256);
        RuleFor(x => x.RelativePath).NotEmpty().MaximumLength(512);
        RuleFor(x => x.FileSizeBytes).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Checksum).NotEmpty().MaximumLength(128);
        RuleFor(x => x.FileType).NotEmpty().MaximumLength(32);
    }
}
