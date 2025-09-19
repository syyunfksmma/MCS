using CAM_API.Setup.UI.ViewModels;
using Microsoft.Win32;
using System;
using System.Diagnostics;
using System.Windows;

namespace CAM_API.Setup.UI.Views
{
    public partial class MachineTemplateEditWindow : Window
    {
        public MachineTemplateEditWindow(Esprit.Application espritApp)
        {
            InitializeComponent();

            var vm = (MachineTemplateEditViewModel)DataContext;
            vm.RequestOpenFileDialog += type =>
            {
                if (!Dispatcher.CheckAccess())
                    Dispatcher.Invoke(() => OpenFileDialogHandler(type, espritApp));
                else
                    OpenFileDialogHandler(type, espritApp);
            };

            vm.RequestClose += () =>
            {
                if (!Dispatcher.CheckAccess())
                    Dispatcher.Invoke(() => this.DialogResult = true);
                else
                    this.DialogResult = true;
            };
        }
        private void OpenFileDialogHandler(string type, Esprit.Application espritApp)
        {
            var dlg = new OpenFileDialog();
            string filter, title, initDir = null;

            if (type.Contains("mprj"))
            {
                filter = "MPRJ 파일 (*.mprj)|*.mprj";
                title = "MPRJ 파일 선택";
                initDir = espritApp.Configuration.GetFileDirectory(EspritConstants.espFileType.espFileTypeMachineSetup);
            }
            else
            {
                filter = "GDML 파일 (*.gdml)|*.gdml";
                title = "GDML 파일 선택";
                initDir = espritApp.Configuration.GetFileDirectory(EspritConstants.espFileType.espFileTypeFixtures);
            }

            dlg.Filter = filter;
            dlg.Title = title;
            if (initDir != null) dlg.InitialDirectory = initDir;
            
            if (dlg.ShowDialog(this) == true)
            {
                var vm = (MachineTemplateEditViewModel)DataContext;
                switch (type)
                {
                    case "mprj": vm.MprjFile = dlg.SafeFileName; break;
                    case "g54Chuck": vm.G54Chuck = dlg.SafeFileName; break;
                    case "g54Jaw": vm.G54Jaw = dlg.SafeFileName; break;
                    case "g54Rot": vm.G54Rot = dlg.SafeFileName; break;
                    case "g55Chuck": vm.G55Chuck = dlg.SafeFileName; break;
                    case "g55Jaw": vm.G55Jaw = dlg.SafeFileName; break;
                    case "g55Rot": vm.G55Rot = dlg.SafeFileName; break;
                }
            }
        }
    }
}