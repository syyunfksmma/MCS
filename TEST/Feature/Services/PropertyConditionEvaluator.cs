using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using EspritProperties;
using CAM_API.Feature.Model;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// CustomPropCondition 기반으로 CAD Feature를 필터링하고 평가하는 유틸리티
    /// </summary>
    public static class PropertyConditionEvaluator
    {
        /// <summary>
        /// 모든 CustomProperties를 Dictionary<string name, string value>로 변환
        /// </summary>
        public static Dictionary<string, string> GetAllProperties(CustomProperties customProps)
        {
            var result = new Dictionary<string, string>();

            if (customProps == null)
                return result;

            for (int i = 1; i <= customProps.Count; i++)
            {
                var prop = customProps[i];
                result[prop.Name] = prop.Value?.ToString() ?? "";
            }

            return result;
        }

        /// <summary>
        /// 조건 리스트와 property Dictionary가 일치하는지 정규식 기반으로 평가
        /// </summary>
        public static bool IsMatchWithRegex(Dictionary<string, string> props, List<CustomPropCondition> conditions)
        {
            try
            {
                foreach (var condition in conditions)
                {
                    if (!props.TryGetValue(condition.PropName, out var propValue))
                        return false;

                    bool matched = false;

                    foreach (var pattern in condition.Values)
                    {
                        if (Regex.IsMatch(propValue, pattern))
                        {
                            matched = true;
                            break;
                        }
                    }

                    if (!matched)
                        return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Regex evaluation error] {ex.Message}");
                return false;
            }
        }
    }
}

