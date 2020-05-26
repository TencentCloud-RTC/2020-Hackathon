using IWshRuntimeLibrary;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
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
using YZCLASS.DBService;
using YZCLASS.UI.LiveRoom;

namespace YZCLASS.UI
{
    /// <summary>
    /// UserControl1.xaml 的交互逻辑
    /// </summary>
    public partial class ucCourseList : UserControl
    {
        dynamic queryCosResult;
        public BaseWindow Window { get; set; }
        // 引入样式文件
        public const string TemplateUri = "pack://application:,,,/YZCLASS.UI;component/Resource/Style/ChatContextMenuTemplate.xaml";

        public ucCourseList()
        {
            InitializeComponent();
            this.Loaded += UcCourseList_Loaded;
            Common.OnCourseCreated += Common_OnCourseCreated;
        }

        #region 加载...
        private void UcCourseList_Loaded(object sender, RoutedEventArgs e)
        {
            this.All_Loaded();
        }
        #endregion

        #region 跨域刷新
        private void Common_OnCourseCreated(object sender, EventArgs e)
        {
            DBService.DataResult ret = null;  //返回结果
            try
            {
                string dataStr = "";    //传入参数
                dataStr += "{";
                dataStr += "    \"appType\":\"" + "pc" + "\"";
                dataStr += "}";
                ret = Common.Db.Course.QueryCourseList(dataStr);
                if (ret.Success && ret.Result != null)
                {
                    LogHelp.WriteLog("课程列表加载中...");
                    // 我的课程
                    myCourse(ret.Result["my"]);
                }
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("课程列表加载异常：", ex);
            }
        }
        #endregion

        #region 课程列表加载
        public void All_Loaded()
        {
            Wait.Run(this, "", () =>
            {
                DBService.DataResult ret = null;  //返回结果
                    try
                {
                    string dataStr = "";    //传入参数
                    dataStr += "{";
                    dataStr += "    \"appType\":\"" + "pc" + "\"";
                    dataStr += "}";
                    ret = Common.Db.Course.QueryCourseList(dataStr);
                    if (ret.Success && ret.Result != null)
                    {
                        LogHelp.WriteLog("课程列表加载中...");
                            // 我的课程
                            myCourse(ret.Result["my"]);
                            queryCosResult = ret.Result["my"];
                           //string queryCosResult1 = ret.Result["my"];
                        LogHelp.WriteLog("课程列表加完成！");
                    }
                    else
                    {
                        DialogWindow.Message(null, "课程列表加载失败！");
                    }
                    LogHelp.WriteLog(ret.Message);
                }
                catch (Exception ex)
                {
                    LogHelp.WriteLog("课程列表加载异常：", ex);
                }
            });
        }

        #endregion

        #region 我的课程
        private void myCourse(dynamic list)
        {
            RowDefinition rowDefinition = null;
            ColumnDefinition columnDefinition = null;
            this.myCourseGrid.Children.Clear();
            foreach (var content in list)
            {
                rowDefinition = new RowDefinition();
                rowDefinition.Height = new GridLength(1, GridUnitType.Auto);
                this.myCourseGrid.RowDefinitions.Add(rowDefinition);
            }
            int i = 0;
            foreach (var content in list)
            {
                Grid gridRow1 = new Grid();
                Grid.SetRow(gridRow1, i);
                gridRow1.Background = new SolidColorBrush(Colors.Transparent);
                //gridRow1.MouseDown += GridRow1_MouseDown;
                if (!string.IsNullOrEmpty(content["courseNumber"].ToString()))
                {
                    string isTeacher = content["isTeacher"].ToString();

                    columnDefinition = new ColumnDefinition();
                    columnDefinition.Width = new GridLength(20.5, GridUnitType.Star);
                    gridRow1.ColumnDefinitions.Add(columnDefinition);
                    columnDefinition = new ColumnDefinition();
                    columnDefinition.Width = new GridLength(35.5, GridUnitType.Star);
                    gridRow1.ColumnDefinitions.Add(columnDefinition);
                    columnDefinition = new ColumnDefinition();
                    columnDefinition.Width = new GridLength(245, GridUnitType.Star);
                    gridRow1.ColumnDefinitions.Add(columnDefinition);

                    // 课程头像地址
                    System.Windows.Controls.Image image = new System.Windows.Controls.Image();
                    Grid.SetColumn(image, 1);
                    image.Stretch = Stretch.Uniform;
                    image.Margin = new Thickness(0, 8.5, 0, 8.5);
                    try
                    {
                        image.Source = ChatUtil.SwithImage(content["coverFileUrl"].ToString());
                    }
                    catch (Exception ex)
                    {
                        image.Source = new BitmapImage(new Uri("/YZCLASS.UI;component/Resource/Image/course-apply.png", UriKind.Relative));
                        LogHelp.WriteLog("我的课程->课程头像加载异常：", ex);
                    }
                    gridRow1.Children.Add(image);

                    StackPanel sp2 = new StackPanel();
                    sp2.Margin = new Thickness(7, 8.5, 7, 8.5);
                    Grid.SetColumn(sp2, 2);
                    sp2.HorizontalAlignment = HorizontalAlignment.Left;
                    sp2.VerticalAlignment = VerticalAlignment.Top;

                    // 课程名称
                    TextBlock textBlock = null;
                    textBlock = new TextBlock();
                    textBlock.Text = content["courseName"].ToString();
                    textBlock.FontSize = 12;
                    textBlock.FontFamily = new FontFamily("苹方 常规");
                    textBlock.Foreground = Common.GetColor("#727171");
                    textBlock.HorizontalAlignment = HorizontalAlignment.Left;
                    sp2.Children.Add(textBlock);

                    // 课程ID
                    textBlock = new TextBlock();
                    textBlock.Text = content["courseNumber"].ToString();
                    textBlock.FontSize = 9;
                    textBlock.FontFamily = new FontFamily("苹方 常规");
                    textBlock.Foreground = Common.GetColor("#B5B5B6");
                    textBlock.HorizontalAlignment = HorizontalAlignment.Left;
                    textBlock.Margin = new Thickness(0, 5.5, 0, 5.5);
                    sp2.Children.Add(textBlock);
                    gridRow1.Children.Add(sp2);
                    // 右键操作

                    /*ContextMenu contextMenu = new ContextMenu();
                    MenuItem menuItem = null;
                    ResourceDictionary dic = new ResourceDictionary { Source = new Uri(TemplateUri) };
                    contextMenu.Style = (Style)dic["contextMenuKey"];
                    menuItem = new MenuItem();
                    menuItem.Header = "进入课程";
                    menuItem.FontFamily = new FontFamily("苹方 常规");
                    menuItem.Tag = content["courseNumber"].ToString();
                    menuItem.Click += MenuItem_Click_Enter_Course;
                    contextMenu.Items.Add(menuItem);*/

                    /*menuItem = new MenuItem();
                    menuItem.Header = "注销课程";
                    menuItem.FontFamily = new FontFamily("苹方 常规");
                    menuItem.Tag = content["courseNumber"].ToString();
                    menuItem.Click += MenuItem_Click_Delete_Course;
                    contextMenu.Items.Add(menuItem);*/

                    /*gridRow1.ContextMenu = contextMenu;*/
                    gridRow1.Tag = content["courseNumber"].ToString();
                    gridRow1.MouseLeftButtonDown += MenuItem_Click_Enter_Course;
                    
                    this.myCourseGrid.Children.Add(gridRow1);
                    i++;
                }
            }
        }

        private void GridRow1_MouseDown(object sender, MouseButtonEventArgs e)
        {
            // < Grid Grid.Row = "1" Background = "#F0FAFF" >
            //throw new NotImplementedException();
        }

        #endregion

        #region 折叠切换
        private void Sp_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            StackPanel sp = sender as StackPanel;
            RowDefinition row = (sp.Parent as Grid).RowDefinitions[1];
            Image img = sp.Children[1] as Image;
            if (row.Height.Value == 0)
            {
                img.Width = 11.5;
                img.Height = 6;
                img.Source = new BitmapImage(new Uri("/Resource/Image/magepage-icon-arrow-down-pre.png", UriKind.Relative));
                row.Height = GridLength.Auto;
            }
            else
            {
                img.Width = 6;
                img.Height = 11.5;
                img.Source = new BitmapImage(new Uri("/Resource/Image/magepage-icon-arrow-right-on.png", UriKind.Relative));
                row.Height = new GridLength(0);
            }
        }
        #endregion 

        #region 进入课程
        private void MenuItem_Click_Enter_Course(object sender, RoutedEventArgs e)
        {
            /*MenuItem m = sender as MenuItem;*/
            Grid m = sender as Grid;
            LiveRoomWindow lrWindow = new LiveRoomWindow();
            string couseNumber = m.Tag.ToString();
            string couseName = "";
            string roomId = "";
            string chatroomId = "";
            foreach (var content in queryCosResult)
            { 
                if(content["courseNumber"] == couseNumber)
                {
                    couseName = content["courseName"];
                    roomId = content["liveRoomId"];
                    chatroomId = content["avchatRoomId"];
                }
            }

            lrWindow.CourseID = couseNumber;
            lrWindow.RoomId = roomId;
            lrWindow.CourseName = couseName;
            lrWindow.ChatGroupID = chatroomId;
            lrWindow.ShowDialog();

            //Course.CourseManage courseManage = new Course.CourseManage();
            //courseManage.CourseNumber = m.Tag.ToString();
            //courseManage.Show();
        }
        #endregion

    }
}
