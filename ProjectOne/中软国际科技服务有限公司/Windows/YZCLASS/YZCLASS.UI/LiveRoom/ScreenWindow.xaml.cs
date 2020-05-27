using ManageLiteAV;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.ComponentModel;

namespace YZCLASS.UI
{
    /// <summary>
    /// ScreenWindow.xaml 的交互逻辑
    /// </summary>
    public partial class ScreenWindow : Window
    {
        #region 属性
        //private TRTCManage TRTCManage;
        private Action<bool> OnSetScreenParamsCallback;
        private ITRTCCloud mTRTCCloud;
        private ITRTCScreenCaptureSourceList mScreenList;
        private ImageList mImageList;
        private System.Drawing.Rectangle BoardAreaRec;
        #endregion
        public ScreenWindow(System.Drawing.Rectangle boardAreaRec, Action<bool> onSetScreenParamsCallback)
        {
            InitializeComponent();
            this.Loaded += ScreenWindow_Loaded;
            mTRTCCloud = DataManager.GetInstance().trtcCloud;
            BoardAreaRec = boardAreaRec;
            OnSetScreenParamsCallback = onSetScreenParamsCallback;

            mImageList = new ImageList();
            mImageList.ImageSize = new System.Drawing.Size(120, 70);
        }

        private void ScreenWindow_Loaded(object sender, RoutedEventArgs e)
        {
            SIZE thumbSize = new SIZE() { cx = 120, cy = 70 };
            SIZE iconSize = new SIZE() { cx = 20, cy = 20 };
            mScreenList = mTRTCCloud.getScreenCaptureSources(ref thumbSize, ref iconSize);
            for (uint i = 0; i < mScreenList.getCount(); i++)
            {
                TRTCScreenCaptureSourceInfo sourse = mScreenList.getSourceInfo(i);
                //Log.I(String.Format("ScreenCaoture{0} : type = {1}, sourseId = {2}, sourseName = {3}, thumbBuffer = {4}, iconBuffer = {5}",
                //    i + 1, sourse.type, sourse.sourceId, sourse.sourceName, sourse.thumbBGRA.buffer + " {" + sourse.thumbBGRA.width + ", " + sourse.thumbBGRA.height + "}, length = " + sourse.thumbBGRA.length,
                //    sourse.iconBGRA.buffer + " {" + sourse.iconBGRA.width + ", " + sourse.iconBGRA.height + "}, length = " + sourse.iconBGRA.length));
                string name;
                if (sourse.sourceName.Equals("Screen1"))
                    name = "显示器-1";
                else if (sourse.sourceName.Equals("Screen2"))
                    name = "显示器-2";
                else if (sourse.sourceName.Equals("Screen3"))
                    name = "显示器-3";
                else if (sourse.sourceName.Equals("Screen4"))
                    name = "显示器-4";
                else if (sourse.sourceName.Equals("Screen5"))
                    name = "显示器-5";
                else
                    name = sourse.sourceName;

                if (name.Contains("直播间") == false)
                    continue;
                // 设置屏幕缩略图

                int width = 120;
                int height = 70;
                Bitmap bmp = new Bitmap(width, height, System.Drawing.Imaging.PixelFormat.Format32bppRgb);
                if (sourse.thumbBGRA.length <= 0)
                {
                    // 未找到缩略图，不显示
                    using (Graphics g = Graphics.FromImage(bmp))
                    {
                        g.Clear(System.Drawing.Color.White);
                    }
                    mImageList.Images.Add(name, bmp);
                    continue;
                }

                BitmapData bmpData = bmp.LockBits(new System.Drawing.Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, System.Drawing.Imaging.PixelFormat.Format32bppRgb);

                int stride = bmpData.Stride;
                IntPtr iptr = bmpData.Scan0;
                int scanBytes = stride * height;
                int posScan = 0, posReal = 0;
                byte[] pixelValues = new byte[scanBytes];

                for (int j = 0; j < sourse.thumbBGRA.buffer.Length; j++)
                    pixelValues[posScan++] = sourse.thumbBGRA.buffer[posReal++];

                Marshal.Copy(pixelValues, 0, iptr, scanBytes);
                bmp.UnlockBits(bmpData);

                mImageList.Images.Add(name, bmp);
            }
            this.screenListView.LargeImageList = mImageList;
            this.screenListView.BeginUpdate();
            for (int i = 0; i < mImageList.Images.Count; i++)
            {
                System.Windows.Forms.ListViewItem item = new System.Windows.Forms.ListViewItem();
                item.ImageIndex = i;
                item.Text = mImageList.Images.Keys[i];
                this.screenListView.Items.Add(item);
            }
            this.screenListView.EndUpdate();
            this.screenListView.HideSelection = true;
            if (this.screenListView.Items.Count > 0)
            {
                this.screenListView.Items[0].Selected = true;
                this.screenListView.Select();
            }
        }

        private void btnOK_Click(object sender, RoutedEventArgs e)
        {
            if (this.screenListView.SelectedItems.Count == 0)
            {
                //MessageForm msg = new MessageForm();
                //msg.setCancelBtn(false);
                //msg.setText("请选择一个需要共享的屏幕！");
                //msg.ShowDialog();
                System.Windows.MessageBox.Show("请选择一个需要共享的屏幕！");
                return;
            }
            TRTCScreenCaptureSourceInfo sourceinfo = mScreenList.getSourceInfo(0);
            for (uint i = 0; i < mScreenList.getCount(); i++)
            {
                TRTCScreenCaptureSourceInfo info = mScreenList.getSourceInfo(i);
                if (this.screenListView.SelectedItems[0].Text.Equals(mScreenList.getSourceInfo(i).sourceName))
                {
                    sourceinfo = info;
                    break;
                }
            }
            RECT rect = new RECT()
            {
                //top = this.BoardAreaRec.Top,
                //left = this.BoardAreaRec.Left,
                //right = this.BoardAreaRec.Right,
                //bottom = this.BoardAreaRec.Bottom
                top = 0,
                left = 0,
                right = 0,
                bottom = 0
            };
            mTRTCCloud.selectScreenCaptureTarget(ref sourceinfo, ref rect, true, true);
            this.OnSetScreenParamsCallback(true);
            this.Close();
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            this.OnSetScreenParamsCallback(false);
            this.Close();
        }
    }
}
