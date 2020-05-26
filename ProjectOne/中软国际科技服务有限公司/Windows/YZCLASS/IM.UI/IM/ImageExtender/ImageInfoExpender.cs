using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace IM.ImageExtender
{
    public class ImageInfoExpender
    {
        const int PropertyTagFrameDelay = 0x5100;

        Image image;
        int frame;
        int frameCount;
        bool frameDirty;
        bool animated;
        EventHandler onFrameChangedHandler;
        int frameTimer;

        ImageSourceExpender[] ImageSourceList = null;

        /// <devdoc>
        /// </devdoc> 
        public ImageInfoExpender(Image image)
        {
            this.image = image;
            animated = ImageAnimator.CanAnimate(image);

            if (animated)
            {
                frameCount = image.GetFrameCount(FrameDimension.Time);
                ImageSourceList = new ImageSourceExpender[frameCount];

                PropertyItem frameDelayItem = image.GetPropertyItem(PropertyTagFrameDelay);

                // If the image does not have a frame delay, we just return 0. 
                //
                if (frameDelayItem != null)
                {
                    // Convert the frame delay from byte[] to int
                    //
                    byte[] values = frameDelayItem.Value;
                    Debug.Assert(values.Length == 4 * FrameCount, "PropertyItem has invalid value byte array");
                    for (int i = 0; i < FrameCount; ++i)
                    {
                        int delayTime = values[i * 4] + 256 * values[i * 4 + 1] + 256 * 256 * values[i * 4 + 2] + 256 * 256 * 256 * values[i * 4 + 3];
                        image.SelectActiveFrame(FrameDimension.Time, i);

                        System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(this.Image.Width, this.Image.Height);
                        System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitmap);
                        g.DrawImage(this.Image, new System.Drawing.Rectangle(0, 0, this.Image.Width, this.Image.Height));

                        IntPtr ip = bitmap.GetHbitmap();
                        ImageSource bitmapSource = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap(
                            ip, IntPtr.Zero, System.Windows.Int32Rect.Empty,
                            System.Windows.Media.Imaging.BitmapSizeOptions.FromEmptyOptions());

                        ImageSourceList[i] = new ImageSourceExpender(bitmapSource, delayTime);
                    }
                }
            }
            else {
                frameCount = 1;
            }

            if (ImageSourceList == null)
            {
                ImageSourceList = new ImageSourceExpender[frameCount];
            }

        }

        /// <devdoc>
        ///     Whether the image supports animation.
        /// </devdoc>
        public bool Animated
        {
            get
            {
                return animated;
            }
        }

        /// <devdoc>
        ///     The current frame.
        /// </devdoc>
        public int Frame
        {
            get
            {
                return frame;
            }
            set
            {
                if (frame != value)
                {
                    if (value < 0 || value >= FrameCount)
                    {
                        throw (new Exception("错误"));
                    }

                    if (Animated)
                    {
                        frame = value;
                        frameDirty = true;

                        OnFrameChanged(EventArgs.Empty);
                    }
                }
            }
        }

        /// <devdoc> 
        ///     The current frame has not been updated. 
        /// </devdoc>
        public bool FrameDirty
        {
            get
            {
                return frameDirty;
            }
        }

        /// <devdoc> 
        /// </devdoc> 
        public EventHandler FrameChangedHandler
        {
            get
            {
                return onFrameChangedHandler;
            }
            set
            {
                onFrameChangedHandler = value;
            }
        }

        /// <devdoc>
        ///     The number of frames in the image. 
        /// </devdoc>
        public int FrameCount
        {
            get
            {
                return frameCount;
            }
        }

        /// <devdoc>
        ///     The delay associated with the frame at the specified index. 
        /// </devdoc>
        public int FrameDelay(int frame)
        {
            return ImageSourceList[frame].DelayTime;
        }

        /// <devdoc> 
        /// </devdoc> 
        internal int FrameTimer
        {
            get
            {
                return frameTimer;
            }
            set
            {
                frameTimer = value;
            }
        }

        /// <devdoc>
        ///     The image this object wraps. 
        /// </devdoc>
        internal Image Image
        {
            get
            {
                return image;
            }
        }

        /// <devdoc>
        ///     Selects the current frame as the active frame in the image. 
        /// </devdoc>
        public void UpdateFrame()
        {
            if (frameDirty)
            {
                //image.SelectActiveFrame(FrameDimension.Time, Frame); 
                frameDirty = false;
            }

            return;
        }

        public ImageSource GetCurrentImageSource()
        {
            return ImageSourceList[Frame].Source;
        }

        /// <devdoc> 
        ///     Raises the FrameChanged event.
        /// </devdoc>
        protected void OnFrameChanged(EventArgs e)
        {
            if (this.onFrameChangedHandler != null)
            {
                this.onFrameChangedHandler(image, e);
            }
        }
    }
}
