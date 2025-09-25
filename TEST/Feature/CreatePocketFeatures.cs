//using System;
//using System.Collections.Generic;
//using System.Linq;
//using Esprit;
//using EspritSolids;


//namespace CAM_API.Feature
//{
//    /// <summary>
//    /// Method for Pocket feature generation.
//    /// </summary>

//    internal class CreatePocketFeatures
//    {
//        private readonly Esprit.Application _application;
//        private readonly Esprit.Document Document;
//        private readonly CadFeaturesManager _cadFeaturesManager;

//        public CreatePocketFeatures(Esprit.Application application)
//        {
//            _application = application;
//            Document = _application.Document;
//            _cadFeaturesManager = new CadFeaturesManager(_application);
//        }

//        public void PipePortSlot(Esprit.CadFeatures allCadFeatures)
//        {
//            var pocket = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Description", new List<string>{ @"^.*컷-돌출.*$", @"^Cut-Extrude.*$" }),
//            new CustomPropConditions("Origin Point (X,Y,Z)", new List<string>{ @"^.*$" }),
//            };
         

//            List<SolidFace> pocketface = _cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures,pocket).ToList();
//            List<SolidFace> facesToRemove = new List<SolidFace>();

//            foreach (SolidFace face in pocketface)
//            {
//                int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기
               
//                if (loopCount == 1) // 갯수가 1일 때 해당 face 삭제 예정
//                {
//                    facesToRemove.Add(face);  // 삭제할 faces를 별도의 리스트에 추가
//                }
//            }

//            // pocketface에서 삭제할 faces를 한 번에 제거
//            foreach (SolidFace faceToRemove in facesToRemove) {pocketface.Remove(faceToRemove);}
//            if (pocketface.Count == 0) { return; }

//            Document.FeatureRecognition.CreatePocketFeatures2(pocketface.ToArray(), Document.ActivePlane, out var comFaults);
//            CadFeaturesManager.HandleComFaults(comFaults, "Pipe Tap Recognition", _application);
//        }
//        //gtec 에서 volute 그리는 방식 확인 필요...
//        // 사내 3d 모델과 차이가 좀 있음
//        public void VoluteFeature(Esprit.CadFeatures allCadFeatures)
//        {
//            var pocket = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Description", new List<string>{ @"^.*컷-돌출.*$", @"^Cut-Extrude.*$" }),
//            new CustomPropConditions("Normal Vector (u,v,w)", new List<string>{ "(-1,0,0)" }),
//            };


//            List<SolidFace> pocketface = _cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, pocket).ToList();
//            List<SolidFace> facesToRemove = new List<SolidFace>();

//            foreach (SolidFace face in pocketface)
//            {
//                int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기

//                if (loopCount == 1) // 갯수가 1일 때 해당 face 삭제 예정
//                {
//                    facesToRemove.Add(face);  // 삭제할 faces를 별도의 리스트에 추가
//                }
//            }

//            // pocketface에서 삭제할 faces를 한 번에 제거
//            foreach (SolidFace faceToRemove in facesToRemove) { pocketface.Remove(faceToRemove); }
//            if (pocketface.Count == 0) { return; }

//            Array array = Document.FeatureRecognition.CreatePocketFeatures2(pocketface.ToArray(), Document.ActivePlane, out var comFaults);
//            CadFeaturesManager.HandleComFaults(comFaults, "Pipe Tap Recognition", _application);

//            foreach (FeatureChain a in array)
//            {
//                a.Name = "Volute";
//                dynamic props = a.CustomProperties as EspritProperties.CustomProperties;
//                var prop = CustomPropConditions.GetOrAddCustomProperty(props, "Volute",EspritConstants.espPropertyType.espPropertyTypeBoolean);
//                prop.Value = true;
//                prop.readOnly = true;
//            }
//        }
//        public void PipePortSlot1(Esprit.CadFeatures allCadFeatures)
//        {
//            var pocket = new List<CustomPropConditions>
//            {
//            new CustomPropConditions("Description", new List<string>{ @"^.*컷-돌출.*$", @"^Cut-Extrude.*$" }),
//            };


//            List<SolidFace> pocketface = _cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures, pocket).ToList();
//            List<SolidFace> facesToRemove = new List<SolidFace>();

//            foreach (SolidFace face in pocketface)
//            {
//                int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기

//                if (loopCount > 1) // 갯수가 1일 때 해당 face 삭제 예정
//                {
//                    facesToRemove.Add(face);  // 삭제할 faces를 별도의 리스트에 추가
//                }
//            }

//            // pocketface에서 삭제할 faces를 한 번에 제거
//            foreach (SolidFace faceToRemove in facesToRemove) { pocketface.Remove(faceToRemove); }
//            if (pocketface.Count == 0) { return; }

//            Document.FeatureRecognition.CreatePocketFeatures2(pocketface.ToArray(), Document.ActivePlane, out var comFaults);
//            CadFeaturesManager.HandleComFaults(comFaults, "Pipe Tap Recognition", _application);
//        }

//    }
//}
