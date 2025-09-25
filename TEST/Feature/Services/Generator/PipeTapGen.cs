using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using CAM_API.Feature.Model;
using Esprit;
using EspritSolids;

namespace CAM_API.Feature.Services.Generator
{
    public class PipeTapGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;

        public PipeTapGen(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            try
            {
                var nptConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Standard", new List < string > { "Ansi Inch"}),
                    new CustomPropCondition("Fastener Type", new List < string > { "관용 테이퍼 탭", "Tapered Pipe Tap"}),
                };
                var nptpatterncon = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Pattern Feature0", new List<string>{ @"^.*NPT 나사 구멍.*$", @"^.*NPT Tapped Hole.*$"}),
                };
                var ptConditions = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Standard", new List < string > { "ISO"}),
                    new CustomPropCondition("Fastener Type", new List < string > { "관용 테이퍼 탭", "Tapered Pipe Tap"}),
                };
                var ptpatterncon = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Pattern Feature0", new List<string>{ @"^.*Rc 나사 구멍.*$", @"^.*Rc Tapped Hole.*$" }),
                };

                var NPTs = CadFeaturesManager.FindMatchingFaces(allCadFeatures, nptConditions).ToList();
                var NPTPattern = CadFeaturesManager.FindMatchingFaces(allCadFeatures, nptpatterncon).ToList();
                NPTs.AddRange(NPTPattern);
                var PTs = CadFeaturesManager.FindMatchingFaces(allCadFeatures, ptConditions).ToList();
                var PTPattern = CadFeaturesManager.FindMatchingFaces(allCadFeatures, ptpatterncon).ToList();
                PTs.AddRange(PTPattern);

                if (NPTs.Count == 0 && PTs.Count == 0)
                    return;


                var conf = _application.Configuration.ConfigurationHoleRecognition2;

                conf.MaxDiameterInch = 35;
                conf.MaxDiameterMetric = 35;
                conf.MinDiameterInch = 0;
                conf.MinDiameterMetric = 1;
                conf.MinimumHoleOpeningInch = 360;
                conf.MinimumHoleOpeningMetric = 360;
                conf.CombineCoaxialHoles = true;
                conf.PropagateHoleFace = false;
                conf.ActiveWorkplaneOnly = is3Axis;
                conf.SplitCustomHole = false;
                conf.GroupByCadFeature = false;
                conf.GroupBySameHoleType = true;
                conf.GroupBySameDiameters = true;
                conf.GroupBySameDepths = false;
                conf.GroupBySameDirection = true;
                conf.GroupBySameAltitude = true;

                if (NPTs.Count > 0)
                {
                    EspritComBase.ComFaults holeComFaults;
                    Array result1 = _application.Document.FeatureRecognition.CreateHoleFeatures2(NPTs.ToArray(), out holeComFaults);
                    ComFaultHandler.Handle(holeComFaults, "NPT PipeTap Recognition", _application);
                    if (result1 != null)
                    {
                        foreach (HolesFeature feature in result1)
                        {
                            dynamic props = feature.CustomProperties;
                            var prop = FeatureManager.GetOrAddCustomProperty(props, "PipeTap", EspritConstants.espPropertyType.espPropertyTypeString);
                            prop.Value = "NPT";
                            prop.readOnly = true;
                        }
                    }
                }

                if (PTs.Count > 0)
                {
                    EspritComBase.ComFaults holeComFaults;
                    Array result2 = _application.Document.FeatureRecognition.CreateHoleFeatures2(PTs.ToArray(), out holeComFaults);
                    ComFaultHandler.Handle(holeComFaults, "PT PipeTap Recognition", _application);
                    if (result2 != null)
                    {
                        foreach (HolesFeature feature in result2)
                        {
                            dynamic props = feature.CustomProperties;
                            var prop = FeatureManager.GetOrAddCustomProperty(props, "PipeTap", EspritConstants.espPropertyType.espPropertyTypeString);
                            prop.Value = "PT";
                            prop.readOnly = true;
                        }
                    }
                }
                
            }
            catch (Exception ex)
            {
                MessageBox.Show($"[PipeTapFeatureGenerator] 오류 발생: {ex.Message}", "Error");
            }
        }
    }
}
