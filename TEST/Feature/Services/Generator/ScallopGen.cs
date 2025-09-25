using CAM_API.Feature.Model;
using Esprit;
using EspritSolids;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Windows;

namespace CAM_API.Feature.Services.Generator
{
    public class ScallopGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;
        private readonly FeatureManager _FeatureManager;

        public ScallopGen(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
            _FeatureManager = new FeatureManager(_application);
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            try
            {
                var Scallop = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Description", new List<string>{"Scallop"}),
                };

                List<SolidFace> solidFaces = CadFeaturesManager.FindMatchingFaces(allCadFeatures, Scallop).ToList();
                solidFaces.RemoveAll(face =>
                {
                    int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기
                    return loopCount == 1;
                });

                if (solidFaces.Count == 0) 
                    return;

                Array result = _application.Document.FeatureRecognition.CreatePocketFeatures2(solidFaces.ToArray(), _application.Document.ActivePlane, out var comFaults);
                ComFaultHandler.Handle(comFaults, "Scallop Recognition", _application);

                foreach (FeatureChain feature in result)
                {
                    dynamic props = feature.CustomProperties;
                    var prop = FeatureManager.GetOrAddCustomProperty(props, "Scallop", EspritConstants.espPropertyType.espPropertyTypeBoolean);
                    prop.Value = true;
                    prop.readOnly = true;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"[Scallop FeatureGenerator] 오류 발생: {ex.Message}", "Error");
            }
        }
    }
}
