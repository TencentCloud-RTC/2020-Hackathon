using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IM.Enum
{//此处应该分成各自的类文件，
    /// <summary>
    /// 文件操作类型
    /// </summary>
    public enum EFileOperationStatus
    {
        /// <summary>
        /// 空闲
        /// </summary>
        [Description("lngIdle")]
        Ide = 11,
        /// <summary>
        /// 运行中
        /// </summary>
        [Description("lngInTransit")]
        Running = 07,
        /// <summary>
        /// 完成
        /// </summary>
        [Description("lngCompleteds")]
        Finished = 27,
        /// <summary>
        /// 错误
        /// </summary>
        [Description("lngError")]
        Error = 18,

        /// <summary>
        /// 空闲
        /// </summary>
        [Description("lngDelete")]
        Delete = 19,
    }
    public enum EFileOperationType
    {
        /// <summary>
        /// 上传
        /// </summary>
        Upload,
        /// <summary>
        /// 下载
        /// </summary>
        Download
    }
    public enum ContentType
    {
        Text,
        Pic,
        Audio,
        Video,
        Link,
        TextAndPic,
        File
    }
}
