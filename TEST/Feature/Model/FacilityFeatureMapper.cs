using System;
using System.Collections.Generic;

namespace CAM_API.Feature.Model
{
    /// <summary>
    /// 설비별 지원 Feature 및 속성 정의 (예: 3축 여부 포함)
    /// </summary>
    public static class FacilityFeatureMapper
    {
        private static readonly Dictionary<FacilityType, FacilityFeatureDefinition> _featureMap =
            new Dictionary<FacilityType, FacilityFeatureDefinition>
            {
                { FacilityType.CNC, new FacilityFeatureDefinition(true, new List<string> { "turning"}) },
                //{ FacilityType.CNC, new FacilityFeatureDefinition(true, new List<string> { "turning", "hole" }) },
                { FacilityType.MCT, new FacilityFeatureDefinition(true, new List<string> { "pipeport", "hole", "tap", "scallop" }) },
                { FacilityType.MCT_RT, new FacilityFeatureDefinition(false, new List<string> { "pipeport", "hole", "tap", }) },
                { FacilityType.MTM, new FacilityFeatureDefinition(false, new List<string> { "turning", "hole", "tap", "slot" }) },
            };

        /// <summary>
        /// 해당 설비의 Feature 정의를 반환
        /// </summary>
        public static FacilityFeatureDefinition GetDefinition(FacilityType facility)
        {
            FacilityFeatureDefinition def;
            return _featureMap.TryGetValue(facility, out def) ? def : null;
        }

        /// <summary>
        /// 문자열을 FacilityType enum으로 변환
        /// </summary>
        public static FacilityType? ParseFacility(string facilityName)
        {
            FacilityType result;
            return Enum.TryParse(facilityName, ignoreCase: true, out result) ? result : (FacilityType?)null;
        }
    }

    /// <summary>
    /// 설비 유형
    /// </summary>
    public enum FacilityType
    {
        CNC,
        MCT,
        MCT_RT,
        MTM
    }

    /// <summary>
    /// 각 설비에 대응되는 Feature 정의 + 3축 여부
    /// </summary>
    public class FacilityFeatureDefinition
    {
        public bool Is3Axis { get; }
        public List<string> Features { get; }

        public FacilityFeatureDefinition(bool is3Axis, List<string> features)
        {
            Is3Axis = is3Axis;
            Features = features ?? new List<string>();
        }
    }
}
