using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IM.Model
{
    public class MsgFontStyles
    {
        public int FontSize { get; set; }
        /// <summary>
        /// 是否是粗体
        /// </summary>
        public bool IsBold { get; set; }
        /// <summary>
        /// 是否倾斜
        /// </summary>
        public bool IsItalic { get; set; }
        /// <summary>
        /// 是否有下划线
        /// </summary>
        public bool IsUnderline { get; set; }
    }
}
