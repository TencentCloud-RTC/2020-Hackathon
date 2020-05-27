using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IM.UI
{
    public enum TIMConvType
    {
        /// <summary>
        /// 无效会话
        /// </summary>
        kTIMConv_Invalid,
        /// <summary>
        /// 个人会话
        /// </summary>
        kTIMConv_C2C,
        /// <summary>
        /// 群组会话
        /// </summary>
        kTIMConv_Group,
        /// <summary>
        /// 系统会话
        /// </summary>
        kTIMConv_System
    }
}
