using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using CAM_API.Feature.Model;
using Esprit;
using EspritSolids;

namespace CAM_API.Feature.Services.Generator
{
    public class HoleGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;

        public HoleGen(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            try
            {
                var holeConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Fastener Type", new List<string>{ "드릴 크기", "Drill sizes" })
                };

                var patternConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Pattern Feature0", new List<string>{ @"^.*지름 구멍.*$", @"^.*Diameter Hole.*$" })
                };

                var solidFaces = CadFeaturesManager.FindMatchingFaces(allCadFeatures, holeConditions).ToList();
                var patterns = CadFeaturesManager.FindMatchingFaces(allCadFeatures, patternConditions).ToList();
                solidFaces.AddRange(patterns);

                var conf = _application.Configuration.ConfigurationHoleRecognition2;

                conf.MaxDiameterInch = 35;
                conf.MaxDiameterMetric = 35;
                conf.MinDiameterInch = 0;
                conf.MinDiameterMetric = 1;
                conf.MinimumHoleOpeningInch = 360;
                conf.MinimumHoleOpeningMetric = 360;
                conf.CombineCoaxialHoles = false;
                conf.PropagateHoleFace = false;
                conf.ActiveWorkplaneOnly = true;
                conf.SplitCustomHole = false;
                conf.GroupByCadFeature = false;
                conf.GroupBySameHoleType = true;
                conf.GroupBySameDiameters = true;
                conf.GroupBySameDepths = false;
                conf.GroupBySameDirection = true;
                conf.GroupBySameAltitude = true;

                EspritComBase.ComFaults holeComFaults;
                Array result = _application.Document.FeatureRecognition.CreateHoleFeatures2(solidFaces.ToArray(), out holeComFaults);
                ComFaultHandler.Handle(holeComFaults, "Hole Recognition", _application);
                if (result != null)
                {
                    foreach (HolesFeature feature in result)
                    {
                        dynamic props = feature.CustomProperties;
                        var prop = FeatureManager.GetOrAddCustomProperty(props, "Hole", EspritConstants.espPropertyType.espPropertyTypeBoolean);
                        prop.Value = true;
                        prop.readOnly = true;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"[HoleFeatureGenerator] 오류 발생: {ex.Message}", "Error");
            }
        }
    }
}
