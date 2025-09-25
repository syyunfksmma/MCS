using CAM_API.Common.Helpers;
using CAM_API.Feature.Model;
using CAM_API.Setup;
using CAM_API.Setup.Services;
using Esprit;
using EspritProperties;
using EspritSolids;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// CAD Feature 관련 기능 전담 (전체 Feature 추출, 특정 Plan 제거 등)
    /// </summary>
    public class CadFeaturesManager
    {
        private readonly Esprit.Application _app;
        private readonly Document _doc;

        public CadFeaturesManager(Esprit.Application application)
        {
            _app = application;
            _doc = _app.Document;
        }

        public class TagFacesResult
        {
            public bool HasSuccess { get; set; }
            public bool HasError { get; set; }
            public string ErrorMessage { get; set; }
        }

        /// <summary>
        /// 전체 SolidFace → CadFeatures 변환
        /// </summary>
        public CadFeatures GetAllCadFeatures()
        {
            if (_doc.Solids.Count < 1)
                return null;

            var solid = _doc.Solids[1];
            var body = solid?.SolidBody as SolidBody;

            if (body == null)
                return null;

            var faces = new List<SolidFace>();
            foreach (SolidFace face in body.SolidFaces)
                faces.Add(face);

            System.Array facesArray = faces.ToArray();
            return _doc.CadFeatures.GetCadFeaturesFromFaces(ref facesArray);
        }

        /// <summary>
        /// CadFeatures에서 조건에 맞는 SolidFace만 추출
        /// </summary>
        public static IEnumerable<SolidFace> FindMatchingFaces(CadFeatures cadFeatures, List<CustomPropCondition> conditions)
        {
            for (int i = 1; i <= cadFeatures.Count; i++)
            {
                var cadFeature = cadFeatures[i];
                var customProps = cadFeature.CustomProperties as CustomProperties;

                var allProps = PropertyConditionEvaluator.GetAllProperties(customProps);

                if (!PropertyConditionEvaluator.IsMatchWithRegex(allProps, conditions))
                    continue;

                dynamic faces = cadFeature.Faces;
                foreach (var face in faces)
                {
                    if (face is SolidFace solidFace)
                        yield return solidFace;
                }
            }
        }



        public TagFacesResult TagSelectedFaces(string description)
        {
            bool hasSuccess = false;
            bool hasError = false;
            string errorMessage = null;

            var groupName = "Temp";
            var set = SelectionSetHelper.GetSelectionSet(_doc, groupName);
            set.RemoveAll();
            for (var i = 1; i <= _doc.Group.Count; i++)
            {
                set.Add(_doc.Group[i]);
            }

            // 선택된 Face 리스트 저장
            List<SolidFace> facesToReturn = set.OfType<SolidFace>().ToList();

            if (facesToReturn.Count == 0)
            {
                _doc.SelectionSets.Remove(groupName);
                return new TagFacesResult
                {
                    HasSuccess = false,
                    HasError = true,
                    ErrorMessage = "선택된 Solid Face가 없습니다."
                };
            }

            System.Array facesArray = facesToReturn.ToArray();
            var cadFeatures = _doc.CadFeatures.GetCadFeaturesFromFaces(ref facesArray);

            foreach (CadFeature cadFeature in cadFeatures)
            {
                try
                {
                    dynamic customProps = cadFeature?.CustomProperties;
                    if (customProps != null)
                    {
                        var prop = FeatureManager.GetOrAddCustomProperty(
                            customProps,
                            "Description",
                            EspritConstants.espPropertyType.espPropertyTypeString
                        );
                        prop.Value = description;
                        prop.readOnly = true;

                        // 색상 변경 (연두색)
                        dynamic faces = cadFeature.Faces;
                        uint targetColor = (uint)((50) | (205 << 8) | (50 << 16));
                        foreach (SolidFace face in faces)
                        {
                            face.set_Color(targetColor);
                        }

                        hasSuccess = true;
                    }
                }
                catch (Exception ex)
                {
                    hasError = true;
                    errorMessage = ex.Message;

                    _app.EventWindow.AddMessage(
                        EspritConstants.espMessageType.espMessageTypeError,
                        "TagSelectedFaces",
                        $"'{cadFeature?.Name}' 처리 중 오류: {ex.Message}"
                    );
                }
            }

            _doc.SelectionSets.Remove(groupName);

            return new TagFacesResult
            {
                HasSuccess = hasSuccess,
                HasError = hasError,
                ErrorMessage = errorMessage
            };
        }


    }
}
