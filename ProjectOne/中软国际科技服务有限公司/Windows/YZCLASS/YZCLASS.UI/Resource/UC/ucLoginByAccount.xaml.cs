using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
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
using YZCLASS.DBService;

namespace YZCLASS.UI
{
    /// <summary>
    /// ucLoginByAccount.xaml 的交互逻辑
    /// </summary>
    public partial class ucLoginByAccount : UserControl
    {
        public event EventHandler<RoutedEventArgs> OnLogin;

        private UserInfoTxtHelp InfoHelp = new UserInfoTxtHelp();

        public ucLoginByAccount()
        {
            InitializeComponent();
            WaterMarkHelp.Init(this.cbbUserName, this.lblUserName);
            WaterMarkHelp.Init(this.txtPassword, this.lblPassword);
            this.Loaded += UcLoginByAccount_Loaded;
        }

        private void UcLoginByAccount_Loaded(object sender, RoutedEventArgs e)
        {
            List<UserInfo> list = LoginWindow.LocalUserList;
            if (list != null && list.Count > 0)
            {
                this.cbbUserName.ItemsSource = list;
            }
        }

        //private void cbbUserName_SelectionChanged(object sender, SelectionChangedEventArgs e)
        //{
        //    UserInfo info = this.cbbUserName.SelectedItem as UserInfo;
        //    if (info != null)
        //    {
        //        this.chkRememberPwd.IsChecked = info.IsRememberPwd;
        //        this.chkAutoLogin.IsChecked = info.IsAutoLogin;
        //        if (!String.IsNullOrEmpty(info.HeadUrl))
        //        {
        //            this.headImg.Source = new BitmapImage(new Uri(info.HeadUrl));
        //        }
        //        else
        //        {
        //            this.headImg.Source = new BitmapImage(new Uri("/YZCLASS.UI;component/Resource/Image/curpage-usergbg.png", UriKind.Relative));
        //        }
        //        if (info.IsRememberPwd == true)
        //        {
        //            this.txtPassword.Password = Common.DESDecrypt(info.Password);
        //            if (info.IsAutoLogin == true && this.txtPassword.Password != "") //自动登录
        //            {
        //                Wait.Run(this, () =>
        //                {
        //                    Thread.Sleep(3000); //3秒后自动登录 
        //                });
        //                this.LoginClick(null, null);
        //            }
        //        }
        //        else
        //        {
        //            this.txtPassword.Password = "";
        //        }
        //    }
        //}


        private void LoginClick(object sender, MouseButtonEventArgs e)
        {
            if (OnLogin != null)
            {
                string msg = "";
                string username = "";
                if (this.cbbUserName.SelectedValue != null)
                {
                    username = this.cbbUserName.SelectedValue.ToString();
                }
                else
                {
                    username = this.cbbUserName.Text;
                }
                string password = this.txtPassword.Password;
                if (username == "")
                {
                    msg = "请输入用户名!";
                    OnLogin(msg, e);
                    return;
                }
                if (password == "")
                {
                    msg = "请输入密码!";
                    OnLogin(msg, e);
                    return;
                }
                Wait.Run(this, "正在登录中...", () =>
                 {
                     DataResult ret = Common.Db.My.Login(username, password);
                     if (ret.Success == true)
                     {
                         CurrentUser.UserNumber = username;
                     }
                     else
                     {
                         msg = "用户名或密码错误！";
                     }
                 });
                OnLogin(msg, e);
            }
        }
    }
}
