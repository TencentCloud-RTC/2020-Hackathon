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

namespace YZCLASS.UI
{
    /// <summary>
    /// TopBar.xaml 的交互逻辑
    /// </summary>
    public partial class TopBar : UserControl
    {
        private BaseWindow ParentWindow { get; set; }

        public event EventHandler OnClosed = null;

        public TopBar()
        {
            InitializeComponent();
            this.Loaded += TopBar_Loaded;
        }

        private void TopBar_Loaded(object sender, RoutedEventArgs e)
        {
            int level = 8;
            FrameworkElement parent = this.Parent as FrameworkElement;
            for (int i = 0; i < level; i++) //向上搜索level层
            {
                if (parent == null)
                    break;
                if (parent is BaseWindow)
                {
                    this.ParentWindow = parent as BaseWindow;
                    break;
                }
                else
                {
                    parent = parent.Parent as FrameworkElement;
                }
            }
        }

        private void UserControl_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                if (this.ParentWindow != null)
                {
                    this.ParentWindow.DragMove();
                }
            }
        }

        private void btnMin_Click(object sender, MouseButtonEventArgs e)
        {
            if (this.ParentWindow != null)
            {
                this.ParentWindow.WindowState = WindowState.Minimized;
            }
        }

        private void btnClose_Click(object sender, MouseButtonEventArgs e)
        {
            if (this.ParentWindow != null)
            {
                if (this.ParentWindow.AllowHideOnClose == true)
                {
                    this.ParentWindow.Close();
                }
                else
                {
                    this.ParentWindow.Hide();
                    Environment.Exit(0);
                }
            }
            if (this.OnClosed != null)
            {
                this.OnClosed(sender, e);
            }
        }
    }
}
