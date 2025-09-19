using CAM_API.Common.Helpers;
using CAM_API.Setup;
using Esprit;
using ESPRIT.Wpf.Components.CadDiagnostics.Model;
using EspritComBase;
using EspritConstants;
using EspritFeatures;
using EspritGeometryBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Windows.Controls;
using System.Xml.Linq;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Tab;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// Method for turning feature generation.
    /// 심연같은 코드.
    /// </summary>

    internal class CreateTurningFeatures
    {
        private readonly Esprit.Application _application;
        private readonly Esprit.Document Document;


        public CreateTurningFeatures(Esprit.Application application)
        {
            _application = application;
            Document = _application.Document;
        }

        public void CreateTURN(bool isodcut)
        {
            try
            {
                // 1) BODY & Z축 설정
                var solid = Document.Solids[1];
                var body = solid.SolidBody as EspritSolids.SolidBody;
                Array bodies = new object[] { body };

                ILine zAxis = Document.GetLine(Document.GetPoint(0, 0, 0), 0, 0, 1);

                // 2) 옵션 구성
                //    - Face | Od | Id 형상(Geometry 추출용)
                var faceSegOpt = BuildClosedOptions(espTurningFeatureCreateType.espTurningFeatureCreateTypeGeometry,
                                                    espTurningFeatureWorkType.espTurningFeatureWorkTypeFace,
                                                    espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                    espTurningFeatureProfileType.espTurningFeatureProfileTypeContour,
                                                    skipGrooves: true, includeBlends: true, reliefAngleDeg: 0);

                var odSegOpt = BuildClosedOptions(espTurningFeatureCreateType.espTurningFeatureCreateTypeGeometry,
                                                    espTurningFeatureWorkType.espTurningFeatureWorkTypeOD,
                                                    espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                    espTurningFeatureProfileType.espTurningFeatureProfileTypeContour,
                                                    skipGrooves: true, includeBlends: true, reliefAngleDeg: 45);

                var idSegOpt = BuildClosedOptions(espTurningFeatureCreateType.espTurningFeatureCreateTypeGeometry,
                                                    espTurningFeatureWorkType.espTurningFeatureWorkTypeID,
                                                    espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                    espTurningFeatureProfileType.espTurningFeatureProfileTypeContour,
                                                    skipGrooves: true, includeBlends: true, reliefAngleDeg: 45);

                //      - Face | Od | Id 형상 (Feature 생성)
                var FaceOpt = BuildOpenOptions(espTurningFeatureWorkType.espTurningFeatureWorkTypeFace,
                                                   espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                   espTurningFeatureProfileType.espTurningFeatureProfileTypeContour);

                var OdOpt = BuildOpenOptions(espTurningFeatureWorkType.espTurningFeatureWorkTypeOD,
                                                   espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                   espTurningFeatureProfileType.espTurningFeatureProfileTypeContour);

                var IdOpt = BuildOpenOptions(espTurningFeatureWorkType.espTurningFeatureWorkTypeID,
                                                  espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                  espTurningFeatureProfileType.espTurningFeatureProfileTypeContour);

                var FaceGrvOpt = BuildOpenOptions(espTurningFeatureWorkType.espTurningFeatureWorkTypeFace,
                                   espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                   espTurningFeatureProfileType.espTurningFeatureProfileTypeGroove);

                //      - Groove 형상 (Fature 생성)
                var grvOpt = BuildClosedOptions(espTurningFeatureCreateType.espTurningFeatureCreateTypeFeature,
                                                   // OD|ID|Face 모두
                                                   (espTurningFeatureWorkType)
                                                   ((int)espTurningFeatureWorkType.espTurningFeatureWorkTypeOD
                                                   | (int)espTurningFeatureWorkType.espTurningFeatureWorkTypeID
                                                   | (int)espTurningFeatureWorkType.espTurningFeatureWorkTypeFace),
                                                   espTurningFeaturePartSideType.espTurningFeaturePartSideTypeFront,
                                                   espTurningFeatureProfileType.espTurningFeatureProfileTypeGroove,
                                                   skipGrooves: false, includeBlends: true, reliefAngleDeg: 45);

                // 3) 피처 인식
                Array FaceSeg = CreateFeature(bodies, zAxis, faceSegOpt, "FaceSeg");
                Array ODSeg = CreateFeature(bodies, zAxis, odSegOpt, "ODSeg");
                Array IDSeg = CreateFeature(bodies, zAxis, idSegOpt, "IDSeg");

                if (ODSeg != null && !isodcut)
                {
                    var endseg = ODSeg.GetValue(ODSeg.Length - 1) as Esprit.Segment;
                    endseg.ZEnd = endseg.ZStart - 1.3;
                }
                if (IDSeg != null)
                {
                    var startseg = IDSeg.GetValue(0) as Esprit.Segment;
                    startseg.ZStart = startseg.ZStart - 1.3;
                }
                Array inputSegments = ConcatArrays(FaceSeg, ODSeg); // 타입 검사 없이 단순 병합(object[])

                Array RghOdFc = CreateFeature(ODSeg, zAxis, OdOpt, "RghOdFc");
                Array FaceFc = CreateFeature(CreateFaceSeg(RghOdFc), zAxis, FaceOpt, "FaceFc");
                Array FinOdFc = CreateFeature(inputSegments, zAxis, OdOpt, "FinOdFc");
                Array RghIdFc = CreateFeature(IDSeg, zAxis, IdOpt, "RghIdFc");
                Array FinIdFc = CreateFeature(IDSeg, zAxis, IdOpt, "FinIdFc");
                Array GrvFc = CreateFeature(bodies, zAxis, grvOpt, "Groove");

                // 4) Grv type 별 분류
                Array OdGrvFc; Array IdGrvFc; Array FaceGrvFc;
                SplitGrvChainsByWorkType(GrvFc, out OdGrvFc, out IdGrvFc, out FaceGrvFc);
                // Feature 방향 정규화 (Minor -> Major)
                ReverseTurningFeature(FaceGrvFc,true);
                // Dovetail Grv 분리
                Array FaceGrvFC1; Array MajDvFc; Array MinDvFc;
                SpritDoveTailGrvChain(FaceGrvFc, zAxis, FaceGrvOpt, out FaceGrvFC1, out MajDvFc, out MinDvFc);
                // Feature 방향 정규화 (Minor -> Major)
                ReverseTurningFeature(FaceGrvFC1, false);
                ReverseTurningFeature(MinDvFc, false);
                GrvFc = ConcatArrays(GrvFc, FaceGrvFC1);
                FaceGrvFc = ConcatArrays(FaceGrvFc, FaceGrvFC1);

                // 5) 커스텀 속성 태깅(읽기전용 Boolean)
                TagChains(FaceFc, "FaceFc");
                TagChains(RghOdFc, "RghOdFc");
                TagChains(FinOdFc, "FinOdFc");
                TagChains(RghIdFc, "RghIdFc");
                TagChains(FinIdFc, "FinIdFc");
                TagChains(GrvFc, "GrvFc");
                TagChains(MajDvFc, "MajDoveTail");
                TagChains(MinDvFc, "MinDoveTail");

                //6) GrvFC Width & Depth 커스텀 속성 부여(읽기 전용 double)
                TagWidthandDepth(OdGrvFc, false);
                TagWidthandDepth(IdGrvFc, false);
                TagWidthandDepth(FaceGrvFc, true);
                TagDegree(MajDvFc);
                TagDegree(MinDvFc);

                // 7) Feature 이름 변경
                RenameChains(FaceFc, "1 FaceFc",false);
                RenameChains(RghOdFc, "2 RghOdFc", false);
                RenameChains(RghIdFc, "3 RghIdFc", false);
                RenameChains(FinOdFc, "4 FinOdFc", false);
                RenameChains(FinIdFc, "5 FinIdFc", false);
                RenameChains(OdGrvFc, " OdGrvFc", true);
                RenameChains(IdGrvFc, " IdGrvFc", true);
                RenameChains(FaceGrvFc, " FaceGrvFc", true);
                RenameChains(MajDvFc, " Maj Dia Dove Tail", true);
                RenameChains(MinDvFc, " Min Dia Dove Tail", true);

            }
            catch (Exception ex)
            {
                System.Windows.Forms.MessageBox.Show($"Error on recognition: {ex.Message}", "Error");
            }
        }

        // ────────────────────────────── Helpers ──────────────────────────────

        private static short B(bool v) => (short)(v ? 1 : 0);

        private TurningFeatureOptions BuildClosedOptions(
            espTurningFeatureCreateType createType, espTurningFeatureWorkType worktype, espTurningFeaturePartSideType partside, espTurningFeatureProfileType profileType,
            bool skipGrooves, bool includeBlends, double reliefAngleDeg)
        {
            var o = new TurningFeatureOptions();
            o.TurningFeatureCreateType = createType;
            o.ClosedGeometryTypeOfWork = (int)worktype;
            o.ClosedGeometryPartSide = (int)partside;
            o.ClosedGeometryProfileType = (int)profileType;
            o.ClosedGeometrySkipProfileGrooves = B(skipGrooves); // 1=true, 0=false
            o.ClosedGeometryIncludeGrooveBlends = B(includeBlends); // 1=true, 0=false
            o.ClosedGeometryGrooveReliefAngle = reliefAngleDeg;

            return o;
        }

        private TurningFeatureOptions BuildOpenOptions(espTurningFeatureWorkType worktype, espTurningFeaturePartSideType partside, espTurningFeatureProfileType profileType)
        {
            var o = new TurningFeatureOptions();
            o.OpenGeometryTypeOfWork = worktype; // OD=1 | ID=2 | Face=4
            o.OpenGeometryPartSide = partside;       // Front=1 | Back=2
            o.OpenGeometryProfileType = profileType;    // Contour=1 | Groove=2

            return o;
        }

        private Array CreateFeature(Array bodiesOrSegments, ILine zAxis, TurningFeatureOptions options, string label)
        {
            if(bodiesOrSegments.Length == 0)
                return null;
            var faults = new ComFaults();
            Array result = Document.FeatureRecognition.CreateTurningFeature(ref bodiesOrSegments, zAxis, false, ref options, out faults);
            ComFaultHandler.Handle(faults, label,_application);
            return result;
        }

        private Array CreateFaceSeg(Array array)
        {
            var f = array.GetValue(0) as Esprit.TurningFeatureChain;
            var maxdia = f.MaximumDiameter;
            var points = new List<Esprit.Point>();
            points.Add(Document.GetPoint(0, 0, 0));
            points.Add(Document.GetPoint(maxdia / 2, 0, 0));

            var segment = Document.Segments.Add(points[0], points[1]);

            Array result = new object[] { segment };
            return result;
        }

        static Array ConcatArrays(Array a, Array b)
        {
            int lenA = a?.Length ?? 0;
            int lenB = b?.Length ?? 0;

            var merged = Array.CreateInstance(typeof(object), lenA + lenB);
            int idx = 0;

            if (a != null) { a.CopyTo(merged, idx); idx += lenA; }
            if (b != null) { b.CopyTo(merged, idx); }

            merged = RemoveUnknown(merged);

            return merged;
        }

        private static Array RemoveUnknown(Array src)
        {
            if (src == null) return null;

            var kept = new List<IGraphicObject>(src.Length);
            foreach (var obj in src)
            {
                var go = obj as IGraphicObject;
                if (go == null) continue; // 타입 불일치/NULL은 버림

                bool unknown = false;
                try
                {
                    var tn = go.TypeName; // COM 접근 시 예외 가능
                    unknown = string.IsNullOrWhiteSpace(tn) ||
                              tn.Equals("Unknown", StringComparison.OrdinalIgnoreCase);
                }
                catch
                {
                    // TypeName 접근 예외 시도 Unknown 취급
                    unknown = true;
                }

                if (!unknown)
                    kept.Add(go);
            }

            // IGraphicObject[] 로 반환 (System.Array로도 사용 가능)
            return kept.ToArray();
        }

        private void TagChains(Array chains, string propName)
        {
            if (chains == null) return;
            foreach (TurningFeatureChain fc in chains)
            {
                dynamic props = fc.CustomProperties;
                var prop = FeatureManager.GetOrAddCustomProperty(props, propName, espPropertyType.espPropertyTypeBoolean);
                prop.Value = true;
                prop.readOnly = true;
            }
        }

        private void TagWidthandDepth(Array chains, bool isFace)
        {
            if (chains == null) return;
            foreach (TurningFeatureChain fc in chains)
            {
                double width = 0; double depth = 0;
                GetGrvFcWidthDepth(fc, isFace, out width, out depth);

                dynamic props = fc.CustomProperties;
                var prop1 = FeatureManager.GetOrAddCustomProperty(props, "Width", espPropertyType.espPropertyTypeDouble);
                prop1.Value = width;
                prop1.readOnly = true;
                var prop2 = FeatureManager.GetOrAddCustomProperty(props, "Depth", espPropertyType.espPropertyTypeDouble);
                prop2.Value = depth;
                prop2.readOnly = true;
            }
        }

        private void TagDegree(Array chains)
        {
            if (chains == null) return;
            foreach (TurningFeatureChain fc in chains)
            {
                double degree = 0;
                GetDegreeFormDoveTailFC(fc, out degree);

                dynamic props = fc.CustomProperties;
                var prop1 = FeatureManager.GetOrAddCustomProperty(props, "Degree", espPropertyType.espPropertyTypeDouble);
                prop1.Value = degree;
                prop1.readOnly = true;                
            }
        }

        private void RenameChains(Array chains, string Name, bool isGrv)
        {
            if (chains == null) return;
            foreach (TurningFeatureChain fc in chains)
            {
                if (isGrv)
                    fc.Name = fc.Name.Substring(0, 2).Trim() + Name;
                else 
                    fc.Name = Name;
            }
        }

        private void ReverseTurningFeature(Array chains, bool isUse)
        {
            if (chains == null) return;
            var set = SelectionSetHelper.GetSelectionSet(Document, "Temp");
            set.RemoveAll();
            foreach (var obj in chains)
            {
                var fc = obj as TurningFeatureChain;
                if (isUse)
                {
                    int n = fc.Count;

                    Segment seg1 = fc.Item[2] as Segment;
                    Segment seg2 = fc.Item[n - 1] as Segment;

                    if (seg1.XStart - seg2.XStart > 0)
                        set.Add(fc);
                }
                else
                {
                    set.Add(fc);
                }
            }
            set.Reverse(false);
            Document.SelectionSets.Remove(set.Name);
        }

        private void SplitGrvChainsByWorkType(Array chains, out Array OdGrvFc, out Array IdGrvFc, out Array FaceGrvFc)
        {
            var od = new List<IGraphicObject>();
            var id = new List<IGraphicObject>();
            var face = new List<IGraphicObject>();

            if (chains != null)
            {
                foreach (var obj in chains)
                {
                    var fc = obj as TurningFeatureChain;
                    if (fc == null) continue;

                    switch (fc.WorkType)
                    {
                        case espTurningFeatureWorkType.espTurningFeatureWorkTypeOD:
                            od.Add(fc as IGraphicObject);
                            break;

                        case espTurningFeatureWorkType.espTurningFeatureWorkTypeID:
                            id.Add(fc as IGraphicObject);
                            break;

                        case espTurningFeatureWorkType.espTurningFeatureWorkTypeFace:
                            face.Add(fc as IGraphicObject);
                            break;

                        default:
                            // 필요 시 기타 타입 처리
                            break;
                    }
                }
            }

            // List<T> -> T[] (System.Array로 업캐스트되어 나감)
            OdGrvFc = od.ToArray();
            IdGrvFc = id.ToArray();
            FaceGrvFc = face.ToArray();
        }

        private void SpritDoveTailGrvChain(Array chains, ILine zAxis, TurningFeatureOptions options, out Array FaceGrvFC1, out Array MajDvFcs, out Array MinDvFcs)
        {
            var Fgrvs = new List<IGraphicObject>();
            var MajDvs = new List<IGraphicObject>();
            var MinDvs = new List<IGraphicObject>();
            
            foreach (var obj in chains)
            {
                var Fgrv = new List<IGraphicObject>();
                var MajDv = new List<IGraphicObject>();
                var MinDv = new List<IGraphicObject>();

                var fc = obj as TurningFeatureChain;
                int n = fc.Count;
                bool isMinorDoveTail = true;

                if (n == 9)
                {
                    Segment seg1 = fc.Item[2] as Segment;
                    Segment seg2 = fc.Item[8] as Segment;
                    Segment seg3 = fc.Item[4] as Segment;

                    if(seg3.TypeName == "Segment" && seg3.XStart!=seg3.XEnd && seg3.ZStart ==seg3.ZEnd)
                        isMinorDoveTail = false;

                    if (isMinorDoveTail)
                    {
                        for (int i = 1; i <= 6; i++)
                        {
                            IGraphicObject item = fc.Item[i];
                            if (i == 6)
                            {
                                Segment a = item as Segment;
                                a.XEnd = seg1.XStart + 0.7;
                                item = a;
                            }
                            MinDv.Add(item);
                        }
                        for (int i = 6; i <= n; i++)
                        {
                            IGraphicObject item = fc.Item[i];
                            if (i == 6)
                            {
                                Segment a = item as Segment;
                                a.XStart = seg1.XStart + 0.15 + 0.381;
                                item = a;
                            }
                            Fgrv.Add(item);
                        }

                        var seg0 = fc.Item[1] as Arc;
                        var seg4 = Fgrv[0] as Segment;

                        Point point0 = Document.GetPoint(seg4.XStart, 0, seg4.ZStart + 0.381);
                        Arc coner1 = Document.GetArc(point0, 0.381, 180 * Math.PI / 180, 270 * Math.PI / 180);
                        coner1.Vy = 0; coner1.Vz = 1;

                        Point point1 = Document.GetPoint(seg1.XStart + 0.15, 0, seg1.ZStart + seg0.Radius - 0.381);
                        Segment seg = Document.GetSegment(point1 , coner1.Extremity(0));

                        Point point3 = Document.GetPoint(seg.XStart - 0.381, 0, seg.ZStart);
                        Arc coner2 = Document.GetArc(point3, 0.381, 90 * Math.PI / 180, 0 * Math.PI / 180);
                        coner2.Vy = 0; coner2.Vz = 1;

                        IGraphicObject addconer1 = coner1; IGraphicObject addconer2 = coner2; IGraphicObject addseg = seg;
                        Fgrv.Add(addconer1); Fgrv.Add(addseg); Fgrv.Add(addconer2);
                    }
                    else 
                    {
                        for (int i = 4; i <= n; i++)
                        {
                            IGraphicObject item = fc.Item[i];
                            if (i == 4)
                            {
                                Segment a = item as Segment;
                                a.XStart = seg2.XStart - 0.7;
                                item = a;
                            }
                            MajDv.Add(item);
                        }
                        for (int i = 1; i <= 4; i++)
                        {
                            IGraphicObject item = fc.Item[i];
                            if (i == 4)
                            {
                                Segment a = item as Segment;
                                a.XEnd = seg2.XStart - 0.15 - 0.381;
                                item = a;
                            }
                            Fgrv.Add(item);
                        }

                        var seg0 = fc.Item[9] as Arc;
                        var seg4 = Fgrv[3] as Segment;

                        Point point0 = Document.GetPoint(seg4.XEnd, 0, seg4.ZStart + 0.381);
                        Arc coner1 = Document.GetArc(point0, 0.381, 0 * Math.PI / 180, 90 * Math.PI / 180);
                        coner1.Vy = 0; coner1.Vz = -1;

                        Point point1 = Document.GetPoint(seg2.XStart - 0.15, 0, seg2.ZEnd + seg0.Radius - 0.381);
                        Segment seg = Document.GetSegment(point1, coner1.Extremity(0));

                        Point point3 = Document.GetPoint(seg.XStart + 0.381, 0, seg.ZStart);
                        Arc coner2 = Document.GetArc(point3, 0.381, 180 * Math.PI / 180, 270 * Math.PI / 180);
                        coner2.Vy = 0; coner2.Vz = -1;

                        IGraphicObject addconer1 = coner1; IGraphicObject addconer2 = coner2; IGraphicObject addseg = seg;
                        Fgrv.Add(addconer1); Fgrv.Add(addseg); Fgrv.Add(addconer2);

                    }
                    DeleteChainSafe(fc);
                }
                else if (n == 11)
                {
                    
                    Segment seg0 = fc.Item[6] as Segment; //XEnd > XStart
                    Segment seg1 = fc.Item[2] as Segment; // Minor
                    Segment seg2 = fc.Item[10] as Segment; // Major

                    seg0.XStart = seg1.XStart + 0.15 + 0.381;
                    seg0.XEnd = seg2.XStart - 0.15 - 0.381;
                    Fgrv.Add(seg0);

                    for (int i = 1; i <= 6; i++)
                    {
                        IGraphicObject item = fc.Item[i];
                        if (i == 6)
                        {
                            Segment a = item as Segment;
                            a.XEnd = seg1.XStart + 0.7;
                            item = a;
                        }
                        MinDv.Add(item);
                    }
                    for (int i = 6; i <= n; i++)
                    {
                        IGraphicObject item = fc.Item[i];
                        if (i == 6)
                        {
                            Segment a = item as Segment;
                            a.XStart = seg2.XStart - 0.7;
                            item = a;
                        }
                        MajDv.Add(item);
                    }

                    var fseg0 = Fgrv[0] as Segment; 
                    var bottomArc = fc.Item[1] as Arc; // Minor
                    var topArc = fc.Item[11] as Arc; // Major

                    Point point1 = Document.GetPoint(seg0.XStart, 0, seg0.ZStart + 0.381);
                    Point point2 = Document.GetPoint(seg0.XEnd, 0, seg0.ZEnd + 0.381);
                    Arc coner1 = Document.GetArc(point1, 0.381, 180 * Math.PI / 180, 270 * Math.PI / 180); // Minor 안쪽
                    coner1.Vy = 0; coner1.Vz = 1;
                    Arc coner2 = Document.GetArc(point2, 0.381, 270 * Math.PI / 180, 360 * Math.PI / 180); // Major 안쪽
                    coner2.Vy = 0; coner2.Vz = 1;

                    Point point3 = Document.GetPoint(seg1.XStart + 0.15, 0, seg1.ZStart + bottomArc.Radius - 0.381); //Minor
                    Point point4 = Document.GetPoint(seg2.XStart - 0.15, 0, seg2.ZEnd + topArc.Radius - 0.381); //Major

                    Segment fseg1 = Document.GetSegment(point3, coner1.Extremity(0)); // Minor Seg
                    Segment fseg2 = Document.GetSegment(point4, coner2.Extremity(espExtremityType.espExtremityEnd)); // Major Seg

                    Point point5 = Document.GetPoint(fseg1.XStart - 0.381, 0, fseg1.ZStart); // Minor
                    Point point6 = Document.GetPoint(fseg2.XStart + 0.381, 0, fseg2.ZStart); // Major
                    Arc coner3 = Document.GetArc(point5, 0.381, 270 * Math.PI / 180, 360 * Math.PI / 180);
                    coner3.Vy = 0; coner3.Vz = -1;
                    Arc coner4 = Document.GetArc(point6, 0.381, 90 * Math.PI / 180, 180 * Math.PI / 180);
                    coner4.Vy = 0; coner4.Vz = 1;

                    IGraphicObject addconer1 = coner1; IGraphicObject addconer2 = coner2;
                    IGraphicObject addconer3 = coner3; IGraphicObject addconer4 = coner4;
                    IGraphicObject addseg1 = fseg1; IGraphicObject addseg2 = fseg2;
                    Fgrv.Add(addconer1); Fgrv.Add(addconer2);
                    Fgrv.Add(addconer3); Fgrv.Add(addconer4);
                    Fgrv.Add(addseg1); Fgrv.Add(addseg2);

                    DeleteChainSafe(fc);
                }
                else
                    continue;

                Fgrvs.AddRange(Fgrv);
                MajDvs.AddRange(MajDv);
                MinDvs.AddRange(MinDv);

            }
            FaceGrvFC1 = CreateFeature(Fgrvs.ToArray(), zAxis, options, "FinIdFc1");
            MajDvFcs = CreateFeature(MajDvs.ToArray(), zAxis, options, "MajDvFcs");
            MinDvFcs = CreateFeature(MinDvs.ToArray(), zAxis, options, "MinDvFcs");
        }

        private void DeleteChainSafe(TurningFeatureChain chain)
        {
            if (chain == null) return;

            try
            {
                var chains = Document.TurningFeatureChains;
                for (int i = 1; i <= chains.Count; i++)
                {
                    if (ReferenceEquals(chains[i], chain))
                    {
                        chains.Remove(i);
                        return;
                    }
                }
            }
            catch { /* 마지막 폴백 실패 시 무시 */ }
        }

        private void GetGrvFcWidthDepth(TurningFeatureChain chain, bool isFace, out double width, out double depth)
        {
            width = 0;
            depth = 0;
            
            int n = chain.Count;
            Arc coner1 = chain.Item[1] as Arc;
            Arc coner2 = chain.Item[n] as Arc;
            Segment seg = chain.Item[4] as Segment;

            if (isFace)
            {
                double z0 = seg.ZStart;
                double z1 = coner1.Z + coner1.Radius;
                double z2 = coner2.Z + coner2.Radius;
                

                double dp1 = Math.Abs(z1 - z0);
                double dp2 = Math.Abs(z2 - z0);

                width = Math.Round(seg.Length,3);
                depth = (dp1 > dp2) ? Math.Round(dp2, 3) : Math.Round(dp1, 3);
            }
            else if (!isFace)
            {
                double X0 = seg.XStart;
                double X1 = coner1.X;
                double X2 = coner2.X;

                if (X0 - coner1.X < 0)
                {
                    X1 = X1 + coner1.Radius;
                    X2 = X2 + coner2.Radius;
                }
                if (X0 - coner1.X > 0)
                {
                    X1 = X1 - coner1.Radius;
                    X2 = X2 - coner2.Radius;
                }
                
                double dp1 = Math.Abs(X1 - X0);
                double dp2 = Math.Abs(X2 - X0);

                width = Math.Round(seg.Length,3);
                depth = (dp1 > dp2) ? Math.Round(dp2,3) : Math.Round(dp1,3);
            }
            else
            { }
        }

        private void GetDegreeFormDoveTailFC(TurningFeatureChain chain, out double degree)
        {
            degree = 0;
            Segment seg = chain.Item[4] as Segment;

            double dz = Math.Abs(seg.ZEnd-seg.ZStart);
            double dx = Math.Abs(seg.XEnd-seg.XStart);

            double radian = Math.Atan2(dx, dz);
            degree = radian * 180 / Math.PI;
        }

    }
}
