//using CAM_API.Feature.Services;
//using CAM_API.Setup;
//using CAM_API.Setup.Services;
//using Esprit;
//using EspritProperties;
//using EspritSolids;
//using System;
//using System.Collections.Generic;
//using System.Windows.Forms;

//namespace CAM_API.Feature
//{
//    // function test
//    /// <summary>
//    /// Method to change the color of a SolidFace selected by the user.
//    ///
//    /// Specify solidface colors by shape to distinguish them when creating features.
//    ///   Ex) hole = red / pocket = yellow
//    /// </summary>

//    internal class FaceColorChanger
//    {
//        private readonly Esprit.Application _application;
//        private readonly Esprit.Document Document;

//        public FaceColorChanger(Esprit.Application application)
//        {
//            _application = application;
//            Document = _application.Document;
//        }


//        //public List<SolidFace> ChangeSelectedFaceColor()
//        public void ChangeSelectedFaceColor()
//        {
//            var groupName = "Temp";
//            var set = ImportCadService.GetSelectionSet(Document, groupName);

//            set.RemoveAll();
//            for (var i = 1; i <= Document.Group.Count; i++)
//            {
//                set.Add(Document.Group[i]);
//            }

//            // 선택된 Face 리스트 저장
//            List<SolidFace> facesToReturn = new List<SolidFace>();
//            //uint targetColor = 204; // BGR (Blue-Green-Red), 빨간색
//            //        face.set_Color(targetColor);  // 🎯 색상 변경 적용

//            foreach (var obj in set)
//            {
//                if (obj is EspritSolids.SolidFace face)
//                {
//                    facesToReturn.Add(face);
//                }
//            }


//            System.Array facesArray = facesToReturn.ToArray();
//            var cadfeature = Document.CadFeatures.GetCadFeaturesFromFaces(ref facesArray)[1];
//            dynamic customProps = cadfeature.CustomProperties as CustomProperties;

//            var prop = FeatureManager.GetOrAddCustomProperty(customProps, "Description", EspritConstants.espPropertyType.espPropertyTypeString);
//            prop.Value = "test";
//            prop.readOnly = true;


//            //foreach (var obj in set)
//            //{
//            //    if (obj is EspritSolids.SolidFace face)
//            //    {
//            //        facesToReturn.Add(face);   
//            //        face.set_Color(targetColor);  // 🎯 색상 변경 적용

//            //        var solidsurface = face.SolidSurface as EspritSolids.SolidSurface;
//            //        var normalVector = solidsurface.NormalAlong(0.5,0.5);

//            //        // ✅ 메시지 출력
//            //        _application.EventWindow.AddMessage(
//            //            EspritConstants.espMessageType.espMessageTypeInformation,
//            //            "Workplane Transformation",
//            //            $"활성 평면: {face.get_Name()}\n" +
//            //            $"Normal Vector = ({normalVector.X}, {normalVector.Y}, {normalVector.Z})"
//            //        );
//            //    }
//            //}

//            //Document.Refresh();
//            Document.SelectionSets.Remove(groupName);



//            return;
//        }
//    }
//}
