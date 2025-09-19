using System;
using Esprit;
using System.Collections.Generic;
using System.Linq;
using EspritProperties;
using System.Collections;
using ESPRIT.KBMModules;

namespace CAM_API.Setup
{
    public class workplan
    {
        private readonly Application _application;
        private readonly Document Document;

        public workplan(Application application)
        {
            _application = application;
            Document = _application.Document;
        }

        public void ConvertLocalToGlobal()
        {
            // 활성 평면 가져오기 (Workplane)
            Plane activePlane = Document.ActivePlane;

            var checkNames = new List<string> { "XYZ", "ZXY", "YZX" };

            Plane workingPlane;
            if (checkNames.Any(name => name.Equals(activePlane.Name, StringComparison.OrdinalIgnoreCase)))
            {
                workingPlane = CopyPlane(Document.Planes, activePlane, "CopyPlane");
            }
            else
            {
                workingPlane = activePlane;
            }



            workingPlane.Translate(-workingPlane.X, -workingPlane.Y, -workingPlane.Z);
            workingPlane.RotateUVW(0, 0, -Math.PI / 2);
            var (A_out, B_out, C_out) = UVXtoABC(
                workingPlane.Ux, workingPlane.Uy, workingPlane.Uz,
                workingPlane.Vx, workingPlane.Vy, workingPlane.Vz,
                workingPlane.Wx, workingPlane.Wy, workingPlane.Wz);

            string baseName = $"B{Math.Round(B_out, 2)},C{Math.Round(C_out, 2)}";
            string newName = baseName;
            int counter = 1;

            // 이름 중복 방지
            while (Document.Planes.Cast<Plane>().Any(p => p.Name == newName))
            {
                newName = $"{baseName}_{counter++}";
            }

            workingPlane.Name = newName;


            // ✅ U, V, W 벡터 값 출력
            //_application.EventWindow.AddMessage(
            //    EspritConstants.espMessageType.espMessageTypeInformation,
            //    "Workplane Transformation",
            //    $"활성 평면: {activePlane.Name}\n" +
            //    $"U = ({activePlane.Ux:F4}, {activePlane.Uy:F4}, {activePlane.Uz:F4})\n" +
            //    $"V = ({activePlane.Vx:F4}, {activePlane.Vy:F4}, {activePlane.Vz:F4})\n" +
            //    $"W = ({activePlane.Wx:F4}, {activePlane.Wy:F4}, {activePlane.Wz:F4})"
            //    );

        }

        public static (double Ux, double Uy, double Uz, double Vx, double Vy, double Vz, double Wx, double Wy, double Wz) ABCtoUVX(double A, double B, double C)
        {
            // 각도를 라디안으로 변환
            double radA = A * Math.PI / 180.0;
            double radB = B * Math.PI / 180.0;
            double radC = C * Math.PI / 180.0;

            // 회전 행렬 생성 (Z-Y-X 순서)
            double cosA = Math.Cos(radA), sinA = Math.Sin(radA);
            double cosB = Math.Cos(radB), sinB = Math.Sin(radB);
            double cosC = Math.Cos(radC), sinC = Math.Sin(radC);

            // U, V, W 벡터 계산
            double Ux = cosA * cosB;
            double Uy = cosA * sinB * sinC - sinA * cosC;
            double Uz = cosA * sinB * cosC + sinA * sinC;

            double Vx = sinA * cosB;
            double Vy = sinA * sinB * sinC + cosA * cosC;
            double Vz = sinA * sinB * cosC - cosA * sinC;

            double Wx = -sinB;
            double Wy = cosB * sinC;
            double Wz = cosB * cosC;

            return (Ux, Uy, Uz, Vx, Vy, Vz, Wx, Wy, Wz);
        }

        // ✅ U, V, W 벡터를 A, B, C 축 각도로 변환
        public static (double A, double B, double C) UVXtoABC(double Ux, double Uy, double Uz, double Vx, double Vy, double Vz, double Wx, double Wy, double Wz)
        {
            double A = Math.Atan2(Uy, Ux) * 180.0 / Math.PI; // Yaw (Z축 회전)
            double B = Math.Atan2(-Uz, Math.Sqrt(Ux * Ux + Uy * Uy)) * 180.0 / Math.PI; // Pitch (Y축 회전)
            double C = Math.Atan2(Wy, Vy) * 180.0 / Math.PI; // Roll (X축 회전)

            return (A, B, C);
        }

        public static Plane CopyPlane(IPlanes planes, Plane sourcePlane, string baseName)
        {


            // 유니크한 이름 생성
            int suffix = 0;
            string newName;
            do
            {
                newName = $"{baseName}_{suffix++}";
            } while (planes.Cast<Plane>().Any(p => p.Name == newName));

            // 새 평면 추가 및 속성 복사
            var newPlane = planes.Add(newName);

            newPlane.Ux = sourcePlane.Ux;
            newPlane.Uy = sourcePlane.Uy;
            newPlane.Uz = sourcePlane.Uz;

            newPlane.Vx = sourcePlane.Vx;
            newPlane.Vy = sourcePlane.Vy;
            newPlane.Vz = sourcePlane.Vz;

            newPlane.Wx = sourcePlane.Wx;
            newPlane.Wy = sourcePlane.Wy;
            newPlane.Wz = sourcePlane.Wz;

            newPlane.X = sourcePlane.X;
            newPlane.Y = sourcePlane.Y;
            newPlane.Z = sourcePlane.Z;

            return newPlane;
        }

        




        public void defineangle()
        {
            var listofPlane = getallplane();
            foreach (HolesFeature holes in Document.HolesFeatures)
            {
                Plane Plane = holes.Plane;
                foreach (string name in listofPlane.Keys)
                {
                    //if (name == Plane.Name)
                    //{
                    //    var property = CustomPropConditions.GetOrAddCustomProperty(holes as IGraphicObject, "define anlge", EspritConstants.espPropertyType.espPropertyTypeDouble);
                    //    property.Caption = "define angle";
                    //    property.ReadOnly = true;
                    //    property.Value = listofPlane[name];
                    //}
                }


                //if (B_out == 0)
                //{
                //    var property = GetOrAddCustomProperty(holes as IGraphicObject, "define anlge", EspritConstants.espPropertyType.espPropertyTypeDouble);

                //    property.Caption = "define angle";
                //    property.ReadOnly = true;
                //    property.Value = 1;
                //}
                //else if (B_out == 90)
                //{
                //    var property = GetOrAddCustomProperty(holes as IGraphicObject, "define anlge", EspritConstants.espPropertyType.espPropertyTypeDouble);
                //    property.Caption = "define angle";
                //    property.ReadOnly = true;
                //    property.Value = 2;
                //}
                //else 
                //{
                //    var property = GetOrAddCustomProperty(holes as IGraphicObject, "define anlge", EspritConstants.espPropertyType.espPropertyTypeDouble);
                //    property.Caption = "define angle";
                //    property.ReadOnly = true;
                //    property.Value = 3;
                //}
            }
        }


        public Dictionary<string, string> getallplane()
        {
            var listofPlane = new Dictionary<string, string>();
            //Double a = 0;
            Plane workingPlane;

            var checkNames = new List<string> { "Top", "Isometric", "Front", "Left", "Right", "Back", "Bottom" };
            //var checkNames = new List<string> { "Top", "Isometric", "Front", "Left", "Right", "Back", "Bottom", "XYZ", "ZXY", "YZX" };



            foreach (Plane Plane in Document.Planes)
            {

                if (checkNames.Any(name => name.Equals(Plane.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    //workingPlane = CopyPlane(Document.Planes, activePlane, "CopyPlane");
                    continue;
                }
                else
                {
                    workingPlane = CopyPlane(Document.Planes, Plane, "CopyPlane");
                    workingPlane.RotateUVW(0, 0, -Math.PI / 2);
                    var (A_out, B_out, C_out) = UVXtoABC(
                        workingPlane.Ux, workingPlane.Uy, workingPlane.Uz,
                        workingPlane.Vx, workingPlane.Vy, workingPlane.Vz,
                        workingPlane.Wx, workingPlane.Wy, workingPlane.Wz);
                    if (B_out == 0)
                    {
                        listofPlane.Add(Plane.Name, "1");

                    }
                    else if (B_out == 90)
                    {
                        listofPlane.Add(Plane.Name, "2");
                    }
                    else
                    {
                        listofPlane.Add(Plane.Name, "3");
                    }
                    Document.Planes.Remove(workingPlane.Name);
                    //workingPlane = activePlane;
                }

            }

            return listofPlane;

        }


        public static string BottomPlan(Application app)
        {
            Planes planes = app.Document.Planes;
            string NAME = null;
            var checkNames = new List<string> { "Top", "Isometric", "Front", "Left", "Right", "Back", "Bottom", "XYZ", "ZXY", "YZX" };

            foreach (Plane a in planes)
            {
                if (checkNames.Any(name => name.Equals(a.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    continue;
                }
                else
                {
                    if (ismatch(a))
                    {
                        NAME = a.Name;
                    }
                }
            }
            return NAME;
        }

        public static bool ismatch(Plane a)
        {
            // U 벡터
            if (a.Ux != 1) return false;
            if (a.Uy != 0) return false;
            if (a.Uz != 0) return false;

            // V 벡터
            if (a.Vx != 0) return false;
            if (a.Vy != -1) return false;
            if (a.Vz != 0) return false;

            // W 벡터
            if (a.Wx != 0) return false;
            if (a.Wy != 0) return false;
            if (a.Wz != -1) return false;

            return true;
        }

        public static bool TryActivatePlaneByName(Esprit.Application app, string planeName)
        {
            if (app?.Document == null || string.IsNullOrWhiteSpace(planeName))
                return false;

            var doc = app.Document;
            Esprit.Plane target = null;

            // 이름(대소문자 무시)으로 검색
            for (int i = 1; i <= doc.Planes.Count; i++)
            {
                var p = doc.Planes[i] as Esprit.Plane;
                if (p != null && string.Equals(p.Name, planeName.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    target = p;
                    break;
                }
            }

            if (target == null)
                return false;

            try
            {
                // 방법 A: 속성으로 활성화 (대부분 버전에서 가능)
                doc.ActivePlane = target;

                // 방법 B: 일부 환경/버전에선 메서드가 따로 있을 수 있음
                // target.Activate();   // 또는 target.SetActive();

                // 확인
                return string.Equals(doc.ActivePlane?.Name, target.Name, StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }


        //public List<Esprit.Plane> getallplane()
        //{
        //    var listofPlane = new List<Plane>();

        //    foreach (Esprit.Plane Plane in Document.Planes)
        //    {
        //        listofPlane.Add(Plane);
        //    }

        //    return listofPlane;

        //}

        //public void AddOrUpdateDiameterPropertyOnCircles()
        //{
        //    foreach (Circle circle in Document.Circles)
        //    {
        //        var property = GetOrAddCustomProperty(circle as IGraphicObject, "Diameter", EspritConstants.espPropertyType.espPropertyTypeDouble);
        //        property.Caption = "Diameter";
        //        property.ReadOnly = true;
        //        property.Value = 2 * circle.Radius;
        //    }
        //}
    }
}