using ManageLiteAV;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.InteropServices;
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
using System.ComponentModel;
using YZCLASS.DBService;
using Microsoft.Win32;
using System.IO;
using Aspose.Words.Saving;
using IM.UI;
using Newtonsoft.Json.Linq;
using System.Windows.Ink;
using System.Reflection;
using IM;
using IM.ImageExtender;
using static IM.FaceUserControl;
using System.Windows.Forms.Integration;

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// LiveRoomWindow.xaml 的交互逻辑
    /// </summary>
    public partial class LiveRoomWindow : BaseWindow
    {
        public const string TemplateUri = "pack://application:,,,/YZCLASS.UI;component/Resource/Style/ContextMunuTemplate.xaml";

        #region 属性
        public string RoomId { get; set; }

        public string CourseID { get; set; }

        public string CourseName { get; set; }

        public string ChatGroupID { get; set; }

        public int RoleType { get; set; } //角色类型（0未加入课程或者是游客、1会员、2管理员、3超级管理员）

        private TRTCManage TRTCManage { get; set; }

        private WhiteBoardManage WBManage { get; set; }

        private LocalRecordManage LRManage { get; set; }

        private bool OnOff { get; set; }

        private dynamic reMsg;

        private static TIMCommCallback _ccbGroupJoin;

        private static TIMRecvNewMsgCallback _rcbRecvNewMsg;

        private static TIMCommCallback _ccbSendNewMsg;

        private static TIMCommCallback _ccbGroupModify;
        
        private static TIMCommCallback _live_TIMProfileGetUserProfileList;

        public enum fileType {PPT, WORD, PDF };
        #endregion

        public LiveRoomWindow()
        {
            InitializeComponent();
            _ccbGroupJoin = Callback_GroupJoin;
            _rcbRecvNewMsg = Callback_RecvNewMsg;
            _ccbSendNewMsg = Callback_SendNewMsg;
            _live_TIMProfileGetUserProfileList = TIMProfileListCallback;
            this.AllowsTransparency = false;
            this.OnOff = false;
            //this.TRTCManage = new TRTCManage(this, this.myPanel.Handle, IntPtr.Zero, null, this.myVoiceBar);
            //uctalkAsk.mTRTCManage = this.TRTCManage;
            this.WBManage = new WhiteBoardManage(this.boardContainer, this.FilePanel, this.FilePagePanel);
            this.boardTool.OnEraserClick += BoardTool_OnEraserClick;
            this.boardTool.OnPenClick += BoardTool_OnPenClick;
            this.boardTool.OnLightPenClick += BoardTool_OnLightPenClick;
            this.boardTool.OnShapeClick += BoardTool_OnShapeClick;
            this.boardTool.OnThicknessClick += BoardTool_OnThicknessClick;
            this.boardTool.OnPenCellClick += BoardTool_OnPenCellClick;
            this.boardTool.OnShapeCellClick += BoardTool_OnShapeCellClick;
            this.boardTool.OnBrushClick += BoardTool_OnBrushClick;
            this.boardTool.OnTextClick += BoardTool_OnTextClick;
            this.faceUserControl.OnUserSelectFace += FaceUserControl_OnUserSelectFace;
        }

        private void Browser_Navigating(object sender, System.Windows.Navigation.NavigatingCancelEventArgs e)
        {
            SuppressScriptErrors(sender as WebBrowser, true);
        }



        private void LiveRoomWindow_Loaded(object sender, RoutedEventArgs e)
        {
            getCourseInfo();
            if (string.IsNullOrEmpty(this.CourseName) == false)
            {
                this.lblCourseName.Text = this.CourseName;
            }

            //注册接收回调事件
            IMProxy.TIMAddRecvNewMsgCallback(_rcbRecvNewMsg, IntPtr.Zero);

            //进入学员列表
            string jsonStr = "";
            jsonStr += "{";
            jsonStr += "    \"liveRoomId\":\"" + this.RoomId + "\",";
            jsonStr += "    \"userNumber\":\"" + CurrentUser.UserNumber + "\",";
            jsonStr += "    \"roleType\":\"" + this.RoleType + "\",";
            jsonStr += "    \"isTeacher\":\"1\"";
            jsonStr += "}";
            Common.Db.LiveRoom.IntoLiveRoom(jsonStr);

            //进入讨论组
            IMProxy.TIMGroupJoin(this.ChatGroupID, " ", _ccbGroupJoin, IntPtr.Zero);

            this.TRTCManage = new TRTCManage(this, this.BoardAreaRec, this.myPanel.Handle, IntPtr.Zero, null, this.myVoiceBar);
            this.LRManage = new LocalRecordManage(this.BoardAreaRec);
            uctalkAsk.mTRTCManage = this.TRTCManage;

            //显示用户ID和房间号
            uint rid = 0;
            if (uint.TryParse(this.RoomId, out rid) == true)
            {
                DataManager.GetInstance().roomId = rid;
            }
            else
            {
                DialogWindow.Message(this, "未能获取房间号！");
            }

            DataManager.GetInstance().userId = CurrentUser.UserNumber;
            DataManager.GetInstance().roleType = TRTCRoleType.TRTCRoleAnchor;
            this.txtUserID.Text = string.Format("用户ID：{0}", DataManager.GetInstance().userId);
            this.txtRoomID.Text = string.Format("房间号：{0}", DataManager.GetInstance().roomId);

            this.LoadRightGridData();
        }

        private void getCourseInfo()
        {
            DataResult ret = base.Db.Course.getCourseInfo("courseNumber=" + CourseID);  //返回结果

            if (ret.Success == true && ret.Result != null)
            {
                this.RoomId = ret.Result["liveRoomId"].ToString();
                this.ChatGroupID = ret.Result["avchatRoomId"].ToString();
                this.CourseName = ret.Result["courseName"].ToString();
            }
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            string jsonStr = "";
            jsonStr += "{";
            jsonStr += "    \"liveRoomId\":\"" + this.RoomId + "\",";
            jsonStr += "    \"userNumber\":\"\"";
            jsonStr += "}";
            Common.Db.LiveRoom.OutLiveRoom(jsonStr);
            this.TRTCManage.ExitRoom();
            base.OnClosing(e);
        }

        private System.Drawing.Rectangle BoardAreaRec
        {
            get
            {
                System.Drawing.Rectangle rec = new System.Drawing.Rectangle();
                rec.Location = new System.Drawing.Point
                (
                    (int)(this.Left * Common.ScreenZoom + 186 * Common.ScreenZoom),
                    (int)(this.Top * Common.ScreenZoom + 45.5 * Common.ScreenZoom)
                );
                rec.Width = (int)this.MiddleGrid.ActualWidth;
                rec.Height = (int)this.MiddleGrid.ActualHeight;
                return rec;
            }
        }

        #region 顶部及折叠
        private void TopGrid_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                this.DragMove();
            }
        }

        private void btnClose_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.Close();
        }

        private void bdMin_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.WindowState = WindowState.Minimized;
        }

        private void btnLeft_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            double width = 171;
            if (this.colLeft.Width.Value > 0)
            {
                this.colLeft.Width = new GridLength(0);
                this.btnLeft.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-arrw-right.png");
                this.colMiddle.Width = new GridLength(this.colMiddle.Width.Value + width, GridUnitType.Star);
            }
            else
            {
                this.colLeft.Width = new GridLength(width, GridUnitType.Star);
                this.btnLeft.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-arrw-left.png");
                this.colMiddle.Width = new GridLength(this.colMiddle.Width.Value - width, GridUnitType.Star);
            }
        }

        private void btnRight_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            double width = 240;
            if (this.colRight.Width.Value > 0)
            {
                this.colRight.Width = new GridLength(0);
                this.btnRight.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-arrw-left.png");
                this.colMiddle.Width = new GridLength(this.colMiddle.Width.Value + width, GridUnitType.Star);
            }
            else
            {
                this.colRight.Width = new GridLength(width, GridUnitType.Star);
                this.btnRight.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-arrw-right.png");
                this.colMiddle.Width = new GridLength(this.colMiddle.Width.Value - width, GridUnitType.Star);
            }
        }

        private void imgClose_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.Close();
        }
        #endregion

        #region 左部

        //上课/下课开关
        private void btnOnOff_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            TextBlock lbl = this.btnOnOff.Child as TextBlock;
            if (this.btnOnOff.Tag.ToString().Equals("0")) //下课->上课
            {
                lbl.Text = "下课";
                this.btnOnOff.Background = Common.GetColor("#EC6941");
                this.btnOnOff.Tag = "1";

                //this.btnOnlineRecord.IsChecked = true;
                //this.imgOnlineRecord.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-ope.png");
                //this.btnLive.IsChecked = true;
                this.imgLive.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-ope.png");
                //this.btnLocalRecord.IsChecked = true;

                string dataStr = "";    //传入参数
                DataResult ret = null;  //返回结果
                dataStr += "{";
                dataStr += "    \"courseNumber\":\"" + CourseID + "\"";
                dataStr += "}";
                ret = base.Db.Course.openShowing(dataStr);

                uint rid = 0;
                if (uint.TryParse(this.RoomId, out rid) == true)
                {
                    //进入直播间
                    this.TRTCManage.EnterRoom(rid);
                }
                else
                {
                    DialogWindow.Message(this, "未能获取房间号,进入房间失败！");
                }
            }
            else //上课->下课
            {
                lbl.Text = "上课";
                this.btnOnOff.Background = Common.GetColor("#40B47A");
                this.btnOnOff.Tag = "0";

                string dataStr = "";    //传入参数
                DataResult ret = null;  //返回结果
                dataStr += "{";
                dataStr += "    \"courseNumber\":\"" + CourseID + "\"";
                dataStr += "}";
                ret = base.Db.Course.closeShowing(dataStr);

                //退出直播间
                this.TRTCManage.ExitRoom();
                //this.btnOnlineRecord.IsChecked = false;
                //this.imgOnlineRecord.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-clos.png");
                //this.btnLive.IsChecked = false;
                this.imgLive.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-clos.png");
                //this.btnLocalRecord.IsChecked = false;
            }
        }

        //屏幕分享
        private void btnScreenShare_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.btnScreenShare.Tag.ToString().Equals("0"))
            {
                this.TRTCManage.MixTransCodingCheck = true;
                this.TRTCManage.ScreenShareCheck = true;
                this.btnScreenShare.Tag = "1";
                this.imgScreenShare.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-fix-on.png");
            }
            else
            {
                this.TRTCManage.MixTransCodingCheck = false;
                this.TRTCManage.ScreenShareCheck = false;
                this.btnScreenShare.Tag = "0";
                this.imgScreenShare.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-fix.png");
            }
        }

        //打开摄像头
        private void btnCamera_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.btnCamera.Tag.ToString().Equals("0") == true)
            {
                this.btnCamera.Tag = "1";
                this.btnBoard.Tag = "0";
                this.btnWebPage.Tag = "0";
                this.cameraContainer.Visibility = Visibility.Visible;
                this.boardContainer.Visibility = Visibility.Hidden;
                this.boardToolGrid.Visibility = Visibility.Hidden;
                this.browserContainer.Visibility = Visibility.Hidden;
                this.TRTCManage.VideoCheck = false;
                this.imgCamera.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-sxt-on.png");
                this.imgBoard.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-wite.png");
                this.imgWebPage.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-ie.png");
            }
        }

        //打开白板
        private void btnBoard_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.btnBoard.Tag.ToString().Equals("0") == true)
            {
                this.btnCamera.Tag = "0";
                this.btnBoard.Tag = "1";
                this.btnWebPage.Tag = "0";
                this.cameraContainer.Visibility = Visibility.Hidden;
                this.boardContainer.Visibility = Visibility.Visible;
                this.boardToolGrid.Visibility = Visibility.Visible;
                this.browserContainer.Visibility = Visibility.Hidden;
                this.TRTCManage.VideoCheck = true;
                this.imgCamera.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-sxt.png");
                this.imgBoard.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-wite-pre.png");
                this.imgWebPage.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-ie.png");
            }
        }

        //网页显示
        private void btnWebPage_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            //this.TRTCManage.sendcustomCmdMsg(2);
            if (this.btnWebPage.Tag.ToString().Equals("0") == true)
            {
                this.btnCamera.Tag = "0";
                this.btnBoard.Tag = "0";
                this.btnWebPage.Tag = "1";
                this.cameraContainer.Visibility = Visibility.Hidden;
                this.boardContainer.Visibility = Visibility.Hidden;
                this.boardToolGrid.Visibility = Visibility.Hidden;
                this.browserContainer.Visibility = Visibility.Visible;
                this.TRTCManage.VideoCheck = true;
                this.imgCamera.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-sxt.png");
                this.imgBoard.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-wite.png");
                this.imgWebPage.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-ie-on.png");
            }
        }
        //private void SuppressScriptErrors(WebBrowser webBrowser, bool hide)
        //{
        //    webBrowser.Navigating += (s, e) =>
        //    {
        //        var fiComWebBrowser = typeof(WebBrowser).GetField("_axIWebBrowser2", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);
        //        if (fiComWebBrowser == null)
        //            return;

        //        object objComWebBrowser = fiComWebBrowser.GetValue(webBrowser);
        //        if (objComWebBrowser == null)
        //            return;

        //        objComWebBrowser.GetType().InvokeMember("Silent", System.Reflection.BindingFlags.SetProperty, null, objComWebBrowser, new object[] { hide });
        //    };
        //}

        private void SuppressScriptErrors(WebBrowser webBrowser, bool silent)
        {
            FieldInfo fi = typeof(WebBrowser).GetField("_axIWebBrowser2", BindingFlags.Instance | BindingFlags.NonPublic);
            if (fi != null)
            {
                object browser = fi.GetValue(webBrowser);
                if (browser != null)
                    browser.GetType().InvokeMember("Silent", BindingFlags.SetProperty, null, browser, new object[] { silent });
            }
        }

        //打开课件
        private void imgOpenFile_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.WBManage.OpenFile();
            //StackPanel sp = sender as StackPanel;
            //string type = sp.Tag.ToString();
            //if(type == "0") 
            //{ 
            //    this.WBManage.OpenFile(fileType.PPT);
            //}
            //else if(type == "1")
            //{
            //    this.WBManage.OpenFile(fileType.WORD);
            //}
            //else if (type == "2")
            //{
            //    this.WBManage.OpenFile(fileType.PDF);
            //}
        }

        private void btnOnOff_Click(object sender, RoutedEventArgs e)
        {
            //this.OnOff = !this.OnOff;
            //if (this.OnOff == true)
            //{
            //    trtcManage.EnterRoom();
            //    this.btnOnOff.Content = "下课";
            //}
            //else
            //{
            //    trtcManage.ExitRoom();
            //    this.btnOnOff.Content = "上课";
            //}
        }

        private void btnShare_Click(object sender, RoutedEventArgs e)
        {
            // 计算 CDN 地址(格式： http://[bizid].liveplay.myqcloud.com/live/[bizid]_[streamid].flv )
            int bizId = 64607;
            // streamid = MD5 (房间号_用户名_流类型)
            string mRoomId = DataManager.GetInstance().roomId.ToString();
            string mUserId = DataManager.GetInstance().userId;
            string streamId = Util.MD5(String.Format("{0}_{1}_{2}", mRoomId, Util.UTF16To8(mUserId), "main"));
            //string shareUrl = String.Format("http://{0}.liveplay.myqcloud.com/live/{0}_{1}.flv", bizId, streamId);
            string shareUrl = String.Format("http://play.fangchenkj.cn/live/{0}_{1}.flv", bizId, streamId);
            Clipboard.SetDataObject(shareUrl);
            MessageBox.Show("播放地址：（已复制到剪切板）\n" + shareUrl);
        }

        private void btnVoice_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.btnVoice.Tag.ToString().Equals("0"))
            {
                this.TRTCManage.VoiceCheck = true;
                this.TRTCManage.AudioCheck = false;
                this.btnVoice.Tag = "1";
            }
            else
            {
                this.TRTCManage.VoiceCheck = false;
                this.TRTCManage.AudioCheck = true;
                this.btnVoice.Tag = "0";
            }
        }

        private void btnLocalRecord_Click(object sender, RoutedEventArgs e)
        {
            if (this.btnLocalRecord.IsChecked == true)
            {
                this.LRManage.Start();
            }
            else
            {
                this.LRManage.Stop();
            }
        }
        #endregion

        #region 右部
        //讨论开关
        private void chkTL_Click(object sender, RoutedEventArgs e)
        {
            JObject json_value_modifygroupinfo = new JObject();
            json_value_modifygroupinfo.Add(TIMCloudDef.kTIMGroupModifyInfoParamGroupId, this.ChatGroupID);
            json_value_modifygroupinfo.Add(TIMCloudDef.kTIMGroupModifyInfoParamModifyFlag, (int)TIMCloudDef.TIMGroupModifyInfoFlag.kTIMGroupModifyInfoFlag_ShutupAll);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(json_value_modifygroupinfo);
            IMProxy.TIMGroupModifyGroupInfo(json, _ccbGroupModify, IntPtr.Zero);
        }
        
        private void imgTL_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }

        private void LoadRightGridData()
        {
            this.LoadXYGridData();
            //this.LoadTWGridData();
        }

        private void LoadXYGridData()
        {
            string dataStr = "";    //传入参数
            DataResult ret = null;  //返回结果
            Border border = null;
            StackPanel sp = null;
            Image img = null;
            TextBlock lbl = null;

            #region 学员列表
            dataStr += "{";
            dataStr += "    \"data\": {";
            dataStr += "        \"liveRoomId\": \"" + this.RoomId + "\"";
            dataStr += "    },";
            dataStr += "    \"page\": {";
            dataStr += "        \"pageNumbers\": \"1\",";
            dataStr += "        \"countPerPages\": \"1000\"";
            dataStr += "    }";
            dataStr += "}";
            ret = Common.Db.LiveRoom.QueryStudentList(dataStr);
            if (ret.Success == true && ret.Result != null)
            {
                this.XYPanel.Children.Clear();
                for (int i = 0; i < ret.Result["data"].Count; i++)
                {
                    var rdata = ret.Result["data"][i];
                    border = new Border();
                    border.Height = 30;
                    this.XYPanel.Children.Add(border);
                    sp = new StackPanel();
                    sp.Orientation = Orientation.Horizontal;
                    sp.VerticalAlignment = VerticalAlignment.Center;
                    sp.Margin = new Thickness(15, 0, 0, 0);
                    border.Child = sp;
                    img = new Image();
                    img.Width = 22;
                    img.VerticalAlignment = VerticalAlignment.Center;
                    if (rdata["headFileUrl"] != null)
                    {
                        img.Source = new BitmapImage(new Uri(rdata["headFileUrl"].ToString()));
                    }
                    else
                    {
                        img.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-userpic.png");
                    }
                    sp.Children.Add(img);
                    lbl = new TextBlock();
                    lbl.FontFamily = new FontFamily("苹方");
                    lbl.Text = rdata["nickname"];
                    lbl.VerticalAlignment = VerticalAlignment.Center;
                    lbl.Foreground = Common.GetColor("#595757");
                    lbl.Margin = new Thickness(10, 0, 0, 0);
                    sp.Children.Add(lbl);
                }
            }
            #endregion
        }

        private void ChangeListTab(object sender, MouseButtonEventArgs e)
        {
            Border border = sender as Border;
            string tag = border.Tag.ToString();
            Grid pGrid = border.Parent as Grid;
            foreach (UIElement child in pGrid.Children)
            {
                ((child as Border).Child as TextBlock).FontWeight = FontWeights.Normal;
                ((child as Border).Child as TextBlock).Foreground = Common.GetColor("#9E9E9F");
            }
            (border.Child as TextBlock).FontWeight = FontWeights.Bold;
            (border.Child as TextBlock).Foreground = Common.GetColor("#595757");
            this.XYPanel.Visibility = Visibility.Hidden;
            this.XYContainer.Visibility = Visibility.Hidden;
            this.TLGrid.Visibility = Visibility.Hidden;
            if (tag.Equals("TL"))
            {
                this.TLGrid.Visibility = Visibility.Visible;
                //重新刷新
                this.LoadXYGridData();
            }
            else
            {
                this.XYContainer.Visibility = Visibility.Visible;
                this.XYPanel.Visibility = Visibility.Visible;
            }
        }

        #region 讨论
        public void Callback_GroupJoin(int code, string desc, byte[] json_params, IntPtr user_data)
        {
            if (code == 0)
            {

            }
        }

        private void Callback_RecvNewMsg(byte[] json_msg_array, IntPtr user_data)
        {
            string message = Common.GetString(json_msg_array);
            try
            {
                this.Dispatcher.Invoke(() =>
                {
                    dynamic msgobj = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(message);
                    foreach (var msg in msgobj)
                    {
                        reMsg = msg;
                        getSenderDetail(msg);
                        //this.UpdateMessageList(msg);
                    }
                });
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("讨论群接收消息失败!", ex);
            }
        }

        public void Callback_SendNewMsg(int code, string desc, byte[] json_params, IntPtr user_data)
        {
            if (code == 0)
            {
                this.Dispatcher.Invoke(() =>
                {
                    string json = Common.GetString(json_params);
                    dynamic msg = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(json);
                    reMsg = msg;
                    getSenderDetail(msg);
                    //this.UpdateMessageList(msg);
                });
            }
        }

        
        //获取消息发送方的名字头像
        private void getSenderDetail(dynamic msg)
        {
            if (msg["message_conv_type"] != null && msg["message_conv_type"].ToString() != "3" && msg["message_sender"] != null
                && msg["message_elem_array"] != null && msg["message_elem_array"].Count > 0)
            {
                string senderNumber = msg["message_sender"].ToString();
                JObject o = new JObject();
                JArray array = new JArray();
                o.Add(TIMCloudDef.kTIMFriendShipGetProfileListParamForceUpdate, false);
                array.Add(senderNumber);
                o.Add(TIMCloudDef.kTIMFriendShipGetProfileListParamIdentifierArray, array);
                string paramContent = Newtonsoft.Json.JsonConvert.SerializeObject(o);
                int userDetail = IMProxy.TIMProfileGetUserProfileList(paramContent, _live_TIMProfileGetUserProfileList, IntPtr.Zero);
            }
        }

        //发送消息
        private void imgSend_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (string.IsNullOrEmpty(this.ChatGroupID) == true)
            {
                DialogWindow.Message(this, "没有可用的讨论组，不能进行讨论！");
                return;
            }

            //string groupID = this.ChatGroupID;
            //string sendContent = ""; //todo this.txtMessage.Text;

            //string msg = "";
            //JObject json_value_msg = new JObject();
            //JArray arr = new JArray();
            //JObject json_value_text = new JObject();
            //json_value_text.Add(TIMCloudDef.kTIMElemType, 0);
            //json_value_text.Add(TIMCloudDef.kTIMTextElemContent, sendContent);
            //arr.Add(json_value_text);
            //json_value_msg.Add(TIMCloudDef.kTIMMsgElemArray, arr);
            //json_value_msg.Add(TIMCloudDef.kTIMMsgSender, CurrentUser.UserNumber);
            //json_value_msg.Add(TIMCloudDef.kTIMMsgClientTime, 1551446728);
            //json_value_msg.Add(TIMCloudDef.kTIMMsgServerTime, 1551446728);

            //msg = Newtonsoft.Json.JsonConvert.SerializeObject(json_value_msg);
            //byte[] msgArr = Common.GetBuffer(msg);
            //IMProxy.TIMMsgSendNewMsg(groupID, TIMConvType.kTIMConv_Group, msgArr, _ccbSendNewMsg, IntPtr.Zero);

            List<string> listStr = new List<string>();
            List<string> listFile = new List<string>();
            ChatProcess.Construe(this.txtMessage, ref listStr, ref listFile);
            int ret = 0;
            if (listStr.Count == 0 && listFile.Count == 0)
            {
                return;
            }
            JObject o = new JObject();
            JArray array = new JArray();
            JObject chatContent = null;
            string messageText = "";
            foreach (string str in listStr)
            {
                if (!string.IsNullOrEmpty(str))
                {
                    messageText += str;
                }
            }
            chatContent = new JObject();
            chatContent.Add(TIMCloudDef.kTIMElemType, TIMElemType.kTIMElem_Text);
            chatContent.Add(TIMCloudDef.kTIMTextElemContent, messageText);
            array.Add(chatContent);
            foreach (string str in listFile)
            {
                if (ChatUtil.isType(str).Equals("image"))
                {
                    uint level = 0;
                    chatContent = new JObject();
                    chatContent.Add(TIMCloudDef.kTIMElemType, TIMElemType.kTIMElem_Image);
                    chatContent.Add(TIMCloudDef.kTIMImageElemLevel, level);
                    chatContent.Add(TIMCloudDef.kTIMImageElemOrigPath, str);
                    chatContent.Add(TIMCloudDef.kTIMImageElemFormat, 0);
                    chatContent.Add(TIMCloudDef.kTIMImageElemOrigPicSize, 22);// 原始图片大小
                }
                else
                {
                    chatContent = new JObject();
                    chatContent.Add(TIMCloudDef.kTIMElemType, TIMElemType.kTIMElem_File);
                    string fileSize = Common.GetFileSize(str);// 根据路径获取文件大小
                    int size = 0;
                    if (!string.IsNullOrEmpty(fileSize))
                    {
                        string[] sArray = fileSize.Split('.');// 一定是单引 
                        size = int.Parse(sArray[0]);
                    }
                    chatContent.Add(TIMCloudDef.kTIMFileElemFileSize, 6000);
                    chatContent.Add(TIMCloudDef.kTIMFileElemFilePath, str);
                    chatContent.Add(TIMCloudDef.kTIMFileElemFileName, System.IO.Path.GetFileNameWithoutExtension(str) + System.IO.Path.GetExtension(str));
                }
                array.Add(chatContent);
            }
            o.Add(TIMCloudDef.kTIMMsgClientTime, ChatUtil.getHHmmssfff());
            o.Add(TIMCloudDef.kTIMMsgSender, CurrentUser.UserNumber);
            o.Add(TIMCloudDef.kTIMMsgServerTime, ChatUtil.getHHmmssfff());
            o.Add(TIMCloudDef.kTIMMsgElemArray, array);
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(o);
            try
            {
                ret = IMProxy.TIMMsgSendNewMsg(this.ChatGroupID, TIMConvType.kTIMConv_Group, Common.GetBuffer(msg), _ccbSendNewMsg, IntPtr.Zero);
                // 如果消息发送成功，则将消息附在聊天面板上
                if (ret == 0)
                {

                }
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("发送消息异常：", ex);
            }
        }

        private void button_smile_Click(object sender, RoutedEventArgs e)
        {
            this.popupExpression.IsOpen = true;
        }

        private void button_file_Click(object sender, RoutedEventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            dlg.Filter = "图像文件|*.jpg;*.png;*.jpeg;*.bmp;*.gif|所有文件|*.*";
            dlg.Multiselect = false;//设置只能选择一个文件
            Nullable<bool> result = dlg.ShowDialog();
            if (result == true)
            {
                int pic_size = 30;
                System.Drawing.Bitmap bm = WindowsThumbnailProvider.GetThumbnail(dlg.FileName, pic_size, pic_size, ThumbnailOptions.None);
                System.Windows.Controls.Image img = ChatUtil.Bitmap2Image(bm);
                img.Tag = dlg.FileName;
                new InlineUIContainer(img, this.txtMessage.Selection.Start); //插入图片到选定位置
            }
        }

        private void UpdateMessageList(dynamic msg, string nickname, string headurl)
        {
            if (msg["message_conv_type"] != null && msg["message_conv_type"].ToString() != "3" && msg["message_sender"] != null
                && msg["message_elem_array"] != null && msg["message_elem_array"].Count > 0)
            {
                Border border = new Border();
                this.TLPanel.Children.Add(border);
                Grid grid = new Grid();
                border.Child = grid;
                RowDefinition row = null;
                row = new RowDefinition();
                row.Height = new GridLength(1, GridUnitType.Auto);
                grid.RowDefinitions.Add(row);
                row = new RowDefinition();
                row.Height = new GridLength(1, GridUnitType.Auto);
                grid.RowDefinitions.Add(row);
                StackPanel sp = new StackPanel();
                grid.Children.Add(sp);
                Grid.SetRow(sp, 0);
                sp.Orientation = Orientation.Horizontal;
                sp.VerticalAlignment = VerticalAlignment.Center;
                sp.Margin = new Thickness(15, 0, 0, 0);
                
                Image img = new Image();
                img.Width = 22;
                img.VerticalAlignment = VerticalAlignment.Center;
                img.Source = new BitmapImage(new Uri(headurl));
                img.Stretch = Stretch.Uniform;
                sp.Children.Add(img);

                TextBlock lbl = new TextBlock();
                lbl.Text = nickname;
                lbl.FontFamily = new FontFamily("苹方");
                lbl.VerticalAlignment = VerticalAlignment.Center;
                lbl.Foreground = Common.GetColor("#9E9E9F");
                lbl.Margin = new Thickness(10, 0, 0, 0);
                sp.Children.Add(lbl);

                WrapPanel wp = new WrapPanel();
                grid.Children.Add(wp);
                wp.Orientation = Orientation.Horizontal;
                Grid.SetRow(wp, 1);
                wp.Margin = new Thickness(15, 5, 15, 5);
                foreach (var item in msg["message_elem_array"])
                {
                    if (item["elem_type"].ToString() == "0") //文本
                    {
                        string msgStr = item["text_elem_content"].ToString();
                        msgStr = msgStr.Replace("[", "|@|[").Replace("]", "]|@|");
                        string[] msgArr = msgStr.Split(new string[] { "|@|" }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (string s in msgArr)
                        {
                            if (s.StartsWith("[") == true && s.EndsWith("]") == true)
                            {
                                img = new Image();
                                img.Height = 16;
                                img.Width = 16;
                                img.Source = Common.GetImage("/IM.UI;component/IM/sysface/" + s + ".png");
                                wp.Children.Add(img);
                            }
                            else
                            {
                                lbl = new TextBlock();
                                lbl.Foreground = Common.GetColor("#232729");
                                lbl.FontSize = 12;
                                lbl.FontFamily = new FontFamily("苹方");
                                lbl.TextWrapping = TextWrapping.Wrap;
                                lbl.Text = s;
                                wp.Children.Add(lbl);
                            }
                        }
                    }
                    if (item["elem_type"].ToString() == "1") //图片
                    {
                        img = new Image();
                        img.Height = 30;
                        img.Width = 30;
                        img.Source = ChatUtil.SwithImage(item["image_elem_thumb_url"].ToString());
                        img.Tag = item["image_elem_large_url"].ToString();
                        img.MouseLeftButtonDown += Img_MouseLeftButtonDown;
                        wp.Children.Add(img);
                    }
                }
            }

            this.txtMessage.Document.Blocks.Clear();
            this.txtMessage.Focus();
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
                        string nickname = item["user_profile_nick_name"].ToString();
                        string headUrl = item["user_profile_face_url"].ToString();
                        string userNumber = item["user_profile_identifier"].ToString();

                        UpdateMessageList(reMsg, nickname, headUrl);
                    }
                }
            });
        }

        private void Img_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Image img = sender as Image;
            ImageView view = new ImageView();
            view.Url = img.Tag.ToString();
            view.ShowDialog();
        }

        private void FaceUserControl_OnUserSelectFace(object sender, OnUserSelectFaceEventArgs e)
        {
            ImageExpender Img_Exp = new ImageExpender();
            Img_Exp.Stretch = Stretch.UniformToFill;
            Img_Exp.Visibility = Visibility.Visible;///YZCLASS.UI;component/Resource/Image/sysface/
            Stream imageStream = System.Windows.Application.GetResourceStream(new Uri("/IM.UI;component/IM/sysface/" + e.Face_Path, UriKind.Relative)).Stream;
            System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(imageStream);

            Img_Exp.Image = bitmap;
            Img_Exp.Location = "/IM.UI;component/IM/sysface/" + e.Face_Path;
            Img_Exp.ToolTip = "/IM.UI;component/IM/sysface/" + e.Face_Path;
            Img_Exp.Tag = e.Face_Path;
            Img_Exp.Height = 26;
            Img_Exp.Width = 26;
            InlineUIContainer IUC = new InlineUIContainer();
            IUC.Child = Img_Exp;
            SetContent(IUC);
        }

        private void SetContent(InlineUIContainer iUC)
        {
            var obj = this.txtMessage.CaretPosition.Parent;
            if (obj is FlowDocument)
            {
                Paragraph paragraph = new Paragraph(iUC);
                this.txtMessage.Document.Blocks.Add(paragraph);
            }
            else if (obj is Run)
            {
                Run run = (Run)obj;
                var paragraph = this.txtMessage.CaretPosition.Paragraph;
                var endTextPointer = this.txtMessage.Selection.End;
                var beforeText = new TextRange(run.ContentStart, endTextPointer);//前面的文本
                var afterText = new TextRange(run.ContentEnd, endTextPointer);//后面的文本
                Run runBefore = new Run(beforeText.Text);
                Run runAfter = new Run(afterText.Text);

                paragraph.Inlines.InsertAfter(run, runAfter);
                paragraph.Inlines.InsertAfter(run, iUC);
                paragraph.Inlines.InsertAfter(run, runBefore);
                paragraph.Inlines.Remove(run);//删除原有text

            }
            else if (obj is Paragraph)
            {
                var var1 = this.txtMessage.CaretPosition.GetAdjacentElement(LogicalDirection.Backward);
                var var2 = this.txtMessage.CaretPosition.GetAdjacentElement(LogicalDirection.Forward);
                if (var1.GetType() == typeof(InlineUIContainer))
                {
                    Paragraph paragraph = obj as Paragraph;
                    paragraph.Inlines.InsertAfter((InlineUIContainer)var1, iUC);
                }
                else if (var2.GetType() == typeof(InlineUIContainer))
                {
                    Paragraph paragraph = obj as Paragraph;
                    paragraph.Inlines.InsertBefore((InlineUIContainer)var2, iUC);
                }
                else
                {
                    Paragraph paragraph = new Paragraph(iUC);
                    this.txtMessage.Document.Blocks.Add(paragraph);
                }
            }
        }
        #endregion

        #endregion

        #region 中部

        private void imgLeft_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.WBManage.PrevBoard();
            this.RefreshBoardIndex();
        }

        private void imgRight_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.WBManage.NextBoard();
            this.RefreshBoardIndex();
        }

        private void imgPen_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.boardTool.Visibility == Visibility.Hidden)
            {
                this.boardTool.Visibility = Visibility.Visible;
            }
            else
            {
                this.boardTool.Visibility = Visibility.Hidden;
            }
        }

        private void imgNew_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.WBManage.NewBoard();
            this.RefreshBoardIndex();
        }

        private void btnPrevBoard_Click(object sender, RoutedEventArgs e)
        {
            this.WBManage.PrevBoard();
            this.RefreshBoardIndex();
        }

        private void btnNextBoard_Click(object sender, RoutedEventArgs e)
        {
            this.WBManage.NextBoard();
            this.RefreshBoardIndex();
        }

        private void RefreshBoardIndex()
        {
            //this.lblBoardIndex.Text = string.Format("{0}/{1}", this.WBManage.CurrentBoardIndex + 1, this.WBManage.BoardCount);
        }

        private void BoardTool_OnThicknessClick(object sender, EventArgs e)
        {
            this.WBManage.Setthickness(Convert.ToDouble(sender));
        }

        private void BoardTool_OnPenCellClick(object sender, EventArgs e)
        {
            this.WBManage.SetColor(sender.ToString());
        }

        private void BoardTool_OnEraserClick(object sender, EventArgs e)
        {
            this.WBManage.EraserCheck = true;
        }

        private void BoardTool_OnPenClick(object sender, EventArgs e)
        {
            this.WBManage.PenCheck = true;
        }

        private void BoardTool_OnLightPenClick(object sender, EventArgs e)
        {
            this.WBManage.LightPenCheck = true;
        }

        private void BoardTool_OnShapeClick(object sender, EventArgs e)
        {
            this.WBManage.ShapeCheck = Convert.ToBoolean(sender);
        }

        private void rbShape_Click(object sender, RoutedEventArgs e)
        {
            this.WBManage.ShapeCheck = true;
        }

        private void BoardTool_OnShapeCellClick(object sender, EventArgs e)
        {
            if (sender.ToString().Equals("line"))
            {
                this.WBManage.LineCheck = true;
            }
            if (sender.ToString().Equals("triangle"))
            {
                this.WBManage.TriangleCheck = true;
            }
            if (sender.ToString().Equals("circle"))
            {
                this.WBManage.CircleCheck = true;
            }
        }

        private void BoardTool_OnBrushClick(object sender, EventArgs e)
        {
            this.WBManage.BrushCheck = true;
        }

        private void BoardTool_OnTextClick(object sender, EventArgs e)
        {
            this.WBManage.TextCheck = true;
        }
        #endregion
        
    }
}