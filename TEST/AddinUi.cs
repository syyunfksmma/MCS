using CAM_API.Feature;
using CAM_API.Feature.UI.Views;
using CAM_API.Images;
using CAM_API.Setup;
using CAM_API.Common;
using CAM_API.Common.Dtos;
using CAM_API.Services;
using CAM_API.UI.Forms;
using CAM_API.Setup.UI.Views;
using CAM_API.Volute_Create;
using ESPRIT.NetApi.Ribbon;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace CAM_API
{
    internal sealed class AddinUi : IDisposable
    {
        private List<IRibbonItem> _ribbonItems;
        private Esprit.Application _espritApplication;
        private ESPRIT.NetApi.Ribbon.IRibbon _ribbon;
        private ImageManager _imageManager;
        private string _tabId;
        private test _test;
        private VoluteWindow _voluteWindow;
        private SetupWindow _SetupWindow;
        private FeatureSelectionView _featureWindow;
        private TagSelectedFacesView _tagSelectedFacesView;\r\n        private readonly AddinSettings _addinSettings;\r\n        private readonly McmsApiClient _mcmsApiClient;

        internal AddinUi(Esprit.Application espApp)
        {
            _tabId = Guid.NewGuid().ToString();

            _imageManager = new ImageManager();
            _test = new test(espApp);
            
           
            //
            _espritApplication = espApp;
            _SetupWindow = new SetupWindow(espApp);
            _voluteWindow = new VoluteWindow();
            _featureWindow = new FeatureSelectionView(espApp);
            _tagSelectedFacesView = new TagSelectedFacesView(espApp);

            _ribbon = _espritApplication.Ribbon as ESPRIT.NetApi.Ribbon.IRibbon;

            _ribbon.OnButtonClick += RibbonOnButtonClick;
            _ribbon.OnCheckBoxCheckChanged += OnCheckBoxCheckChanged;

            CreateUI();

            _espritApplication.AfterDocumentClose += OnAfterDocumentClose;
            _espritApplication.AfterDocumentOpen += OnAfterDocumentOpen;
            _espritApplication.AfterTemplateOpen += OnAfterDocumentOpen;
            _espritApplication.AfterNewDocumentOpen += OnAfterNewDocumentOpen;

            SetUiStatus(true, false);
        }

        private void SetUiStatus(bool visible, bool enabled)
        {
            foreach (IRibbonItem ribbonItem in _ribbonItems)
            {
                ribbonItem.Enabled = enabled;
                ribbonItem.Visible = visible;
            }
        }

        void OnAfterNewDocumentOpen()
        {
            SetUiStatus(true, true);
        }

        void OnAfterDocumentOpen(string FileName)
        {
            SetUiStatus(true, true);
        }

        void OnAfterDocumentClose()
        {
            SetUiStatus(true, false);
        }

        internal void CreateUI()
        {
            _ribbonItems = new List<IRibbonItem>();

            IRibbonTab tab;
            tab = _ribbon.Tabs.Add(_tabId, @"CAM API");

            IRibbonGroup group1;
            group1 = tab.Groups.Add(Guid.NewGuid().ToString(), @"Group 1");

            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn1", @"Setup", true, _imageManager.GetIcon("setup")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn2", @"Scan Feature", true, _imageManager.GetIcon("scan")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn3", @"volute Feature", true, _imageManager.GetIcon("Square")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn4", @"KBM", true, _imageManager.GetIcon("kbm")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn5", @"WORKPLAN", false, _imageManager.GetIcon("partsetup")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn6", @"API Settings", true, _imageManager.GetIcon("Square")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn7", @"Next Job", true, _imageManager.GetIcon("Square")));

            IRibbonGroup group2;
            group2 = tab.Groups.Add(Guid.NewGuid().ToString(), @"Group 2");

            _ribbonItems.Add(group2.Items.AddCheckBox(@"TEST_CheckBox1", @"Check Box 1", false));
            _ribbonItems.Add(group2.Items.AddCheckBox(@"TEST_CheckBox2", @"Check Box 2", false));
            _ribbonItems.Add(group2.Items.AddCheckBox(@"TEST_CheckBox3", @"Check Box 3", false));
        }

        void OnCheckBoxCheckChanged(object sender, CheckBoxCheckChangedEventArgs e)
        {
            switch (e.Key)
            {
                case (@"TEST_CheckBox1"):
                    {
                        MessageBox.Show(string.Format("Check Box changed, key = {0}, value = {1}", e.Key, e.Checked.ToString()));
                        break;
                    }
                case (@"TEST_CheckBox2"):
                    {
                        MessageBox.Show(string.Format("Check Box changed, key = {0}, value = {1}", e.Key, e.Checked.ToString()));
                        break;
                    }
                case (@"TEST_CheckBox3"):
                    {
                        MessageBox.Show(string.Format("Check Box changed, key = {0}, value = {1}", e.Key, e.Checked.ToString()));
                        break;
                    }
            }
        }

        void RibbonOnButtonClick(object sender, ButtonClickEventArgs e)
        {
            switch (e.Key)
            {
                case (@"TEST_Btn1"):
                    {
                        if (_SetupWindow == null || !_SetupWindow.IsLoaded)
                        {
                            Esprit.Application _app = Main._espritApplication;
                            _SetupWindow = new SetupWindow(_app);
                            var wpfHelper = new System.Windows.Interop.WindowInteropHelper(_SetupWindow);
                            wpfHelper.Owner = System.Diagnostics.Process.GetCurrentProcess().MainWindowHandle;
                            _SetupWindow.Show();
                        }
                        else
                        {
                            if (_SetupWindow.WindowState == System.Windows.WindowState.Minimized)
                            { _SetupWindow.WindowState = System.Windows.WindowState.Normal; }
                            _SetupWindow.Activate();
                        }
                        break;
                    }
                case (@"TEST_Btn2"):
                    {
                        if (_featureWindow == null || !_featureWindow.IsLoaded)
                        {
                            Esprit.Application _app = Main._espritApplication;
                            _featureWindow = new FeatureSelectionView(_app);
                            var wpfHelper = new System.Windows.Interop.WindowInteropHelper(_featureWindow);
                            wpfHelper.Owner = System.Diagnostics.Process.GetCurrentProcess().MainWindowHandle;
                            _featureWindow.Show();
                        }
                        else
                        {
                            if (_featureWindow.WindowState == System.Windows.WindowState.Minimized)
                            { _featureWindow.WindowState = System.Windows.WindowState.Normal; }
                            _featureWindow.Activate();
                        }
                        break;
                    }
                case (@"TEST_Btn3"):
                    {   
                        if (_voluteWindow == null || !_voluteWindow.IsLoaded)
                        {
                            _voluteWindow = new VoluteWindow();
                            var wpfHelper = new System.Windows.Interop.WindowInteropHelper(_voluteWindow);
                            wpfHelper.Owner = System.Diagnostics.Process.GetCurrentProcess().MainWindowHandle;

                            _voluteWindow.Show();
                        }
                        else 
                        {
                            if (_voluteWindow.WindowState == System.Windows.WindowState.Minimized)
                            { _voluteWindow.WindowState = System.Windows.WindowState.Normal; }
                            _voluteWindow.Activate();
                        }
                        break;
                    }
                case (@"TEST_Btn4"):
                    {
                        Esprit.Application _app = Main._espritApplication;
                        KBMProcessManager manager = new KBMProcessManager(_app);
                        manager.ProcessAllFeatures();
                        break;
                    }
                case (@"TEST_Btn5"):
                    {
                        Esprit.Application _app = Main._espritApplication;
                        workplan setup = new workplan(_app);
                        setup.ConvertLocalToGlobal();
                        break;
                    }
                case (@"TEST_Btn6"):
                    {
                        ShowApiSettingsDialog();
                        break;
                    }
                case (@"TEST_Btn7"):
                    {
                        HandleNextJob();
                        break;
                    }
            }
        }

        private void ShowApiSettingsDialog()
        {
            using (var form = new ApiSettingsForm(_addinSettings, _mcmsApiClient))
            {
                form.ShowDialog();
            }
        }

        private void HandleNextJob()
        {
            try
            {
                var job = _mcmsApiClient.GetNextJobAsync().GetAwaiter().GetResult();
                if (job == null)
                {
                    MessageBox.Show("대기 중인 작업이 없습니다.", "MCMS", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }

                var parameters = job.Parameters != null && job.Parameters.Any()
                    ? string.Join("\n", job.Parameters.Select(p => $"- {p.Key}: {p.Value}"))
                    : "(파라미터 없음)";

                var message = $"Job ID: {job.JobId}\nRouting ID: {job.RoutingId}\n상태: {job.Status}\n파라미터:\n{parameters}\n\n작업을 완료로 표시하시겠습니까?";
                var result = MessageBox.Show(message, "MCMS Job", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Question);

                if (result == DialogResult.Yes)
                {
                    var request = new AddinJobCompleteRequest { ResultStatus = "completed", Message = "Completed via ESPRIT Add-in" };
                    _mcmsApiClient.CompleteJobAsync(job.JobId, request).GetAwaiter().GetResult();
                    MessageBox.Show("작업을 완료 처리했습니다.", "MCMS", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else if (result == DialogResult.No)
                {
                    var request = new AddinJobCompleteRequest { ResultStatus = "failed", Message = "작업이 실패 처리되었습니다." };
                    _mcmsApiClient.CompleteJobAsync(job.JobId, request).GetAwaiter().GetResult();
                    MessageBox.Show("작업을 실패로 처리했습니다.", "MCMS", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "MCMS API 오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        public void Dispose()
        {
            _mcmsApiClient?.Dispose();

            if (_imageManager != null)
            {
                _imageManager.Dispose();
                _imageManager = null;
            }

            if (_ribbonItems != null)
            {
                _ribbonItems.Clear();
                _ribbonItems = null;
            }

            if (_ribbon != null)
            {
                _ribbon.Tabs.Remove(_tabId);
                _ribbon.OnButtonClick -= RibbonOnButtonClick;
                _ribbon = null;
            }

            if (_espritApplication != null)
            {
                _espritApplication.AfterDocumentClose -= OnAfterDocumentClose;
                _espritApplication.AfterDocumentOpen -= OnAfterDocumentOpen;
                _espritApplication.AfterTemplateOpen -= OnAfterDocumentOpen;
                _espritApplication.AfterNewDocumentOpen -= OnAfterNewDocumentOpen;
                _espritApplication = null;
            }
        }
    }
}



