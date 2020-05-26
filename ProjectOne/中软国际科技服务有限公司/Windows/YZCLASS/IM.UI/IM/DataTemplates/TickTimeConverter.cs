using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace IM.DataTemplates
{
    public class TickTimeConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            long ticks = (long)value;
            if (ticks > 0)
            {
                DateTime time = new DateTime(ticks);
                DateTime now = DateTime.Today;
                if (time.Year == now.Year && time.Month == now.Month && time.Day == now.Day)
                    return time.ToString("HH:mm:ss");
                else
                    return time.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else
            {
                return null;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            return null;
        }
    }

}
