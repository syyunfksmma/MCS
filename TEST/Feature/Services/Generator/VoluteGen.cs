using CAM_API.Feature.Model;
using Esprit;
using EspritSolids;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Windows;

namespace CAM_API.Feature.Services.Generator
{
    public class VoluteGen : IFeatureGenerator
    {
        private readonly Esprit.Application _application;
        private readonly CadFeaturesManager _cadFeaturesManager;
        private readonly FeatureManager _FeatureManager;

        public VoluteGen(Esprit.Application application)
        {
            _application = application ?? throw new ArgumentNullException(nameof(application));
            _cadFeaturesManager = new CadFeaturesManager(_application);
            _FeatureManager = new FeatureManager(_application);
        }

        public void Generate(CadFeatures allCadFeatures, bool is3Axis)
        {
            try
            {
                var volute = new List<CustomPropCondition>
                {
                    new CustomPropCondition("Description", new List<string>{"Volute"}),
                };

                List<SolidFace> solidFaces = CadFeaturesManager.FindMatchingFaces(allCadFeatures, volute).ToList();
                //List<SolidFace> facesToRemove = new List<SolidFace>();
                //foreach (SolidFace face in pocketface)
                //{

                //    string A = face.get_Name().ToString();
                //    int loopCount = face.SolidLoops.Count; // face.SolidLoops의 갯수 구하기

                //    if (loopCount == 1) // 갯수가 1일 때 해당 face 삭제 예정
                //    {
                //        facesToRemove.Add(face);  // 삭제할 faces를 별도의 리스트에 추가
                //    }
                //}
                //pocketface.RemoveAll(face => facesToRemove.Contains(face));
                if (solidFaces.Count == 0) 
                    return;

                Array result = _application.Document.FeatureRecognition.CreatePocketFeatures2(solidFaces.ToArray(), _application.Document.ActivePlane, out var comFaults);
                ComFaultHandler.Handle(comFaults, "Volute Recognition", _application);

                foreach (FeatureChain feature in result)
                {
                    dynamic props = feature.CustomProperties;
                    var prop = FeatureManager.GetOrAddCustomProperty(props, "Volute", EspritConstants.espPropertyType.espPropertyTypeBoolean);
                    prop.Value = true;
                    prop.readOnly = true;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"[Volute FeatureGenerator] 오류 발생: {ex.Message}", "Error");
            }
        }
    }
}
