using CAM_API.Feature.Model;
using Esprit;
using ESPRIT.KBMModules;
using EspritSolids;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;

namespace CAM_API.Feature.Services.Generator
{
    public class ReamGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;

        public ReamGen(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            try
            {
                var reamConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Description", new List<string>{ @"^.맞춤핀 구멍.*$" , @"^.Dowel Holes.*$"})
                };

                var patternConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Pattern Feature0", new List<string>{ @"^.맞춤핀 구멍.*$" , @"^.Dowel Holes.*$" })
                };

                var solidFaces = CadFeaturesManager.FindMatchingFaces(allCadFeatures, reamConditions).ToList();
                var patterns = CadFeaturesManager.FindMatchingFaces(allCadFeatures, patternConditions).ToList();
                solidFaces.AddRange(patterns);

                if (solidFaces.Count == 0)
                    return;

                var conf = _application.Configuration.ConfigurationHoleRecognition2;

                conf.MaxDiameterInch = 35;
                conf.MaxDiameterMetric = 35;
                conf.MinDiameterInch = 0;
                conf.MinDiameterMetric = 1;
                conf.MinimumHoleOpeningInch = 360;
                conf.MinimumHoleOpeningMetric = 360;
                conf.CombineCoaxialHoles = false;
                conf.PropagateHoleFace = false;
                conf.ActiveWorkplaneOnly = is3Axis;
                conf.SplitCustomHole = false;
                conf.GroupByCadFeature = false;
                conf.GroupBySameHoleType = true;
                conf.GroupBySameDiameters = true;
                conf.GroupBySameDepths = false;
                conf.GroupBySameDirection = true;
                conf.GroupBySameAltitude = true;

                EspritComBase.ComFaults holeComFaults;
                Array result = _application.Document.FeatureRecognition.CreateHoleFeatures2(solidFaces.ToArray(), out holeComFaults);
                ComFaultHandler.Handle(holeComFaults, "Ream Recognition", _application);

                if (result != null)
                {
                    foreach (HolesFeature feature in result)
                    {
                        dynamic props = feature.CustomProperties;
                        var prop = FeatureManager.GetOrAddCustomProperty(props, "Ream", EspritConstants.espPropertyType.espPropertyTypeBoolean);
                        prop.Value = true;
                        prop.readOnly = true;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"[ReamFeatureGenerator] 오류 발생: {ex.Message}", "Error");
            }
        }
    }
}
