using Aspose.Words.Saving;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// <para>功能：白板管理类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.03.14</para>
    /// </summary>
    public class WhiteBoardManage
    {
        #region Checked属性
        private bool _penCheck = true;
        public bool PenCheck
        {
            get
            {
                return _penCheck;
            }
            set
            {
                _penCheck = value;
                if (value == true)
                {
                    this.CurrentCanvas.DefaultDrawingAttributes.StylusTipTransform = new Matrix();
                    this.CurrentCanvas.EditingMode = InkCanvasEditingMode.Ink;
                }
            }
        }

        public bool LightPenCheck
        {
            set
            {
                this.CurrentCanvas.DefaultDrawingAttributes.IsHighlighter = value;
                if (value == true)
                {
                    this.CurrentCanvas.DefaultDrawingAttributes.StylusTipTransform = new Matrix();
                    this.CurrentCanvas.EditingMode = InkCanvasEditingMode.Ink;
                }
            }
        }

        public bool BrushCheck
        {
            set
            {
                if (value == true)
                {
                    this.CurrentCanvas.EditingMode = InkCanvasEditingMode.Ink;
                    this.CurrentCanvas.DefaultDrawingAttributes.StylusTipTransform = new Matrix(0, 1, 1, 5, 0, 0);
                }
            }
        }

        private bool _eraserCheck = false;
        public bool EraserCheck
        {
            get
            {
                return _eraserCheck;
            }
            set
            {
                _eraserCheck = value;
                if (value == true)
                {
                    this.CurrentCanvas.DefaultDrawingAttributes.StylusTipTransform = new Matrix();
                    this.CurrentCanvas.EditingMode = InkCanvasEditingMode.EraseByStroke;
                }
            }
        }

        private bool _shapeCheck = false;
        public bool ShapeCheck
        {
            get
            {
                return _shapeCheck;
            }
            set
            {
                _shapeCheck = value;
                this.CurrentCanvas.EditingMode = InkCanvasEditingMode.None;
            }
        }

        private bool _lineCheck = true;
        public bool LineCheck
        {
            get
            {
                return _lineCheck;
            }
            set
            {
                _lineCheck = value;
                this.line_Click(null, null);
            }
        }

        private bool _circleCheck = false;
        public bool CircleCheck
        {
            get
            {
                return _circleCheck;
            }
            set
            {
                _circleCheck = value;
                this.circle_Click(null, null);
            }
        }

        private bool _triangleCheck = false;
        public bool TriangleCheck
        {
            get
            {
                return _triangleCheck;
            }
            set
            {
                _triangleCheck = value;
                this.triangle_Click(null, null);
            }
        }

        private bool _textCheck = false;
        public bool TextCheck
        {
            get
            {
                return _textCheck;
            }
            set
            {
                _textCheck = value;
                if (value == true)
                {
                    this.CurrentCanvas.EditingMode = InkCanvasEditingMode.None;
                    this.text_Click(null, null);
                }
            }
        }
        #endregion

        public int BoardCount
        {
            get { return this.BoardContainer.Children.Count; }
        }

        public int CurrentBoardIndex { get; set; }

        private Grid BoardContainer { get; set; }

        private StackPanel FilePanel { get; set; }

        private StackPanel FilePagePanel { get; set; }

        private InkCanvas CurrentCanvas
        {
            get { return (this.BoardContainer.Children[this.CurrentBoardIndex] as ScrollViewer).Content as InkCanvas; }
        }

        private Image CurrentFileImage
        {
            get { return this.CurrentCanvas.Children[0] as Image; }
        }

        public WhiteBoardManage(Grid boardContainer, StackPanel filePanel, StackPanel filePagePanel)
        {
            this.BoardContainer = boardContainer;
            this.FilePanel = filePanel;
            this.FilePagePanel = filePagePanel;
            this.NewBoard();
        }

        public void NewBoard()
        {
            ScrollViewer sv = new ScrollViewer();
            sv.VerticalScrollBarVisibility = ScrollBarVisibility.Auto;
            this.BoardContainer.Children.Add(sv);
            InkCanvas canv = new InkCanvas();
            canv.DefaultDrawingAttributes.IgnorePressure = false;
            canv.DefaultDrawingAttributes.Color = Colors.Black;
            canv.PreviewMouseMove += inkcanvas_MouseMove;
            canv.PreviewMouseUp += inkcanvas_MouseUp;
            canv.PreviewMouseDown += inkcanvas_MouseDown;
            sv.Content = canv;
            Image img = new Image();
            img.HorizontalAlignment = HorizontalAlignment.Center;
            img.Stretch = System.Windows.Media.Stretch.None;
            img.Margin = new Thickness(1, 1, 1, 1);
            canv.Children.Add(img);
            this.ShowBoard(this.BoardContainer.Children.Count - 1);
        }

        public void Setthickness(double num)
        {
            this.CurrentCanvas.DefaultDrawingAttributes.Width = num;
            this.CurrentCanvas.DefaultDrawingAttributes.Height = num;
        }

        public void SetColor(string value)
        {
            this.CurrentCanvas.DefaultDrawingAttributes.Color = (Color)ColorConverter.ConvertFromString(value);
        }

        public void PrevBoard()
        {
            this.ShowBoard(this.CurrentBoardIndex - 1);
        }

        public void NextBoard()
        {
            this.ShowBoard(this.CurrentBoardIndex + 1);
        }

        private void ShowBoard(int index = 0)
        {
            if (index < 0 || index > this.BoardContainer.Children.Count - 1)
                return;

            InkCanvas canv = null;
            for (int i = 0; i < this.BoardContainer.Children.Count; i++)
            {
                canv = (this.BoardContainer.Children[i] as ScrollViewer).Content as InkCanvas;
                canv.Visibility = (i == index ? Visibility.Visible : Visibility.Hidden);
            }
            this.CurrentBoardIndex = index;
        }

        //打开课件
        public void OpenFile()
        {
            OpenFileDialog openDialog = new OpenFileDialog
            {
                //Filter = "PPT File(*.pptx)|*.pptx|docx File(*.docx)|*.docx|Pdf File(*.pdf)|*.pdf",
                Filter = "课件|*.pptx;*.docx;*.doc;*.pdf",
                Title = "选择课件"
            };
            if (openDialog.ShowDialog() == true)
            {
                this.ShowFileImage(openDialog);
            }
        }
        //public void OpenFile(LiveRoomWindow.fileType type)
        //{
        //    if (type == LiveRoomWindow.fileType.PPT ) {
        //        OpenFileDialog openDialog = new OpenFileDialog
        //        {
        //            //Filter = "PPT File(*.pptx)|*.pptx|docx File(*.docx)|*.docx|Pdf File(*.pdf)|*.pdf",
        //            Filter = "课件|*.pptx",
        //            Title = "选择PPT课件"
        //        };
        //        if (openDialog.ShowDialog() == true)
        //        {
        //            this.ShowFileImage(openDialog);
        //        }
        //    } else if (type == LiveRoomWindow.fileType.WORD) {
        //        OpenFileDialog openDialog = new OpenFileDialog
        //        {
        //            //Filter = "PPT File(*.pptx)|*.pptx|docx File(*.docx)|*.docx|Pdf File(*.pdf)|*.pdf",
        //            Filter = "课件|*.docx",
        //            Title = "选择WORD课件"
        //        };
        //        if (openDialog.ShowDialog() == true)
        //        {
        //            this.ShowFileImage(openDialog);
        //        }
        //    } else if(type == LiveRoomWindow.fileType.PDF) {
        //        OpenFileDialog openDialog = new OpenFileDialog
        //        {
        //            //Filter = "PPT File(*.pptx)|*.pptx|docx File(*.docx)|*.docx|Pdf File(*.pdf)|*.pdf",
        //            Filter = "课件|*.pdf",
        //            Title = "选择PDF课件"
        //        };
        //        if (openDialog.ShowDialog() == true)
        //        {
        //            this.ShowFileImage(openDialog);
        //        }
        //    }
        //}

        private void ShowFileImage(OpenFileDialog openDialog)
        {
            try
            {
                string path = openDialog.FileName;
                BoardFile file = BoardFile.Create(path);
                if (file == null)
                {
                    DialogWindow.Message(null, "读取文件失败！");
                    return;
                }

                //int count = this.pdfcount(path);
                #region 渲染FilePanel
                StackPanel sp = new StackPanel();
                sp.Margin = new Thickness(0, 20, 0, 0);
                Image img = new Image();
                if (file.Suffix.Equals(".docx") || file.Suffix.Equals(".doc"))
                {
                    img.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-world-on.png");
                }
                if (file.Suffix.Equals(".pptx"))
                {
                    img.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-ppt-on.png");
                }
                if (file.Suffix.Equals(".pdf"))
                {
                    img.Source = Common.GetImage("/YZCLASS.UI;component/Resource/Image/livepage-icon-pdf-on.png");
                }
                sp.Children.Add(img);
                img.Width = 30;
                img.Cursor = Cursors.Hand;
                TextBlock lbl = new TextBlock();
                lbl.Text = openDialog.SafeFileName;
                lbl.ToolTip = openDialog.SafeFileName; ;
                lbl.TextTrimming = TextTrimming.WordEllipsis;
                lbl.HorizontalAlignment = HorizontalAlignment.Center;
                lbl.Foreground = Common.GetColor("#9E9E9F");
                lbl.FontSize = 11;
                lbl.Margin = new Thickness(0, 3, 0, 0);
                sp.Children.Add(lbl);
                sp.Tag = file;
                sp.MouseLeftButtonDown += FileClick;
                this.FilePanel.Children.Add(sp);
                #endregion
            }
            catch
            {
                DialogWindow.Message(null, "加载课件失败，请尝试重新加载！");
            }
        }

        private void FileClick(object sender, MouseButtonEventArgs e)
        {
            BoardFile file = (sender as StackPanel).Tag as BoardFile;

            #region 渲染FilePagePanel
            System.Drawing.Image img = null;
            System.Drawing.Bitmap bitmap = null;
            StackPanel sp = null;
            Image image = null;
            TextBlock lbl = null;

            this.FilePagePanel.Children.Clear();
            for (int i = 0; i < file.ImageList.Count; i++)
            {
                sp = new StackPanel();
                sp.Cursor = Cursors.Hand;
                sp.MouseLeftButtonDown += FilePageClick;
                sp.Margin = new Thickness(0, 20, 0, 0);
                img = file.ImageList[i];
                bitmap = new System.Drawing.Bitmap(img);
                image = new Image();
                image.HorizontalAlignment = HorizontalAlignment.Center;
                image.Stretch = Stretch.UniformToFill;
                //image.Width = 87.5;  
                //image.Height = 66.5;
                //不限定文档加载区大小
                image.Source = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap
                (
                    bitmap.GetHbitmap(),
                    IntPtr.Zero,
                    Int32Rect.Empty,
                    BitmapSizeOptions.FromEmptyOptions()
                );
                sp.Tag = bitmap;
                sp.Children.Add(image);
                lbl = new TextBlock();
                lbl.HorizontalAlignment = HorizontalAlignment.Center;
                lbl.Foreground = Common.GetColor("#CCCBCB");
                lbl.Text = string.Format("{0}/{1}", i + 1, file.ImageList.Count);
                lbl.Margin = new Thickness(0, 3, 0, 0);
                sp.Children.Add(lbl);
                this.FilePagePanel.Children.Add(sp);
            }
            #endregion
        }

        private void FilePageClick(object sender, MouseButtonEventArgs e)
        {
            System.Drawing.Bitmap bitmap = (sender as StackPanel).Tag as System.Drawing.Bitmap;
            //this.CurrentCanvas.Height = bitmap.Size.Height * bitmap.Size.Width * 1.0 / this.CurrentCanvas.Width;
            int width = (int)this.BoardContainer.ActualWidth - 20;
            //int height = (int)(bitmap.Size.Height * bitmap.Size.Width * 1.0 / (this.BoardContainer.ActualWidth - 20));
            int height = (int)(width * bitmap.Size.Height * 1.0 / bitmap.Size.Width);
            //this.CurrentFileImage.Height = height;
            //重新计算文档加载区大小

            this.CurrentFileImage.Source = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap
            (
                bitmap.GetHbitmap(),
                IntPtr.Zero,
                Int32Rect.Empty,
                BitmapSizeOptions.FromEmptyOptions()
            );
        }

        private void rbPen_Click(object sender, RoutedEventArgs e)
        {
            this.CurrentCanvas.EditingMode = InkCanvasEditingMode.Ink;
        }

        private void rbEraser_Click(object sender, RoutedEventArgs e)
        {
            this.CurrentCanvas.EditingMode = InkCanvasEditingMode.EraseByStroke;
        }

        TextBox myTextBox;
        Point mouseLeftDownPoint, currentPoint;
        private bool IsDrawing = false;
        //private void rbShape_Click(object sender, RoutedEventArgs e)
        //{
        //    this.CurrentCanvas.EditingMode = InkCanvasEditingMode.None;
        //}

        private void line_Click(object sender, RoutedEventArgs e)
        {
            if (this.ShapeCheck == false)
                return;

            if (_lineCheck == true)
            {
                _circleCheck = false;
                _triangleCheck = false;
            }
            this.CurrentCanvas.EditingMode = InkCanvasEditingMode.None;
        }

        private void circle_Click(object sender, RoutedEventArgs e)
        {
            if (this.ShapeCheck == false)
                return;

            if (_circleCheck == true)
            {
                _lineCheck = false;
                _triangleCheck = false;
            }
            this.CurrentCanvas.EditingMode = InkCanvasEditingMode.None;
        }

        private void triangle_Click(object sender, RoutedEventArgs e)
        {
            if (this.ShapeCheck == false)
                return;

            if (_triangleCheck == true)
            {
                _circleCheck = false;
                _lineCheck = false;
            }
            this.CurrentCanvas.EditingMode = InkCanvasEditingMode.None;
        }
        private void text_Click(object sender, RoutedEventArgs e)
        {
            if (this.TextCheck == true)
            {
                _circleCheck = false;
                _lineCheck = false;
                _triangleCheck = false;
            }
        }

        private void inkcanvas_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (this.CurrentCanvas.EditingMode == InkCanvasEditingMode.None)
            {
                IsDrawing = true;
                mouseLeftDownPoint = e.GetPosition((IInputElement)sender);
            }
        }

        Stroke st = null;
        private void inkcanvas_MouseMove(object sender, MouseEventArgs e)
        {
            if (IsDrawing)
            {
                //if (draw.IsChecked == true)
                //{
                //    currentPoint = e.GetPosition((IInputElement)sender);
                //    StylusPointCollection pts = new StylusPointCollection();
                //    pts.Add(new StylusPoint(mouseLeftDownPoint.X, mouseLeftDownPoint.Y));
                //    pts.Add(new StylusPoint(mouseLeftDownPoint.X, currentPoint.Y));
                //    pts.Add(new StylusPoint(currentPoint.X, currentPoint.Y));
                //    pts.Add(new StylusPoint(currentPoint.X, mouseLeftDownPoint.Y));
                //    pts.Add(new StylusPoint(mouseLeftDownPoint.X, mouseLeftDownPoint.Y));
                //    if (st != null)
                //        inkcanvas.Strokes.Remove(st);
                //    st = new customStroke(pts);
                //}
                //else 
                if (_circleCheck == true)
                {
                    System.Windows.Point endP = e.GetPosition((IInputElement)sender);
                    List<System.Windows.Point> pointList = GenerateEclipseGeometry(mouseLeftDownPoint, endP);
                    StylusPointCollection pts = new StylusPointCollection(pointList);
                    if (st != null)
                        this.CurrentCanvas.Strokes.Remove(st);
                    st = new CustomStroke(pts);
                }
                else if (_lineCheck == true)
                {
                    currentPoint = e.GetPosition((IInputElement)sender);
                    StylusPointCollection pts = new StylusPointCollection();
                    pts.Add(new StylusPoint(mouseLeftDownPoint.X, mouseLeftDownPoint.Y));
                    pts.Add(new StylusPoint(currentPoint.X, currentPoint.Y));
                    if (st != null)
                        this.CurrentCanvas.Strokes.Remove(st);
                    st = new CustomStroke(pts);
                }
                else if (_triangleCheck == true)
                {
                    currentPoint = e.GetPosition((IInputElement)sender);
                    StylusPointCollection pts = new StylusPointCollection();
                    pts.Add(new StylusPoint((mouseLeftDownPoint.X + currentPoint.X) / 2, mouseLeftDownPoint.Y));
                    pts.Add(new StylusPoint(mouseLeftDownPoint.X, currentPoint.Y));
                    pts.Add(new StylusPoint(currentPoint.X, currentPoint.Y));
                    pts.Add(new StylusPoint((mouseLeftDownPoint.X + currentPoint.X) / 2, mouseLeftDownPoint.Y));
                    if (st != null)
                        this.CurrentCanvas.Strokes.Remove(st);
                    st = new CustomStroke(pts);
                }
                else if (_textCheck == true)
                {
                    //if(e.LeftButton == MouseButtonState.Pressed) {
                    //    if (myTextBox!=null)
                    //    {
                    //        inkcanvas.Children.Remove(myTextBox);
                    //    }

                    myTextBox = new TextBox();
                    this.CurrentCanvas.Children.Add(myTextBox);
                    myTextBox.Visibility = Visibility.Visible;
                    Point currentPoint = e.GetPosition(this.CurrentCanvas);
                    double left = Math.Min(mouseLeftDownPoint.X, currentPoint.X);
                    double top = Math.Min(mouseLeftDownPoint.Y, currentPoint.Y);
                    myTextBox.Width = Math.Abs(mouseLeftDownPoint.X - currentPoint.X);
                    myTextBox.Height = Math.Abs(mouseLeftDownPoint.Y - currentPoint.Y);
                    InkCanvas.SetLeft(myTextBox, left);
                    InkCanvas.SetTop(myTextBox, top);
                    //myTextBox.Focus();
                    //myTextBox.LostFocus += new RoutedEventHandler(myTextBox_LostFocus);
                    if (st != null)
                        this.CurrentCanvas.Strokes.Remove(st);
                    //}
                }
                if (st != null)
                {
                    st.DrawingAttributes.Color = Colors.Red;
                    this.CurrentCanvas.Strokes.Add(st);
                }

            }
        }

        private List<System.Windows.Point> GenerateEclipseGeometry(System.Windows.Point st, System.Windows.Point ed)
        {
            double a = 0.5 * (ed.X - st.X);
            double b = 0.5 * (ed.Y - st.Y);
            List<System.Windows.Point> pointList = new List<System.Windows.Point>();
            for (double r = 0; r <= 2 * Math.PI; r = r + 0.01)
            {
                pointList.Add(new System.Windows.Point(0.5 * (st.X + ed.X) + a * Math.Cos(r), 0.5 * (st.Y + ed.Y) + b * Math.Sin(r)));
            }
            return pointList;
        }

        private void inkcanvas_MouseUp(object sender, MouseButtonEventArgs e)
        {
            if (this.CurrentCanvas.EditingMode == InkCanvasEditingMode.None)
            {
                if (st != null)
                {
                    this.CurrentCanvas.Strokes.Remove(st);
                    this.CurrentCanvas.Strokes.Add(st.Clone());
                }
                IsDrawing = false;
            }
        }
    }

    public class CustomStroke : Stroke
    {
        public CustomStroke(StylusPointCollection pts)
          : base(pts)
        {
            this.StylusPoints = pts;
        }

        public bool IsSelected
        {
            get
            {
                PropertyInfo property = typeof(Stroke).GetProperty("IsSelected",
                   System.Reflection.BindingFlags.Instance |
                   System.Reflection.BindingFlags.GetProperty |
                   System.Reflection.BindingFlags.NonPublic);
                return (bool)property.GetValue(this, null);
            }
        }

        System.Windows.Point GetTheLeftTopPoint()
        {
            if (this.StylusPoints == null)
                throw new ArgumentNullException("StylusPoints");
            StylusPoint tmpPoint = new StylusPoint(double.MaxValue, double.MaxValue);
            foreach (StylusPoint point in this.StylusPoints)
            {
                if ((point.X < tmpPoint.X) || (point.Y < tmpPoint.Y))
                    tmpPoint = point;
            }
            return tmpPoint.ToPoint();
        }

        System.Windows.Point GetTheRightBottomPoint()
        {
            if (this.StylusPoints == null)
                throw new ArgumentNullException("StylusPoints");
            StylusPoint tmpPoint = new StylusPoint(0, 0);
            foreach (StylusPoint point in this.StylusPoints)
            {
                if ((point.X > tmpPoint.X) || (point.Y > tmpPoint.Y))
                    tmpPoint = point;
            }
            return tmpPoint.ToPoint();
        }
    }
}
