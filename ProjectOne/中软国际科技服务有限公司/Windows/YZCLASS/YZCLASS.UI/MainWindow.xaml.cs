using System;
using IM.UI;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using YZCLASS.DBService;
using Newtonsoft.Json.Linq;

namespace YZCLASS.UI
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : BaseWindow
    {
        public override bool AllowHideOnClose
        {
            get { return false; }
        }

        protected override string SizeScale
        {
            get
            {
                return "300:669";
            }
        }

        private static TIMCommCallback _ccb_TIMProfileGetUserProfileList;

        public MainWindow()
        {
            InitializeComponent();
            //DockHelp.Init(this, DockSide.Right); //todo
            this.Log.Info("已启动主界面");
            this.ucCourse.Window = this;
            this.Loaded += MainWindow_Loaded;
            _ccb_TIMProfileGetUserProfileList = TIMProfileListCallback;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            JObject o = new JObject();
            JArray array = new JArray();
            o.Add(TIMCloudDef.kTIMFriendShipGetProfileListParamForceUpdate, false);
            array.Add(CurrentUser.UserNumber);
            o.Add(TIMCloudDef.kTIMFriendShipGetProfileListParamIdentifierArray, array);
            string paramContent = Newtonsoft.Json.JsonConvert.SerializeObject(o);
            int userDetail = IMProxy.TIMProfileGetUserProfileList(paramContent, _ccb_TIMProfileGetUserProfileList, IntPtr.Zero);

        }

        private void bdCreateCourse_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Course.CreateCourse ccWindow = new Course.CreateCourse();
            ccWindow.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            ccWindow.ShowDialog();
        }

        public void TIMProfileListCallback(int code, string desc, byte[] json_params, IntPtr user_data)
        {
            this.Dispatcher.Invoke(() =>
            {
                if (code == 0)
                {
                    string message = Common.GetString(json_params);
                    var content = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(message);
                    foreach (var item in content)
                    {
                        CurrentUser.Nickname = item["user_profile_nick_name"].ToString();
                        CurrentUser.HeadUrl = item["user_profile_face_url"].ToString();
                        CurrentUser.UserNumber = item["user_profile_identifier"].ToString();
                        this.lblNikeName.Text = CurrentUser.Nickname;
                        this.lblUserId.Text = CurrentUser.UserNumber;

                        //显示头像
                        if (!String.IsNullOrEmpty(CurrentUser.HeadUrl))
                        {
                            this.headImg.Source = new BitmapImage(new Uri(CurrentUser.HeadUrl));
                        }
                        else
                        {
                            this.headImg.Source = new BitmapImage(new Uri("/YZCLASS.UI;component/Resource/Image/curpage-usergbg.png", UriKind.Relative));
                        }
                    }
                }
            });
        }
    }
}
