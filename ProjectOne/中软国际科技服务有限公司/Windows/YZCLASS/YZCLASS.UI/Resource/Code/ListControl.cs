using IWshRuntimeLibrary;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：列表控件类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.11.04</para>
    /// </summary>
    public class ListControl
    {
        public const string ColNameTypeValue = "TypeValue";
        public const string ColNameTypeName = "TypeName";
        public const string ColNameValue = "Value";
        public const string ColNameName = "Name";

        public event EventHandler<ItemClickArgs> ItemClick = null;

        public BaseWindow Window { get; set; }

        private Grid ListGrid { get; set; }
        private Grid DataGrid { get; set; }

        public ListControl(Grid listGrid)
        {
            this.ListGrid = listGrid;
            this.ListGrid.Children.Clear();
            ScrollViewer sv = new ScrollViewer();
            this.ListGrid.Children.Add(sv);
            this.DataGrid = new Grid();
            sv.Content = this.DataGrid;
        }

        public void BindData(DataTable typeTable, DataTable itemTable)
        {

            ContextMenu menu = null;
            MenuItem item = null;

            menu = new ContextMenu();
            menu.Tag = "";
            item = new MenuItem();
            item.Header = "进入课程";
            item.Click += openCourse;
            menu.Items.Add(item);
            
            item.Header = "注销课程(有角色判断)";
            menu.Items.Add(item);

            RowDefinition grow = null;
            Grid grid = null;
            Grid grid2 = null;
            DataRow[] rows = null;
            StackPanel sp = null;
            StackPanel sp2 = null;
            TextBlock lbl = null;
            System.Windows.Controls.Image img = null;
            foreach (DataRow row in typeTable.Rows)
            {
                grow = new RowDefinition();
                grow.Height = new GridLength(1, GridUnitType.Auto);
                this.DataGrid.RowDefinitions.Add(grow);
                grid = new Grid();
                grow = new RowDefinition();
                grow.Height = new GridLength(1, GridUnitType.Auto);
                grid.RowDefinitions.Add(grow);
                Grid.SetRow(grid, typeTable.Rows.IndexOf(row));
                this.DataGrid.Children.Add(grid);
                grow = new RowDefinition();
                //grow.Height = new GridLength(1, GridUnitType.Auto);
                grow.Height = new GridLength(0);
                grid.RowDefinitions.Add(grow);
                sp = new StackPanel();
                sp.Orientation = Orientation.Horizontal;
                sp.VerticalAlignment = VerticalAlignment.Center;
                sp.Margin = new Thickness(0, 10, 0, 10);
                sp.MouseLeftButtonDown += Sp_MouseLeftButtonDown1;
                lbl = new TextBlock();
                lbl.Text = row[ListControl.ColNameTypeName].ToString();
                lbl.FontSize = 14;
                lbl.Foreground = Common.GetColor("#595757");
                sp.Children.Add(lbl);
                lbl = new TextBlock();
                lbl.Width = 0;
                lbl.Text = row[ListControl.ColNameTypeValue].ToString();
                lbl.FontSize = 16;
                lbl.Visibility = Visibility.Hidden;
                sp.Children.Add(lbl);
                lbl = new TextBlock();
                lbl.Width = 20;
                sp.Children.Add(lbl);
                img = new System.Windows.Controls.Image();
                img.Margin = new Thickness(0, 1, 0, 0);
                img.Width = 8;
                img.Height = 16;
                img.Source = new BitmapImage(new Uri("/Resource/Image/magepage-icon-arrow-right-on.png", UriKind.Relative));
                sp.Children.Add(img);
                grid.Children.Add(sp);

                grid2 = new Grid();
                Grid.SetRow(grid2, 1);
                grid.Children.Add(grid2);
                rows = itemTable.Select(string.Format("{0}='{1}'", ListControl.ColNameTypeValue, row[ListControl.ColNameTypeValue]));
                for (int i = 0; i < rows.Length; i++)
                {
                    DataRow row2 = rows[i];
                    grow = new RowDefinition();
                    grow.Height = new GridLength(1, GridUnitType.Auto);
                    grid2.RowDefinitions.Add(grow);
                    sp = new StackPanel();
                    Grid.SetRow(sp, i);
                    sp.Orientation = Orientation.Horizontal;
                    sp.Margin = new Thickness(20, 5, 0, 0);
                    sp.Background = new SolidColorBrush(Colors.Transparent);
                    sp.MouseLeftButtonDown += Sp_MouseLeftButtonDown;
                    grid2.Children.Add(sp);
                    img = new System.Windows.Controls.Image();
                    img.Width = 30;
                    img.Height = 30;
                    img.Source = new BitmapImage(new Uri("/Resource/Image/-s-loding-user.png", UriKind.Relative));
                    sp.Children.Add(img);
                    sp2 = new StackPanel();
                    sp2.VerticalAlignment = VerticalAlignment.Center;
                    sp2.Margin = new Thickness(10, 0, 0, 0);
                    sp.Children.Add(sp2);
                    lbl = new TextBlock();
                    lbl.Text = row2[ListControl.ColNameName].ToString();
                    lbl.FontSize = 12;
                    lbl.Foreground = Common.GetColor("#727171");
                    lbl.ContextMenu = menu;
                    sp2.Children.Add(lbl);
                    lbl = new TextBlock();
                    lbl.Text = row2[ListControl.ColNameValue].ToString();
                    lbl.FontSize = 9;
                    lbl.Foreground = Common.GetColor("#CCCBCB");
                    sp2.Children.Add(lbl);
                }
            }
        }

        private void openCourse(object sender, RoutedEventArgs e)
        {
            // 居中
            /*Course.CourseManage.Instance.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            Course.CourseManage.Instance.Show();*/
            if (this.Window != null)
            {
                this.Window.WindowState = WindowState.Minimized;
            }
        }
       
        private void Sp_MouseLeftButtonDown1(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            StackPanel sp = sender as StackPanel;
            System.Windows.Controls.Image img = sp.Children[3] as System.Windows.Controls.Image;
            Grid grid = sp.Parent as Grid;
            if (grid.RowDefinitions[1].Height.Value > 0)
            {
                img.Width = 8;
                img.Height = 16;
                img.Source = new BitmapImage(new Uri("/Resource/Image/magepage-icon-arrow-right-on.png", UriKind.Relative));
                grid.RowDefinitions[1].Height = new GridLength(0);
            }
            else
            {
                img.Width = 16;
                img.Height = 8;
                img.Source = new BitmapImage(new Uri("/Resource/Image/magepage-icon-arrow-down-pre.png", UriKind.Relative));
                grid.RowDefinitions[1].Height = new GridLength(1, GridUnitType.Auto);
            }
        }

        private void Sp_MouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            ItemClickArgs args = new ItemClickArgs();
            StackPanel sp = sender as StackPanel;
            TextBlock lbl = (sp.Children[1] as StackPanel).Children[1] as TextBlock;
            args.Value = lbl.Text;
            lbl = (sp.Children[1] as StackPanel).Children[0] as TextBlock;
            args.Name = lbl.Text;
            StackPanel sp2 = ((sp.Parent as Grid).Parent as Grid).Children[0] as StackPanel;
            lbl = sp2.Children[0] as TextBlock;
            args.TypeName = lbl.Text;
            lbl = sp2.Children[1] as TextBlock;
            args.TypeValue = lbl.Text;

            if (this.ItemClick != null)
            {
                this.ItemClick(sender, args);
            }
        }

        public void AppendChild(UIElement child)
        {
            RowDefinition grow = new RowDefinition();
            grow.Height = new GridLength(1, GridUnitType.Auto);
            this.DataGrid.RowDefinitions.Add(grow);
            Grid.SetRow(child, this.DataGrid.Children.Count);
            this.DataGrid.Children.Add(child);
        }
    }

    public class ItemClickArgs : EventArgs
    {
        public string TypeValue { get; set; }

        public string TypeName { get; set; }

        public string Value { get; set; }

        public string Name { get; set; }

        public string SelfSignature { get; set; }

        public string Id { get; set; }

        public string FaceUrl { get; set; }
    }
}
