using log4net;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using YZCLASS.DBService;

namespace YZCLASS.UI
{
    /// <summary>
    /// App.xaml 的交互逻辑
    /// </summary>
    public partial class App : Application
    {
        private System.Windows.Forms.Timer _timer = null;
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            //安装字体
            try
            {
                FontHelp.InstallFont(Environment.CurrentDirectory + "\\fonts\\PingFang Regular.ttf");
                FontHelp.InstallFont(Environment.CurrentDirectory + "\\fonts\\PingFang Bold.ttf");
                FontHelp.InstallFont(Environment.CurrentDirectory + "\\fonts\\PingFang Light.ttf");
                FontHelp.InstallFont(Environment.CurrentDirectory + "\\fonts\\PingFang Medium.ttf");
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("字体安装失败！", ex);
            }

            // 初始化SDK的 Local 配置信息
            DataManager.GetInstance().InitConfig();
            Common.RegisteCourseCreated();   //注册跨域刷新时间
            //Common.RegisteCourseApplied();

            _timer = new System.Windows.Forms.Timer();
            _timer.Interval = 1000;
            _timer.Tick += _timer_Tick;
            _timer.Start();

            Window window = null;
            window = new LoginWindow();
            window.Show();
        }

        private void _timer_Tick(object sender, EventArgs e)
        {
            try
            {
                String courseDir = Environment.CurrentDirectory + "\\tempfile\\courses\\";
                if (false == System.IO.Directory.Exists(courseDir))
                {
                    //创建pic文件夹
                    System.IO.Directory.CreateDirectory(courseDir);
                }

                //实例化一个DirectoryInfo的对象
                DirectoryInfo dInfo = new DirectoryInfo(courseDir);

                FileInfo[] files = dInfo.GetFiles();
                if (files.Length > 0)
                {
                    foreach (Process p in Process.GetProcesses())
                    {
                        if (p.ProcessName.Contains("OutCourseLnk"))
                        {
                            p.Kill();
                            p.WaitForExit(); // possibly with a timeout
                        }
                    }

                    string courseNumber = files.First().Name;

                    string dataStr = "";    //传入参数
                    dataStr += "{";
                    dataStr += "    \"appType\":\"" + "pc" + "\"";
                    dataStr += "}";
                    DataResult ret = Common.Db.Course.QueryCourseList(dataStr);

                    if (ret.Success == true && ret.Result != null && ret.Result["my"] != null)
                    {
                        bool isExists = false;
                        foreach (var content in ret.Result["my"])
                        {
                            if (content["courseNumber"].ToString().Equals(courseNumber))
                            {
                                isExists = true;
                            }
                        }
                        if (isExists)
                        {
                            //_timer.Stop();
                            /*Course.CourseManage courseManage = new Course.CourseManage();
                            courseManage.CourseNumber = courseNumber;
                            courseManage.Show();*/
                        }
                    }
                    //删除文件
                    foreach (var file in files)
                    {
                        File.Delete(dInfo + file.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("_timer_Tick.Error", ex);
            }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            // 退出程序前写入最新的 Local 配置信息。
            DataManager.GetInstance().Uninit();
            DataManager.GetInstance().Dispose();
            base.OnExit(e);
        }

        ~App()
        {

            System.Environment.Exit(0);
            System.Diagnostics.Process.GetCurrentProcess().Kill();
        }
    }
}
