using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace YZCLASS.UI
{
    public class ImageButton : Button
    {
        /// <summary>
        /// 默认路径，正常状态下显示的图标
        /// </summary>
        private string _imgPath = null;
        public string ImagePath
        {
            get
            {
                object result = GetValue(ImagePathProperty);

                if (result == null || (int)result == 0)
                {
                    return _imgPath;
                }

                return (string)result;
            }

            set
            {
                SetValue(ImagePathProperty, value);
                this.InvalidateVisual();
            }
        }
        public static DependencyProperty ImagePathProperty = DependencyProperty.Register("ImagePath", typeof(string), typeof(ImageButton), new UIPropertyMetadata());


        /// <summary>
        /// 高亮图标，点击按钮时显示的图标
        /// </summary>
        private string _pressImgPath = null;
        public string PressImagePath
        {
            get
            {
                object result = GetValue(PressImagePathProperty);

                if (result == null || (int)result == 0)
                {
                    return _pressImgPath;
                }

                return (string)result;
            }

            set
            {
                SetValue(PressImagePathProperty, value);

                this.InvalidateVisual();
            }
        }
        public static DependencyProperty PressImagePathProperty = DependencyProperty.Register("PressImagePath", typeof(string), typeof(ImageButton), new UIPropertyMetadata());


    }
}
