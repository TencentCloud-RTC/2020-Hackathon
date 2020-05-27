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
using System.Windows.Shapes;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：对话框(共通)</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.11.21</para>
    /// </summary>
    public partial class DialogWindow : Window
    {
        private DialogWindow()
        {
            InitializeComponent();
            this.topBorder.MouseMove += MessageWindow_MouseMove;
        }

        /// <summary>
        /// 显示消息对话框
        /// </summary>
        /// <param name="owner">拥有对话框的窗体(即模态)</param>
        /// <param name="text">显示的文本内容</param>
        /// <returns>只有确定才返回True</returns>
        public static bool Message(Window owner, string text)
        {
            return Show(owner, null, text);
        }

        /// <summary>
        /// 显示消息对话框
        /// </summary>
        /// <param name="owner">拥有对话框的窗体(即模态)</param>
        /// <param name="title">显示的标题</param>
        /// <param name="text">显示的文本内容</param>
        /// <returns>只有确定才返回True</returns>
        public static bool Message(Window owner, string title, string text)
        {
            return Show(owner, title, text);
        }

        /// <summary>
        /// 显示确认对话框
        /// </summary>
        /// <param name="owner">拥有对话框的窗体(即模态)</param>
        /// <param name="text">显示的文本内容</param>
        /// <returns>只有确定才返回True</returns>
        public static bool Confirm(Window owner, string text)
        {
            return Show(owner, null, text, true);
        }

        /// <summary>
        /// 显示确认对话框
        /// </summary>
        /// <param name="owner">拥有对话框的窗体(即模态)</param>
        /// <param name="title">显示的标题</param>
        /// <param name="text">显示的文本内容</param>
        /// <returns>只有确定才返回True</returns>
        public static bool Confirm(Window owner, string title, string text)
        {
            return Show(owner, title, text, true);
        }

        private static bool Show(Window owner, string title, string text, bool isConfirm = false)
        {
            DialogWindow msg = new DialogWindow();
            msg.Owner = owner;
            if (string.IsNullOrEmpty(title) == false)
            {
                msg.lblTitle.Text = title;
            }
            msg.lblText.Text = text;
            if (isConfirm == true)
            {
                msg.bdCancel.Visibility = Visibility.Visible;
            }
            else
            {
                msg.bdCancel.Visibility = Visibility.Collapsed;
            }
            bool? ret = msg.ShowDialog();
            return ret == true;
        }

        private void MessageWindow_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                this.DragMove();
            }
        }

        private void Ok_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.CloseThis(true);
        }

        private void Cancel_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.CloseThis(false);
        }

        private void lblClose_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.CloseThis(false);
        }

        private void CloseThis(bool result)
        {
            this.DialogResult = result;
            this.Close();
        }
    }
}
