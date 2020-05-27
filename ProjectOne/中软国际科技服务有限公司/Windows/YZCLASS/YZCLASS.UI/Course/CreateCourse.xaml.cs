using COSXML.Model.Object;
using COSXML.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using ThoughtWorks.QRCode.Codec;
using YZCLASS.DBService;
using YZCLASS.UI.LiveRoom;

namespace YZCLASS.UI.Course
{
    /// <summary>
    /// CreateCourse.xaml 的交互逻辑
    /// </summary>
    public partial class CreateCourse : BaseWindow
    {
        public static event EventHandler OnCourseCreated;
        /// <summary>
        /// 标签
        /// </summary>
        public List<string> strList;
        private string mCourseID;
        private string mRoomId;
        private string mCourseName;
        private string mChatGroupID;


        public CreateCourse()
        {
            InitializeComponent();
            this.ucButton1.OnNext += UcButton1_OnNext;
            this.ucButton5.OnNext += UcButton5_OnNext;
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            e.Cancel = true;
            this.Hide();
        }

        private BitmapImage BitmapToBitmapImage(System.Drawing.Bitmap bitmap)
        {
            BitmapImage bitmapImage = new BitmapImage();
            using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
            {
                bitmap.Save(ms, bitmap.RawFormat);
                bitmapImage.BeginInit();
                bitmapImage.StreamSource = ms;
                bitmapImage.CacheOption = BitmapCacheOption.OnLoad;
                bitmapImage.EndInit();
                bitmapImage.Freeze();
            }
            return bitmapImage;
        }

        private void UcButton1_OnNext(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(this.ucBaseInformation.courseName.Text.Trim()))
            {
                DialogWindow.Message(this, "请输入课程名称");
                return;
            }
            if (this.ucBaseInformation.courseDescription.Text.Trim().Length>600)
            {
                DialogWindow.Message(this, "课程描述超过600字符");
                return;
            }
            
           string courseName = this.ucBaseInformation.CourseName;//课程名称
            string courseDescription = this.ucBaseInformation.CourseDescription;//课程描述       
            try
            {
                Wait.Run(this, "正在创建课程中...", () =>
                {
                    string dataStr = "";    //传入参数
                    DataResult ret = null;  //返回结果
                    #region 接口测试 - 创建课程
                    dataStr += "{";
                    dataStr += "    \"courseName\":\"" + courseName + "\",";
                    dataStr += "    \"courseDes\":\"" + courseDescription +"\"";
                    dataStr += "}";
                    ret = base.Db.Course.createCourse(dataStr);
                    
                    if (ret.Success == true && ret.Result != null)
                    {
                        this.ucButton1.Visibility = Visibility.Hidden;
                        this.ucButton5.Visibility = Visibility.Visible;
                        this.mCourseID = ret.Result["courseNumber"].ToString();
                        this.mRoomId = ret.Result["liveRoomId"].ToString();
                        this.mCourseName = courseName;
                        this.mChatGroupID = ret.Result["avchatRoomId"].ToString();
                        //刷新主页面事件
                        if (CreateCourse.OnCourseCreated != null)
                        {
                            CreateCourse.OnCourseCreated(null, null);
                        }
                    }
                    else
                    {
                        DialogWindow.Message(this, "创建课程失败!");
                        return;
                    }

                        #endregion
                });
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("创建课程异常:",ex);
            }
        }


        private void UcButton5_OnNext(object sender, EventArgs e)
        {
            this.Close();
            LiveRoomWindow lrWindow = new LiveRoomWindow();
            lrWindow.CourseID = this.mCourseID;
            lrWindow.RoomId = this.mRoomId; 
            lrWindow.CourseName = this.mCourseName;
            lrWindow.ChatGroupID = this.mChatGroupID;
            lrWindow.ShowDialog();
        }
    }
}
