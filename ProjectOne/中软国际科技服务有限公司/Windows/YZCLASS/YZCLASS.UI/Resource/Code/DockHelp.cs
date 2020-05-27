using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Media.Animation;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：停靠帮助类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.12.09</para>
    /// </summary>
    public class DockHelp
    {
        private Log _log = null;
        private Window Window { get; set; }
        private Timer _timer = null;

        private DockSide _dockSide = DockSide.None;
        private const double EdgePixel = 5;

        private DockHelp(Window window, DockSide dockSide)
        {
            this.Window = window;
            this.Window.WindowStartupLocation = WindowStartupLocation.Manual;
            _dockSide = dockSide;
            if (dockSide == DockSide.Left)
            {
                this.Window.Left = 1;
                this.Window.Top = (Screen.PrimaryScreen.Bounds.Height - 40 - this.Window.Height) / 2;
            }
            else if (dockSide == DockSide.Top)
            {
                this.Window.Left = (Screen.PrimaryScreen.Bounds.Width - this.Window.Width) / 2;
                this.Window.Top = 1;
            }
            else if (dockSide == DockSide.Right)
            {
                this.Window.Left = Screen.PrimaryScreen.Bounds.Width - this.Window.Width - 1;
                this.Window.Top = (Screen.PrimaryScreen.Bounds.Height - 40 - this.Window.Height) / 2;
            }
            _log = Log.GetLog(window.GetType());
            _timer = new Timer();
            _timer.Interval = 300;
            _timer.Tick += _timer_Tick;
            _timer.Start();
        }

        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="window">需要停靠的窗体对象</param>
        public static void Init(Window window, DockSide dockSide)
        {
            new DockHelp(window, dockSide);
        }

        private void _timer_Tick(object sender, EventArgs e)
        {
            bool showRange, hideRange;
            double sleft, stop, hleft, htop;

            //获取鼠标在屏幕上的位置
            double x = System.Windows.Forms.Form.MousePosition.X;
            double y = System.Windows.Forms.Form.MousePosition.Y;

            if (this.Window.Left <= DockHelp.EdgePixel)
            {
                _dockSide = DockSide.Left; //左边停靠
                showRange = (x <= DockHelp.EdgePixel) && (y >= this.Window.Top && y <= this.Window.Top + this.Window.Height);
                hideRange = (x > this.Window.Left + this.Window.Width) || (y < this.Window.Top || y > this.Window.Top + this.Window.Height);
                sleft = 1;
                stop = this.Window.Top;
                hleft = -this.Window.Width + DockHelp.EdgePixel;
                htop = this.Window.Top;
            }
            else if (this.Window.Top <= DockHelp.EdgePixel)
            {
                _dockSide = DockSide.Top; //顶部停靠
                showRange = (x >= this.Window.Left && x <= this.Window.Left + this.Window.Width) && (y <= DockHelp.EdgePixel);
                hideRange = (x < this.Window.Left || x > this.Window.Left + this.Window.Width) || (y > this.Window.Top + this.Window.Height);
                sleft = this.Window.Left;
                stop = 1;
                hleft = this.Window.Left;
                htop = -this.Window.Height + DockHelp.EdgePixel;
            }
            else if (this.Window.Left >= Screen.PrimaryScreen.Bounds.Width - this.Window.Width - 1)
            {
                _dockSide = DockSide.Right; //右边停靠
                showRange = (x >= Screen.PrimaryScreen.Bounds.Width - DockHelp.EdgePixel) && (y >= this.Window.Top && y <= this.Window.Top + this.Window.Height);
                hideRange = (x < this.Window.Left) || (y < this.Window.Top || y > this.Window.Top + this.Window.Height);
                sleft = Screen.PrimaryScreen.Bounds.Width - this.Window.Width - 1;
                stop = this.Window.Top;
                hleft = Screen.PrimaryScreen.Bounds.Width - DockHelp.EdgePixel;
                htop = this.Window.Top;
            }
            else
            {
                _dockSide = DockSide.None; //不停靠
                showRange = false;
                hideRange = false;
                sleft = this.Window.Left;
                stop = this.Window.Top;
                hleft = this.Window.Left;
                htop = this.Window.Top;
            }

            if (_dockSide > 0)
            {
                if (hideRange == true)
                {
                    this.Window.Left = hleft;
                    this.Window.Top = htop;
                }
                else if (showRange == true)
                {
                    this.Window.Left = sleft;
                    this.Window.Top = stop;
                }
            }
        }
    }

    /// <summary>
    /// <para>功能：停靠地方</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.12.10</para>
    /// </summary>
    public enum DockSide
    {
        /// <summary>
        /// 不停靠
        /// </summary>
        None = 0,
        /// <summary>
        /// 停靠到左边
        /// </summary>
        Left = 1,
        /// <summary>
        /// 停靠到顶部
        /// </summary>
        Top = 2,
        /// <summary>
        /// 停靠到右边
        /// </summary>
        Right = 3
    }
}
