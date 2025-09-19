using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class UploadRoutingFileRequestValidator : AbstractValidator<UploadRoutingFileRequest>
{
    public UploadRoutingFileRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        RuleFor(x => x.Content).NotNull();
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(256);
        RuleFor(x => x.FileType).NotEmpty().MaximumLength(32);
        RuleFor(x => x.UploadedBy).NotEmpty().MaximumLength(128);
    }
}
