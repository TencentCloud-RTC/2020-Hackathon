using IM.ImageExtender;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;

namespace IM
{
    public class ChatProcess
    {
        /// <summary>
        /// 此方法用于分析用户聊天内容
        /// </summary>
        /// <returns></returns>
        public static string Construe(System.Windows.Controls.RichTextBox rtb_TalkMessage, ref List<string> str, ref List<string> file)
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
                                string[] sArrayFaceName = Img_Exp.Location.Split('/');
                                string faceName = sArrayFaceName[4];
                                string path = System.AppDomain.CurrentDomain.BaseDirectory.Replace("\\", "/");
                                string facePath = path + sArrayFaceName[3] + "/" + faceName;
                                string faceIO = GetFileIOString(facePath);
                                string imgCode = GetPictireProtocol(Img_Exp);
                                string key = imgCode.Split('.')[0];
                                str.Add(key);
                                XML_Content += imgCode;
                            }
                            else if (IUC.Child is Image)
                            {
                                Image image = IUC.Child as Image;
                                string localFilePath = image.Tag.ToString();
                                file.Add(localFilePath);
                            }
                        }
                    }
                    //string s = "<br/>";//换行
                    //str.Add(s);
                    //XML_Content += s;

                }
                if (blk is BlockUIContainer)// 截图
                {
                    System.Drawing.Image img = System.Windows.Forms.Clipboard.GetImage();
                    string deerory = Environment.CurrentDirectory + "\\print\\";
                    if (!System.IO.Directory.Exists(deerory))
                    {
                        System.IO.Directory.CreateDirectory(deerory);
                    }
                    deerory = deerory+ DateTime.Now.ToString("yyyyMMddHHmmss") + ".jpg";
                    img.Save(deerory);
                    file.Add(deerory);
                }
            }
            return XML_Content;
        }

        private static string GetFileIOString(string path)
        {
            //定义读文件流
            FileStream fsr = new FileStream(path, FileMode.Open);
            //开辟内存区域 1024 * 1024 bytes
            byte[] readBytes = new byte[1024 * 1024];
            //开始读数据
            int count = fsr.Read(readBytes, 0, readBytes.Length);
            //byte[]转字符串
            string readStr = Encoding.UTF8.GetString(readBytes, 0, count);
            //关闭文件流
            fsr.Close();
            return readStr;
        }

        public static String GetTextProtocol(Run inline)
        {
            String TextProtocol = "<FONT|";
            TextProtocol += "COLOR(*Equ*)\'" + inline.Foreground.ToString() + "\"|";
            TextProtocol += "FAMILY(*Equ*)\"" + inline.FontFamily.ToString() + "\"|";
            TextProtocol += "SIZE(*Equ*)\"" + inline.FontSize.ToString() + "\"|";
            TextProtocol += "VALUE(*Equ*)\"" + inline.Text.Replace("|", "(*Split*)").Replace("=", "(*CEqu*)") + "\"|";
            TextProtocol += "/>";
            return TextProtocol.Replace(" ", "(*Space*)");
        }
        public static string GetOnlyText(Run inline)
        {
            String TextProtocol = inline.Text;
            return TextProtocol;
        }
        public static String GetPictireProtocol(Image img)
        {
           //String PicProtocol = "<img>:" + img.Tag.ToString();
           String PicProtocol = img.Tag.ToString();
            return PicProtocol;
        }
    }
}
