using Oraycn.MCapture;
using Oraycn.MFile;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace YZCLASS.UI.LiveRoom
{
    /// <summary>
    /// <para>功能：本地录制管理类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.03.16</para>
    /// </summary>
    public class LocalRecordManage
    {
        private Rectangle? RecordRect { get; set; }

        private bool checkBox_micro_Checked = true;  //麦克风
        private bool checkBox_soundCard_Checked = false; //声卡
        private bool radioButton_desktop_Checked = true; //录制桌面
        private bool radioButton_camera_Checked = false; //录制摄像头

        private ISoundcardCapturer soundcardCapturer;
        private IMicrophoneCapturer microphoneCapturer;
        private IDesktopCapturer desktopCapturer;
        private ICameraCapturer cameraCapturer;
        private IAudioMixter audioMixter;
        private VideoFileMaker videoFileMaker;
        private SilenceVideoFileMaker silenceVideoFileMaker;
        private AudioFileMaker audioFileMaker;
        private int frameRate = 10; // 采集视频的帧频
        private bool sizeRevised = false;// 是否需要将图像帧的长宽裁剪为4的整数倍
        private volatile bool isRecording = false;
        private volatile bool isParsing = false;
        private System.Windows.Forms.Timer timer;
        private int seconds = 0;
        private bool justRecordVideo = false;
        private bool justRecordAudio = false;

        Random r = new Random();
        public LocalRecordManage(Rectangle? recordRect)
        {
            this.RecordRect = recordRect;

            try
            {
                Oraycn.MCapture.GlobalUtil.SetAuthorizedUser("FreeUser", "");
                Oraycn.MFile.GlobalUtil.SetAuthorizedUser("FreeUser", "");
            }
            catch (Exception ex)
            {
                LogHelp.WriteLog("加载本地录制组件失败！", ex);
            }

            this.timer = new System.Windows.Forms.Timer();
            this.timer.Interval = 1000;
            this.timer.Tick += timer_Tick;
        }

        void timer_Tick(object sender, EventArgs e)
        {
            if (this.isRecording && !this.isParsing)
            {
                var ts = new TimeSpan(0, 0, ++seconds);
                //this.label.Content = ts.Hours.ToString("00") + ":" + ts.Minutes.ToString("00") + ":" + ts.Seconds.ToString("00");
            }
        }

        #region 开始
        public void Start()
        {
            //TODO 开始录制桌面，依据 声音复选框 来选择使用 声卡 麦克风 还是混合录制
            //TODO label 中显示实际录制的时间，需要考虑暂停和恢复这种情况。 格式为 hh:mm:ss
            try
            {
                int audioSampleRate = 16000;
                int channelCount = 1;
                seconds = 0;

                System.Drawing.Size videoSize = System.Windows.Forms.Screen.PrimaryScreen.Bounds.Size;
                this.justRecordAudio = false;//this.radioButton_justAudio.IsChecked.Value;

                //if (this.justRecordAudio && this.checkBox_micro.IsChecked == false && this.checkBox_soundCard.IsChecked == false)
                if (this.justRecordAudio && this.checkBox_micro_Checked == false && this.checkBox_soundCard_Checked == false)
                {
                    MessageBox.Show("请插入麦克风设备！");
                    return;
                }

                #region 设置采集器
                //if (this.radioButton_desktop.IsChecked == true)
                if (this.radioButton_desktop_Checked == true)
                {
                    //桌面采集器

                    //如果需要录制鼠标的操作，第二个参数请设置为true
                    this.desktopCapturer = CapturerFactory.CreateDesktopCapturer(frameRate, true, this.RecordRect);
                    this.desktopCapturer.ImageCaptured += ImageCaptured;
                    videoSize = this.desktopCapturer.VideoSize;
                }
                //else if (this.radioButton_camera.IsChecked == true)
                //{
                //    //摄像头采集器
                //    videoSize = new System.Drawing.Size(int.Parse(this.textBox_width.Text), int.Parse(this.textBox_height.Text));
                //    this.cameraCapturer = CapturerFactory.CreateCameraCapturer(0, videoSize, frameRate);
                //    this.cameraCapturer.ImageCaptured += new CbGeneric<Bitmap>(ImageCaptured);
                //}

                //if (this.checkBox_micro.IsChecked == true)
                if (this.checkBox_micro_Checked == true)
                {
                    //麦克风采集器
                    this.microphoneCapturer = CapturerFactory.CreateMicrophoneCapturer(0);
                    this.microphoneCapturer.CaptureError += capturer_CaptureError;
                }

                //if (this.checkBox_soundCard.IsChecked == true)
                if (this.checkBox_soundCard_Checked == true)
                {
                    //声卡采集器 【目前声卡采集仅支持vista以及以上系统】
                    this.soundcardCapturer = CapturerFactory.CreateSoundcardCapturer();
                    this.soundcardCapturer.CaptureError += capturer_CaptureError;
                    audioSampleRate = this.soundcardCapturer.SampleRate;
                    channelCount = this.soundcardCapturer.ChannelCount;
                }

                //if (this.checkBox_micro.IsChecked == true && this.checkBox_soundCard.IsChecked == true)
                if (this.checkBox_micro_Checked == true && this.checkBox_soundCard_Checked == true)
                {
                    //混音器
                    this.audioMixter = CapturerFactory.CreateAudioMixter(this.microphoneCapturer, this.soundcardCapturer, SoundcardMode4Mix.DoubleChannel, true);
                    this.audioMixter.AudioMixed += audioMixter_AudioMixed; //如果是混音,则不再需要预订microphoneCapturer和soundcardCapturer的AudioCaptured事件
                    audioSampleRate = this.audioMixter.SampleRate;
                    channelCount = this.audioMixter.ChannelCount;
                }
                //else if (this.checkBox_micro.IsChecked == true)
                else if (this.checkBox_micro_Checked == true)
                {
                    this.microphoneCapturer.AudioCaptured += audioMixter_AudioMixed;
                }
                //else if (this.checkBox_soundCard.IsChecked == true)
                else if (this.checkBox_soundCard_Checked == true)
                {
                    this.soundcardCapturer.AudioCaptured += audioMixter_AudioMixed;
                }
                #endregion

                #region 开始采集
                //if (this.checkBox_micro.IsChecked == true)
                if (this.checkBox_micro_Checked == true)
                {
                    this.microphoneCapturer.Start();
                }
                //if (this.checkBox_soundCard.IsChecked == true)
                if (this.checkBox_soundCard_Checked == true)
                {
                    this.soundcardCapturer.Start();
                }

                //if (this.radioButton_camera.IsChecked == true)
                if (this.radioButton_camera_Checked == true)
                {
                    this.cameraCapturer.Start();
                }
                //else if (this.radioButton_desktop.IsChecked == true)
                else if (this.radioButton_desktop_Checked == true)
                {
                    this.desktopCapturer.Start();
                }
                #endregion

                #region 录制组件
                if (this.justRecordAudio) //仅仅录制声音
                {
                    this.audioFileMaker = new AudioFileMaker();
                    this.audioFileMaker.Initialize("test.mp3", audioSampleRate, channelCount);
                }
                else
                {
                    //宽和高修正为4的倍数
                    this.sizeRevised = (videoSize.Width % 4 != 0) || (videoSize.Height % 4 != 0);
                    if (this.sizeRevised)
                    {
                        videoSize = new System.Drawing.Size(videoSize.Width / 4 * 4, videoSize.Height / 4 * 4);
                    }

                    //if (this.checkBox_micro.IsChecked == false && this.checkBox_soundCard.IsChecked == false) //仅仅录制图像
                    if (this.checkBox_micro_Checked == false && this.checkBox_soundCard_Checked == false) //仅仅录制图像
                    {
                        this.justRecordVideo = true;
                        this.silenceVideoFileMaker = new SilenceVideoFileMaker();
                        this.silenceVideoFileMaker.Initialize("test.mp4", VideoCodecType.H264, videoSize.Width, videoSize.Height, frameRate, VideoQuality.Middle);
                    }
                    else //录制声音+图像
                    {
                        this.justRecordVideo = false;
                        this.videoFileMaker = new VideoFileMaker();
                        this.videoFileMaker.Initialize("test.mp4", VideoCodecType.H264, videoSize.Width, videoSize.Height, frameRate, VideoQuality.High, AudioCodecType.AAC, audioSampleRate, channelCount, true);

                    }
                }
                #endregion

                this.isRecording = true;
                this.isParsing = false;
                this.timer.Start();

                //this.checkBox_micro.IsEnabled = false;
                //this.checkBox_soundCard.IsEnabled = false;
                //this.radioButton_desktop.IsEnabled = false;
                //this.radioButton_camera.IsEnabled = false;
                //this.radioButton_justAudio.IsEnabled = false;

                //this.button_Start.IsEnabled = false;
                MessageBox.Show("已开始本地录制！");
            }
            catch (Exception ee)
            {
                MessageBox.Show("开启本地录制失败，请检查摄像头和麦克风设备是否连接好！");
            }
        }
        #endregion

        #region 暂停
        private void Parse()
        {
            //TODO 暂停当前录制或恢复录制
            //TODO label 中显示实际录制的时间，需要考虑暂停和恢复这种情况。 格式为 hh:mm:ss
            if (this.isParsing)
            {
                this.isParsing = false;
            }
            else
            {
                this.isParsing = true;
            }
            //this.button_Parse.Content = (!this.isParsing ? "暂停" : "恢复");


        }
        #endregion

        #region 结束
        public void Stop()
        {
            try
            {
                ////TODO 结束录制，保存文件 
                //this.checkBox_micro.IsEnabled = true;
                //this.checkBox_soundCard.IsEnabled = true;
                //this.radioButton_camera.IsEnabled = true;
                //this.radioButton_desktop.IsEnabled = true;
                //this.radioButton_justAudio.IsEnabled = true;

                //this.button_Start.IsEnabled = true;

                //this.button_Parse.Content = "暂停";

                //if (this.checkBox_micro.IsChecked == true) // 麦克风
                if (this.checkBox_micro_Checked == true) // 麦克风
                {
                    this.microphoneCapturer.Stop();
                }
                //if (this.checkBox_soundCard.IsChecked == true) //声卡
                if (this.checkBox_soundCard_Checked == true) //声卡
                {
                    this.soundcardCapturer.Stop();
                }
                //if (this.radioButton_camera.IsChecked == true)
                if (this.radioButton_camera_Checked == true)
                {
                    this.cameraCapturer.Stop();
                }
                //if (this.radioButton_desktop.IsChecked == true)
                if (this.radioButton_desktop_Checked == true)
                {
                    this.desktopCapturer.Stop();
                }
                if (this.justRecordAudio)
                {
                    this.audioFileMaker.Close(true);
                }
                else
                {
                    if (!this.justRecordVideo)
                    {
                        this.videoFileMaker.Close(true);
                    }
                    else
                    {
                        this.silenceVideoFileMaker.Close(true);
                    }
                }

                this.isRecording = false;
                MessageBox.Show("本地录制已完成！");
            }
            catch
            {
                MessageBox.Show("由于本地录制开启失败，尚未进行录制！");
            }
        }
        #endregion

        void audioMixter_AudioMixed(byte[] audioData)
        {
            if (this.isRecording && !this.isParsing)
            {
                if (this.justRecordAudio)
                {
                    this.audioFileMaker.AddAudioFrame(audioData);
                }
                else
                {
                    if (!this.justRecordVideo)
                    {
                        this.videoFileMaker.AddAudioFrame(audioData);
                    }
                }

            }
        }

        void capturer_CaptureError(Exception ex)
        {

        }

        #region ImageCaptured
        void ImageCaptured(Bitmap bm)
        {
            if (this.isRecording && !this.isParsing)
            {
                //这里可能要裁剪
                Bitmap imgRecorded = bm;
                if (this.sizeRevised) // 对图像进行裁剪，  MFile要求录制的视频帧的长和宽必须是4的整数倍。
                {
                    imgRecorded = ESBasic.Helpers.ImageHelper.RoundSizeByNumber(bm, 4);
                    bm.Dispose();
                }

                if (!this.justRecordVideo)
                {
                    this.videoFileMaker.AddVideoFrame(imgRecorded);
                }
                else
                {
                    this.silenceVideoFileMaker.AddVideoFrame(imgRecorded);
                }
            }
        }
        #endregion

        //private void Window_Closing(object sender, CancelEventArgs e)
        //{
        //    if (this.isRecording)
        //    {
        //        MessageBox.Show("正在录制视频，请先停止！");
        //        e.Cancel = true;
        //        return;
        //    }

        //    e.Cancel = false;

        //}

        #region radioButton_camera_Checked
        //private void radioButton_camera_Checked(object sender, RoutedEventArgs e)
        //{
        //    this.label1.Visibility = Visibility.Visible;
        //    this.label2.Visibility = Visibility.Visible;
        //    this.textBox_width.Visibility = Visibility.Visible;
        //    this.textBox_height.Visibility = Visibility.Visible;
        //}
        #endregion

        #region radioButton_desktop_Checked
        //private void radioButton_desktop_Checked(object sender, RoutedEventArgs e)
        //{
        //    this.label1.Visibility = Visibility.Hidden;
        //    this.label2.Visibility = Visibility.Hidden;
        //    this.textBox_width.Visibility = Visibility.Hidden;
        //    this.textBox_height.Visibility = Visibility.Hidden;
        //}
        #endregion

        #region radioButton_justAudio_Checked
        private void radioButton_justAudio_Checked(object sender, RoutedEventArgs e)
        {
            //this.label1.Visibility = Visibility.Hidden;
            //this.label2.Visibility = Visibility.Hidden;
            //this.textBox_width.Visibility = Visibility.Hidden;
            //this.textBox_height.Visibility = Visibility.Hidden;
        }
        #endregion
    }
}
