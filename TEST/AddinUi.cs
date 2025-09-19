using CAM_API.Feature;
using CAM_API.Feature.UI.Views;
using CAM_API.Images;
using CAM_API.Setup;
using CAM_API.Setup.UI.Views;
using CAM_API.Volute_Create;
using ESPRIT.NetApi.Ribbon;
using System;
using System.Collections.Generic;
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
        private TagSelectedFacesView _tagSelectedFacesView;

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
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn6", @"test1", false, _imageManager.GetIcon("Square")));
            _ribbonItems.Add(group1.Items.AddButton(@"TEST_Btn7", @"test2", true, _imageManager.GetIcon("Square")));

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
                        if (_featureWindow == null || !_featureWindow.IsLoaded)
                        {
                            Esprit.Application _app = Main._espritApplication;
                            _tagSelectedFacesView = new TagSelectedFacesView(_app);
                            var wpfHelper = new System.Windows.Interop.WindowInteropHelper(_tagSelectedFacesView);
                            wpfHelper.Owner = System.Diagnostics.Process.GetCurrentProcess().MainWindowHandle;
                            _tagSelectedFacesView.Show();
                        }
                        else
                        {
                            if (_tagSelectedFacesView.WindowState == System.Windows.WindowState.Minimized)
                            { _tagSelectedFacesView.WindowState = System.Windows.WindowState.Normal; }
                            _tagSelectedFacesView.Activate();
                        }
                        break;
                    }
                case (@"TEST_Btn7"):
                    {
                        Esprit.Application _app = Main._espritApplication;
                        //workplan setup = new workplan(_app);
                        //setup.ConvertLocalToGlobal();

                        //This button is for simple function testing.


                        //ScanF scanFeature = new ScanF(_app);

                        //FaceColorChanger setup1 = new FaceColorChanger(_app);
                        //setup1.ChangeSelectedFaceColor();
                        //setup1.RecognizeHoles();

                        //CreateHoleFeature setup2 = new CreateHoleFeature(_app);
                        //setup2.smash();

                        //CreateTurningFeatures setup3 = new CreateTurningFeatures(_app);
                        //setup3.CreateTURN();

                        //workplan setup4 = new workplan(_app);
                        //setup4.defineangle();

                        test test = new test(_app);
                        test.Run1();


                        break;
                    }
            }
        }

        public void Dispose()
        {
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
