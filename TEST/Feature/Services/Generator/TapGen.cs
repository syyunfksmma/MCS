using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using CAM_API.Feature.Model;
using Esprit;
using EspritSolids;

namespace CAM_API.Feature.Services.Generator
{
    public class TapGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;

        public TapGen(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            try
            {
                var ThreadConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Fastener Type",  new List<string>{"탭 구멍","Tapped hole" })
                };
                var Threadpatterncon = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Pattern Feature0", new List<string>{ @"^.*나사 구멍.*$", @"^.*Tapped Hole.*$" }),
                };
                var Threadpatterncon1 = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Pattern Feature0", new List<string>{ @"^.*NPT 나사 구멍.*$", @"^.*Rc 나사 구멍.*$", @"^.*NPT Tapped Hole.*$", @"^.*Rc Tapped Hole.*$" }),
                };


                var solidFaces = CadFeaturesManager.FindMatchingFaces(allCadFeatures, ThreadConditions).ToList();
                var patterns = CadFeaturesManager.FindMatchingFaces(allCadFeatures, Threadpatterncon).ToList();
                var facesToRemove = CadFeaturesManager.FindMatchingFaces(allCadFeatures, Threadpatterncon1).ToList();
                solidFaces.AddRange(patterns);
                solidFaces.RemoveAll(face => facesToRemove.Contains(face));

                if (solidFaces.Count == 0)
                    return;

                var conf = _application.Configuration.ConfigurationHoleRecognition2;

                conf.MaxDiameterInch = 35;
                conf.MaxDiameterMetric = 35;
                conf.MinDiameterInch = 0;
                conf.MinDiameterMetric = 1;
                conf.MinimumHoleOpeningInch = 360;
                conf.MinimumHoleOpeningMetric = 360;
                conf.CombineCoaxialHoles = true;
                conf.PropagateHoleFace = true;
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
                ComFaultHandler.Handle(holeComFaults, "Tap Recognition", _application);

                if (result != null)
                {
                    foreach (HolesFeature feature in result)
                    {
                        dynamic props = feature.CustomProperties;
                        var prop = FeatureManager.GetOrAddCustomProperty(props, "Tap", EspritConstants.espPropertyType.espPropertyTypeBoolean);
                        prop.Value = true;
                        prop.readOnly = true;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"[TapFeatureGenerator] 오류 발생: {ex.Message}", "Error");
            }
        }
    }
}
