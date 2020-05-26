using IM.ImageExtender;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media.Imaging;

namespace YZCLASS.UI
{
    class ChatUtil
    {
        #region 文本图片处理 返回String
        public static string Construe(System.Windows.Controls.RichTextBox rtb_TalkMessage, ref List<string> str)
        {
            String XML_Content = "";
            //得到流文档
            FlowDocument document = rtb_TalkMessage.Document;
            //遍历文档顶级节点
            foreach (Block blk in document.Blocks)
            {
                //当前对象是元素
                if (blk is Paragraph)
                {
                    Paragraph para = blk as Paragraph;
                    //判断元素类型 --> 是图像
                    foreach (Inline line in para.Inlines)
                    {
                        if (line is Run)
                        {
                            Run run = (line as Run);
                            string txt = GetOnlyText(run);
                            str.Add(txt);
                            XML_Content += txt;
                        }
                        else if (line is InlineUIContainer)
                        {
                            InlineUIContainer IUC = line as InlineUIContainer;
                            if (IUC.Child is ImageExpender)
                            {
                                ImageExpender Img_Exp = IUC.Child as ImageExpender;
                                string imgCode = GetPictireProtocol(Img_Exp);
                                str.Add(imgCode);
                                XML_Content += imgCode;
                            }
                        }
                    }
                    string s = "<br/>";//换行
                    str.Add(s);
                    XML_Content += s;

                }
            }
            return XML_Content;
        }
        #endregion

        #region 文本图片处理 返回List
        public static List<string> getListContent(System.Windows.Controls.RichTextBox rtb_TalkMessage)
        {
            List<string> list = new List<string>();
            //得到流文档
            FlowDocument document = rtb_TalkMessage.Document;
            //遍历文档顶级节点
            foreach (Block blk in document.Blocks)
            {
                //当前对象是元素
                if (blk is Paragraph)
                {
                    Paragraph para = blk as Paragraph;
                    foreach (Inline line in para.Inlines)
                    {
                        //判断元素类型 --> 文字
                        if (line is Run)
                        {
                            Run run = (line as Run);
                            string txt = GetOnlyText(run);
                            list.Add(txt);
                        }
                        //判断元素类型 --> 图片
                        else if (line is InlineUIContainer)
                        {
                            InlineUIContainer IUC = line as InlineUIContainer;
                            if (IUC.Child is ImageExpender)
                            {
                                ImageExpender Img_Exp = IUC.Child as ImageExpender;
                                string imgCode = GetPictireProtocol(Img_Exp);
                                list.Add(imgCode);
                            }
                        }
                    }
                }
            }
            return list;
        }
        #endregion

        #region 获取当前时间：HHmmssfff
        public static int getHHmmssfff()
        {
            return int.Parse(DateTime.Now.ToString("HHmmssfff"));
        }
        #endregion

        #region 获取当前时间：HH:mm:ss
        public static string getHHmmss()
        {
            return DateTime.Now.ToString("HH:mm:ss");
        }
        #endregion

        #region 获取当前时间：yyyy-MM-dd HH:mm:ss
        public static string getYMDHMS()
        {
            return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
        #endregion

        public static string GetOnlyText(Run inline)
        {
            String TextProtocol = inline.Text;
            return TextProtocol;
        }

        public static String GetPictireProtocol(Image img)
        {
            String PicProtocol = "<img>:" + img.Tag.ToString();
            return PicProtocol;
        }
        //["融入","<img>:3ced67ed7484ec180470b6cf8f0e44b3.gif","","<br/>"]
        public static List<string> stringToList(string msg)
        {
            List<string> list = null;
            if(msg.Length > 0)
            {
                string content = msg.Replace("[", "").Replace("]", "");
                string[] sArray = content.Split(',');
                list = new List<string>(sArray);
            }
            return list;
        }

        public static string isType(string file)
        {
            string flag = "";
            if(file != null)
            {
                string type = file.Split('.')[file.Split('.').Length - 1].ToUpper(); //文件类型
                if (type.Equals("JPG") || type.Equals("PNG") || type.Equals("JPEG") || type.Equals("GIF") || type.Equals("BMP"))
                {
                    flag = "image";
                }
                else
                {
                    flag = "file";
                }
            }
            return flag;
        }

        public static System.Windows.Controls.Image Bitmap2Image(System.Drawing.Bitmap Bi)
        {
            MemoryStream ms = new MemoryStream();
            Bi.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            BitmapImage bImage = new BitmapImage();
            bImage.BeginInit();
            bImage.StreamSource = new MemoryStream(ms.ToArray());
            bImage.EndInit();
            ms.Dispose();
            Bi.Dispose();
            System.Windows.Controls.Image image = new System.Windows.Controls.Image();
            image.Source = bImage;
            image.Height = bImage.Height;
            image.Width = bImage.Width;
            return image;
        }
        /// <summary>
        /// 网络图片转换显示
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static BitmapImage SwithImage(string url)
        {
            try
            {
                BitmapImage bitImage = new BitmapImage();
                bitImage.BeginInit();
                bitImage.UriSource = new Uri(url, UriKind.Absolute);
                bitImage.EndInit();
                return bitImage;
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("网络图片转换异常：url=="+url,ex);
            }
            return null;
        }

    }
}
