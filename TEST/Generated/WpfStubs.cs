using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace CAM_API.Feature.UI.Views
{
    public partial class FeatureSelectionView
    {
        public void InitializeComponent()
        {
            // Stub to satisfy build.
        }
    }

    public partial class TagSelectedFacesView
    {
        public void InitializeComponent()
        {
            // Stub to satisfy build.
        }
    }
}

namespace CAM_API.KBM.UI.Views
{
    public partial class DuplicateToolOpsWindow
    {
        public void InitializeComponent()
        {
            // Stub to satisfy build.
        }
    }
}

namespace CAM_API.Setup.UI.Views
{
    public partial class ProgramInfoSetupWindow
    {
        public void InitializeComponent()
        {
            if (DataContext == null)
            {
                DataContext = new CAM_API.Setup.UI.ViewModels.ProgramInfoSetupViewModel();
            }
        }
    }

    public partial class SetupWindow
    {
        public void InitializeComponent()
        {
            if (DataContext == null)
            {
                DataContext = new CAM_API.Setup.UI.ViewModels.SetupWindowViewModel();
            }
        }
    }

    public partial class MachineTemplateEditWindow
    {
        public void InitializeComponent()
        {
            if (DataContext == null)
            {
                DataContext = new CAM_API.Setup.UI.ViewModels.MachineTemplateEditViewModel();
            }
        }
    }
}

namespace CAM_API.Volute_Create
{
    public partial class VoluteWindow
    {
        private TextBox txtStartRadius;
        private TextBox txtEndRadius;
        private TextBox txtStartAngle;
        private TextBox txtEndAngle;
        private TextBox txtLeadOutRadius;
        private TextBox txtVoluteWidth;
        private TextBox txtVoluteDepth;
        private RadioButton rbtnCW;
        private RadioButton rbtnCCW;
        private Image ccw;
        private Image cw;

        public void InitializeComponent()
        {
            txtStartRadius = new TextBox();
            txtEndRadius = new TextBox();
            txtStartAngle = new TextBox();
            txtEndAngle = new TextBox();
            txtLeadOutRadius = new TextBox();
            txtVoluteWidth = new TextBox();
            txtVoluteDepth = new TextBox();
            rbtnCW = new RadioButton();
            rbtnCCW = new RadioButton();
            ccw = new Image();
            cw = new Image();

            rbtnCCW.IsChecked = true;
            rbtnCW.IsChecked = false;

            rbtnCCW.Checked += OnRadioButtonCheckedChanged;
            rbtnCW.Checked += OnRadioButtonCheckedChanged;
        }
    }
}
