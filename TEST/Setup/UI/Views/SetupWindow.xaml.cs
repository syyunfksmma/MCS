using System.Windows;
using Microsoft.Win32;
using CAM_API.Setup.UI.ViewModels;

namespace CAM_API.Setup.UI.Views
{
    public partial class SetupWindow : Window
    {
        public SetupWindow(Esprit.Application espritApp)
        {
            InitializeComponent();

            var vm = (SetupWindowViewModel)DataContext;

            // 파일 다이얼로그 연결 (VM -> View)
            vm.RequestOpenFileDialog = type =>
            {
                var dlg = new OpenFileDialog();
                if (type == "Part")
                {
                    dlg.Title = "Select Part File";
                    dlg.Filter = "SolidWorks Files (*.sldprt;*.sldasm)|*.sldprt;*.sldasm|SolidEdge Files (*.par;*.psm;*.asm)|*.par;*.psm;*.asm|All Files (*.*)|*.*";

                }
                else // Stock
                {
                    dlg.Title = "Select Stock File";
                    dlg.Filter = "Stock Files (*.wp;*.stl)|*.wp;*.stl|All Files (*.*)|*.*";
                }
                if (dlg.ShowDialog() == true)
                {
                    if (type == "Part")
                        vm.SetPartFile(dlg.FileName);
                    else if (type == "Stock")
                        vm.SetStockFile(dlg.FileName);
                }
            };

            // 프로그램 정보 팝업 연결
            vm.RequestShowProgramInfo = () =>
            {
                var win = new ProgramInfoSetupWindow();
                if (win.DataContext is ProgramInfoSetupViewModel programVm)
                {
                    programVm.ProgramInfoUpdated += vm.UpdateProgramName;
                }
                win.ShowDialog();
            };

            // 템플릿 편집 팝업 연결
            vm.RequestEditTemplate = machineKey =>
            {
                var win = new MachineTemplateEditWindow(espritApp);
                if (win.DataContext is MachineTemplateEditViewModel editVm)
                {
                    // Load existing template data into the edit view model
                    if (!string.IsNullOrEmpty(machineKey))
                        editVm.LoadTemplateData(machineKey);
                    win.ShowDialog();
                    vm.LoadMachineTemplates();
                }
            };

            vm.CloseWindow += () => this.Close();
        }
    }
}