using System;
using System.Collections.Generic;
using System.Windows;
using CAM_API.Feature.Model;
using CAM_API.Feature.Services.Generator;
using Esprit;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// 선택된 설비에 따라 관련 feature 들을 생성하는 서비스
    /// </summary>
    public class FeatureGenerationService
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;
        private readonly FeatureManager _FeatureManager;

        public FeatureGenerationService(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
            _FeatureManager = new FeatureManager(_application);
        }

        /// <summary>
        /// 설비 이름(enum)과 3축 여부를 기반으로 feature 생성 수행
        /// </summary>
        /// <param name="facility">선택된 설비명</param>
        public bool GenerateFeatures(FacilityType facility, bool isodcut)
        {
            try
            {
                // 해당 설비가 지원하는 feature 목록 가져오기
                var definition = FacilityFeatureMapper.GetDefinition(facility);
                bool is3Axis = definition.Is3Axis;
                List<string> features = definition.Features;

                if (features.Count == 0)
                {
                    _application.EventWindow.AddMessage(
                        EspritConstants.espMessageType.espMessageTypeWarning,
                        "FeatureGeneration",
                        $"설비 '{facility}'에 대한 feature 목록이 비어 있습니다.");
                    return true;
                }

                // 전체 CAD Feature 추출
                var allCadFeatures = _cadFeaturesManager.GetAllCadFeatures();
                if (allCadFeatures == null)
                {
                    _application.EventWindow.AddMessage(
                       EspritConstants.espMessageType.espMessageTypeWarning,
                       "CAD Feature 인식 실패",
                       "Solid가 없습니다.");
                    return true;
                }

                // Feature 생성
                foreach (string featureName in features)
                {
                    try
                    {
                        var generatorList = FeatureGeneratorFactory.Create(featureName, _application, isodcut);
                        
                        if (generatorList.Count == 0)
                        {   
                            _application.EventWindow.AddMessage(
                                EspritConstants.espMessageType.espMessageTypeWarning,
                                "FeatureGeneration",
                                $"'{featureName}'에 대한 Generator를 찾을 수 없습니다.");
                            return true;
                        }

                        foreach (var generator in generatorList)
                        {
                            generator.Generate(allCadFeatures, is3Axis);
                        }
                    }
                    catch (Exception ex)
                    {
                        _application.EventWindow.AddMessage(
                            EspritConstants.espMessageType.espMessageTypeError,
                            "FeatureGeneration",
                            $"'{featureName}' 형상이 없습니다. : {ex.Message}");
                    }
                }

                // 가공 불가능한 평면의 Feature 삭제 작업
                _FeatureManager.RemoveBottomPlanFeature();
            }
            catch (Exception ex)
            {
                _application.EventWindow.AddMessage(
                    EspritConstants.espMessageType.espMessageTypeError,
                    "FeatureGenerationService",
                    $"전체 처리 중 예외 발생: {ex.Message}");
                return true;
            }

            return false;
        }
    }
}
