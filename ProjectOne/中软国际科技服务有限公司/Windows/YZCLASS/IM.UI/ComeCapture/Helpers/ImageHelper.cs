﻿using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media.Imaging;

namespace IM.UI
{
    public class ImageHelper
    {
        #region 保存为PNG图片
        public static void SaveToPng(BitmapSource image, string fileName)
        {
            using (var fs = System.IO.File.Create(fileName))
            {
                BitmapEncoder encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(image));
                encoder.Save(fs);
            }
        }
        #endregion

        #region 截图
        public static BitmapSource GetBitmapSource(int x, int y, int width, int height)
        {
            var bounds = ScreenHelper.GetPhysicalDisplaySize();
            var screenWidth = bounds.Width;
            var screenHeight = bounds.Height;
            var scaleWidth = (screenWidth * 1.0) / SystemParameters.PrimaryScreenWidth;
            var scaleHeight = (screenHeight * 1.0) / SystemParameters.PrimaryScreenHeight;
            var w = (int)(width * scaleWidth);
            var h = (int)(height * scaleHeight);
            var l = (int)(x * scaleWidth);
            var t = (int)(y * scaleHeight);
            using (var bm = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                using (var g = Graphics.FromImage(bm))
                {
                    g.CopyFromScreen(l, t, 0, 0, bm.Size);
                    return Imaging.CreateBitmapSourceFromHBitmap(
                        bm.GetHbitmap(),
                        IntPtr.Zero,
                        Int32Rect.Empty,
                        BitmapSizeOptions.FromEmptyOptions());
                }
            }
        }
        #endregion

        #region 全屏截图
        public static BitmapSource GetFullBitmapSource()
        {
            var bounds = ScreenHelper.GetPhysicalDisplaySize();
            _Bitmap = new Bitmap(bounds.Width, bounds.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
            var bmpGraphics = Graphics.FromImage(_Bitmap);
            bmpGraphics.CopyFromScreen(0, 0, 0, 0, _Bitmap.Size);
            return Imaging.CreateBitmapSourceFromHBitmap(
                _Bitmap.GetHbitmap(),
                IntPtr.Zero,
                Int32Rect.Empty,
                BitmapSizeOptions.FromEmptyOptions());
        }
        #endregion

        #region 获取RGB
        private static Bitmap _Bitmap = null;
        private static StringBuilder sb = new StringBuilder();
        public static string GetRGB(int x,int y)
        {
            var color = _Bitmap.GetPixel(x, y);
            sb.Clear();
            sb.Append("RGB:（");
            sb.Append(color.R.ToString());
            sb.Append(",");
            sb.Append(color.G.ToString());
            sb.Append(",");
            sb.Append(color.B.ToString());
            sb.Append("）");
            return sb.ToString();
        }
        #endregion
    }
}
