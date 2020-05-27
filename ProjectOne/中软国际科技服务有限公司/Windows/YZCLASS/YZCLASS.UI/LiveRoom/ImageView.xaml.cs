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

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// ImageView.xaml 的交互逻辑
    /// </summary>
    public partial class ImageView : Window
    {
        public string Url { get; set; }

        public ImageView()
        {
            InitializeComponent();
            this.Loaded += ImageView_Loaded;
        }

        private void ImageView_Loaded(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(Url) == false)
            {
                this.img.Source = ChatUtil.SwithImage(this.Url);
            }
        }
    }
}
