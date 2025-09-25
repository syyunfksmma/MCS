using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using CAM_API.Feature.Model;
using Esprit;
using EspritSolids;

namespace CAM_API.Feature.Services.Generator
{
    public class TurnGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly bool _isodcut;

        public TurnGen(Esprit.Application application, bool isodcut )
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _isodcut = isodcut;
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            var impl = new CreateTurningFeatures(_application);
            impl.CreateTURN(_isodcut);
        }
    }
}
