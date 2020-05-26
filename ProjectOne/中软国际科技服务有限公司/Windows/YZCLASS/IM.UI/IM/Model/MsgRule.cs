using IM.Enum;
using IM.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Xml.Serialization;

namespace IM.Model
{
    public class MsgRule : PropertyChangedBase
    {
        private string _NikeName;
        public string NikeName
        {
            get { return _NikeName; }
            set
            {
                _NikeName = value;
                OnPropertyChanged("NikeName");
            }
        }

        private string _FaceUrl;
        public string FaceUrl
        {
            get { return _FaceUrl; }
            set
            {
                _FaceUrl = value;
                OnPropertyChanged("FaceUrl");
            }
        }

        private bool _IsMySelf;
        public bool IsMySelf
        {
            get { return _IsMySelf; }
            set
            {
                _IsMySelf = value;
                OnPropertyChanged("IsMySelf");
            }
        }

        private string _Content;
        /// <summary>
        /// 消息内容
        /// </summary>
        public string Content
        {
            get { return _Content; }
            set
            {
                _Content = value;
                OnPropertyChanged("Content");
            }
        }
        private MsgFontStyles _FontStyles;
        /// <summary>
        /// 发送字体样式
        /// </summary>
        [XmlIgnore]
        public MsgFontStyles FontStyles
        {
            get { return _FontStyles; }
            set
            {
                _FontStyles = value;
                OnPropertyChanged("FontStyles");
            }
        }
        private List<string> _ContentList;
        /// <summary>
        /// 消息内容List
        /// </summary>
        public List<string> ContentList
        {
            get { return _ContentList; }

            set
            {
                _ContentList = value;
                OnPropertyChanged("ContentList");
            }
        }
        private ContentType _ContentType;
        /// <summary>
        /// 发送类别：文件，字符
        /// </summary>
        public ContentType ContentType
        {
            get { return _ContentType; }
            set
            {
                _ContentType = value;
                OnPropertyChanged("ContentType");
            }
        }
        #region 文件存储
        private ImageSource _ImageSource = null;
        /// <summary>
        /// 文件图片
        /// </summary>
        [XmlIgnore]
        public ImageSource ImageSource
        {
            get
            {
                if (this._ImageSource == null)
                {
                    //string extName = IOHelper.GetFileExtension(this._LocalFilePath);
                    //if (!string.IsNullOrEmpty(extName))
                        //this._ImageSource = FileIconHelper.GetFileIcon(extName, ESystemIconSize.Large);
                        //this._ImageSource = extName;
                    //此处是设置文件图片的默认值。
                }
                return this._ImageSource;
            }
            set
            {
                _ImageSource = value;
                OnPropertyChanged("ImageSource");
            }
        }
        private long _FileSize = 0;
        /// <summary>
        /// 文件大小
        /// </summary>
        public long FileSize
        {
            get { return this._FileSize; }
            set
            {
                _FileSize = value;
                OnPropertyChanged("FileSize");
            }
        }
        public string SizeString
        {
            get
            {
                if (FileSize >= 0)
                    return ByteFormatterHelper.ToString(FileSize);
                else
                    return string.Empty;
            }
        }
        private string _FileName = string.Empty;
        /// <summary>
        /// 文件的全名
        /// </summary>
        public string FileName
        {
            get { return this._FileName; }
            set
            {
                _FileName = value;
                OnPropertyChanged("FileName");
            }
        }
        private string _LocalFilePath = string.Empty;
        /// <summary>
        /// 文件的全路径
        /// </summary>
        public string LocalFilePath
        {
            get { return this._LocalFilePath; }
            set
            {
                _LocalFilePath = value;
                OnPropertyChanged("LocalFilePath");
                OnPropertyChanged("ImageSource");
            }
        }
        private string _MachineName;
        /// <summary>
        /// 本地机器的唯一识别码
        /// </summary>
        public string MachineName
        {
            get { return _MachineName; }
            set
            {
                _MachineName = value;
                OnPropertyChanged("MachineName");
            }
        }
        private string _FileId;
        /// <summary>
        /// 文件的服务器id
        /// </summary>
        public string FileId
        {
            get { return _FileId; }
            set
            {
                _FileId = value;
                OnPropertyChanged("FileId");
            }
        }

        private string _UserId = string.Empty;
        /// <summary>
        /// 用户ID
        /// </summary>
        public string UserId
        {
            get { return _UserId; }
            set
            {
                _UserId = value;
                OnPropertyChanged("UserId");
            }
        }

        private string _SpaceId = string.Empty;
        /// <summary>
        /// 用户空间ID
        /// </summary>
        public string SpaceId
        {
            get { return _SpaceId; }
            set
            {
                _SpaceId = value;
                OnPropertyChanged("SpaceId");
            }
        }

        private string _Fullpath = "/";
        /// <summary>
        /// 文件上传目录
        /// </summary>
        public string Fullpath
        {
            get { return _Fullpath; }
            set
            {
                _Fullpath = value;
                OnPropertyChanged("Fullpath");
            }
        }
        private double _Rate = 0.0;
        /// <summary>
        /// 进度
        /// </summary>
        public double Rate
        {
            get { return this._Rate; }
            set
            {
                _Rate = value;
                OnPropertyChanged("Rate");
                OnPropertyChanged("RateString");
            }
        }
        public string RateString
        {
            get { return this._Rate + "%"; }
        }
        private EFileOperationStatus _Status = EFileOperationStatus.Ide;
        /// <summary>
        /// 文件操作状态
        /// </summary>
        public EFileOperationStatus Status
        {
            get { return this._Status; }
            set
            {
                _Status = value;
                OnPropertyChanged("Status");
            }
        }
        #endregion
    }

    /// <summary>
    /// 事件通知基类
    /// </summary>
    [Serializable]
    public class PropertyChangedBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    }
}
