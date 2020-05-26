using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace IM.ImageExtender
{
    public class ImageSourceExpender
    {

        public int DelayTime { set; get; }

        public ImageSource Source { set; get; }

        public ImageSourceExpender(ImageSource source, int delayTime)
        {
            this.Source = source;
            this.DelayTime = delayTime;
        }
    }
}
