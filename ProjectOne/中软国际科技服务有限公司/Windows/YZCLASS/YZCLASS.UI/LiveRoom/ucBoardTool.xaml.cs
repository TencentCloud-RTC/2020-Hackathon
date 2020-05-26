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

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// ucBoardTool.xaml 的交互逻辑
    /// </summary>
    public partial class ucBoardTool : UserControl
    {
        public event EventHandler OnEraserClick;
        public event EventHandler OnPenClick;
        public event EventHandler OnLightPenClick;
        public event EventHandler OnTextClick;
        public event EventHandler OnThicknessClick;
        public event EventHandler OnPenCellClick;
        public event EventHandler OnShapeClick;
        public event EventHandler OnShapeCellClick;
        public event EventHandler OnBrushClick;

        public ucBoardTool()
        {
            InitializeComponent();
        }

        private void imgText_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.OnTextClick != null)
            {
                this.OnTextClick(null, null);
            }
        }

        private void imgShape_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.imgShape.Tag.ToString().Equals("0"))
            {
                this.imgShape.Tag = "1";
                this.imgShape.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-hua-on.png");
                this.shapeGrid.Visibility = Visibility.Visible;
                this.cellGrid.Visibility = Visibility.Hidden;
                if (this.OnShapeClick != null)
                {
                    this.OnShapeClick(true, null);
                }
            }
            else
            {
                this.imgShape.Tag = "0";
                this.imgShape.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-hua.png");
                this.shapeGrid.Visibility = Visibility.Hidden;
                this.cellGrid.Visibility = Visibility.Visible;
                if (this.OnShapeClick != null)
                {
                    this.OnShapeClick(false, null);
                }
            }
        }

        private void imgEraser_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.imgEraser.Tag.ToString().Equals("0"))
            {
                this.imgEraser.Tag = "1";
                this.imgEraser.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-rubber-on.png");
                this.imgPen.Tag = "0";
                this.imgPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-mixpen.png");
                this.imgLightPen.Tag = "0";
                this.imgLightPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-big-pen.png");
                this.imgText.Tag = "0";
                this.imgText.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-text.png");
                this.imgBrush.Tag = "0";
                this.imgBrush.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-cle.png");
            }
            if (this.OnEraserClick != null)
            {
                this.OnEraserClick(sender, e);
            }
        }

        private void imgPen_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.imgPen.Tag.ToString().Equals("0"))
            {
                this.imgEraser.Tag = "0";
                this.imgEraser.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-rubber.png");
                this.imgPen.Tag = "1";
                this.imgPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-mixpen-on.png");
                this.imgLightPen.Tag = "0";
                this.imgLightPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-big-pen.png");
                this.imgText.Tag = "0";
                this.imgText.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-text.png");
                this.imgBrush.Tag = "0";
                this.imgBrush.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-cle.png");
            }
            if (this.OnPenClick != null)
            {
                this.OnPenClick(sender, e);
            }
        }

        private void imgLightPen_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.imgLightPen.Tag.ToString().Equals("0"))
            {
                this.imgEraser.Tag = "0";
                this.imgEraser.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-rubber.png");
                this.imgPen.Tag = "0";
                this.imgPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-mixpen.png");
                this.imgLightPen.Tag = "1";
                this.imgLightPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-big-pen-pre.png");
                this.imgText.Tag = "0";
                this.imgText.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-text.png");
                this.imgBrush.Tag = "0";
                this.imgBrush.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-cle.png");
            }
            if (this.OnLightPenClick != null)
            {
                this.OnLightPenClick(sender, e);
            }
        }

        private void imgBrush_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.imgBrush.Tag.ToString().Equals("0"))
            {
                this.imgEraser.Tag = "0";
                this.imgEraser.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-rubber.png");
                this.imgPen.Tag = "0";
                this.imgPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-mixpen.png");
                this.imgLightPen.Tag = "0";
                this.imgLightPen.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-big-pen.png");
                this.imgText.Tag = "0";
                this.imgText.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-text.png");
                this.imgBrush.Tag = "1";
                this.imgBrush.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-cle-on.png");
            }
            if (this.OnBrushClick != null)
            {
                this.OnBrushClick(null, null);
            }
        }

        private void ThicknessCellClick(object sender, MouseButtonEventArgs e)
        {
            Border border = sender as Border;
            if (this.OnThicknessClick != null)
            {
                this.OnThicknessClick(Convert.ToDouble(border.Tag.ToString()), null);
            }
        }

        private void PenCellClick(object sender, MouseButtonEventArgs e)
        {
            Border border = sender as Border;
            if (this.OnPenCellClick != null)
            {
                this.OnPenCellClick(border.Tag.ToString(), null);
            }
        }

        private void ShapeCellClick(object sender, MouseButtonEventArgs e)
        {
            TextBlock lbl = sender as TextBlock;
            if (this.OnShapeCellClick != null)
            {
                this.OnShapeCellClick(lbl.Tag.ToString(), null);
            }
        }
    }
}
