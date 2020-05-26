using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    /// <summary>
    /// <para>功能：直播间模块接口</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.04.16</para>
    /// </summary>
    public interface ILiveRoomData
    {
        DataResult QueryStudentList(string jsonString);

        DataResult IntoLiveRoom(string jsonString);

        DataResult OutLiveRoom(string jsonString);

        DataResult addOnlineMember(string jsonString);

        DataResult queryOnlineMemberList(string jsonString);
    }

    /// <summary>
    /// <para>功能：直播间模块类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.04.16</para>
    /// </summary>
    public class LiveRoomData : BaseData, ILiveRoomData
    {
        public DataResult QueryStudentList(string jsonString)
        {
            return base.PostResult("service-core/liveRoomStudent/queryStudentList", jsonString);
        }

        public DataResult IntoLiveRoom(string jsonString)
        {
            return base.PostResult("service-core/liveRoomStudent/intoLiveRoom", jsonString);
        }

        public DataResult OutLiveRoom(string jsonString)
        {
            return base.PostResult("service-core/liveRoomStudent/outLiveRoom", jsonString);
        }
        public DataResult addOnlineMember(string jsonString)
        {
            return base.PostResult("service-core/onlineVoice/addOnlineMember", jsonString);
        }
        public DataResult queryOnlineMemberList(string jsonString)
        {
            return base.PostResult("service-core/onlineVoice/queryOnlineMemberList", jsonString);
        }
    }
}
