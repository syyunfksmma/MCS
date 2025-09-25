using System;
using System.Windows;
using System.IO;
using System.Windows.Media;
using MessageBox = System.Windows.MessageBox;  // WPF MessageBox 사용


namespace CAM_API.Volute_Create
{
    public partial class VoluteWindow : System.Windows.Window
    {
        private Esprit.Application _app;
        private VoluteDrawer _drawer;

        public VoluteWindow()
        {
            InitializeComponent();
            _app = Main._espritApplication;
            _drawer = new VoluteDrawer(_app);

        }
        

        private void OnDrawClick(object sender, RoutedEventArgs e)
        {
            try
            {
                // 입력값 변환
                if (!double.TryParse(txtStartRadius.Text, out double startRadius) ||
                    !double.TryParse(txtEndRadius.Text, out double endRadius) ||
                    !double.TryParse(txtStartAngle.Text, out double startAngle) ||
                    !double.TryParse(txtEndAngle.Text, out double endAngle) ||
                    !double.TryParse(txtLeadOutRadius.Text, out double leadOutRadius) ||
                    !double.TryParse(txtVoluteWidth.Text, out double VoluteWidth) ||
                    !double.TryParse(txtVoluteDepth.Text, out double VoluteDepth))
                {
                    MessageBox.Show("Please enter valid numeric values.", "Input Error");
                    return;
                }

                // CW 또는 CCW 여부 설정
                bool isClockwise = rbtnCW.IsChecked == true;
                _drawer.DrawVolute(startRadius, endRadius, startAngle, endAngle, leadOutRadius, VoluteWidth, VoluteDepth, isClockwise);
                MessageBox.Show("Volute feature creation completed.");

            }
            catch (Exception ex)
            {
                MessageBox.Show($"An unexpected error occurred: {ex.Message}", "Error");
            }
        }

        private void btnCancle_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void OnRadioButtonCheckedChanged(object sender, RoutedEventArgs e)
        {

            bool isCW = rbtnCCW?.IsChecked ?? false;  // null이면 false로 처리
                
            if (ccw != null)
                ccw.Visibility = isCW? Visibility.Visible : Visibility.Collapsed;
            if (cw != null)
                cw.Visibility = !isCW ? Visibility.Visible : Visibility.Collapsed;

        }

        private ImageSource ConvertToImage(byte[] imageBytes)
        {
            using (var ms = new MemoryStream(imageBytes))
            {
                return System.Windows.Media.Imaging.BitmapFrame.Create(ms);
            }
        }
    }
}
