using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    /// <summary>
    /// <para>功能：数据模块</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.02.10</para>
    /// </summary>
    public class Data
    {
        public static string Authorization = null;

        internal Data()
        {
        }
        /// <summary>
        /// 课程模块接口
        /// </summary>
        public ICourseData Course { get; set; }
        
        /// <summary>
        /// 个人模块接口
        /// </summary>
        public IMyData My { get; set; }

        /// <summary>
        /// 直播间模块接口
        /// </summary>

        public ILiveRoomData LiveRoom { get; set; }
    }
}
