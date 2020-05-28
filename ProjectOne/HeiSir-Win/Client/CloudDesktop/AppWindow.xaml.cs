using CloudDesktop.Common;
using ManageLiteAV;
using Microsoft.Win32;
using Newtonsoft.Json.Linq;
using Quobject.SocketIoClientDotNet.Client;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Runtime.Remoting;
using System.Runtime.Remoting.Channels;
using System.Runtime.Remoting.Channels.Ipc;
using System.Security;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using WindowsInput;
using WindowsInput.Native;
using static CloudDesktop.Program;
using Path = System.IO.Path;

namespace CloudDesktop
{
    /// <summary>
    /// AppWindow.xaml 的交互逻辑
    /// </summary>
    public partial class AppWindow : Window, IDisposable, ITRTCCloudCallback
    {
        private int m_nMachineGUID;
        private string m_sMachineGUID;
        private string m_sMachinePassword;
        private string ProductName = "HeiSirCloudDesktop";
        private Socket _socket = null; 
        private Manager _manager = null;

        private ITRTCCloud trtcCloud = null;

        private IpcServerChannel m_IpcServerChannel = null;
        private bool mIsEnterSuccess;

        public AppWindow()
        {
            InitializeComponent();
        }

        public string Endpoint { get; internal set; }

        public bool IsConnected
        {
            get { return _manager != null && _manager.ReadyState == Manager.ReadyStateEnum.OPEN; }
        }
        internal void Reconnect()
        {
            try
            {
                _socket = IO.Socket(Endpoint,
                    new IO.Options()
                    {
                        // default is 1000, default attempts is int.MaxValue
                        ReconnectionDelay = 5000,
                        
                    });

                var Success = new Action(() =>
                {
                    SetMessage("连接服务器成功.");
                    _ = this.Dispatcher.BeginInvoke(new Action(() =>
                      {
                          statuIcon.Background = new SolidColorBrush(System.Windows.Media.Color.FromArgb(255, 39, 201, 64));
                      }));
                    RegClient();
                });
                var Fail = new Action(() =>
                {
                    SetMessage("与服务器断开连接.");
                    this.Dispatcher.BeginInvoke(new Action(() =>
                    {
                        statuIcon.Background = System.Windows.Media.Brushes.Red;
                    }));
                });
                _socket.On(Socket.EVENT_CONNECT, Success);
                _socket.On(Socket.EVENT_CONNECT_ERROR, Fail);
                _socket.On(Socket.EVENT_DISCONNECT, Fail);

                _socket.On("control_connect", message => OnControlConnect((JObject)message));
                _socket.On("control_connect_result", message => OnControlConnectResult((JObject)message));
                _socket.On("control_connect_result_ack", message => OnControlConnectResultAck((JObject)message));

                _manager = _socket.Io();
            }
            catch (Exception err)
            {
                status.Content = $"连接服务器异常：{err.Message}";
            }
        }

        private void SetMessage(string message)
        {
            this.Dispatcher.BeginInvoke(new Action(() =>
            {
                status.Content = message;
            }));
        }


        private void app_Loaded(object sender, RoutedEventArgs e)
        {
            //检查启动项
            RegistryKey HKLM = Registry.LocalMachine;
            try
            {
                if (HKLM != null)
                {
                    RegistryKey kRun = HKLM.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
                    if (kRun != null)
                    {
                        checkBox_AutoStart.IsChecked = string.IsNullOrEmpty((string)kRun.GetValue(ProductName)) ? false : true;
                        kRun.Close();
                    }
                    HKLM.Close();
                }
            }
            catch (Exception)
            {
                HKLM.Close();
            }

            int nMachineGUID = Computer.GetMachineGUID() /*+ DateTime.Now.Second*/;
            if (nMachineGUID > 0)
            {
                m_nMachineGUID = nMachineGUID;
                m_sMachineGUID = m_nMachineGUID.ToString();
                Console.WriteLine("MachineGUID:" + m_sMachineGUID);
                textBox_ComputerId.Text = m_sMachineGUID;
            }
            else
            {
                textBox_ComputerId.Text = Computer.Instance().GetIPAddress();
            }

            NewPassword();
            statuIcon.Background = System.Windows.Media.Brushes.Red;
            status.Content = "正在连接服务器...";
            Endpoint = "https://heisir.djdeveloper.cn:3005";
            Reconnect();

            var p = Path.Combine(Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName), "config.json");
            var j = JObject.Parse(File.Exists(p) ? File.ReadAllText(p, Encoding.UTF8) : "{}");
            if (j["machines"] != null && j["machines"] is JArray jArr)
            {
                foreach (var item in jArr)
                {
                    ConnId.Items.Add(new ComboBoxItem() { Content = item });
                }
            }

            RegIpcServer();
        }


        private void RegIpcServer()
        {
            try
            {
                WndHandle.SetWnd(new WindowInteropHelper(this).Handle);
                m_IpcServerChannel = new IpcServerChannel(ProductName + "ServerChannel");
                if (m_IpcServerChannel != null)
                {
                    ChannelServices.RegisterChannel(m_IpcServerChannel, false);
                    RemotingConfiguration.RegisterWellKnownServiceType(typeof(WndHandle), "WindowsHandle", WellKnownObjectMode.SingleCall);
                }
            }
            catch (Exception)
            {

            }
        }

        private void RegClient()
        {
            if (IsConnected && _socket != null)
            {
                JObject jObject = new JObject
                {
                    ["id"] = m_sMachineGUID,
                    ["password"] = m_sMachinePassword
                };
                _socket.Emit("reg client", jObject);
            }
        }


        private void OnControlConnect(JObject message)
        {
            JObject jObject = new JObject
            {
                ["src_id"] = m_sMachineGUID,
                ["dest_id"] = message["src_id"]
            };
            if (message["password"].ToString() == m_sMachinePassword)
            {
                jObject["code"] = 0;
                jObject["message"] = "success";
            }
            else
            {
                jObject["code"] = -1;
                jObject["message"] = "验证失败，请输入正确的密码。";
            }
            if (IsConnected && _socket != null)
            {
                _socket.Emit("control_connect_result", jObject);
            }
        }


        private void OnControlConnectResult(JObject message)
        {
            this.Dispatcher.BeginInvoke(new Action(() => {
                StartConn.Content = "开始连接";
                StartConn.IsEnabled = true;
            }));
            if (!string.IsNullOrEmpty( message["src_id"].ToString() ))
            {
                try
                {
                    var src_id = message["src_id"].ToString();
                    var p = Path.Combine(Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName), "config.json");
                    var j = JObject.Parse( File.Exists(p) ? File.ReadAllText(p,Encoding.UTF8):"{}");
                    if (j["machines"] != null && j["machines"] is JArray jArr)
                    {
                        if(jArr.ToString().IndexOf($"\"{src_id}\"") == -1)
                        {
                            jArr.Add(src_id);

                            this.Dispatcher.BeginInvoke(new Action(() => {
                                ConnId.Items.Add(new ComboBoxItem() { Content = src_id });
                            }));

                            File.WriteAllText(p, j.ToString(), Encoding.UTF8);
                        }
                    }
                    else
                    {
                        var jArr_ = new JArray();
                        jArr_.Add(src_id);
                        j["machines"] = jArr_;
                        File.WriteAllText(p, j.ToString(), Encoding.UTF8);
                    }
                }
                catch (Exception)
                {

                }
            }

            if ((int)message["code"] == 0)
            {
                SetMessage("连接成功");

                //给被控制端发送ack，让其加入房间
                if (IsConnected && _socket != null)
                {
                    JObject jObject = new JObject
                    {
                        ["src_id"] = m_sMachineGUID,
                        ["dest_id"] = message["src_id"].ToString()
                    };
                    _socket.Emit("control_connect_result_ack", jObject);
                }

                this.Dispatcher.BeginInvoke(new Action(() =>
                {
                    var screenControl = new ScreenControl();
                    screenControl.m_nMachineGUID = m_nMachineGUID;
                    screenControl.m_nPeerMachineGUID = int.Parse(message["src_id"].ToString());

                    screenControl.Show();
                }));

            }
            else
            {
                SetMessage(message["message"].ToString());
            }
        }


        private void OnControlConnectResultAck(JObject message)
        {

            this.Dispatcher.BeginInvoke(new Action(() =>
            {
                EnterSelfRoom();
            }));

        }

        private void EnterSelfRoom()
        {
            if (trtcCloud == null)
            {
                trtcCloud = ITRTCCloud.getTRTCShareInstance();
                Log.I(String.Format(" SDKVersion : {0}", trtcCloud.getSDKVersion()));
                trtcCloud.addCallback(this);

                TRTCParams trtcParams = new TRTCParams();
                trtcParams.sdkAppId = GenerateTestUserSig.SDKAPPID;
                trtcParams.roomId = (uint)m_nMachineGUID;
                trtcParams.userId = "source";
                trtcParams.userSig = GenerateTestUserSig.GetInstance().GenTestUserSig(trtcParams.userId);
                trtcParams.privateMapKey = "";
                trtcParams.businessInfo = "";
                trtcParams.role = TRTCRoleType.TRTCRoleAnchor;

                //trtcCloud.setVideoEncoderParam();

                // 用户进房
                trtcCloud.enterRoom(ref trtcParams, TRTCAppScene.TRTCAppSceneVideoCall);
                TRTCVideoEncParam encParams = DataManager.GetInstance().videoEncParams;   // 视频编码参数设置
                TRTCNetworkQosParam qosParams = DataManager.GetInstance().qosParams;      // 网络流控相关参数设置
                trtcCloud.setVideoEncoderParam(ref encParams);
                trtcCloud.setSubStreamEncoderParam(ref encParams);
                trtcCloud.setNetworkQosParam(ref qosParams);

            }
        }





        private void Button_Close(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void WndTitle_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }

        private void app_Closed(object sender, EventArgs e)
        {

        }

        private string NewPassword()
        {
            m_sMachinePassword = Computer.MD5Encrypt(DateTime.Now.ToLongTimeString()).Substring(8, 6).ToLower();
            m_sMachinePassword = "trtcsdk";
            textBox_ComputerPassword.Text = m_sMachinePassword;
            RegClient();
            return textBox_ComputerPassword.Text;
        }

        private void BtnNewPsw_Click(object sender, RoutedEventArgs e)
        {
            NewPassword();
        }

        private void checkBox_AutoStart_Click(object sender, RoutedEventArgs e)
        {
            bool bIsAutoStart = false;
            bIsAutoStart = checkBox_AutoStart.IsChecked ?? false;

            try
            {
                RegistryKey HKLM = Registry.LocalMachine;
                if (HKLM != null)
                {
                    RegistryKey kRun = HKLM.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
                    if (kRun != null)
                    {
                        if (bIsAutoStart)
                        {
                            try
                            {
                                kRun.SetValue(ProductName, "\"" + Process.GetCurrentProcess().MainModule.FileName + "\" -hide");
                                if (string.IsNullOrEmpty((string)kRun.GetValue(ProductName)))
                                {
                                    this.Dispatcher.
                                    BeginInvoke(new Action(() => {
                                        checkBox_AutoStart.IsChecked = false;
                                    }));
                                }
                            }
                            catch (Exception)
                            {
                                if (string.IsNullOrEmpty((string)kRun.GetValue(ProductName)))
                                {
                                    this.Dispatcher.
                                    BeginInvoke(new Action(() => {
                                        checkBox_AutoStart.IsChecked = false;
                                    }));
                                }
                            }
                        }
                        else
                        {
                            try
                            {
                                kRun.DeleteValue(ProductName);
                                if (!string.IsNullOrEmpty((string)kRun.GetValue(ProductName)))
                                {
                                    this.Dispatcher.BeginInvoke(new Action(() => {
                                        checkBox_AutoStart.IsChecked = true;
                                    }));
                                }
                            }
                            catch (Exception)
                            {
                                if (!string.IsNullOrEmpty((string)kRun.GetValue(ProductName)))
                                {
                                    this.Dispatcher.BeginInvoke(new Action(() => {
                                        checkBox_AutoStart.IsChecked = true;
                                    }));
                                }
                            }

                        }
                        kRun.Close();
                    }
                }
                HKLM.Close();
            }
            catch (SecurityException)
            {
                MessageBox.Show("没有权限修改注册表，请用管理员权限启动云桌面");
            }
            catch (Exception err)
            {
                Console.WriteLine(err.Message);
            }
        }

        private void StartConn_Click(object sender, RoutedEventArgs e)
        {
            StartConn.IsEnabled = false;
            if (IsConnected && _socket != null)
            {
                JObject jObject = new JObject
                {
                    ["src_id"] = m_sMachineGUID,
                    ["dest_id"] = ConnId.Text,
                    ["password"] = ConnPassword.Password
                };
                _socket.Emit("control_connect", jObject);
                SetMessage($"正在连接 {ConnId.Text} ...");

                StartConn.Content = "正在连接";
            }
            else
            {
                MessageBox.Show("您未连接到互联网，请连接到网络后重试。");
                StartConn.IsEnabled = true;
            }
        }

        public void Dispose()
        {
            trtcCloud = null;
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
            this.Dispatcher.Invoke(new Action(() => {
                if (result >= 0)
                {
                    trtcCloud.muteLocalAudio(true);
                    trtcCloud.muteLocalVideo(true);
                    trtcCloud.muteAllRemoteAudio(true);

                    // 进房成功
                    mIsEnterSuccess = true;

                    
                    SIZE a = new SIZE() { cx = 0,cy = 0}, b = new SIZE() { cx = 0, cy = 0 };
                    var list = trtcCloud.getScreenCaptureSources(ref a, ref b);
                    for (uint i = 0; i < list.getCount(); i++)
                    {
                        var si = list.getSourceInfo(i);
                        if (si.type == TRTCScreenCaptureSourceType.TRTCScreenCaptureSourceTypeScreen)
                        {
                            RECT captureRect = new RECT();
                            trtcCloud.selectScreenCaptureTarget(ref si,ref captureRect, false, false);
                            break;
                        }
                    }

                    trtcCloud.startScreenCapture(IntPtr.Zero);
                    trtcCloud.showDebugView(2);
                }
                else
                {
                    // 进房失败
                    mIsEnterSuccess = false;
                    SetMessage("进房失败，请重试");
                }
            }));
        }

        public void onExitRoom(int reason)
        {
            Log.I($"onExitRoom reason = {reason}");

            trtcCloud?.Dispose();
            trtcCloud = null;

            this.Dispatcher.BeginInvoke(new Action(() =>
            {
                EnterSelfRoom();
            }));

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
        }

        public void onUserAudioAvailable(string userId, bool available)
        {
            Log.I($"onUserAudioAvailable userId:{userId} available:{available}");
        }

        public void onFirstVideoFrame(string userId, TRTCVideoStreamType streamType, int width, int height)
        {
            Log.I($"onFirstVideoFrame");
        }

        public void onFirstAudioFrame(string userId)
        {
            Log.I($"onFirstAudioFrame");
        }

        public void onSendFirstLocalVideoFrame(TRTCVideoStreamType streamType)
        {
            Log.I($"onSendFirstLocalVideoFrame");
        }

        public void onSendFirstLocalAudioFrame()
        {
            Log.I($"onSendFirstLocalAudioFrame ");
        }

        public void onUserEnter(string userId)
        {
            Log.I($"onUserEnter userId:{userId}");
        }

        public void onUserExit(string userId, int reason)
        {
            Log.I($"onUserExit userId:{userId} reason:{reason}");
        }

        public void onNetworkQuality(TRTCQualityInfo localQuality, TRTCQualityInfo[] remoteQuality, uint remoteQualityCount)
        {

        }

        public void onStatistics(TRTCStatistics statis)
        {

        }

        public void onConnectionLost()
        {
            Log.I($"onConnectionLost");
        }

        public void onTryToReconnect()
        {
            Log.I($"onTryToReconnect");
        }

        public void onConnectionRecovery()
        {
            Log.I($"onConnectionRecovery");
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
        private KeyboardSimulator _Keyboard =  new KeyboardSimulator(new InputSimulator());
        public void onRecvCustomCmdMsg(string userId, int cmdID, uint seq, byte[] msg, uint msgSize)
        {
            try
            {
                var content = Encoding.UTF8.GetString(msg, 0, (int)msgSize);
                Log.I(content);
                var o = JObject.Parse(content);
                var cmd = o["cmd"].ToString();
                switch (cmd)
                {
                    case "MouseDown":
                    case "MouseMove":
                    case "MouseUp":
                        {

                        var x = (int)o["X"];
                        var y = (int)o["Y"];
                        var Delta = (uint)o["Delta"];

                        uint flag = 0;
                        POINT p = new POINT(0, 0);
                        if (GetCursorPos(ref p) && (p.X != x || p.Y != y))
                        {
                            flag |= (uint)ENUM_MouseOperate.Move;
                        }
                        flag |= (uint)o["Operate"];

                        var cx = GetSystemMetrics(0);
                        var cy = GetSystemMetrics(1);

                        INPUT mouseDownInput = new INPUT();
                        mouseDownInput.type = SendInputEventType.InputMouse;
                        mouseDownInput.mkhi.mi.dwFlags = (MouseEventFlags)((uint)MouseEventFlags.MOUSEEVENTF_ABSOLUTE | flag);
                        mouseDownInput.mkhi.mi.dx = x * 65535 / (cx-1);
                        mouseDownInput.mkhi.mi.dy = y * 65535 / (cy - 1);
                        mouseDownInput.mkhi.mi.mouseData = Delta;
                        SendInput(1, ref mouseDownInput, Marshal.SizeOf(mouseDownInput));

                        }
                        break;
                    case "MouseWheel":
                        {
                            var x = (int)o["X"];
                            var y = (int)o["Y"];
                            var Delta = (uint)o["Delta"];

                            uint flag = 0;
                            flag |= (uint)o["Operate"];

                            INPUT mouseDownInput = new INPUT();
                            mouseDownInput.type = SendInputEventType.InputMouse;
                            mouseDownInput.mkhi.mi.dwFlags = (MouseEventFlags)flag;
                            mouseDownInput.mkhi.mi.dx = 0;
                            mouseDownInput.mkhi.mi.dy = 0;
                            mouseDownInput.mkhi.mi.mouseData = Delta;
                            SendInput(1, ref mouseDownInput, Marshal.SizeOf(mouseDownInput));
                        }
                        break;
                    case "KeyDown":
                        {
                            var key = (int)o["KeyCode"];
                            _Keyboard.KeyDown((VirtualKeyCode)key);
                        }
                        break;
                    case "KeyUp":
                        {
                            var key = (int)o["KeyCode"];
                            _Keyboard.KeyUp((VirtualKeyCode)key);
                        }
                        break;
                    default:
                        break;
                }

            }
            catch (Exception)
            {
            }
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
            Log.I($"onScreenCaptureCovered");
        }

        public void onScreenCaptureStarted()
        {
            Log.I($"onScreenCaptureStarted");
        }

        public void onScreenCapturePaused(int reason)
        {
            Log.I($"onScreenCapturePaused");
        }

        public void onScreenCaptureResumed(int reason)
        {

            Log.I($"onScreenCaptureResumed");
        }

        public void onScreenCaptureStoped(int reason)
        {
            Log.I($"onScreenCaptureStoped");
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



        [DllImport("user32.dll", SetLastError = true)]
        static extern uint SendInput(uint nInputs, ref INPUT pInputs, int cbSize);

        [StructLayout(LayoutKind.Sequential)]
        struct INPUT
        {
            public SendInputEventType type;
            public MouseKeybdhardwareInputUnion mkhi;
        }
        [StructLayout(LayoutKind.Explicit)]
        struct MouseKeybdhardwareInputUnion
        {
            [FieldOffset(0)]
            public MouseInputData mi;

            [FieldOffset(0)]
            public KEYBDINPUT ki;

            [FieldOffset(0)]
            public HARDWAREINPUT hi;
        }
        [StructLayout(LayoutKind.Sequential)]
        struct KEYBDINPUT
        {
            public ushort wVk;
            public ushort wScan;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }
        [StructLayout(LayoutKind.Sequential)]
        struct HARDWAREINPUT
        {
            public int uMsg;
            public short wParamL;
            public short wParamH;
        }
        struct MouseInputData
        {
            public int dx;
            public int dy;
            public uint mouseData;
            public MouseEventFlags dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }
        [Flags]
        enum MouseEventFlags : uint
        {
            MOUSEEVENTF_MOVE = 0x0001,
            MOUSEEVENTF_LEFTDOWN = 0x0002,
            MOUSEEVENTF_LEFTUP = 0x0004,
            MOUSEEVENTF_RIGHTDOWN = 0x0008,
            MOUSEEVENTF_RIGHTUP = 0x0010,
            MOUSEEVENTF_MIDDLEDOWN = 0x0020,
            MOUSEEVENTF_MIDDLEUP = 0x0040,
            MOUSEEVENTF_XDOWN = 0x0080,
            MOUSEEVENTF_XUP = 0x0100,
            MOUSEEVENTF_WHEEL = 0x0800,
            MOUSEEVENTF_VIRTUALDESK = 0x4000,
            MOUSEEVENTF_ABSOLUTE = 0x8000
        }
        enum SendInputEventType : int
        {
            InputMouse,
            InputKeyboard,
            InputHardware
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct POINT
        {
            public int X;
            public int Y;

            public POINT(int x, int y)
            {
                this.X = x;
                this.Y = y;
            }
        }

        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(ref POINT lpPoint);

        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern int GetSystemMetrics(int nIndex);
    }
}
