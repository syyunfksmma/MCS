using CAM_API.Setup;
using Esprit;
using EspritConstants;
using EspritProperties;
using System.Collections.Generic;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// Esprit의 CustomProperty 관련 유틸리티
    /// 필요 시 기존 값을 삭제 후 타입에 맞게 재생성
    /// </summary>
    public class FeatureManager
    {
        /// <summary>
        /// CustomProperty가 존재하지 않거나 타입이 맞지 않으면 제거 후 생성
        /// </summary>
        /// 
        private readonly Application _app;
        private readonly Document _doc;

        public FeatureManager(Application application)
        {
            _app = application;
            _doc = _app.Document;
        }

        public static CustomProperty GetOrAddCustomProperty(CustomProperties customProperties, string name, espPropertyType type)
        {
            if (customProperties == null || string.IsNullOrWhiteSpace(name))
                return null;

            CustomProperty customProperty = customProperties[name];

            if (customProperty != null && customProperty.VariableType != type)
            {
                customProperties.Remove(name);
                customProperty = null;
            }

            if (customProperty == null)
            {
                customProperty = type == espPropertyType.espPropertyTypeString
                    ? customProperties.Add(name, name, type, "")
                    : customProperties.Add(name, name, type, 0);
            }

            return customProperty;
        }


        /// <summary>
        /// 지정된 BottomPlan의 HolesFeature 제거
        /// </summary>
        public void RemoveBottomPlanFeature()
        {
            string bottomPlaneName = workplan.BottomPlan(_app);
            HolesFeatures holesFeatures = _doc.HolesFeatures;

            for (int i = holesFeatures.Count; i >= 1; i--)
            {
                var hole = holesFeatures[i];
                if (hole?.Plane?.Name == bottomPlaneName)
                {
                    _doc.HolesFeatures.Remove(hole);
                }
            }
        }

        public void RemoveXYZPlanFeature()
        {
            HolesFeatures holesFeatures = _doc.HolesFeatures;

            for (int i = holesFeatures.Count; i >= 1; i--)
            {
                var hole = holesFeatures[i];
                if (hole?.Plane?.Name == "XYZ")
                {
                    _doc.HolesFeatures.Remove(hole);
                }
            }
        }

    }
}
