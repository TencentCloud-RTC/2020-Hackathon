using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：水印效果帮助类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.03.04</para>
    /// </summary>
    public class WaterMarkHelp
    {
        private TextBox TextBox { get; set; }

        private ComboBox ComboBox { get; set; }

        private PasswordBox PasswordBox { get; set; }

        private TextBlock TextBlock { get; set; }

        public static WaterMarkHelp Init(TextBox textBox, TextBlock textBlock)
        {
            return new WaterMarkHelp(textBox, textBlock);
        }

        public static WaterMarkHelp Init(ComboBox comboBox, TextBlock textBlock)
        {
            return new WaterMarkHelp(comboBox, textBlock);
        }

        public static WaterMarkHelp Init(PasswordBox pwdBox, TextBlock textBlock)
        {
            return new WaterMarkHelp(pwdBox, textBlock);
        }

        private WaterMarkHelp(TextBox textBox, TextBlock textBlock)
        {
            this.TextBox = textBox;
            this.TextBlock = textBlock;
            this.TextBlock.MouseLeftButtonDown += TextBlock_MouseLeftButtonDown;
            this.TextBox.GotFocus += TextBox_GotFocus;
            this.TextBox.LostFocus += TextBox_LostFocus;
            this.TextBox.TextChanged += TextBox_TextChanged;
        }

        private WaterMarkHelp(ComboBox comboBox, TextBlock textBlock)
        {
            this.ComboBox = comboBox;
            this.TextBlock = textBlock;
            this.TextBlock.MouseLeftButtonDown += TextBlock_MouseLeftButtonDown;
            this.ComboBox.GotFocus += ComboBox_GotFocus;
            this.ComboBox.LostFocus += ComboBox_LostFocus;
        }

        private WaterMarkHelp(PasswordBox pwdBox, TextBlock textBlock)
        {
            this.PasswordBox = pwdBox;
            this.TextBlock = textBlock;
            this.TextBlock.MouseLeftButtonDown += TextBlock_MouseLeftButtonDown;
            this.PasswordBox.GotFocus += PasswordBox_GotFocus;
            this.PasswordBox.LostFocus += PasswordBox_LostFocus;
            this.PasswordBox.PasswordChanged += PasswordBox_PasswordChanged;
        }

        private void TextBlock_MouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (this.TextBox != null)
            {
                this.TextBox.Focus();
            }
            if (this.ComboBox != null)
            {
                this.ComboBox.Focus();
            }
            if (this.PasswordBox != null)
            {
                this.PasswordBox.Focus();
            }
        }

        private void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (this.TextBox.Text.Length == 0)
            {
                this.TextBlock.Visibility = Visibility.Visible;
            }
            else
            {
                this.TextBlock.Visibility = Visibility.Hidden;
            }
        }

        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (this.TextBox.Text.Length == 0)
            {
                this.TextBlock.Visibility = Visibility.Visible;
            }
            else
            {
                this.TextBlock.Visibility = Visibility.Hidden;
            }
        }

        private void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            this.TextBlock.Visibility = Visibility.Hidden;
        }

        private void ComboBox_GotFocus(object sender, RoutedEventArgs e)
        {
            this.TextBlock.Visibility = Visibility.Hidden;
        }

        private void ComboBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (this.ComboBox.Text.Length == 0)
            {
                this.TextBlock.Visibility = Visibility.Visible;
            }
            else
            {
                this.TextBlock.Visibility = Visibility.Hidden;
            }
        }

        private void PasswordBox_GotFocus(object sender, RoutedEventArgs e)
        {
            this.TextBlock.Visibility = Visibility.Hidden;
        }

        private void PasswordBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (this.PasswordBox.Password.Length == 0)
            {
                this.TextBlock.Visibility = Visibility.Visible;
            }
            else
            {
                this.TextBlock.Visibility = Visibility.Hidden;
            }
        }

        private void PasswordBox_PasswordChanged(object sender, RoutedEventArgs e)
        {
            this.SetLabelVisible(this.PasswordBox.Password);
        }

        private void SetLabelVisible(string text)
        {
            if (text.Length == 0)
            {
                this.TextBlock.Visibility = Visibility.Visible;
            }
            else
            {
                this.TextBlock.Visibility = Visibility.Hidden;
            }
        }
    }
}
