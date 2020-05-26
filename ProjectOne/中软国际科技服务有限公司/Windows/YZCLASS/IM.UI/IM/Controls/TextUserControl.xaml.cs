using IM.ImageExtender;
using IM.Model;
using System;
using System.Collections.Generic;
using System.IO;
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

namespace IM.Controls
{
    /// <summary>
    /// TextUserControl.xaml 的交互逻辑
    /// </summary>
    public partial class TextUserControl : UserControl
    {
        MsgRule _Msg = null;
        public TextUserControl()
        {
            InitializeComponent();
            this.Loaded += TextUserControl_Loaded;
        }

        private void TextUserControl_Loaded(object sender, RoutedEventArgs e)
        {
            _Msg = this.DataContext as MsgRule;
            Initi();
        }

        void Initi()
        {
            if (this._Msg != null)
            {
                if (this._Msg.ContentList != null && this._Msg.ContentList.Count > 0)
                {
                    foreach (string str2 in this._Msg.ContentList)
                    {
                        string str = str2.Replace("\"", "");
                        if (str.Contains("[") && str.Contains("]") && str.Length < 6)
                        {
                            string urlCode = str.Replace("<img>:", "").Trim();
                            urlCode = urlCode + ".png";
                            ImageExpender Img_Exp = new ImageExpender();
                            Img_Exp.Stretch = Stretch.UniformToFill;
                            Img_Exp.Visibility = Visibility.Visible;
                            Stream imageStream = System.Windows.Application.GetResourceStream(new Uri("/IM.UI;component/IM/sysface/" + urlCode, UriKind.Relative)).Stream;
                            System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(imageStream);
                            Img_Exp.Image = bitmap;
                            Img_Exp.Location = "/IM.UI;component/IM/sysface/" + urlCode;
                            Img_Exp.Height = 26;
                            Img_Exp.Width = 26;
                            wrapPanel.Children.Add(Img_Exp);
                        }
                        else if (str.Contains("<br/>"))
                        {

                        }
                        else
                        {
                            TextBlock tb = new TextBlock();
                            tb.Text = str;
                            tb.TextWrapping = TextWrapping.Wrap;
                            tb.LineHeight = 18;
                            tb.FontSize = 14;// this._Msg?.FontStyles?.FontSize ?? 14;
                            if (this._Msg.FontStyles != null)
                            {
                                if (this._Msg.FontStyles.IsBold)
                                {
                                    tb.FontWeight = FontWeights.Bold;
                                }
                                if (this._Msg.FontStyles.IsItalic)
                                {
                                    tb.FontStyle = FontStyles.Italic;
                                }
                                if (this._Msg.FontStyles.IsUnderline)
                                {
                                    tb.TextDecorations = TextDecorations.Underline;
                                }
                            }
                            wrapPanel.Children.Add(tb);
                        }


                    }
                }
                else
                {
                    TextBlock tb = new TextBlock();
                    tb.LineHeight = 18;
                    tb.FontSize = 14;//this._Msg?.FontStyles?.FontSize ?? 14;
                    tb.Text = this._Msg?.Content;
                    this.wrapPanel.Children.Add(tb);
                }
            }
        }
    }
}
