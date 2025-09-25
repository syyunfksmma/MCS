using CAM_API.Common.DTO;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

namespace CAM_API.KBM.UI.Views
{
    /// <summary>
    /// DuplicateToolOpsWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class DuplicateToolOpsWindow : Window
    {
        public ObservableCollection<OperationToolInfo> Items { get; }

        public DuplicateToolOpsWindow(System.Collections.Generic.IEnumerable<OperationToolInfo> items)
        {
            InitializeComponent();
            Items = new ObservableCollection<OperationToolInfo>(items);
            DataContext = this;
        }

        public System.Collections.Generic.List<OperationToolInfo> SelectedItems =>
            Items.Where(i => i.IsSelected).ToList();

        private void Ok_Click(object sender, RoutedEventArgs e) => DialogResult = true;
        private void Cancel_Click(object sender, RoutedEventArgs e) => DialogResult = false;
    }
}
