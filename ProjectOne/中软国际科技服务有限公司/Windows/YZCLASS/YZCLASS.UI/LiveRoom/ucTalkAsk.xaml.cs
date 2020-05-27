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

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// ucBoardTool.xaml 的交互逻辑
    /// </summary>
    public partial class ucTalkAsk : UserControl
    {
        public TRTCManage mTRTCManage { get; set; }

        public ucTalkAsk() 
        { 
            InitializeComponent(); 
        }

        private void acceptAsk_click(object sender, MouseButtonEventArgs e)
        {
            this.Visibility = Visibility.Hidden;
            mTRTCManage.sendcustomCmdMsg(3);
            //调人员接口刷新显示agree界面
        }

        private void refuseAsk_click(object sender, MouseButtonEventArgs e)
        {
            this.Visibility = Visibility.Hidden;
            mTRTCManage.sendcustomCmdMsg(4);
        }
    }
}
