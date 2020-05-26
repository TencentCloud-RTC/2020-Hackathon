using IM.UI;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
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
using Newtonsoft.Json.Linq;

namespace YZCLASS.UI
{
    /// <summary>
    /// LoginWindow.xaml 的交互逻辑
    /// </summary>
    public partial class LoginWindow : BaseWindow
    {
        private int AppId = int.Parse(ConfigurationManager.AppSettings["ComAppId"]);
        private string AppSK = ConfigurationManager.AppSettings["ComAppSK"];
        private static TIMCommCallback _ccb;
        public static List<UserInfo> LocalUserList = null;

        public override bool AllowHideOnClose
        {
            get { return false; }
        }

        public LoginWindow()
        {
            InitializeComponent();
            _ccb = TIMCommCallback;
            this.LoginByAccountUC.OnLogin += OnLogin;
            UserInfoTxtHelp InfoHelp = new UserInfoTxtHelp();
            LocalUserList = InfoHelp.ReadList();
        }

        private void OnLogin(object sender, RoutedEventArgs e)
        {
            if (sender.ToString().Length > 0)
            {
                DialogWindow.Message(this, sender.ToString());
                return;
            }

            // 初始化IM 
            int ret = 0;
            string config = "{}";
            ret = IMProxy.TIMInit(AppId, config);

            //登录IM
            string uid = CurrentUser.UserNumber;
            UserSig userSig = new UserSig(AppId, AppSK);
            string sig = userSig.Gen(uid);
            IMProxy.TIMLogin(uid, sig, _ccb, IntPtr.Zero);
        }
        
        public void TIMCommCallback(int code, string desc, byte[] json_params, IntPtr user_data)
        {
            if (code == 0)
            {
                //MessageBox.Show("登录成功！");
            }
            else
            {
                DialogWindow.Message(this, "IM登录失败！");
            }
            this.Dispatcher.Invoke(() =>
            {
                this.Hide();
                MainWindow window = new MainWindow();
                window.Show();
                this.Close();
            }); 
        }
    }
}
