using FluentValidation;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Validation;

public class ReviewRoutingRequestValidator : AbstractValidator<ReviewRoutingRequest>
{
    public ReviewRoutingRequestValidator()
    {
        RuleFor(x => x.RoutingId).NotEmpty();
        RuleFor(x => x.ReviewedBy).NotEmpty().MaximumLength(64);
        RuleFor(x => x.EffectiveDate)
            .GreaterThanOrEqualTo(DateTimeOffset.UtcNow.Date)
            .WithMessage("유효 시작일은 오늘 이전일 수 없습니다.");
    }
}
