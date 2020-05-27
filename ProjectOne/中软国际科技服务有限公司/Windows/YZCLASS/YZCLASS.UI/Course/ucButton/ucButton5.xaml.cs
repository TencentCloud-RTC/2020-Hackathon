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
using System.Windows.Navigation;
using System.Windows.Shapes;
using YZCLASS.UI.LiveRoom;


namespace YZCLASS.UI.Course.ucButton
{
    /// <summary>
    /// ucButton5.xaml 的交互逻辑
    /// </summary>
    public partial class ucButton5 : UserControl
    { 
        public event EventHandler OnNext;

        public ucButton5()
        {
            InitializeComponent();
        }

        private void btnNext_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.OnNext != null)
            {
                this.OnNext(sender, e);
            }
            //这里需要先把直播间需要的参数从接口查出来。
            //LiveRoomWindow lrWindow = new LiveRoomWindow();
            //lrWindow.CourseID = courseNumber;

            //lrWindow.ShowDialog();
        }
    }
}
