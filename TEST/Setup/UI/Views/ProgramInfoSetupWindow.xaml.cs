using System.Windows;
using CAM_API.Setup.UI.ViewModels;

namespace CAM_API.Setup.UI.Views
{
    public partial class ProgramInfoSetupWindow : Window
    {
        public ProgramInfoSetupWindow()
        {
            InitializeComponent();

            if (DataContext is ProgramInfoSetupViewModel vm)
            {
                vm.CloseWindowAction = () => this.Close();

                // 부모 창에서 이벤트 구독 필요시 아래처럼 (예시)
                // vm.ProgramInfoUpdated += (name) => { ... };
            }
        }
    }
}
