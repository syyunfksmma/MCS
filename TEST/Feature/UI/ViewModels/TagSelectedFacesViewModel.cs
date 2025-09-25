using CAM_API.Common.Commands;
using CAM_API.Common.ViewModels;
using CAM_API.Feature.Model;
using CAM_API.Feature.Services;
using Esprit;
using System;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;

namespace CAM_API.Feature.UI.ViewModels
{
    public class TagSelectedFacesViewModel : BaseViewModel
    {
        private readonly Esprit.Application _app;
        private readonly CadFeaturesManager _cadFeaturesManager;

        public TagSelectedFacesViewModel(Esprit.Application app)
        {
            _app = app ?? throw new ArgumentNullException(nameof(app));
            _cadFeaturesManager = new CadFeaturesManager(_app);

            DescriptionOptions = new ObservableCollection<DescriptionOption>(
                (DescriptionOption[])System.Enum.GetValues(typeof(DescriptionOption))
            );

            ApplyCommand = new RelayCommand(Apply, CanApply);
            CancelCommand = new RelayCommand(() => CloseWindow?.Invoke());
        }

        private DescriptionOption _selectedDescription;
        public DescriptionOption SelectedDescription
        {
            get => _selectedDescription;
            set => SetProperty(ref _selectedDescription, value);
        }

        public ObservableCollection<DescriptionOption> DescriptionOptions { get; }

        public ICommand ApplyCommand { get; }
        public ICommand CancelCommand { get; }
        public event Action CloseWindow;

        private bool CanApply() => true;

        private void Apply()
        {
            var result = _cadFeaturesManager.TagSelectedFaces(SelectedDescription.ToString());

            if (result.HasSuccess && !result.HasError)
            {
                MessageBox.Show("모든 Face 변경 성공", "Tag Selected Faces", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            else if (result.HasSuccess && result.HasError)
            {
                MessageBox.Show("일부 오류 발생", "Tag Selected Faces", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            else
            {
                MessageBox.Show("변경 실패", "Tag Selected Faces", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }


    }
}