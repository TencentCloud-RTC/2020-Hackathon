using GalaSoft.MvvmLight.Messaging;
using IM.Enum;
using IM.Helper;
using IM.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media.Imaging;

namespace IM.UI
{
    public class MsgViewModel : PropertyChangedBase
    {
        private ObservableCollection<MsgRule> _MsgNodes;
        public ObservableCollection<MsgRule> MsgNodes
        {
            get { return _MsgNodes; }
            set
            {
                _MsgNodes = value;
                OnPropertyChanged("MsgNodes");
            }
        }
        public void SendFile()
        {
            Microsoft.Win32.OpenFileDialog sfd = new Microsoft.Win32.OpenFileDialog();
            if (sfd.ShowDialog() == true && sfd.FileName != null)
            {
                string path = sfd.FileName.Trim();
                MsgRule SendingModel = new MsgRule()
                {
                    ContentType = ContentType.File,
                    Content = "[文件]" + IOHelper.GetFileNameNoPath(path),

                    FileName = IOHelper.GetFileNameNoPath(path),
                    FileSize = IOHelper.GetFileSize(path),
                    LocalFilePath = path,
                    MachineName = Environment.MachineName,

                    UserId = "123",
                    SpaceId = "123",
                    Fullpath = "/",

                };
                MsgNodes.Add(SendingModel);
            }
        }

        public void sendFile(string fileName,bool flag, string faceUrl,string nickName)
        {
            if (fileName != null)
            {
                string path = fileName.Trim();
                int pic_size = 60;
                System.Drawing.Bitmap bm = FileHelper.GetThumbnail(path, pic_size, pic_size, ThumbnailOptions.None);
                System.Windows.Controls.Image img = FileHelper.Bitmap2Image(bm);
                MsgRule SendingModel = new MsgRule()
                {
                    ContentType = ContentType.File,
                    Content = "[文件]" + IOHelper.GetFileNameNoPath(path),

                    FileName = IOHelper.GetFileNameNoPath(path),
                    FileSize = IOHelper.GetFileSize(path),
                    FaceUrl = faceUrl,
                    NikeName = nickName,
                    ImageSource = img.Source,
                    LocalFilePath = path,
                    MachineName = Environment.MachineName,
                    IsMySelf = flag,

                    UserId = "123",
                    SpaceId = "123",
                    Fullpath = "/",

                };
                MsgNodes.Add(SendingModel);
            }
        }
        public MsgViewModel()
        {
            Messenger.Default.Register<object>(this, "winChatVMSendFile", AcceptMsg);
            Messenger.Default.Register<object>(this, "winChatVMSendTxt", AcceptTxtMsg);
            MsgNodes = new ObservableCollection<MsgRule>();
        }

        /// <summary>
        /// 发送文字
        /// </summary>
        /// <param name="obj"></param>
        public void AcceptTxtMsg(object obj)
        {
            MsgRule msg = obj as MsgRule;
            if (msg != null)
            {
                msg.ContentType = ContentType.Text;
                MsgNodes.Add(msg);
                //发送文字的MSG到服务器
            }
        }
        /// <summary>
        /// 发送文件
        /// </summary>
        /// <param name="obj"></param>
        void AcceptMsg(object obj)
        {
            //发送文件ID的MSG到服务器
        }
    }
}
