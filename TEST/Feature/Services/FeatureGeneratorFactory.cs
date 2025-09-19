using System;
using Esprit;
using CAM_API.Feature.Services.Generator;
using System.Collections.Generic;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// Feature 이름(string)을 기반으로 적절한 FeatureGenerator를 반환하는 Factory 클래스
    /// </summary>
    public static class FeatureGeneratorFactory
    {
        // <summary>
        /// Feature 이름(string)을 기반으로 적절한 FeatureGenerator 목록을 반환하는 Factory 클래스
        /// </summary>
        public static List<IFeatureGenerator> Create(string featureName, Application app, bool isodcut )
        {
            if(string.IsNullOrWhiteSpace(featureName))
                throw new ArgumentNullException(nameof(featureName));

            featureName = featureName.ToLower();
            var generators = new List<IFeatureGenerator>();

            switch (featureName)
            {
                case "hole":
                    generators.Add(new HoleGen(app));
                    // generators.Add(new AnotherHoleFeatureGenerator(app)); // 추가 가능
                    break;
                case "tap":
                    generators.Add(new TapGen(app));
                    // generators.Add(new AnotherHoleFeatureGenerator(app)); // 추가 가능
                    break;
                case "pipeport":
                    generators.Add(new PipeTapSlotGen(app));
                    generators.Add(new PipeTapGen(app));
                    generators.Add(new AngleHoleGen(app));
                    // generators.Add(new AnotherHoleFeatureGenerator(app)); // 추가 가능
                    break;
                case "slot":
                    new List<IFeatureGenerator>();
                    break;
                case "scallop":
                    generators.Add(new ScallopGen(app));
                    break;

                case "turning":
                    generators.Add(new TurnGen(app, isodcut));
                    break;

                default:
                    return new List<IFeatureGenerator>();
            }

            return generators;
        }
    }
}
