// Build-time stub used when EnableWpfStubs=true to satisfy partial class definitions without XAML-generated code.
// Do not enable in production WPF builds where .g.cs files exist, otherwise duplicate members will occur.
using System;
using System.Windows;
using System.Windows.Controls;

namespace CAM_API.Feature.UI.Views
{
    public partial class FeatureSelectionView
    {
        private bool _contentLoaded;

        public void InitializeComponent()
        {
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/Feature/UI/Views/FeatureSelectionView.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);
        }
    }

    public partial class TagSelectedFacesView
    {
        private bool _contentLoaded;

        public void InitializeComponent()
        {
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/Feature/UI/Views/TagSelectedFacesView.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);
        }
    }
}

namespace CAM_API.KBM.UI.Views
{
    public partial class DuplicateToolOpsWindow
    {
        private bool _contentLoaded;

        public void InitializeComponent()
        {
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/KBM/UI/Views/DuplicateToolOpsWindow.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);
        }
    }
}

namespace CAM_API.Setup.UI.Views
{
    public partial class ProgramInfoSetupWindow
    {
        private bool _contentLoaded;

        public void InitializeComponent()
        {
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/Setup/UI/Views/ProgramInfoSetupWindow.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);

            if (DataContext == null)
            {
                DataContext = new CAM_API.Setup.UI.ViewModels.ProgramInfoSetupViewModel();
            }
        }
    }

    public partial class SetupWindow
    {
        private bool _contentLoaded;

        public void InitializeComponent()
        {
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/Setup/UI/Views/SetupWindow.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);

            if (DataContext == null)
            {
                DataContext = new CAM_API.Setup.UI.ViewModels.SetupWindowViewModel();
            }
        }
    }

    public partial class MachineTemplateEditWindow
    {
        private bool _contentLoaded;

        public void InitializeComponent()
        {
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/Setup/UI/Views/MachineTemplateEditWindow.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);

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
        private bool _contentLoaded;
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
            if (_contentLoaded)
            {
                return;
            }

            _contentLoaded = true;
            var resourceLocater = new Uri("/CAM_API;component/Volute/VoluteWindow.xaml", UriKind.Relative);
            Application.LoadComponent(this, resourceLocater);

            txtStartRadius = (TextBox)FindName("txtStartRadius");
            txtEndRadius = (TextBox)FindName("txtEndRadius");
            txtStartAngle = (TextBox)FindName("txtStartAngle");
            txtEndAngle = (TextBox)FindName("txtEndAngle");
            txtLeadOutRadius = (TextBox)FindName("txtLeadOutRadius");
            txtVoluteWidth = (TextBox)FindName("txtVoluteWidth");
            txtVoluteDepth = (TextBox)FindName("txtVoluteDepth");
            rbtnCW = (RadioButton)FindName("rbtnCW");
            rbtnCCW = (RadioButton)FindName("rbtnCCW");
            ccw = (Image)FindName("ccw");
            cw = (Image)FindName("cw");
        }
    }
}
