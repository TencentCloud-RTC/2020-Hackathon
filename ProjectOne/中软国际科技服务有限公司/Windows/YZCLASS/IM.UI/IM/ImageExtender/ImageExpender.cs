using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Threading;

namespace IM.ImageExtender
{
    public class ImageExpender : Image
    {
        string imageLocation;
        public string ImageLocation
        {
            get
            {
                return imageLocation;
            }
            set
            {
                if (imageLocation != value)
                {
                    imageLocation = value;

                    try
                    {
                        Load();
                    }
                    catch (Exception ep)
                    { }
                }
            }
        }

        private String location;
        /// <summary>
        ///     图像路径
        /// </summary>
        public String Location
        {
            get { return location; }
            set { location = value; }
        }

        public System.Drawing.Image Image
        {
            get { return (System.Drawing.Image)GetValue(ImageProperty); }
            set { SetValue(ImageProperty, value); }
        }

        //使用 DependencyProperty 作为后备存储的图像。这使动画、 样式、 绑定等......
        public static readonly DependencyProperty ImageProperty =
         DependencyProperty.Register("Image", typeof(System.Drawing.Image), typeof(ImageExpender), new UIPropertyMetadata(null, new PropertyChangedCallback(ImagePropertyChanged)));

        private static void ImagePropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            ImageExpender imageExpender = d as ImageExpender;

            System.Drawing.Image oldImage = e.OldValue as System.Drawing.Image;
            System.Drawing.Image newImage = e.NewValue as System.Drawing.Image;

            imageExpender.StopAnimate(oldImage);
            imageExpender.Animate(newImage);
            imageExpender.RefreshImageSource();
        }
        bool currentlyAnimating = false;
        #region Animate

        private void Animate(bool animate, System.Drawing.Image image)
        {
            if (animate != this.currentlyAnimating)
            {
                if (animate)
                {
                    if (image != null)
                    {
                        ImageAnimatiorExpender.Animate(image, new EventHandler(this.OnFrameChanged));
                        this.currentlyAnimating = animate;
                    }
                }
                else
                {
                    if (image != null)
                    {
                        ImageAnimatiorExpender.StopAnimate(image, new EventHandler(this.OnFrameChanged));
                        this.currentlyAnimating = animate;
                    }
                }
            }
        }

        private void StopAnimate(System.Drawing.Image image)
        {
            Animate(false, image);
        }

        private void Animate(System.Drawing.Image image)
        {
            Animate(IsEnabled && Visibility == Visibility.Visible, image);
        }

        #endregion

        private void OnFrameChanged(object o, EventArgs e)
        {
            this.Dispatcher.BeginInvoke(DispatcherPriority.Normal, new System.Threading.ThreadStart(RefreshImageSource));
        }

        private void RefreshImageSource()
        {
            if (this.Image != null && this.Visibility == Visibility.Visible)
            {
                ImageAnimatiorExpender.UpdateFrames(this.Image);
                ImageSource imageSource = ImageAnimatiorExpender.GetImageSource(this.Image);

                if (imageSource == null)
                {
                    IntPtr ip = (this.Image as System.Drawing.Bitmap).GetHbitmap();
                    imageSource = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                        ip, IntPtr.Zero, System.Windows.Int32Rect.Empty,
                        System.Windows.Media.Imaging.BitmapSizeOptions.FromEmptyOptions());
                }

                this.Source = imageSource;
            }
        }

        #region 辅助方法

        private Uri CalculateUri(string path)
        {
            Uri uri;
            try
            {
                uri = new Uri(path);
            }
            catch (UriFormatException)
            {
                // It's a relative pathname, get its full path as a file.
                path = Path.GetFullPath(path);
                uri = new Uri(path);
            }
            return uri;
        }

        public void Load()
        {
            if (ImageLocation == null || ImageLocation.Length == 0)
            {
                return;
            }

            System.Drawing.Image img = null;
            try
            {
                Uri uri = CalculateUri(ImageLocation);
                if (uri.IsFile)
                {
                    using (StreamReader reader = new StreamReader(uri.LocalPath))
                    {
                        //img = System.Drawing.Image.FromStream(reader.BaseStream);
                        img = new System.Drawing.Bitmap(uri.LocalPath);
                    }
                }
                else
                {
                    using (WebClient wc = new WebClient())
                    {
                        using (Stream s = wc.OpenRead(uri.ToString()))
                        {
                            img = System.Drawing.Bitmap.FromStream(s);
                        }
                    }
                }
            }
            catch
            {

            }

            this.Image = img;
        }

        #endregion
    }
}
