using System.Collections.Generic;

namespace CAM_API.Feature.Model
{
    /// <summary>
    /// CAD Feature 속성 필터링을 위한 단일 조건 정의
    /// 예: PropName = "Fastener Type", Values = ["드릴 크기", "Drill sizes"]
    /// </summary>
    public class CustomPropCondition
    {
        public string PropName { get; }
        public List<string> Values { get; }

        public CustomPropCondition(string propName, List<string> values)
        {
            PropName = propName;
            Values = values ?? new List<string>();
        }
    }
}
