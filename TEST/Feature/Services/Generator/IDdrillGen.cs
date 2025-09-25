//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Windows;
//using CAM_API.Feature.Model;
//using Esprit;
//using EspritSolids;

//namespace CAM_API.Feature.Services.Generator
//{
//    public class IDdrillGen : IFeatureGenerator
//    {
//        private readonly Esprit.Application _application;
//        private readonly CadFeaturesManager _cadFeaturesManager;
//        private readonly FeatureManager _FeatureManager;

//        public IDdrillGen(Esprit.Application application)
//        {
//            _application = application ?? throw new ArgumentNullException(nameof(application));
//            _cadFeaturesManager = new CadFeaturesManager(_application);
//            _FeatureManager = new FeatureManager(_application);
//        }

//        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
//        {
//            var featureHoles = _application.Document.HolesFeatures.Add() as Esprit.HolesFeature;
//            var comFeatureHoles = featureHoles.Object as EspritFeatures.IComFeatureHoles;
//            comFeatureHoles.Name = "Test HolesFeature";
//            comFeatureHoles.PartID = _application.Document.Parts[1].Key;
//            comFeatureHoles.WorkCoordinateNumber = int.Parse(_application.Document.WorkCoordinates[1].Key);
//            comFeatureHoles.WorkPlaneNumber = 8;
//            comFeatureHoles.FeatureType = EspritFeatures.geoFeatureType.geoHolesFeature;

//            var holeNormal = new EspritGeometry.ComVector();
//            holeNormal.SetXyz(0, 0, 1);

//            var holePoint = new EspritGeometry.ComPoint();

//            var holes = new List<EspritFeatures.IComFeatureHole>();
//            for (var i = 0; i < 4; i++)
//            {
//                holePoint.SetXyz(10 + 20 * i, 30 + 20 * i, 0);

//                var hole = new EspritFeatures.ComFeatureHole()
//                {
//                    HoleDiameter = 10,
//                    HoleDepth = 10,
//                    ThroughAll = true,
//                    BoreDepth = 0,
//                    BoreDiameter = 0,
//                    BottomAngleDeg = 0,
//                    ChamferAngleDeg = 0,
//                    ChamferDiameter = 0,
//                    HeadClearance = 20,
//                    MajorDiameter = 0,
//                    MinorDiameter = 0,
//                    ThreadDepth = 0,
//                    ThreadDiameter = 0,
//                    ThreadPitch = 0,

//                    HolePoint = holePoint,
//                    HoleNormal = holeNormal,
//                    Type = EspritFeatures.espFeatureHoleType.espFeatureHoleDrill
//                };

//                holes.Add(hole);
//            }

//            comFeatureHoles.SetHoles(holes.ToArray());

//            try
//            {
//                _application.Document.PartOperations.Add(tech, featureHoles);
//            }
//            catch (Exception e)
//            {
//                System.Windows.MessageBox.Show(e.Message, "CreateCustomFeatureHolesTutorial");
//            }
//        }
//    }
//}
