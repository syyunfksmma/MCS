using System;
using System.Globalization;
using System.Windows.Data;

namespace CAM_API.Common.Converters
{
    public class EqualityMultiConverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            if (values.Length < 2 || values[0] == null || values[1] == null)
                return false;

            return values[0].Equals(values[1]);
        }

        public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
        {
            if ((bool)value)
            {
                // values[1]은 여기서 사용할 수 없으므로 View에서 Binding Path="."으로 현재 항목을 첫 번째 인자로 넣어줬다면,
                // 첫 번째 값으로 되돌려준다. 즉, ViewModel.SelectedFacility에 들어가게 됨.
                // 이 시점에서는 values[1]은 알 수 없으므로, SelectedFacility 바인딩이 첫 번째 요소임을 가정하고 parameter로 넘기지 않고,
                // XAML의 첫 번째 <Binding Path="." />가 실제 선택된 FacilityType이므로 그것을 사용해야 함
                // => 이 경우에는 ConvertBack에서 값을 넘기면 자동으로 SelectedFacility에 매핑됨
                return new object[] { value, Binding.DoNothing };
            }

            return new object[] { Binding.DoNothing, Binding.DoNothing };
        }
    }
}
