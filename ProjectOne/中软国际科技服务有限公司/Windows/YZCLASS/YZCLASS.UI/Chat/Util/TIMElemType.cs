using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.UI
{
    public class TIMElemType
    {
        public const int kTIMElem_Text = 0; // 文本元素
        public const int kTIMElem_Image = 1; // 图片元素
        public const int kTIMElem_Sound = 2;	// 声音元素
        public const int kTIMElem_Custom = 3; // 自定义元素
        public const int kTIMElem_File = 4; // 文件元素
        public const int kTIMElem_GroupTips = 5; // 群组系统消息元素
        public const int kTIMElem_Face = 6; // 表情元素
        public const int kTIMElem_Location = 7; // 位置元素
        public const int kTIMElem_GroupReport = 8; // 群组系统通知元素
        public const int kTIMElem_Video = 9; // 视频元素
        public const int kTIMElem_FriendChange = 10; // 关系链变更消息元素
        public const int kTIMElem_ProfileChange = 11; // 资料变更消息元素
    }
}
