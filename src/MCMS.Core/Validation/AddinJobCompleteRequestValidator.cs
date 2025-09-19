using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class AddinJobCompleteRequestValidator : AbstractValidator<AddinJobCompleteRequest>
{
    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "completed",
        "failed"
    };

    public AddinJobCompleteRequestValidator()
    {
        RuleFor(x => x.ResultStatus)
            .NotEmpty()
            .Must(status => AllowedStatuses.Contains(status))
            .WithMessage("ResultStatus must be either 'completed' or 'failed'.");
        RuleFor(x => x.Message).MaximumLength(1024);
    }
}
