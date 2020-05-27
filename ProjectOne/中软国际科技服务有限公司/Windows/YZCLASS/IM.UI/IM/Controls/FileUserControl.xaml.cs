using GalaSoft.MvvmLight.Messaging;
using IM.Enum;
using IM.Helper;
using IM.Model;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace IM.Controls
{
    /// <summary>
    /// FileUserControl.xaml 的交互逻辑
    /// </summary>
    public partial class FileUserControl : UserControl
    {
        MsgRule _Msg = null;
        WebClient client = null;
        public FileUserControl()
        {
            InitializeComponent();
            client = new WebClient();
            this.Loaded += FileUserControl_Loaded;
            //this.btnDelete.Click += BtnDelete_Click;
            //this.btnFileDownLoad.Click += BtnFileDownLoad_Click;
            this.btnOpenFile.Click += BtnOpenFile_Click;
            this.btnOpenDir.Click += BtnOpenDir_Click;
        }

        private void FileUserControl_Loaded(object sender, RoutedEventArgs e)
        {
            _Msg = this.DataContext as MsgRule;
            string MachineName = Environment.MachineName;
            Initi();
        }

        #region 方法

        internal void Initi()
        {
            if (_Msg != null)
            {
                this._Msg.Status = EFileOperationStatus.Ide;
                if (string.IsNullOrEmpty(_Msg.FileId))
                {
                    this.Start(EFileOperationType.Upload);
                }
                Refresh();
            }
        }
        internal void Refresh()
        {
            if (_Msg != null)
            {
                #region button
                if (this._Msg.Status == EFileOperationStatus.Error)
                {
                    //this.btnDelete.Visibility = Visibility.Visible;
                    //this.btnFileDownLoad.Visibility = Visibility.Collapsed;
                    //this.btnOpenFile.Visibility = Visibility.Collapsed;
                    //this.btnOpenDir.Visibility = Visibility.Collapsed;
                    //this.btnForwardMain.Visibility = Visibility.Collapsed;
                    //this.btnForwardFriend.Visibility = Visibility.Collapsed;
                    //this.btnRayfileDownLoad.Visibility = Visibility.Collapsed;
                    if (!string.IsNullOrEmpty(_Msg.FileId))
                    {
                        //this.btnDelete.Visibility = Visibility.Collapsed;
                        //this.btnFileDownLoad.Visibility = Visibility.Visible;
                        //this.btnOpenFile.Visibility = Visibility.Collapsed;
                        //this.btnOpenDir.Visibility = Visibility.Collapsed;
                        //this.btnForwardMain.Visibility = Visibility.Visible;
                        //this.btnForwardFriend.Visibility = Visibility.Visible;
                        //this.btnRayfileDownLoad.Visibility = Visibility.Visible;

                    }
                    return;
                }
                if (string.IsNullOrEmpty(_Msg.FileId))
                {
                    //this.btnDelete.Visibility = Visibility.Visible;
                    //this.btnFileDownLoad.Visibility = Visibility.Collapsed;
                    //this.btnOpenFile.Visibility = Visibility.Collapsed;
                    //this.btnOpenDir.Visibility = Visibility.Collapsed;
                    //this.btnForwardMain.Visibility = Visibility.Collapsed;
                    //this.btnForwardFriend.Visibility = Visibility.Collapsed;
                    //this.btnRayfileDownLoad.Visibility = Visibility.Collapsed;
                }
                else
                {
                    if (_Msg.MachineName != Environment.MachineName)
                    {
                        //this.btnDelete.Visibility = Visibility.Collapsed;
                        //this.btnFileDownLoad.Visibility = Visibility.Visible;
                        //this.btnOpenFile.Visibility = Visibility.Collapsed;
                        //this.btnOpenDir.Visibility = Visibility.Collapsed;
                        //this.btnForwardMain.Visibility = Visibility.Visible;
                        //this.btnForwardFriend.Visibility = Visibility.Visible;
                        //this.btnRayfileDownLoad.Visibility = Visibility.Visible;
                        if (this._Msg.Status == EFileOperationStatus.Running)
                        {
                            //this.btnFileDownLoad.Visibility = Visibility.Collapsed;
                        }
                        else if (this._Msg.Status == EFileOperationStatus.Finished)
                        {
                            //this.btnFileDownLoad.Visibility = Visibility.Visible;
                            //this.btnOpenFile.Visibility = Visibility.Visible;
                            //this.btnOpenDir.Visibility = Visibility.Visible;
                        }
                        else
                        {
                            //this.btnDelete.Visibility = Visibility.Collapsed;
                            //this.btnFileDownLoad.Visibility = Visibility.Visible;
                            //this.btnOpenFile.Visibility = Visibility.Collapsed;
                        }
                    }
                    else if (_Msg.MachineName == Environment.MachineName)
                    {
                        //this.btnDelete.Visibility = Visibility.Collapsed;
                        //this.btnFileDownLoad.Visibility = Visibility.Collapsed;
                        //this.btnOpenFile.Visibility = Visibility.Visible;
                        //this.btnOpenDir.Visibility = Visibility.Visible;
                        //this.btnForwardMain.Visibility = Visibility.Visible;
                        //this.btnForwardFriend.Visibility = Visibility.Visible;
                        //this.btnRayfileDownLoad.Visibility = Visibility.Visible;
                    }
                }
                #endregion

                if (this._Msg.Status == EFileOperationStatus.Running)
                {
                    //this.proBar.Visibility = Visibility.Visible;
                    //this.runError.Text = null;
                }
                else
                {
                    //this.proBar.Visibility = Visibility.Collapsed;
                }
            }
        }

        private void BtnOpenDir_Click(object sender, RoutedEventArgs e)
        {
            //打开本地文件夹
            Process.Start("explorer.exe ", IOHelper.GetDirecotryNameByFileInfo(this._Msg.LocalFilePath));

        }

        private void BtnOpenFile_Click(object sender, RoutedEventArgs e)
        {
            Process.Start(this._Msg.LocalFilePath);
            //打开本地文件
        }

        private void BtnFileDownLoad_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(_Msg.FileId))
            {
                this.Start(EFileOperationType.Download);
            }
            Refresh();
        }

        //private void BtnLook_Click(object sender, RoutedEventArgs e)
        //{
        //    Process.Start(this._Msg.LocalFilePath);
        //}
        internal void Start(EFileOperationType operationType)
        {
            if (operationType == EFileOperationType.Upload)
            {
                UpLoad();
            }
            else
            {
                Microsoft.Win32.SaveFileDialog sfd = new Microsoft.Win32.SaveFileDialog();
                sfd.FileName = this._Msg?.FileName;
                if (sfd.ShowDialog() == true && sfd.FileName != null)
                {
                    DownLoad(sfd.FileName.Trim());
                }
            }


        }

        internal void Error(string error)
        {
            this._Msg.Status = EFileOperationStatus.Error;
            //this.runError.Text = error;
        }
        internal void Stop()
        {
            if (this._Msg?.Status == EFileOperationStatus.Running)
            {
                this.client.CancelAsync();
            }
            this._Msg.Status = EFileOperationStatus.Delete;
            //this.runError.Text = "已取消.";
        }
        #endregion
        #region private
        private void UpLoad()
        {
            if (this._Msg.UserId != null && this._Msg.SpaceId != null && this._Msg.Fullpath != null && this._Msg.LocalFilePath != null)
            {
                this._Msg.Status = EFileOperationStatus.Running;

                NameValueCollection nvc = new NameValueCollection();
                nvc.Add("userId", this._Msg.UserId);
                nvc.Add("spaceId", this._Msg.SpaceId);
                nvc.Add("fullpath", this._Msg.Fullpath);
                string http = "http://localhost" + "/zuul/fs/api/v1/uploadFile";//URL文件上传地址
                string address = UrlHelper.CombGetUrl(http, nvc);


                Uri uri = new Uri(address);
                client.UploadProgressChanged += Client_UploadProgressChanged;
                client.UploadFileCompleted += Client_UploadFileCompleted;
                client.UploadFileAsync(uri, "POST", this._Msg.LocalFilePath);
            }
            else
            {
                this._Msg.Status = EFileOperationStatus.Error;
                //this.runError.Text = "异常：参数异常。";
            }
        }
        private void Client_UploadFileCompleted(object sender, UploadFileCompletedEventArgs e)
        {
            if (this._Msg.Status != EFileOperationStatus.Delete)
            {
                if (e.Error != null)
                {
                    this._Msg.Status = EFileOperationStatus.Error;
                    this.Error(e.Error.Message);
                }
                else
                {
                    byte[] responseBytes = e.Result;
                    this._Msg.Status = EFileOperationStatus.Finished;
                    this._Msg.FileId = System.Text.Encoding.UTF8.GetString(responseBytes);
                    this._Msg.Content = "[文件]" + this._Msg.FileName;
                    //发送信息
                    Messenger.Default.Send<object>(this._Msg, "winChatVMSendFile");
                }
            }
            Refresh();
        }
        DateTime dt = DateTime.Now;
        private void Client_UploadProgressChanged(object sender, UploadProgressChangedEventArgs e)
        {
            DateTime dtNow = DateTime.Now;
            TimeSpan ts = dtNow - dt;

            if (ts.Milliseconds > 100)
            {
                dt = dtNow;
                double p = (double)e.BytesSent / (double)e.TotalBytesToSend;
                this._Msg.Rate = (int)(p * 100);

            }
        }


        private void DownLoad(string path)
        {
            this._Msg.Status = EFileOperationStatus.Running;
            this._Msg.LocalFilePath = path;
            string http = "http://localhost" + "/fs/api/v1/downFile/" + this._Msg.FileId;//文件下载URL
            WebClient client = new WebClient();
            Uri uri = new Uri(http);
            client.DownloadProgressChanged += Client_DownloadProgressChanged;
            client.DownloadFileCompleted += Client_DownloadFileCompleted;
            client.DownloadFileAsync(uri, path);
        }
        private void Client_DownloadFileCompleted(object sender, System.ComponentModel.AsyncCompletedEventArgs e)
        {
            if (this._Msg.Status != EFileOperationStatus.Delete)
            {
                if (e.Error != null)
                {
                    this._Msg.Status = EFileOperationStatus.Error;
                    this.Error(e.Error.Message);
                }
                else
                {
                    this._Msg.Status = EFileOperationStatus.Finished;
                }
            }
            Refresh();
        }

        private void Client_DownloadProgressChanged(object sender, DownloadProgressChangedEventArgs e)
        {
            DateTime dtNow = DateTime.Now;
            TimeSpan ts = dtNow - dt;

            if (ts.Milliseconds > 100)
            {
                dt = dtNow;
                double p = (double)e.BytesReceived / (double)this._Msg.FileSize;
                this._Msg.Rate = (int)(p * 100);
            }
        }
        #endregion

    }
}
