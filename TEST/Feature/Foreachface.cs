using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Esprit;
using EspritSolids;

namespace CAM_API.Feature
{
    // function test
    /// <summary>
    /// Method to Find SolidFaces by the color of a SolidFace.
    ///
    /// </summary>

    internal class Foreachface
    {
        private readonly Esprit.Application _application;
        private readonly Esprit.Document Document;

        //

        public Foreachface(Esprit.Application application)
        {
            _application = application;
            Document = _application.Document;
        }

        public Tuple<List<SolidFace>, List<SolidFace>> FindHoleface()
        {
            var solid = Document.Solids[1];
            var body = solid.SolidBody as EspritSolids.SolidBody;
            uint tapColor = 0x94BF2F;  // 원하는 색상의 BGR 값을 통해 필터링

            List<EspritSolids.SolidFace> Hole = new List<EspritSolids.SolidFace>(); 
            List<EspritSolids.SolidFace> TapHole = new List<EspritSolids.SolidFace>();

            foreach (EspritSolids.SolidFace face in body.SolidFaces)
            {
                var solidsurface = face.SolidSurface as EspritSolids.SolidSurface;
                EspritSolids.SolidSurfaceType surfaceType = solidsurface.SurfaceType;

                if (surfaceType == EspritSolids.SolidSurfaceType.geoSurfaceCylinder)
                {
                    uint faceColor = Convert.ToUInt32(face.get_Color());
                    if (faceColor == tapColor)  // 🎯 Face 색상 비교
                    {
                        TapHole.Add(face);
                    }
                    else
                    {
                        Hole.Add(face);
                    }
                }
                else
                {
                    continue;
                }
            }

            return Tuple.Create(TapHole, Hole);
        }
        //    public List<SolidFaces> HOLEHOLE()
        //    {
        //        var solid1 = Document.Solids[1];
        //        var body1 = solid1.SolidBody as EspritSolids.SolidBody; // SolidBody 접근

        //        List<EspritSolids.SolidFaces> Hole1 = new List<EspritSolids.SolidFaces>();

        //        EspritSolidsHoles.HolesRecognitionClass holeRecognition = new EspritSolidsHoles.HolesRecognitionClass();
        //        try
        //        {
        //            EspritSolids.SolidFaces holeFaces = holeRecognition.HoleFaces(body1);  // 구멍에 관련된 면들 반환
        //            Hole1.Add(holeFaces);
        //        }
        //        catch (ArgumentException ex)
        //        {
        //            // Body가 null인 경우 ArgumentException 처리
        //            MessageBox.Show($"ArgumentException 발생: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        //        }
        //        catch (COMException ex)
        //        {
        //            // COM 호출 중 실패한 경우 처리
        //            MessageBox.Show($"ComException 발생: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        //        }
        //        catch (Exception ex)
        //        {
        //            // 기타 예외 처리
        //            MessageBox.Show($"예외 발생: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        //        }
        //        return Hole1;
        //    }

    }
}
