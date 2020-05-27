
using GalaSoft.MvvmLight.Messaging;
using IM.ImageExtender;
using IM.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace IM
{
    /// <summary>
    /// PeopleChatWindow.xaml 的交互逻辑
    /// </summary>
    public partial class PeopleChatWindow : Window
    {
        //FriendMsgModel fmm = new FriendMsgModel();
        MsgFontStyles msgFontStyles = new MsgFontStyles();
        public Action<object> WinClose;
        public Action WinMax;
        public Action WinMini;
        public Action UploadFile;
        public PeopleChatWindow()
        {
            InitializeComponent();

            this.btnMini.Click += BtnMini_Click;
            this.btnMax.Click += BtnMax_Click;
            this.btnClose.Click += BtnClose_Click;
            this.btnNewFolder.Click += BtnUploadFile_Click;
            this.btnSendMsg.Click += BtnSendMsg_Click;
            this.btnFont.Click += BtnFont_Click;
            this.btnExpression.Click += BtnExpression_Click;
            this.cbx_FontSize.SelectionChanged += Cbx_FontSize_SelectionChanged;
            this.faceUserControl.OnUserSelectFace += FaceUserControl_OnUserSelectFace;
            this.tbn_B.Click += Tbn_Click;
            this.tbn_I.Click += Tbn_Click;
            this.tbn_U.Click += Tbn_Click;
            this.MouseLeftButtonDown += new MouseButtonEventHandler(WindowBaseDragMove_MouseLeftButtonDown);
            Initi();
        }
        void WindowBaseDragMove_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
                this.DragMove();
        }
        private void FaceUserControl_OnUserSelectFace(object sender, FaceUserControl.OnUserSelectFaceEventArgs e)
        {
            ImageExpender Img_Exp = new ImageExpender();
            Img_Exp.Stretch = Stretch.None;
            Img_Exp.Visibility = Visibility.Visible;
            Stream imageStream = System.Windows.Application.GetResourceStream(new Uri("/IM;component/sysface/" + e.Face_Path, UriKind.Relative)).Stream;
            System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(imageStream);
            Img_Exp.Image = bitmap;
            Img_Exp.Location = "/IM;component/sysface/" + e.Face_Path;
            Img_Exp.ToolTip = "/IM;component/sysface/" + e.Face_Path;
            Img_Exp.Tag = e.Face_Path;

            InlineUIContainer IUC = new InlineUIContainer();
            IUC.Child = Img_Exp;

            SetContent(IUC);

        }
        /// <summary>
        /// 增添图片位置
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="iUC"></param>
        void SetContent(InlineUIContainer iUC)
        {
            var obj = rtfSendContent.CaretPosition.Parent;
            if (obj is FlowDocument)
            {
                Paragraph paragraph = new Paragraph(iUC);
                this.rtfSendContent.Document.Blocks.Add(paragraph);
            }
            else if (obj is Run)
            {
                Run run = (Run)obj;
                var paragraph = rtfSendContent.CaretPosition.Paragraph;
                var endTextPointer = rtfSendContent.Selection.End;
                var beforeText = new TextRange(run.ContentStart, endTextPointer);//前面的文本
                var afterText = new TextRange(run.ContentEnd, endTextPointer);//后面的文本
                Run runBefore = new Run(beforeText.Text);
                Run runAfter = new Run(afterText.Text);

                paragraph.Inlines.InsertAfter(run, runAfter);
                paragraph.Inlines.InsertAfter(run, iUC);
                paragraph.Inlines.InsertAfter(run, runBefore);
                paragraph.Inlines.Remove(run);//删除原有text

            }
            else if (obj is Paragraph)
            {

                var var1 = rtfSendContent.CaretPosition.GetAdjacentElement(LogicalDirection.Backward);

                var var2 = rtfSendContent.CaretPosition.GetAdjacentElement(LogicalDirection.Forward);
                if (var1.GetType() == typeof(InlineUIContainer))
                {
                    Paragraph paragraph = obj as Paragraph;
                    paragraph.Inlines.InsertAfter((InlineUIContainer)var1, iUC);
                }
                else if (var2.GetType() == typeof(InlineUIContainer))
                {
                    Paragraph paragraph = obj as Paragraph;
                    paragraph.Inlines.InsertBefore((InlineUIContainer)var2, iUC);
                }
                //  this.rtfSendContent.Document.Blocks.Add(paragraph);
            }
        }

        void Initi()
        {
            //初始化字体大小
            for (int i = 8; i < 22; i++)
            {
                this.cbx_FontSize.Items.Add(i);
            }
            this.cbx_FontSize.SelectedItem = 12;
        }


        private void Tbn_Click(object sender, RoutedEventArgs e)
        {
            if (this.tbn_B.IsChecked == true)
            {
                this.rtfSendContent.FontWeight = FontWeights.Bold;
                this.msgFontStyles.IsBold = true;
            }
            else
            {
                this.rtfSendContent.FontWeight = FontWeights.Normal;
                this.msgFontStyles.IsBold = false;
            }

            if (this.tbn_I.IsChecked == true)
            {
                this.rtfSendContent.FontStyle = FontStyles.Italic;
                this.msgFontStyles.IsItalic = true;
            }
            else
            {
                this.rtfSendContent.FontStyle = FontStyles.Normal;
                this.msgFontStyles.IsItalic = false;
            }
        }

        private void Cbx_FontSize_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (this.cbx_FontSize.SelectedItem != null)
            {
                this.rtfSendContent.FontSize = (int)this.cbx_FontSize.SelectedItem;
                this.msgFontStyles.FontSize = (int)this.cbx_FontSize.SelectedItem;
            }
        }

        /// <summary>
        /// 发送表情
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnExpression_Click(object sender, RoutedEventArgs e)
        {
            this.popupExpression.IsOpen = true;
        }

        /// <summary>
        /// 更改字体
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnFont_Click(object sender, RoutedEventArgs e)
        {
            this.popupFont.IsOpen = true;
        }

        private void BtnSendMsg_Click(object sender, RoutedEventArgs e)
        {
            List<string> str = new List<string>();
            List<string> file = new List<string>();
            //填充Sendtxt
            String XML_Content = ChatProcess.Construe(this.rtfSendContent, ref str,ref file);
            if (XML_Content != "")
            {
                MsgRule msg = new MsgRule();
                msg.Content = XML_Content;
                msg.ContentList = str;
                msg.FontStyles = this.msgFontStyles;
                Messenger.Default.Send<object>(msg, "winChatVMSendTxt");
                this.rtfSendContent.Document.Blocks.Clear();
            }
        }

        #region 事件 
        private void BtnUploadFile_Click(object sender, RoutedEventArgs e)
        {
            if (UploadFile != null)
                UploadFile();
        }
        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            if (WinClose != null)
                WinClose(this);
        }

        private void BtnMax_Click(object sender, RoutedEventArgs e)
        {
            if (WinMax != null)
            {
                this.WinMax();
            }
        }

        private void BtnMini_Click(object sender, RoutedEventArgs e)
        {
            if (WinMini != null)
                this.WinMini();
        }
        #endregion
    }
}
