using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：窗体基类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.11.14</para>
    /// </summary>
    public class BaseWindow : Window
    {
        protected Log Log
        {
            get
            {
                return Log.GetLog(this.GetType());
            }
        }
        
        /// <summary>
        /// 数据访问对象
        /// </summary>
        protected DBService.Data Db
        {
            get
            {
                return DBService.DBFactory.Create();
            }
        }

        protected virtual string SizeScale
        {
            get
            {
                return null;
            }
        }

        /// <summary>
        /// 当关闭时是否允许隐藏
        /// </summary>
        public virtual bool AllowHideOnClose
        {
            get { return true; }
        }

        public BaseWindow()
        {
            this.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            this.WindowStyle = WindowStyle.None;
            this.ResizeMode = ResizeMode.CanResizeWithGrip;
            this.AllowsTransparency = true;
            this.Loaded += BaseWindow_Loaded;
        }

        private void BaseWindow_Loaded(object sender, RoutedEventArgs e)
        {
            //屏蔽自适应功能
            //this.ResizeWindow();
        }

        private void ResizeWindow()
        {
            if (string.IsNullOrWhiteSpace(this.SizeScale) == true)
                return;

            int W, H;
            try
            {
                string[] wh = this.SizeScale.Split(':');
                W = int.Parse(wh[0].Trim());
                H = int.Parse(wh[1].Trim());
            }
            catch
            {
                W = 4;
                H = 3;
            }
            int h = Screen.PrimaryScreen.Bounds.Height - 40 - 30 * 2;
            this.Height = h;
            this.Width = (int)(W * 1.0 * h / H);
            this.Left = (Screen.PrimaryScreen.Bounds.Width - this.Width) * 1.0 / 2;
            this.Top = ((Screen.PrimaryScreen.Bounds.Height - 40) - this.Height) * 1.0 / 2;
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            e.Cancel = true;
            this.Hide();
        }
    }
}
