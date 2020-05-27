using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace YZCLASS.UI
{
    /// <summary>
    /// LoadingWindow.xaml 的交互逻辑
    /// </summary>
    public partial class LoadingWindow : Window
    {
        private ContentControl Control { get; set; }

        private Action Action { get; set; }

        private BackgroundWorker Worker { get; set; }

        public LoadingWindow(ContentControl control, Action action)
        {
            InitializeComponent();
            this.Control = control;
            this.Action = action;
            this.Worker = new BackgroundWorker();
            this.Worker.DoWork += Worker_DoWork;
            this.Worker.RunWorkerCompleted += Worker_RunWorkerCompleted;
            this.Loaded += LoadingWindow_Loaded;
        }

        private void LoadingWindow_Loaded(object sender, RoutedEventArgs e)
        {
            this.Width = this.sp.ActualWidth + 40;
            this.Left = Screen.PrimaryScreen.Bounds.Width / 2.0 - this.Width / 2.0;
            if (this.Worker.IsBusy == false)
            {
                this.Worker.RunWorkerAsync();
            }
        }

        private void Worker_DoWork(object sender, DoWorkEventArgs e)
        {
            if (this.Action != null)
            {
                this.Control.Dispatcher.Invoke(() =>
                {
                    this.Action();
                });
            }
        }

        private void Worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            this.Close();
        }

        public void SetDisplayText(string desc)
        {
            if (String.IsNullOrEmpty(desc) == false)
            {
                this.Dispatcher.Invoke(new Action(() =>
                {
                    this.message.Content = desc;
                }));
            }
        }
    }

    /// <summary>
    /// <para>功能：等待效果类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.04.13</para>
    /// </summary>
    public class Wait
    {
        /// <summary>
        /// 执行需等待的方法
        /// </summary>
        /// <param name="control">当前Window或UserControl对象</param>
        /// <param name="action">执行的方法</param>
        public static void Run(ContentControl control, Action action)
        {
            Wait.Run(control, "正在加载数据...", action);
        }

        /// <summary>
        /// 执行需等待的方法
        /// </summary>
        /// <param name="control">当前Window或UserControl对象</param>
        /// <param name="message">等待时显示的提示内容</param>
        /// <param name="action">执行的方法</param>
        public static void Run(ContentControl control, string message, Action action)
        {
            LoadingWindow loading = new LoadingWindow(control, action);
            loading.SetDisplayText(message);
            loading.ShowDialog();
            loading.Close();
        }
    }
}
