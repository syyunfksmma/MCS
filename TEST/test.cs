using CAM_API.Common.Helpers;
using CAM_API.Feature;
using CAM_API.Feature.Model;
using CAM_API.Feature.Services;
using CAM_API.Setup;
using CAM_API.Setup.Services;
using Esprit;
using ESPRIT.KBMAccess;
using ESPRIT.KBMDAL.Collections.CuttingTools;
using ESPRIT.KBMProcedures;
using ESPRIT.MachineOperationManager.Model;
using ESPRIT.ToolAssembly.DataExchange;
using ESPRIT.ToolAssemblyManager.Model;
using ESPRIT.ToolChangeIntermediatePoint.Utility;
using EspritConstants;
using EspritGeometry;
using EspritProperties;
using EspritSolids;
using EspritTechnology;
using EspritTools;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows;
using static ESPRIT.KBMAccess.Views.SaveToolsWindow;

namespace CAM_API
{
    
    // function test
    /// <summary>
    /// for simple function testing.
    ///
    /// 
    /// </summary>
    /// 
    internal class test
    {
        private readonly Esprit.Application _app;
        private readonly Esprit.Document Document;
        private readonly CadFeaturesManager _cadFeaturesManager;
   
        public test(Esprit.Application app)
        {
            _app = app ?? throw new ArgumentNullException(nameof(app));
            Document = _app.Document;  // ✅ _app.Document 값으로 초기화
            _cadFeaturesManager = new CadFeaturesManager(_app);
        }


        public void Run()
        {
            //var allCadFeatures = _cadFeaturesManager.GetAllCadFeatures();

            //var ptpatterncon = new List<CustomPropCondition>
            //    {
            //        new CustomPropCondition("Description", new List<string>{ "TEST"}),
            //    };

            //var NPTs = CadFeaturesManager.FindMatchingFaces(allCadFeatures, ptpatterncon).ToList();

            //int A = NPTs.Count;


            //var featureHoles = Document.HolesFeatures.Add() as Esprit.HolesFeature;
            //var comFeatureHoles = featureHoles.Object as EspritFeatures.IComFeatureHoles;

            //comFeatureHoles.Name = "CenterHole";
            //comFeatureHoles.PartID = Document.Parts[1].Key;
            //comFeatureHoles.WorkCoordinateNumber = int.Parse(Document.WorkCoordinates[1].Key);
            //comFeatureHoles.WorkPlaneNumber = 1; // XYZ 평면
            //comFeatureHoles.FeatureType = EspritFeatures.geoFeatureType.geoHolesFeature;

            //// 홀 방향 (Z+)
            //var holeNormal = new EspritGeometry.ComVector();
            //holeNormal.SetXyz(0, 0, 1);

            //// 홀 중심 좌표 (0,0,0)
            //var holePoint = new EspritGeometry.ComPoint();
            //holePoint.SetXyz(0, 0, 0);

            //// 홀 정의
            //var hole = new EspritFeatures.ComFeatureHole()
            //{
            //    HoleDiameter = 30,   // 직경
            //    HoleDepth = 20,      // 깊이
            //    ThroughAll = true,  // 관통 여부
            //    HolePoint = holePoint,
            //    HoleNormal = holeNormal,
            //    Type = EspritFeatures.espFeatureHoleType.espFeatureHoleDrill
            //};

            //// HolesFeature에 적용
            //comFeatureHoles.SetHoles(new[] { hole });


            var groupName = "Temp";
            var set = SelectionSetHelper.GetSelectionSet(Document, groupName);

            set.RemoveAll();
            for (var i = 1; i <= Document.Group.Count; i++)
            {
                set.Add(Document.Group[i]);
            }

            // 선택된 Face 리스트 저장
            List<SolidFace> facesToReturn = new List<SolidFace>();
            List<Arc> arc = new List<Arc>();
            List<TurningFeatureChain> fc = new List<TurningFeatureChain>();
            //uint targetColor = 204; // BGR (Blue-Green-Red), 빨간색

            foreach (var obj in set)
            {
                if (obj is EspritSolids.SolidFace face)
                    facesToReturn.Add(face);
                
                if (obj is Arc arc1)
                    arc.Add(arc1);

                if(obj is TurningFeatureChain featureChain)
                    fc.Add(featureChain);
            }

            double u = 0;
            double v = 0;
            foreach (var face in facesToReturn)
            {
                var surface = face.SolidSurface;

                var normal = surface.NormalAlong(u, v);

                double x = normal.X;
                double y = normal.Y;
                double z = normal.Z;

                MessageBox.Show($"{x},{y},{z}", "Tag Selected Faces", MessageBoxButton.OK, MessageBoxImage.Information);

            }


            foreach (var a in arc)
            {
                double x = a.X;
                double y = a.Y;
                double z = a.Z;

                double ux = a.Ux;
                double uy = a.Uy;
                double uz = a.Uz;

                double vx = a.Vx;
                double vy = a.Vy;
                double vz = a.Vz;

                double wx = a.Wx;
                double wy = a.Wy;
                double wz = a.Wz;



                MessageBox.Show($"{x},{y},{z} \n {ux},{uy},{uz} \n {vx},{vy},{vz} \n {wx},{wy},{wz}", "Tag Selected Faces", MessageBoxButton.OK, MessageBoxImage.Information);


            }



            //System.Array facesArray = facesToReturn.ToArray();
            //var cadfeature = Document.CadFeatures.GetCadFeaturesFromFaces(ref facesArray)[1];
            //dynamic customProps = cadfeature.CustomProperties as CustomProperties;

            //var prop = FeatureManager.GetOrAddCustomProperty(customProps, "Description", EspritConstants.espPropertyType.espPropertyTypeString);
            //prop.Value = "test";
            //prop.readOnly = true;

            Document.SelectionSets.Remove(groupName);

            return;

        }

        public void Run1()
        {
            var tools = Document.Tools as EspritTools.Tools;
            var partOperations = Document.PartOperations;

            var list1 = new List<int>();
            var list2 = new List<string>();

            foreach (EspritTechnology.ITechnology technology in tools)
            {
                var ToolNumber = technology.FindParameter("ToolNumber").Value;
                list1.Add(Convert.ToInt32(ToolNumber));
            }

            var duplicates = list1.GroupBy(i => i) .Where(g => g.Count()>1).Select(g => g.Key).ToList();
            
            foreach (var item in duplicates)
            {
                MessageBox.Show($"현재 중복 된 Tool Number는 {item} 입니다.", "Tool Number", MessageBoxButton.OK, MessageBoxImage.Information);
            }

            foreach (PartOperation operation in partOperations)
            {
                var number = operation.Count; 
                var tech = operation.Technology as EspritTechnology.ITechnology;
                var toolID = tech.FindParameter("ToolID").Value;
                list2.Add(toolID.ToString());
            }


        }


        //public void Run()
        //{
        //    //var allCadFeatures = _cadFeaturesManager.GetallCadFeatures();

        //    //var pocket = new List<CustomPropConditions>
        //    //{
        //    ////new CustomPropConditions("Description", new List<string>{ @"^.*컷-돌출4"}),
        //    //};


        //    //List<SolidFace> pocketface = _cadFeaturesManager.FindCadFeaturesByProps(allCadFeatures,pocket).ToList();
        //    //List<SolidFace> facesToRemove = new List<SolidFace>();

        //    //foreach (SolidFace face in pocketface)
        //    //{
        //    //    int fasces = face.SolidSurface.SolidFaces.Count;

        //    //    int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기

        //    //    if (loopCount == 1) // 갯수가 1일 때 해당 face 삭제 예정
        //    //    {
        //    //        facesToRemove.Add(face);  // 삭제할 faces를 별도의 리스트에 추가
        //    //    }
        //    //}

        //    //// pocketface에서 삭제할 faces를 한 번에 제거
        //    //foreach (SolidFace faceToRemove in facesToRemove) { pocketface.Remove(faceToRemove); }
        //    //if (pocketface.Count == 0) { return; }

        //    //Document.FeatureRecognition.CreatePocketFeatures2(pocketface.ToArray(), Document.ActivePlane, out var comFaults);
        //    //CadFeaturesManager.HandleComFaults(comFaults, "Pipe Tap Recognition", _app);
        //}


        //public void Run()
        //{
        //    var machineItems = Document.InitialMachineSetup;
        //    IMachineSetupQuery query = machineItems.CreateQuery();
        //    int count = query.Count;



        //    //string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
        //    //string espPath = Path.Combine(
        //    //            desktop,
        //    //            "test" + ".esprit"
        //    //        );
        //    //string wpPath = Path.Combine(
        //    //            desktop,
        //    //            "test" + ".wp"
        //    //        );
        //    //string stlPath = Path.Combine(
        //    //            desktop,
        //    //            "test" + ".stl"
        //    //        );


        //    //var partOperations = Document.PartOperations;
        //    //int count = partOperations.Count;
        //    //// (ESPRIT COM 컬렉션은 1-based 인덱스를 사용합니다.)
        //    //var partOperation = partOperations[count] as Esprit.PartOperation;
        //    //Array stockData;
        //    //var stockAutomation = Document.StockAutomation;
        //    //// 파라미터: 대상 PartOperation, 
        //    ////            false = 기존 스톡 무시 여부(여기서는 false로 두고)
        //    ////            out stockData = 반환된 Stock 객체 배열

        //    //if (stockAutomation.GetCalculatedStocks(partOperation, false, out stockData))
        //    //{
        //    //    foreach (var o in stockData)
        //    //    {
        //    //        var csd = o as Esprit.ICalculatedStockData;
        //    //        if (csd == null) continue;
        //    //        File.Copy(csd.FileName,wpPath,true);
        //    //        File.Copy(csd.FileName, stlPath, true);

        //    //    }
        //    //}


        //    //try
        //    //{
        //    //    Document.SaveAs(espPath);
        //    //}
        //    //catch (COMException ex) when (ex.Message.Contains("license"))
        //    //{
        //    //    // 라이선스 옵션 거부로 인한 예외
        //    //    MessageBox.Show($"저장 라이선스가 거부되었습니다:\n{ex.Message}",
        //    //                    "라이선스 오류", MessageBoxButton.OK, MessageBoxImage.Warning);
        //    //}
        //    //catch (COMException ex)
        //    //{
        //    //    // 기타 COM 오류
        //    //    MessageBox.Show($"문서 저장 중 오류가 발생했습니다:\n{ex.Message}",
        //    //                    "저장 실패", MessageBoxButton.OK, MessageBoxImage.Error);
        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    // 예상치 못한 예외
        //    //    MessageBox.Show($"알 수 없는 오류가 발생했습니다:\n{ex.Message}",
        //    //                    "오류", MessageBoxButton.OK, MessageBoxImage.Error);
        //    //}


        //    //// 1. PartOperations 컬렉션에서 마지막 PartOperation을 가져오기
        //    //var partOperations = Document.PartOperations;
        //    //int count = partOperations.Count;
        //    //// (ESPRIT COM 컬렉션은 1-based 인덱스를 사용합니다.)
        //    //var partOperation = partOperations[count] as Esprit.PartOperation;

        //    //if (partOperation == null)
        //    //{
        //    //    _app.EventWindow.AddMessage(
        //    //        EspritConstants.espMessageType.espMessageTypeWarning,
        //    //        "Run",
        //    //        "PartOperation을 가져올 수 없습니다.");
        //    //    return;
        //    //}

        //    //// 2. 이름 읽기
        //    //string name = partOperation.Name;
        //    //_app.EventWindow.AddMessage(
        //    //    EspritConstants.espMessageType.espMessageTypeInformation,
        //    //    "Run",
        //    //    $"PartOperation 이름: {name}");

        //    //// 3. Stock 저장 플래그 켜기
        //    //if (partOperation.SaveStock)
        //    //{
        //    //    return;
        //    //}

        //    //// 4. StockAutomation을 이용해 계산된 스톡 데이터를 가져오기
        //    //Array stockData;
        //    //var stockAutomation = Document.StockAutomation;
        //    //// 파라미터: 대상 PartOperation, 
        //    ////            false = 기존 스톡 무시 여부(여기서는 false로 두고)
        //    ////            out stockData = 반환된 Stock 객체 배열
        //    ////stockAutomation.GetCalculatedStocks(partOperation, false, out stockData);

        //    //espStockAutomationState espStockAutomationState = stockAutomation.GetState(partOperation);

        //    //if (stockAutomation.GetCalculatedStocks(partOperation, false, out stockData))
        //    //{
        //    //    foreach (var o in stockData)
        //    //    {
        //    //        var csd = o as Esprit.ICalculatedStockData;
        //    //        if (csd == null) continue;

        //    //        string wpPath = csd.FileName;
        //    //        string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
        //    //        string stlPath = Path.Combine(
        //    //            desktop,
        //    //            "test" + ".wp"
        //    //        );

        //    //        csd.FileName = stlPath;

        //    //        var aa = Document.SaveStockMode;





        //    //    }
        //    //}









        //    //NCOutputs nCOutputs = Document.InitialMachineSetup.NCOutputs;
        //    //long count = nCOutputs.Count;
        //    //if(count == 0)
        //    //    return;
        //    //for (int i = 1; i <= count; i++)
        //    //{
        //    //   NCOutput nCOutput = nCOutputs[i];
        //    //    string foldername = nCOutput.NCFileFolder;
        //    //    string filename = nCOutput.NCFileName;
        //    //    string extension = nCOutput.NCFileExtension;
        //    //    var post = nCOutput.PostProcessorFileNames;
        //    //    string postitem = nCOutput.PostProcessorItem[i];


        //    //    MessageBox.Show($"folder name : {foldername} \n file name : {filename} \n extension : {extension}");

        //    //}





        //}

        //public void Run()
        //{
        //    //Feature에서 cadfeature 속성 트리 접근하는 코드
        //    foreach (Esprit.IHolesFeature feature in Document.HolesFeatures)
        //    {
        //        try
        //        {
        //            var customProps = feature.CustomProperties as EspritProperties.CustomProperties;
        //            var customProp = customProps.ItemByEnumeration(espReservedCustomPropertyType.cadFeature) as EspritProperties.CustomProperty;
        //            var childProps = customProp as EspritProperties.CustomProperties;

        //            if (childProps == null) return;
        //            for (int j = 1; j <= childProps.Count; j++)
        //            {
        //                var sub = childProps[j];               // EspritProperties.CustomProperty
        //                string caption = sub.Caption;         // 자식 항목의 레이블
        //                object value = sub.Value;         // 자식 항목의 실제 값
        //                System.Windows.Forms.MessageBox.Show($"caption : {caption} / value : {value}", "childProps",
        //                System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            System.Windows.Forms.MessageBox.Show($"작업 중 오류가 발생했습니다:\n{ex.Message}", "Error",
        //           System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
        //        }
        //    }
        //}








        //public void cadfeaturecount()
        //{
        //    int cfs = Document.CadFeatures.Count;
        //    System.Windows.Forms.MessageBox.Show($"cadfeature count : {cfs}", "갯수",
        //        System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);

        //    for (int i = 1; i <= cfs; i++)
        //    {
        //        var cf = Document.CadFeatures[i];
        //        cf.c
        //        System.Windows.Forms.MessageBox.Show($"cadfeature name : {cf.Name}", "이름",
        //        System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);

        //    }

        //    return;

        //}



    }
}


////스매쉬 어쩌구 저쩌구 면취 Feature 만들어 보려고 한것들
//public void smash()
//{
//    try
//    {
//        var features = GetValidFeatures();
//        if (!features.Any())
//        {
//            MessageBox.Show("no");
//            return;
//        }

//        foreach (var feature in features)
//        {
//            SmashStlObjects(feature);
//        }
//    }
//    catch (Exception ex)
//    {
//        MessageBox.Show($"error : {ex}");
//    }
//}


//private IEnumerable<Esprit.GraphicObject> GetValidFeatures()
//{
//    return _application.Document.GraphicsCollection
//        .Cast<Esprit.GraphicObject>()
//        .Where(obj => obj is Esprit.HolesFeature);
//}




//private void SmashStlObjects(Esprit.GraphicObject holesFeature)
//{
//    var selectionSet = GetSelectionSet(Document, "Temp");
//    selectionSet.RemoveAll();
//    selectionSet.Add(holesFeature);

//    //foreach (Esprit.IGraphicObject graphicObject in Document.GraphicsCollection)
//    //{
//    //    if (graphicObject.GraphicObjectType == EspritConstants.espGraphicObjectType.espSTL_Model)
//    //    {
//    //        selectionSet.Add(graphicObject);
//    //    }
//    //}

//    //var tolerance = (Document.SystemUnit == EspritConstants.espUnitType.espInch)
//    //    ? 0.01
//    //    : 0.25;

//    try
//    {
//        selectionSet.Smash(true, false, false, EspritConstants.espWireFrameElementType.espWireFrameElementAll, 0, 0);
//    }
//    catch (Exception ex)
//    {
//        System.Windows.MessageBox.Show(ex.Message);
//    }

//    Document.Refresh();
//    Document.Windows.ActiveWindow.Fit();
//    Document.Windows.ActiveWindow.Refresh();

//    Document.SelectionSets.Remove(selectionSet.Name);
//}



// Created as an attempt to apply both the name and custom properties to the generated feature at once.
// It seems unfeasible, but I kept it just in case it might be useful somewhere.
//static public void EditFeatureProp(IGraphicObject graphicObject, string fname, string caption, string value, EspritConstants.espPropertyType type)
//{
//    string Ftype = graphicObject.TypeName;
//    dynamic props = graphicObject.CustomProperties;

//    if (Ftype == "FeatureChain")
//    {
//        FeatureChain Feature = graphicObject as FeatureChain;
//        Feature.Name = fname;
//        var property = CustomPropConditions.GetOrAddCustomProperty(props, caption, EspritConstants.espPropertyType.espPropertyTypeString);
//        property.Caption = caption;
//        property.ReadOnly = true;
//        property.Value = value;
//    }
//    if (Ftype == "HolesFeature")
//    {
//        HolesFeature Feature = graphicObject as HolesFeature;
//        Feature.Name = fname;
//        var property = CustomPropConditions.GetOrAddCustomProperty(props, caption, EspritConstants.espPropertyType.espPropertyTypeString);
//        property.Caption = caption;
//        property.ReadOnly = true;
//        property.Value = value;
//    }
//}
