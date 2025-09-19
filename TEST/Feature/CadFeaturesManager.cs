//using System;
//using System.Linq;
//using System.Collections.Generic;
//using CAM_API.Setup;
//using Esprit;
//using EspritComBase;
//using EspritSolids;


//namespace CAM_API.Feature
//{
//    /// <summary>
//    /// Method for filtering CAD features by property value.
//    /// Closely related to CustomPropConditions.cs.
//    /// </summary>

//    internal class CadFeaturesManager
//    {
//        private readonly Esprit.Application _app;
//        private readonly Esprit.Document Document;

//        public CadFeaturesManager(Esprit.Application application)
//        {
//            _app = application;
//            Document = _app.Document;
//        }

//        public Esprit.CadFeatures GetallCadFeatures()
//        {
//            List<EspritSolids.SolidFace> faces = new List<EspritSolids.SolidFace>();
//            var solid = Document.Solids[1];
//            var body = solid.SolidBody as EspritSolids.SolidBody;


//            foreach (EspritSolids.SolidFace face in body.SolidFaces)
//            {
//                faces.Add(face);
//            }

//            // 3. SolidFace 배열을 System.Array로 변환
//            System.Array facesArray = faces.ToArray();
//            // 4. GetCadFeaturesFromFaces를 호출하여 CadFeature를 가져옴
//            Esprit.CadFeatures cadFeatures = Document.CadFeatures.GetCadFeaturesFromFaces(ref facesArray);

//            return cadFeatures;
//        }

//        public IEnumerable<SolidFace> FindCadFeaturesByProps(Esprit.CadFeatures cadFeatures, List<CustomPropConditions> conditions)
//        {
//            for (int i = 1; i <= cadFeatures.Count; i++) // 1-based index
//            {
//                var cadFeature = cadFeatures[i];
//                List<Tuple<string, string>> prop = allProperties(cadFeature.CustomProperties as EspritProperties.CustomProperties);
//                if (CustomPropConditions.IsMatchWithRegex(prop, conditions))
//                {
//                    dynamic faces = cadFeature.Faces;
//                    foreach (var face in faces)
//                    {
//                        if (face is SolidFace sf)
//                            yield return sf;
//                    }
//                }
//            }
//        }

//        private static List<Tuple<string, string>> allProperties(EspritProperties.CustomProperties customProps)
//        {
//            List<Tuple<string, string>> properties = new List<Tuple<string, string>>();

//            for (int j = 1; j <= customProps.Count; j++)
//            {
//                var currentProp = customProps[j];
//                properties.Add(Tuple.Create(currentProp.Name, currentProp.Value.ToString()));
//            }
//            return properties;
//        }

//        public static void HandleComFaults(EspritComBase.ComFaults comFaults, string featureType, Esprit.Application _app)
//        {
//            for (var i = 1; i <= comFaults.Count; i++)
//            {
//                var msgType = comFaults[i].Severity == espFaultSeverity.espFaultWarning
//                    ? EspritConstants.espMessageType.espMessageTypeWarning
//                    : EspritConstants.espMessageType.espMessageTypeError;

//                _app.EventWindow.AddMessage(msgType, featureType, comFaults[i].Description);
//            }
//        }

//        public void RemoveBottomPlanFeature()
//        {
//            string plane = workplan.BottomPlan(_app);
//            HolesFeatures holesFeatures = Document.HolesFeatures;
//            foreach (Esprit.HolesFeature hole in holesFeatures)
//            {
//                if (hole.Plane.Name == plane)
//                {
//                    Document.HolesFeatures.Remove(hole);
//                }
//            }
//        }
//    }
//}
