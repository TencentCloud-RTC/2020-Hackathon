using IM.Model;
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
using System.Windows.Shapes;

namespace IM.Controls
{
    /// <summary>
    /// HeadPortRait.xaml 的交互逻辑
    /// </summary>
    public partial class HeadPortRait : UserControl
    {
        MsgRule _Msg = null;
        public HeadPortRait()
        {
            InitializeComponent();
            this.Loaded += HeadPortRait_Loaded;
        }

        private void HeadPortRait_Loaded(object sender, RoutedEventArgs e)
        {
            _Msg = this.DataContext as MsgRule;
           this.imageHeadPortrait.Source = SwithImage(_Msg.FaceUrl);
        }

        /// 网络图片转换显示
        private BitmapImage SwithImage(string url)
        {
            try
            {
                BitmapImage bitImage = new BitmapImage();
                bitImage.BeginInit();
                bitImage.UriSource = new Uri(url, UriKind.Absolute);
                bitImage.EndInit();
                return bitImage;
            }
            catch (Exception)
            {
                
            }
            return null;
        }
    }
}
