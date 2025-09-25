using Esprit;

namespace CAM_API.Feature.Services.Generator
{
    /// <summary>
    /// 각 Feature Generator가 구현해야 할 인터페이스
    /// </summary>
    public interface IFeatureGenerator
    {
        /// <summary>
        /// CAD Feature 데이터를 기반으로 feature 생성 수행
        /// </summary>
        /// <param name="cadFeatures">전체 CAD Features</param>
        /// <param name="is3Axis">3축 여부</param>
        void Generate(CadFeatures cadFeatures, bool is3Axis);
    }
}
