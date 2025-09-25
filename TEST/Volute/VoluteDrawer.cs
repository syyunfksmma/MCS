using System;
using Esprit;

namespace CAM_API.Volute_Create
{
    public class VoluteDrawer
    {
        private readonly Esprit.Application _app;
        private readonly Esprit.Document Document;

        public VoluteDrawer(Esprit.Application app)
        {
            _app = app ?? throw new ArgumentNullException(nameof(app));
            Document = _app.Document;  // ✅ _app.Document 값으로 초기화
        }

        public FeatureChain DrawVolute(double startRadius, double endRadius, double startAngle, double endAngle, double leadOutRadius, double VoluteWidth, double VoluteDepth, bool clockwise)
        {
            try
            {
                if(clockwise)
                {
                    startAngle = 360 - startAngle;
                }

                double sz = VoluteWidth - VoluteDepth;

                // 각도 계산에 사용할 상수
                const double PI = Math.PI;
                double angleStep = 0.5; // 각도 간격
                int numPoints = (int)(endAngle / angleStep);

                // 문서 객체 가져오기
                var document = Document;

                // 점 배열 선언
                var points = new Point[numPoints + 1];
                Point arcCenter = null;

                // 점 생성 (원의 방정식 활용)
                for (int i = 0; i <= numPoints; i++)
                {
                    double angle = clockwise ? startAngle - i * angleStep : startAngle + i * angleStep;
                    angle = angle * PI / 180; // 라디안 변환

                    double radius = startRadius + (i / (double)numPoints) * (endRadius - startRadius);

                    points[i] = document.GetPoint(radius * Math.Cos(angle), radius * Math.Sin(angle), sz);

                    if (i == numPoints)
                    {
                        arcCenter = document.GetPoint((radius - leadOutRadius) * Math.Cos(angle), (radius - leadOutRadius) * Math.Sin(angle), sz);
                    }
                }

                // 선 추가
                for (int i = 0; i < numPoints; i++)
                {
                    document.Segments.Add(points[i], points[i + 1]);
                }

                // 호 추가
                double angle1 = Math.Atan2(points[0].Y - arcCenter.Y, points[0].X - arcCenter.X);
                double angle2 = Math.Atan2(points[numPoints].Y - arcCenter.Y, points[numPoints].X - arcCenter.X);
                //if(endAngle > 180)
                //{
                //     angle1 = Math.Atan2(points[0].Y - arcCenter.Y, points[0].X - arcCenter.X);
                //     angle2 = Math.Atan2(points[numPoints].Y - arcCenter.Y, points[numPoints].X - arcCenter.X);
                //  }
                //  else
                //  {
                //angle2 = Math.Atan2()
                // }


                document.Arcs.Add(arcCenter, leadOutRadius, angle1, angle2);

                // FeatureChain 생성
                var featureChain = document.FeatureChains.Add(points[0]);

                for (int i = 0; i < numPoints; i++)
                {
                    featureChain.Add(document.GetSegment(points[i], points[i + 1]));
                }
                featureChain.Add(document.GetArc(arcCenter, leadOutRadius, angle1, angle2));

                // FeatureChain 속성 설정
                if (clockwise)
                {
                    featureChain.Name = "CW Volute";
                }
                else
                {
                    featureChain.Name = "CCW Volute";
                }
                featureChain.Depth = VoluteWidth;
                featureChain.Through = false;
              
                // 화면 갱신
                document.Refresh();

                Console.WriteLine("Volute drawing completed successfully!");
                return featureChain;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return null;
            }
        }
    }
}
