//using System;
//using System.Collections.Generic;
//using Esprit;
//using EspritSolids;
//using System.Windows;
//using System.Linq;

//namespace CAM_API.Feature
//{
//    /// <summary>
//    /// Method for hole feature generation.
//    /// </summary>

//    internal class CreateHoleFeatures
//    {
//        private readonly Esprit.Application _application;
//        private readonly Esprit.Document Document;
//        //private readonly CadFeaturesManager _CadFeatureManager;


//        public CreateHoleFeatures(Esprit.Application application)
//        {
//            _application = application;
//            Document = _application.Document;
//            //_CadFeatureManager = new CadFeaturesManager(_application);
//        }

//        public void HolesFeature(Esprit.CadFeatures allCadFeatures, bool is3aixs)
//        {
//            var HoleConditions = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Fastener Type", new List<string>{"드릴 크기","Drill sizes" }),
//            };
//            var Holepatterncon = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Pattern Feature0", new List<string>{ @"^.*지름 구멍.*$", @"^.*Diameter Hole.*$" }),
//            };

//            CadFeaturesManager cadFeaturesManager = new CadFeaturesManager(_application);
//            List<SolidFace> Hole = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, HoleConditions).ToList(); //Hole solidface 수집
//            List<SolidFace> HolePattern = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, Holepatterncon).ToList(); // pattern solidface 수집
//            foreach (SolidFace pattern in HolePattern) { Hole.Add(pattern); } // 두개 결합
//            if (Hole.Count == 0) { return; }

//            try
//            {
//                var conf = _application.Configuration.ConfigurationHoleRecognition2; // 가공 경로 생성 조건 설정
//                conf.MaxDiameterInch = 35;
//                conf.MaxDiameterMetric = 35;
//                conf.MinDiameterInch = 0;
//                conf.MinDiameterMetric = 1;
//                conf.MinimumHoleOpeningInch = 360;
//                conf.MinimumHoleOpeningMetric = 360;

//                conf.CombineCoaxialHoles = false;
//                conf.PropagateHoleFace = false;
//                conf.ActiveWorkplaneOnly = is3aixs;
//                conf.SplitCustomHole = false;

//                conf.GroupByCadFeature = false;
//                conf.GroupBySameHoleType = true;
//                conf.GroupBySameDiameters = true;
//                conf.GroupBySameDepths = false;

//                conf.GroupBySameDirection = true;
//                conf.GroupBySameAltitude = true;

//                EspritComBase.ComFaults holeComFaults;
//                Array array = Document.FeatureRecognition.CreateHoleFeatures2(Hole.ToArray(), out holeComFaults);
//                CadFeaturesManager.HandleComFaults(holeComFaults, "Hole Recognition", _application);


//                foreach (HolesFeature a in array)
//                {
//                    dynamic props = a.CustomProperties as EspritProperties.CustomProperties;
//                    var prop = CustomPropConditions.GetOrAddCustomProperty(props, "Hole", EspritConstants.espPropertyType.espPropertyTypeBoolean);
//                    prop.Value = true;
//                    prop.readOnly = true;
//                }
//            }
//            catch (Exception ex)
//            {
//                MessageBox.Show($"Error on Hole recognition: {ex.Message}", "Error");
//            }
//        }

//        public void ThreadFeature(Esprit.CadFeatures allCadFeatures, bool is3aixs)
//        {
//            var ThreadConditions = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Fastener Type",  new List<string>{"탭 구멍","Tapped hole" })
//            };
//            var Threadpatterncon = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Pattern Feature0", new List<string>{ @"^.*탭 구멍.*$", @"^.*Tapped Hole.*$" }),
//            };
//            var Threadpatterncon1 = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Pattern Feature0", new List<string>{ @"^.*NPT Tapped Hole.*$" }),
//            };
//            //var ThreadConditionsforSE = new List<Conditions>
//            //{
//            //new Conditions("Hole Thread Type", "Standard Thread")
//            //};

//            CadFeaturesManager cadFeaturesManager = new CadFeaturesManager(_application);
//            List<SolidFace> Thread = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, ThreadConditions).ToList();
//            List<SolidFace> ThreadPattern = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, Threadpatterncon).ToList(); // pattern solidface 수집
//            List<SolidFace> ThreadPattern1 = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, Threadpatterncon1).ToList(); // pattern solidface 수집
//            foreach (SolidFace pattern in ThreadPattern) { Thread.Add(pattern); } // 두개 결합
//            foreach (SolidFace pattern1 in ThreadPattern1) { Thread.Remove(pattern1); } // 두개 결합
//            if (Thread.Count == 0) { return; }

//            try
//            {
//                var conf = _application.Configuration.ConfigurationHoleRecognition2; // 가공 경로 생성 조건 설정
//                conf.MaxDiameterInch = 35;
//                conf.MaxDiameterMetric = 35;
//                conf.MinDiameterInch = 0;
//                conf.MinDiameterMetric = 1;
//                conf.MinimumHoleOpeningInch = 360;
//                conf.MinimumHoleOpeningMetric = 360;

//                conf.CombineCoaxialHoles = true;
//                conf.PropagateHoleFace = true;
//                conf.ActiveWorkplaneOnly = is3aixs;
//                conf.SplitCustomHole = false;

//                conf.GroupByCadFeature = false;
//                conf.GroupBySameHoleType = true;
//                conf.GroupBySameDiameters = true;
//                conf.GroupBySameDepths = false;

//                conf.GroupBySameDirection = true;
//                conf.GroupBySameAltitude = true;

//                EspritComBase.ComFaults tapComFaults;
//                Array array = Document.FeatureRecognition.CreateHoleFeatures2(Thread.ToArray(), out tapComFaults);
//                CadFeaturesManager.HandleComFaults(tapComFaults, "Tap Recognition", _application);
//                if (array == null) return;

//                foreach (HolesFeature a in array)
//                {
//                    dynamic props = a.CustomProperties as EspritProperties.CustomProperties;
//                    var prop = CustomPropConditions.GetOrAddCustomProperty(props, "Tap", EspritConstants.espPropertyType.espPropertyTypeBoolean);
//                    prop.Value = true;
//                    prop.readOnly = true;
//                }

//            }
//            catch (Exception ex)
//            {
//                MessageBox.Show($"Error on Thread recognition: {ex.Message}", "Error");
//            }
//        }

//        public void PipeTapFeature(Esprit.CadFeatures allCadFeatures, bool is3aixs)
//        {
//            var PipeTapConditions = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Fastener Type", new List < string > { "관용 테이퍼 탭", "Tapered Pipe Tap"}),
//            };
//            var PipeTappatterncon = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Pattern Feature0", new List<string>{ @"^.*관용 테이퍼 탭.*$", @"^.*NPT Tapped Hole.*$" }),
//            };
//            //var PipeTapConditionsforSE = new List<Conditions>
//            //{
//            //new Conditions("Hole Thread Type", "Tapered Pipe Thread")
//            //};

//            CadFeaturesManager cadFeaturesManager = new CadFeaturesManager(_application);
//            List<SolidFace> PipeTap = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, PipeTapConditions).ToList();
//            List<SolidFace> PipeTapPattern = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, PipeTappatterncon).ToList();
//            foreach (SolidFace pattern in PipeTapPattern) { PipeTap.Add(pattern); } // 두개 결합
//            if (PipeTap.Count == 0) { return; }

//            try
//            {
//                var conf = _application.Configuration.ConfigurationHoleRecognition2; // 가공 경로 생성 조건 설정
//                conf.MaxDiameterInch = 35;
//                conf.MaxDiameterMetric = 35;
//                conf.MinDiameterInch = 0;
//                conf.MinDiameterMetric = 1;
//                conf.MinimumHoleOpeningInch = 360;
//                conf.MinimumHoleOpeningMetric = 360;

//                conf.CombineCoaxialHoles = true;
//                conf.PropagateHoleFace = false;
//                conf.ActiveWorkplaneOnly = is3aixs;
//                conf.SplitCustomHole = false;

//                conf.GroupByCadFeature = true;
//                conf.GroupBySameHoleType = false;
//                conf.GroupBySameDiameters = false;
//                conf.GroupBySameDepths = false;

//                conf.GroupBySameDirection = true;
//                conf.GroupBySameAltitude = true;

//                EspritComBase.ComFaults pipeComFaults;
//                Array array = Document.FeatureRecognition.CreateHoleFeatures2(PipeTap.ToArray(), out pipeComFaults);
//                CadFeaturesManager.HandleComFaults(pipeComFaults, "Pipe Tap Recognition", _application);
//                if (array == null) return;

//                foreach (HolesFeature a in array)
//                {
//                    dynamic props = a.CustomProperties as EspritProperties.CustomProperties;
//                    var prop = CustomPropConditions.GetOrAddCustomProperty(props, "Pipe Tap", EspritConstants.espPropertyType.espPropertyTypeBoolean);
//                    prop.Value = true;
//                    prop.readOnly = true;
//                }
//            }
//            catch (Exception ex)
//            {
//                MessageBox.Show($"Error on Pipe Tap recognition: {ex.Message}", "Error");
//            }
//        }

//        public void SlotFeature(Esprit.CadFeatures allCadFeatures, bool is3aixs)
//        {
//            var slotConditions = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Description", new List<string>{ @"^Cut-Extrude.*$" }),
//            };


//            CadFeaturesManager cadFeaturesManager = new CadFeaturesManager(_application);
//            List<SolidFace> slot = cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, slotConditions).ToList();
//            List<SolidFace> facesToRemove = new List<SolidFace>();

//            foreach (SolidFace face in slot)
//            {
//                int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기

//                if (loopCount != 1) // 갯수가 1일 때 해당 face 삭제 예정
//                {
//                    facesToRemove.Add(face);  // 삭제할 faces를 별도의 리스트에 추가
//                }
//            }
//            foreach (SolidFace faceToRemove in facesToRemove) { slot.Remove(faceToRemove); }
//            if (slot.Count == 0) { return; }
//            //List<SolidFace> PipeTapPattern = cadFeaturesManager.FindCadFeaturesByProps(PipeTappatterncon);
//            //foreach (SolidFace pattern in PipeTapPattern) { PipeTap.Add(pattern); } // 두개 결합
//            //if (PipeTap.Count == 0) { return; }

//            try
//            {
//                var conf = _application.Configuration.ConfigurationHoleRecognition2; // 가공 경로 생성 조건 설정
//                conf.MaxDiameterInch = 35;
//                conf.MaxDiameterMetric = 100;
//                conf.MinDiameterInch = 0;
//                conf.MinDiameterMetric = 1;
//                conf.MinimumHoleOpeningInch = 10;
//                conf.MinimumHoleOpeningMetric = 10;

//                conf.CombineCoaxialHoles = true;
//                conf.PropagateHoleFace = false;
//                conf.ActiveWorkplaneOnly = is3aixs;
//                conf.SplitCustomHole = false;

//                conf.GroupByCadFeature = true;
//                conf.GroupBySameHoleType = false;
//                conf.GroupBySameDiameters = false;
//                conf.GroupBySameDepths = false;

//                conf.GroupBySameDirection = true;
//                conf.GroupBySameAltitude = true;

//                EspritComBase.ComFaults pipeComFaults;
//                Array array = Document.FeatureRecognition.CreateHoleFeatures2(slot.ToArray(), out pipeComFaults);
//                CadFeaturesManager.HandleComFaults(pipeComFaults, "Slot Recognition", _application);

//                foreach (FeatureChain a in array)
//                {
//                    dynamic props = a.CustomProperties as EspritProperties.CustomProperties;
//                    var prop = CustomPropConditions.GetOrAddCustomProperty(props, "Slot", EspritConstants.espPropertyType.espPropertyTypeBoolean);
//                    prop.Value = true;
//                    prop.readOnly = true;
//                }


//            }
//            catch (Exception ex)
//            {
//                MessageBox.Show($"Error on Pipe Tap recognition: {ex.Message}", "Error");
//            }
//        }
//    }
//}
