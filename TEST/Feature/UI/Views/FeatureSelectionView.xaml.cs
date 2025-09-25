using CAM_API.Feature.UI.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CAM_API.Feature.UI.Views
{
    /// <summary>
    /// FeatureSelectionView.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class FeatureSelectionView : Window
    {
        public FeatureSelectionView(Esprit.Application espritApp)
        {
            InitializeComponent();
            var vm = new FeatureSelectionViewModel(espritApp);
            vm.CloseWindow += () => this.Close();
            this.DataContext = vm;
        }
    }
}
