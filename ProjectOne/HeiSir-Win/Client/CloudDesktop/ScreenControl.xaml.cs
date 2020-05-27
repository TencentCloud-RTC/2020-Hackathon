using CloudDesktop.Common;
using ManageLiteAV;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace CloudDesktop
{
    /// <summary>
    /// ScreenControl.xaml 的交互逻辑
    /// </summary>
    public partial class ScreenControl : Window, IDisposable, ITRTCCloudCallback
    {
        private ITRTCCloud trtcCloud = null;
        public int m_nMachineGUID = 0;
        public int m_nPeerMachineGUID = 0;
        private bool IsHaveStream =false;

        public ScreenControl()
        {
            InitializeComponent();
        }
        private void Screen_Loaded(object sender, RoutedEventArgs e)
        {
            trtcCloud = ITRTCCloud.getTRTCShareInstance();
            Log.I(String.Format(" SDKVersion : {0}", trtcCloud.getSDKVersion()));
            trtcCloud.addCallback(this);

            TRTCParams trtcParams = new TRTCParams();
            trtcParams.sdkAppId = GenerateTestUserSig.SDKAPPID;
            trtcParams.roomId = (uint)m_nPeerMachineGUID;
            trtcParams.userId = $"ctrl_{m_nMachineGUID}";
            trtcParams.userSig = GenerateTestUserSig.GetInstance().GenTestUserSig(trtcParams.userId);
            trtcParams.privateMapKey = "";
            trtcParams.businessInfo = "";
            trtcParams.role = TRTCRoleType.TRTCRoleAnchor;

            // 用户进房
            trtcCloud.enterRoom(ref trtcParams, TRTCAppScene.TRTCAppSceneVideoCall);
            TRTCVideoEncParam encParams = DataManager.GetInstance().videoEncParams;   // 视频编码参数设置
            TRTCNetworkQosParam qosParams = DataManager.GetInstance().qosParams;      // 网络流控相关参数设置
            trtcCloud.setVideoEncoderParam(ref encParams);
            trtcCloud.setNetworkQosParam(ref qosParams);

        }

        private void WndTitle_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }

        private void Button_Close(object sender, RoutedEventArgs e)
        {
            try
            {
                this.Close();
            }
            catch (Exception)
            {
            }
        }

        public void Dispose()
        {
            
        }

        public void onError(TXLiteAVError errCode, string errMsg, IntPtr arg)
        {
            Log.E(errMsg);
        }

        public void onWarning(TXLiteAVWarning warningCode, string warningMsg, IntPtr arg)
        {

            Log.I(warningMsg);
        }

        public void onEnterRoom(int result)
        {
            Log.I($"onEnterRoom result = {result}");

            //trtcCloud.muteAllRemoteVideoStreams(false);
        }

        public void onExitRoom(int reason)
        {
            trtcCloud?.stopAllRemoteView();
            trtcCloud?.removeCallback(this);
            trtcCloud = null;

            this.Close();
        }

        public void onSwitchRole(TXLiteAVError errCode, string errMsg)
        {
            
        }

        public void onConnectOtherRoom(string userId, TXLiteAVError errCode, string errMsg)
        {
            
        }

        public void onDisconnectOtherRoom(TXLiteAVError errCode, string errMsg)
        {
            
        }

        public void onRemoteUserEnterRoom(string userId)
        {

            Log.I($"onRemoteUserEnterRoom userId = {userId}");
        }

        public void onRemoteUserLeaveRoom(string userId, int reason)
        {

            Log.I($"onRemoteUserLeaveRoom userId = {userId}");
        }

        public void onUserVideoAvailable(string userId, bool available)
        {
            Log.I($"onUserVideoAvailable userId:${userId} available:${available}");
        }

        public void onUserSubStreamAvailable(string userId, bool available)
        {
            Log.I($"onUserSubStreamAvailable userId:${userId} available:${available}");
            if (userId == "source")
            {
                this.Dispatcher.BeginInvoke(new Action(() => {
                    if (available)
                    {
                        // 远端辅流自定义渲染 View 动态绑定和监听 SDK 渲染回调
                        trtcCloud.startRemoteSubStreamView(userId, IntPtr.Zero);

                        TXLiteAVVideoView videoView = RenderMapView;
                        videoView.RegEngine(userId, TRTCVideoStreamType.TRTCVideoStreamTypeSub, trtcCloud, false);
                        videoView.SetRenderMode(TRTCVideoFillMode.TRTCVideoFillMode_Fit);
                        videoView.Margin = new Thickness(0);
                        Loading.Visibility = Visibility.Hidden;
                        IsHaveStream = true;
                    }
                    else
                    {
                        // 远端辅流自定义渲染 View 移除绑定
                        trtcCloud.stopRemoteSubStreamView(userId);
                        Loading.Content = "远程已断开";
                        Loading.Visibility = Visibility.Visible;
                        IsHaveStream = false;
                    }
                }));
            }
        }

        public void onUserAudioAvailable(string userId, bool available)
        {
            
        }

        public void onFirstVideoFrame(string userId, TRTCVideoStreamType streamType, int width, int height)
        {
            
        }

        public void onFirstAudioFrame(string userId)
        {
            
        }

        public void onSendFirstLocalVideoFrame(TRTCVideoStreamType streamType)
        {
            
        }

        public void onSendFirstLocalAudioFrame()
        {
            
        }

        public void onUserEnter(string userId)
        {
            
        }

        public void onUserExit(string userId, int reason)
        {
            
        }

        public void onNetworkQuality(TRTCQualityInfo localQuality, TRTCQualityInfo[] remoteQuality, uint remoteQualityCount)
        {
            
        }

        public void onStatistics(TRTCStatistics statis)
        {
            
        }

        public void onConnectionLost()
        {
            
        }

        public void onTryToReconnect()
        {
            
        }

        public void onConnectionRecovery()
        {
            
        }

        public void onSpeedTest(TRTCSpeedTestResult currentResult, uint finishedCount, uint totalCount)
        {
            
        }

        public void onCameraDidReady()
        {
            
        }

        public void onMicDidReady()
        {
            
        }

        public void onUserVoiceVolume(TRTCVolumeInfo[] userVolumes, uint userVolumesCount, uint totalVolume)
        {
            
        }

        public void onDeviceChange(string deviceId, TRTCDeviceType type, TRTCDeviceState state)
        {
            
        }

        public void onTestMicVolume(uint volume)
        {
            
        }

        public void onTestSpeakerVolume(uint volume)
        {
            
        }

        public void onRecvCustomCmdMsg(string userId, int cmdID, uint seq, byte[] msg, uint msgSize)
        {
            
        }

        public void onMissCustomCmdMsg(string userId, int cmdId, int errCode, int missed)
        {
            
        }

        public void onRecvSEIMsg(string userId, byte[] message, uint msgSize)
        {
            
        }

        public void onStartPublishing(int errCode, string errMsg)
        {
            
        }

        public void onStopPublishing(int errCode, string errMsg)
        {
            
        }

        public void onStartPublishCDNStream(int errCode, string errMsg)
        {
            
        }

        public void onStopPublishCDNStream(int errCode, string errMsg)
        {
            
        }

        public void onSetMixTranscodingConfig(int errCode, string errMsg)
        {
            
        }

        public void onAudioEffectFinished(int effectId, int code)
        {
            
        }

        public void onScreenCaptureCovered()
        {
            
        }

        public void onScreenCaptureStarted()
        {
            
        }

        public void onScreenCapturePaused(int reason)
        {
            
        }

        public void onScreenCaptureResumed(int reason)
        {
            
        }

        public void onScreenCaptureStoped(int reason)
        {
            
        }

        public void onPlayBGMBegin(TXLiteAVError errCode)
        {
            
        }

        public void onPlayBGMProgress(uint progressMS, uint durationMS)
        {
            
        }

        public void onPlayBGMComplete(TXLiteAVError errCode)
        {
            
        }

        private void Screen_Closed(object sender, EventArgs e)
        {
        }

        private void Screen_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (trtcCloud != null)
            {

                RenderMapView.RemoveEngine(trtcCloud);

                trtcCloud?.exitRoom();

                e.Cancel = true;
            }
        }

        private void BtnMax_Click(object sender, RoutedEventArgs e)
        {
            this.WindowState = this.WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
        }

        private void RenderMapView_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (trtcCloud != null && IsHaveStream)
            {

                /*
                uint flag = 0;
                MouseControlImpl.POINT p = new MouseControlImpl.POINT(0, 0);
                if (MouseControlImpl.GetCursorPos(ref p) && (p.X != MouseEvent.X || p.Y != MouseEvent.Y))
                {
                    flag |= (uint)ENUM_MouseOperate.Move;
                }
                flag |= (uint)MouseEvent.Operate;
                                   
                SafeNetClientSdk.mouse_event_ex(flag, MouseEvent.X, MouseEvent.Y, (uint)MouseEvent.Delta);
                 */

                var point = e.GetPosition(RenderMapView);
                var o = new JObject();
                o["cmd"] = "MouseDown";
                o["Button"] = (int)e.ChangedButton;
                o["Clicks"] = e.ClickCount;
                o["X"] = point.X;
                o["Y"] = point.Y;
                o["Operate"] = (int)(e.ChangedButton == MouseButton.Left ? ENUM_MouseOperate.LeftDown : (e.ChangedButton == MouseButton.Right ? ENUM_MouseOperate.RightDown : (e.ChangedButton == MouseButton.Middle ? ENUM_MouseOperate.MiddleDown : ENUM_MouseOperate.LeftDown))); ;
                o["Delta"] = 0;
                var data = Encoding.UTF8.GetBytes(o.ToString());
                trtcCloud?.sendCustomCmdMsg(1, data, (uint)data.Length, true, true);
            }   
        }

        private void RenderMapView_MouseMove(object sender, MouseEventArgs e)
        {
            if (trtcCloud != null && IsHaveStream)
            {

                var point = e.GetPosition(RenderMapView);
                var o = new JObject();
                o["cmd"] = "MouseMove";
                o["Button"] = (int)0;
                o["Clicks"] = 0;
                o["X"] = point.X;
                o["Y"] = point.Y;
                o["Operate"] = (int)(e.LeftButton == MouseButtonState.Pressed ? ENUM_MouseOperate.LeftDown : (e.RightButton == MouseButtonState.Pressed ? ENUM_MouseOperate.RightDown : (e.MiddleButton == MouseButtonState.Pressed ? ENUM_MouseOperate.MiddleDown : ENUM_MouseOperate.LeftDown))); ;
                o["Delta"] = 0;
                var data = Encoding.UTF8.GetBytes(o.ToString());
                trtcCloud?.sendCustomCmdMsg(1, data, (uint)data.Length, true, true);
            }
        }

        private void RenderMapView_MouseUp(object sender, MouseButtonEventArgs e)
        {
            if (trtcCloud != null && IsHaveStream)
            {

                var point = e.GetPosition(RenderMapView);
                var o = new JObject();
                o["cmd"] = "MouseUp";
                o["Button"] = (int)e.ChangedButton;
                o["Clicks"] = e.ClickCount;
                o["X"] = point.X;
                o["Y"] = point.Y;
                o["Operate"] = (int)(e.ChangedButton == MouseButton.Left ? ENUM_MouseOperate.LeftDown : (e.ChangedButton == MouseButton.Right ? ENUM_MouseOperate.RightDown : (e.ChangedButton == MouseButton.Middle ? ENUM_MouseOperate.MiddleDown : ENUM_MouseOperate.LeftDown))); ;
                o["Delta"] = 0;
                var data = Encoding.UTF8.GetBytes(o.ToString());
                trtcCloud?.sendCustomCmdMsg(1, data, (uint)data.Length, true, true);
            }
        }

        private void RenderMapView_MouseWheel(object sender, MouseWheelEventArgs e)
        {
            if (trtcCloud != null && IsHaveStream)
            {

                var point = e.GetPosition(RenderMapView);
                var o = new JObject();
                o["cmd"] = "MouseWheel";
                o["Button"] = 0;
                o["Clicks"] = 0;
                o["X"] = point.X;
                o["Y"] = point.Y;
                o["Operate"] = (int)ENUM_MouseOperate.Wheel; ;
                o["Delta"] = e.Delta;
                var data = Encoding.UTF8.GetBytes(o.ToString());
                trtcCloud?.sendCustomCmdMsg(1, data, (uint)data.Length, true, true);
            }
        }

        private void Loading_KeyDown(object sender, KeyEventArgs e)
        {

            if (trtcCloud != null && IsHaveStream)
            {

                var o = new JObject();
                o["cmd"] = "KeyDown";
                o["KeyCode"] = (uint)e.Key;

                var data = Encoding.UTF8.GetBytes(o.ToString());
                trtcCloud?.sendCustomCmdMsg(1, data, (uint)data.Length, true, true);
            }
        }

        private void Loading_KeyUp(object sender, KeyEventArgs e)
        {
            if (trtcCloud != null && IsHaveStream)
            {

                var o = new JObject();
                o["cmd"] = "KeyUp";
                o["KeyCode"] = (uint)e.Key;

                var data = Encoding.UTF8.GetBytes(o.ToString());
                trtcCloud?.sendCustomCmdMsg(1, data, (uint)data.Length, true, true);
            }
        }
    }
}
