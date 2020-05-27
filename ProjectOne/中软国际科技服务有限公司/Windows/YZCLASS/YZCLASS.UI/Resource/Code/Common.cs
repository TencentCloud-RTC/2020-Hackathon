using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using ThoughtWorks.QRCode.Codec;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：共通类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.11.01</para>
    /// </summary>
    public class Common
    {
        public static event EventHandler OnCourseCreated;
        public static event EventHandler OnCourseApplied;

        /// <summary>
        /// 数据访问对象
        /// </summary>
        public static DBService.Data Db
        {
            get
            {
                return DBService.DBFactory.Create();
            }
        }

        public static double ScreenZoom
        {
            get
            {
                double zoom = 1;
                if (double.TryParse(ConfigurationManager.AppSettings["ScreenZoom"], out zoom))
                    return zoom;
                return 1;
            }
        }

        public static ImageSource GetImage(string uri)
        {
            return new BitmapImage(new Uri(uri, UriKind.Relative));
        }

        public static SolidColorBrush GetColor(string value)
        {
            return new SolidColorBrush((Color)ColorConverter.ConvertFromString(value));
        }

        public static SolidColorBrush GetColor(Color color)
        {
            return new SolidColorBrush(color);
        }

        /// <summary>
        /// 生成二维码
        /// </summary>
        /// <param name="Content">内容文本</param>
        /// <param name="size">图片尺寸（像素）</param>
        /// <param name="margin">图片白边（像素）</param>
        /// <returns></returns>

        public static string GetString(byte[] utf8String)
        {
            utf8String = Encoding.Convert(Encoding.GetEncoding("UTF-8"), Encoding.Unicode, utf8String);
            string strUnicode = Encoding.Unicode.GetString(utf8String);
            strUnicode = strUnicode.Substring(0, strUnicode.IndexOf('\0'));
            return strUnicode;
        }

        public static string GetStringUser(byte[] utf8String)
        {
            utf8String = Encoding.Convert(Encoding.GetEncoding("UTF-8"), Encoding.Unicode, utf8String);
            string strUnicode = Encoding.Unicode.GetString(utf8String);
            //strUnicode = strUnicode.Substring(0, strUnicode.IndexOf('\0'));
            return strUnicode;
        }

        public static byte[] GetBuffer(string inputString, int bufferLen = 8081)
        {
            byte[] utf8Buffer = new byte[bufferLen];
            byte[] tempBuffer = System.Text.Encoding.UTF8.GetBytes(inputString);
            for (int i = 0; i < tempBuffer.Length; ++i)
            {
                utf8Buffer[i] = tempBuffer[i];
            }
            return utf8Buffer;
        }

        private static string DESKey = "k3k3k3k3";
        private static string DESIv = "k3k3k3k3";
        
        public static void RegisteCourseCreated()
        {
            Course.CreateCourse.OnCourseCreated += CreateCourse_OnCourseCreated;
        }


        private static void CreateCourse_OnCourseCreated(object sender, EventArgs e)
        {
            if (Common.OnCourseCreated != null)
            {
                Common.OnCourseCreated(null, null);
            }
        }

        // 根据文件路径获取文件大小
        public static string GetFileSize(string path)
        {
            if (File.Exists(path))
            {
                long Size = new FileInfo(path).Length;

                string m_strSize = "";
                long FactSize = 0;
                FactSize = Size;
                if (FactSize < 1024.00)
                    m_strSize = FactSize.ToString("F2") + " Byte";
                else if (FactSize >= 1024.00 && FactSize < 1048576)
                    m_strSize = (FactSize / 1024.00).ToString("F2") + " K";
                else if (FactSize >= 1048576 && FactSize < 1073741824)
                    m_strSize = (FactSize / 1024.00 / 1024.00).ToString("F2") + " M";
                else if (FactSize >= 1073741824)
                    m_strSize = (FactSize / 1024.00 / 1024.00 / 1024.00).ToString("F2") + " G";
                return m_strSize;
            }
            else
            {
                return "";
            }
        }

    }
}
