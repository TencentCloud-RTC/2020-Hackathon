using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：顶部选项卡类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期： 2020.01.17</para>
    /// </summary>
    public class TopTab
    {
        private Grid TopGrid { get; set; }
        private Grid ContentGrid { get; set; }

        private TopTab(Grid topGrid, Grid contentGrid)
        {
            this.TopGrid = topGrid;
            this.ContentGrid = contentGrid;
            Border border = null;
            for (int i = 0; i < this.TopGrid.Children.Count; i++)
            {
                border = this.TopGrid.Children[i] as Border;
                if (border != null)
                {
                    border.Tag = i.ToString();
                    border.MouseLeftButtonDown += TabClick;
                }
            }
        }

        public static void Init(Grid topGrid, Grid contentGrid)
        {
            new TopTab(topGrid, contentGrid);
        }

        private void TabClick(object sender, MouseButtonEventArgs e)
        {
            Border curBorder = sender as Border;
            int index = Convert.ToInt32(curBorder.Tag);
            Border border = null;
            TextBlock lbl = null;
            UIElement ui = null;
            for (int i = 0; i < this.TopGrid.Children.Count; i++)
            {
                border = this.TopGrid.Children[i] as Border;
                lbl = border.Child as TextBlock;
                if (i == index) //选中状态
                {
                    border.Background = Common.GetColor(Colors.White);
                    lbl.Foreground = Common.GetColor("#2CA6E0");
                }
                else //未选中状态
                {
                    border.Background = Common.GetColor(Colors.Transparent);
                    lbl.Foreground = Common.GetColor("#595757");
                }
                ui = this.ContentGrid.Children[i];
                ui.Visibility = (i == index ? Visibility.Visible : Visibility.Hidden);
            }
        }
    }
}
