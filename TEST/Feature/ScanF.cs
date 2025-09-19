using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Esprit;
using EspritComBase;

namespace CAM_API.Feature
{
    // function test
    /// <summary>
    /// Milling Feature generation function test
    /// Tutorials : https://espritweb.hexagon.com/ew/help/ESPRIT/EDGE/en/2024.1/main/API/_feature_recognition.html
    /// </summary>

    internal class ScanF
    {
        private readonly Esprit.Application _application;
        private readonly Esprit.Document Document;
        private readonly FaceColorChanger _faceColorChanger; 

        public ScanF(Esprit.Application application)
        {
            _application = application;
            Document = _application.Document;
            _faceColorChanger = new FaceColorChanger(application); // ✅ 객체 초기화
        }

        /// <summary>
        /// 포인트 및 원형 객체에서 홀을 인식하는 메서드
        /// </summary>
        //public void RecognizeHoles()
        //{
        //    _application.Configuration.ConfigurationHoleRecognition2.MinDiameterMetric = 1;
        //    _application.Configuration.ConfigurationHoleRecognition2.MaxDiameterMetric = 15;

            // 1. 포인트 기반 홀 인식
        //    var points = new List<Esprit.Point>
        //    {
        //        Document.Points[1],
        //        Document.Points[2],
        //        Document.Points[3],
        //    };

        //    var pointFeatureHoles = Document.FeatureRecognition.CreateHoleFeatures2(points.ToArray(), out var espPointFaults);

        //    if (pointFeatureHoles != null)
        //    {
        //        for (var i = pointFeatureHoles.GetLowerBound(0); i <= pointFeatureHoles.GetUpperBound(0); i++)
        //        {
        //            var featureHole = pointFeatureHoles.GetValue(i) as HolesFeature;
        //            var hole = featureHole?.Object as ComFeatureHoles;

        //            if (hole != null)
        //            {
        //                System.Windows.Forms.MessageBox.Show($"{hole.Count} point hole(s) recognized", "Feature Holes Recognition");
        //            }
        //        }
        //    }

            // 2. 원 기반 홀 인식
        //    var circles = new List<Esprit.Circle>
        //    {
        //        Document.Circles[1],
        //        Document.Circles[2],
        //    };

        //    var circleFeatureHoles = Document.FeatureRecognition.CreateHoleFeatures2(circles.ToArray(), out var espCircleFaults);

        //    if (circleFeatureHoles != null)
        //    {
        //        for (var i = circleFeatureHoles.GetLowerBound(0); i <= circleFeatureHoles.GetUpperBound(0); i++)
        //        {
        //            var featureHole = circleFeatureHoles.GetValue(i) as HolesFeature;
        //            var hole = featureHole?.Object as ComFeatureHoles;

        //            if (hole != null)
        //            {
        //                System.Windows.Forms.MessageBox.Show($"{hole.Count} circle hole(s) recognized", "Feature Holes Recognition");
        //            }
        //        }
        //    }
        //}

        /// <summary>
        /// 솔리드 모델에서 홀을 인식하는 메서드
        /// </summary>
        public void RecognizeFeatureHolesOnSolid()
        {
            if (Document.Solids.Count == 0)
            {
                return;
            }

            var faceFinder = new Foreachface(_application);
            var (TapHole, Hole) = faceFinder.FindHoleface();

            //var solid = Document.Solids[1];
            //var body = solid.SolidBody as EspritSolids.SolidBody;
            //List<EspritSolids.SolidFace> Hole = new List<EspritSolids.SolidFace>();
            //List<EspritSolids.SolidFace> TapHole = new List<EspritSolids.SolidFace>();
            
            //uint tapColor = 0x94BF2F;  // 원하는 색상의 BGR 값
            

            //foreach (EspritSolids.SolidFace face in body.SolidFaces)
            //{
            //    var solidsurface = face.SolidSurface as EspritSolids.SolidSurface;
            //    EspritSolids.SolidSurfaceType surfaceType = solidsurface.SurfaceType;

            //    if(surfaceType == EspritSolids.SolidSurfaceType.geoSurfaceCylinder)
            //    {
            //        uint faceColor = Convert.ToUInt32(face.get_Color());
            //        if (faceColor == tapColor)  // 🎯 Face 색상 비교
            //        {
            //            TapHole.Add(face);
            //        }
            //        else
            //        {
            //            Hole.Add(face);
            //        }
            //    }
            //    else
            //    {
            //        continue;
            //    }                
            //}    

            try
            {
                var conf = _application.Configuration.ConfigurationHoleRecognition2; // Hole 가공 경로 생성 조건 설정
                conf.MaxDiameterMetric = 35;
                conf.MinDiameterMetric = 1;
                conf.MinimumHoleOpeningMetric = 180;

                conf.CombineCoaxialHoles = false;
                conf.PropagateHoleFace = false;
                conf.ActiveWorkplaneOnly = false;
                conf.SplitCustomHole = true;

                conf.GroupByCadFeature = true;
                conf.GroupBySameHoleType = true;
                conf.GroupBySameDiameters = true;
                conf.GroupBySameDepths = false;

                conf.GroupBySameDirection = false;
                conf.GroupBySameAltitude = false;

                EspritComBase.ComFaults tapComFaults;
                EspritComBase.ComFaults holeComFaults;

                Document.FeatureRecognition.CreateHoleFeatures2(TapHole.ToArray(), out tapComFaults);
                Document.FeatureRecognition.CreateHoleFeatures2(Hole.ToArray(), out holeComFaults);

                // 🔹 TapHole 오류 메시지 출력
               for (var i = 1; i <= tapComFaults.Count; i++)
               {
                    var msgType = tapComFaults[i].Severity == espFaultSeverity.espFaultWarning
                        ? EspritConstants.espMessageType.espMessageTypeWarning
                        : EspritConstants.espMessageType.espMessageTypeError;

                    _application.EventWindow.AddMessage(msgType, "Tap Hole Recognition", tapComFaults[i].Description);
               }

                // 🔹 Hole 오류 메시지 출력
                for (var i = 1; i <= holeComFaults.Count; i++)
                {
                    var msgType = holeComFaults[i].Severity == espFaultSeverity.espFaultWarning
                        ? EspritConstants.espMessageType.espMessageTypeWarning
                        : EspritConstants.espMessageType.espMessageTypeError;

                    _application.EventWindow.AddMessage(msgType, "Hole Recognition", holeComFaults[i].Description);
                }
            }
            catch (Exception)
            {
                System.Windows.Forms.MessageBox.Show("Error on Hole Features recognition", "Feature Holes Recognition");
            }
        }

        public void Pocketing()
        {
            if (Document.Solids.Count == 0)
            {
                return;
            }

            var solid = Document.Solids[1];
            var body = solid.SolidBody as EspritSolids.SolidBody; // Accessing SolidBody
            List<EspritSolids.SolidFace> Pocket = new List<EspritSolids.SolidFace>();

            foreach (EspritSolids.SolidFace face in body.SolidFaces) // Accessing SolidFace 
            {
                var solidsurface = face.SolidSurface as EspritSolids.SolidSurface; // Accessing SolidSurface 
                EspritSolids.SolidSurfaceType surfaceType = solidsurface.SurfaceType; // Filter by Surface type

                if (surfaceType == EspritSolids.SolidSurfaceType.geoSurfacePlane)
                {
                    var normalVector = solidsurface.NormalAlong(0.5, 0.5);
                    var Znormal = new EspritGeometry.ComVector();
                    Znormal.SetXyz(0, 0, 1);
                    if (normalVector != Znormal)
                    {
                        Pocket.Add(face);
                        //System.Windows.Forms.MessageBox.Show($"Pocket 추가됨: Face ID {face.Identity}, Normal Vector: {normalVector.X} , {normalVector.Y}, {normalVector.Z}");
                    }
                }
                else
                {
                    continue;
                }
            }
            try
            {
                Document.FeatureRecognition.CreatePocketFeatures2(Pocket.ToArray(), Document.ActivePlane, out var comFaults);
                foreach (var fault in comFaults)
                {
                    var faultItem = fault as EspritComBase.ComFault;
                    if (faultItem != null)
                    {
                        _application.EventWindow.AddMessage(EspritConstants.espMessageType.espMessageTypeWarning,
                        "Pocket Feature Recognition", faultItem.Description);
                    }
                }
            }
            catch (Exception)
            {
                System.Windows.Forms.MessageBox.Show("Error on Pocket Features recognition");
            }
        }

        //public void Pocketing()
        //{
        //    if (Document.Solids.Count == 0)
        //    {
        //        System.Windows.Forms.MessageBox.Show("No solids found in the document.");
        //        return;
        //    }

        //    var solid = Document.Solids[1];
        //    var body = solid.SolidBody as EspritSolids.SolidBody;
        //    if (body == null)
        //    {
        //        System.Windows.Forms.MessageBox.Show("SolidBody를 가져오지 못했습니다.");
        //        return;
        //    }
        //    List<EspritSolids.SolidFace> selectedFaces = _faceColorChanger.ChangeSelectedFaceColor();
        //    //List<EspritSolids.SolidFace> validFaces = new List<EspritSolids.SolidFace>();

        //    // ✅ 특정 색상 (예: 0xFF0000, 빨간색) 기준으로 Face 필터링
        //    // uint targetColor = 204;  // 원하는 색상의 RGB 값 (16진수)

        //    //    foreach (EspritSolids.SolidFace face in body.SolidFaces)
        //    //  {
        //    //    uint faceColor = Convert.ToUInt32(face.get_Color());   
        //    //   if (faceColor == targetColor)  // 🎯 Face 색상 비교
        //    //       {
        //    //           validFaces.Add(face);
        //    //       }
        //    //  }


        //    // foreach (EspritSolids.SolidFace face in body.SolidFaces)
        //    //{
        //    //  Array faceArray = new EspritSolids.SolidFace[] { face };

        //    // ✅ 올바른 CadFeatures 객체 가져오기
        //    //                Esprit.CadFeatures cadFeatureRecognition = _application.Document.CadFeatures;
        //    //
        //    //                var cadFeatures = cadFeatureRecognition.GetCadFeaturesFromFaces(ref faceArray);
        //    //                if (cadFeatures != null)
        //    //               {
        //    //                   foreach (Esprit.CadFeature cadFeature in cadFeatures)
        //    //                  {

        //    //         if (cadFeature.TypeDescriptor == "SE_igExtrudedCutoutFeatureObject")
        //    //       {
        //    //         //validFaces.Add(face);
        //    //        validFacesWithPlanes.Add(face);
        //    //       break;
        //    //  }
        //    //}
        //    //}
        //    //}

        //    if (selectedFaces.Count > 0)
        //    {
        //        try
        //        {
        //            Document.FeatureRecognition.CreatePocketFeatures2(selectedFaces.ToArray(), Document.ActivePlane, out var comFaults);
        //            foreach (var fault in comFaults)
        //            {
        //                var faultItem = fault as EspritComBase.ComFault;
        //                if (faultItem != null)
        //                {
        //                    _application.EventWindow.AddMessage(EspritConstants.espMessageType.espMessageTypeWarning,
        //                    "Pocket Feature Recognition", faultItem.Description);
        //                }
        //            }
        //        }
        //        catch (Exception)
        //        {
        //            System.Windows.Forms.MessageBox.Show("Error on Pocket Features recognition");
        //        }
        //    }
        //    else
        //    {
        //        System.Windows.Forms.MessageBox.Show("No valid faces found with 'ExtrudedCutoutFeatureObject' feature.");
        //    }
        //}

        public void Autochain()
        {
            //var solidArray = new List<IGraphicObject> { Document.Solids[1] };
            List<EspritSolids.SolidFace> selectedFaces = _faceColorChanger.ChangeSelectedFaceColor();
            try
            {
                var autoChains = Document.FeatureRecognition.CreateAutoChains1(selectedFaces.ToArray());
            }
            catch (COMException)
            {
                System.Windows.Forms.MessageBox.Show($"Error creating feature chains");
            }

        }
    }
}
