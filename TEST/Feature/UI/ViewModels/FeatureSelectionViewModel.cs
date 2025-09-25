using CAM_API.Common.Commands;
using CAM_API.Common.ViewModels;
using CAM_API.Feature.Model;
using CAM_API.Feature.Services;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using Esprit;

namespace CAM_API.Feature.UI.ViewModels
{
    /// <summary>
    /// 설비 선택 창의 ViewModel
    /// - 사용자 선택에 따라 Feature 생성 로직 수행
    /// </summary>
    public class FeatureSelectionViewModel : BaseViewModel
    {
        // ========== Public Properties ==========

        public ObservableCollection<FacilityType> FacilityOptions { get; }

        private FacilityType _selectedFacility;
        public FacilityType SelectedFacility
        {
            get => _selectedFacility;
            set => SetProperty(ref _selectedFacility, value);
        }

        private bool _isOdCut;
        public bool IsOdCut
        {
            get => _isOdCut;
            set
            {
                if (_isOdCut != value)
                {
                    _isOdCut = value;
                    OnPropertyChanged(nameof(IsOdCut));
                }
            }
        }


        public ICommand ApplyCommand { get; }
        public ICommand CancelCommand { get; }
        public event Action CloseWindow;

        // ========== Private Fields ==========

        private readonly Esprit.Application _app;
        private readonly FeatureGenerationService _featureService;

        // ========== Constructor ==========

        public FeatureSelectionViewModel(Esprit.Application app)
        {
            _app = app ?? throw new ArgumentNullException(nameof(app));
            _featureService = new FeatureGenerationService(_app);

            // FacilityType enum 값 전체를 옵션에 바인딩
            FacilityOptions = new ObservableCollection<FacilityType>(
                Enum.GetValues(typeof(FacilityType)).Cast<FacilityType>()
            );

            SelectedFacility = FacilityOptions.FirstOrDefault();

            ApplyCommand = new RelayCommand(OnApply, CanApply);
            CancelCommand = new RelayCommand(() => CloseWindow?.Invoke());
        }

        // ========== Private Methods ==========

        private void OnApply()
        {
            try
            {
                bool hasError = _featureService.GenerateFeatures(SelectedFacility, IsOdCut);

                if (hasError)
                {
                    MessageBox.Show($"'{SelectedFacility}' 설비 Feature 생성 중 오류가 발생했습니다.", "경고", MessageBoxButton.OK, MessageBoxImage.Warning);
                }
                else
                {
                    MessageBox.Show($"'{SelectedFacility}' 설비에 대한 Feature 생성 완료", "성공", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Feature 생성 중 오류 발생: {ex.Message}", "오류");
            }
        }

        private bool CanApply()
        {
            return FacilityOptions.Contains(SelectedFacility);
        }
    }
}
