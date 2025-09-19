using System;
using System.Globalization;
using System.Windows.Data;

namespace CAM_API.Common.Converters
{
    public class EnumToBooleanConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value == null || parameter == null)
                return false;

            string paramString = parameter.ToString();
            if (!Enum.IsDefined(value.GetType(), value))
                return false;

            object paramValue = Enum.Parse(value.GetType(), paramString);
            return paramValue.Equals(value);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool isChecked && isChecked && parameter != null)
            {
                return Enum.Parse(targetType, parameter.ToString());
            }

            return Binding.DoNothing;
        }
    }
}
