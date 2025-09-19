//using ESPRIT.KBMAccess;
//using EspritComBase;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Windows;
//using System.Windows.Controls;

//namespace CAM_API.Feature
//{
//    /// <summary>
//    /// FeatureWindow.xaml에 대한 상호 작용 논리
//    /// </summary>
//    public partial class FeatureWindow : System.Windows.Window
//    {
//        private Esprit.Application _app;
//        private Esprit.Document _doc;
//        private CadFeaturesManager _cadFeaturesManager;
//        private CreateHoleFeatures _CreateHoleFeature;
//        private CreateTurningFeatures _CreateTurningFeatures;
//        private CreatePocketFeatures _CreatePocketFeatures;

//        public FeatureWindow()
//        {
//            InitializeComponent();
//            _app = Main._espritApplication;
//            _doc = _app.Document;
//            _CreateHoleFeature = new CreateHoleFeatures(_app);
//            _CreateTurningFeatures = new CreateTurningFeatures(_app);
//            _CreatePocketFeatures = new CreatePocketFeatures(_app) ;
//            _cadFeaturesManager = new CadFeaturesManager(_app);
//        }

//        private void btnApply_Click(object sender, RoutedEventArgs e)
//        {
//            bool is3aixs = rdois3aixs?.IsChecked ?? true;

//            // 1. 솔리드 존재 여부 확인
//            if (_doc.Solids.Count == 0)
//            {
//                System.Windows.Forms.MessageBox.Show("솔리드가 존재하지 않습니다.", "Error",
//                    System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);
//                return;
//            }

//            var allCadFeatures = _cadFeaturesManager.GetallCadFeatures();

//            // 2. 체크박스와 액션을 매핑
//            var checkboxActions = new Dictionary<CheckBox, (string name, Action action)>
//            {
//                [Turning] = ("Turning Features", () =>
//                    { _CreateTurningFeatures.CreateTURN(); }),
//                [Hole] = ("Hole Features", () => 
//                    { _CreateHoleFeature.HolesFeature(allCadFeatures,is3aixs); }),
//                [tap] = ("Thread Features", () => 
//                    { _CreateHoleFeature.ThreadFeature(allCadFeatures,is3aixs); }),
//                [PipeTap] = ("All PipeTap Features", () =>
//                    { _CreatePocketFeatures.PipePortSlot(allCadFeatures); _CreateHoleFeature.PipeTapFeature(allCadFeatures,is3aixs); }),
//                [Slot] = ("SLOT Features", () => 
//                    { _CreatePocketFeatures.PipePortSlot1(allCadFeatures); }),
//                //[Scallop] = ("Scallop Features", () => { _CreatePocketFeatures.ScallopFeature(); }),
//                [Volute] = ("Volute Features", () => { _CreatePocketFeatures.VoluteFeature(allCadFeatures); }),
//                //[FlyCut] = ("FlyCut Features", () => { _CreatePocketFeatures.FlyCutFeature(); }),
//                // ✅ 새 체크박스 추가 시 여기에만 추가하면 됨
//                //[NewCheckBox] = ("New Feature", () =>
//                //{ _SomeClass.SomeMethod(); _SomeClass.SomeMethod(); _SomeClass.SomeMethod()}),
//            };

//            // 3. 선택된 체크박스 확인
//            var selectedActions = checkboxActions.Where(x => x.Key.IsChecked == true).ToList();

//            if (selectedActions.Count == 0)
//            {
//                System.Windows.Forms.MessageBox.Show("실행할 작업을 선택해주세요.", "Selection Required",
//                    System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
//                return;
//            }

//            // 4. 선택된 작업들 실행
//            try
//            {
//                foreach (var item in selectedActions)
//                {
//                    item.Value.action(); // 액션 실행
//                }

//                _cadFeaturesManager.RemoveBottomPlanFeature();

//                //var completedTasks = string.Join(", ", selectedActions.Select(x => x.Value.name));
//                //System.Windows.Forms.MessageBox.Show($"완료된 작업: {completedTasks}", "Success",
//                //    System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
//            }
//            catch (Exception ex)
//            {
//                System.Windows.Forms.MessageBox.Show($"작업 중 오류가 발생했습니다:\n{ex.Message}", "Error",
//                    System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
//            }
//        }

//        private void btnCancel_Click(object sender, RoutedEventArgs e)
//        {
//            this.Close();
//        }
//    }
//}
