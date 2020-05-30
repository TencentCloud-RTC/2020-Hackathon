using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Remoting.Channels;
using System.Runtime.Remoting.Channels.Ipc;
using System.Text;
using CloudDesktop.Common;

namespace CloudDesktop
{
    public static class Program
    {
        private static string ProductName = "HeiSirCloudDesktop";
        // 外部函数声明
        [DllImport("User32.dll")]
        private static extern Int32 SetProcessDPIAware();

        /// <summary>
        /// Application Entry Point.
        /// </summary>
        [System.STAThreadAttribute()]
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "4.0.0.0")]
        public static void Main()
        {

            bool createNew;
            using (System.Threading.Mutex mutex = new System.Threading.Mutex(true, ProductName, out createNew))
            {
                if (/*true ||*/ createNew)
                {
                    ManageLiteAV.CrashDump dump = new ManageLiteAV.CrashDump();
                    dump.open();

                    SetProcessDPIAware();   // 默认关闭高DPI，避免SDK录制出错

                    Log.Open();
                    // 初始化SDK的 Local 配置信息
                    DataManager.GetInstance().InitConfig();

                    Process processes = Process.GetCurrentProcess();
                    Log.I(String.Format("Progress <{0}, {1}>", processes.ProcessName, processes.Id));

                    CloudDesktop.App app = new CloudDesktop.App();
                    app.InitializeComponent();
                    app.Run();

                    // 退出程序前写入最新的 Local 配置信息。
                    DataManager.GetInstance().Uninit();
                    DataManager.GetInstance().Dispose();

                    Log.Close();

                    dump.close();
                }
                else
                {
                    IpcClientChannel channel = new IpcClientChannel();
                    if (channel != null)
                    {
                        try
                        {
                            ChannelServices.RegisterChannel(channel, false);
                            WndHandle obj = (WndHandle)Activator.GetObject(typeof(WndHandle), "ipc://" + ProductName + "ServerChannel" + "/WindowsHandle");
                            if (obj != null)
                            {
                                IntPtr nWndHandle = obj.GetWndHandle();
                                ShowWindowAsync(nWndHandle, SW_SHOWNOMAL);//显示
                                SetForegroundWindow(nWndHandle);//当到最前端
                            }
                            ChannelServices.UnregisterChannel(channel);
                        }
                        catch (Exception)
                        {
                        }
                    }
                }
            }
        }
        public class WndHandle : MarshalByRefObject
        {
            public static IntPtr m_WndHandle = IntPtr.Zero;
            public static void SetWnd(IntPtr hwnd)
            {
                m_WndHandle = hwnd;
            }
            public IntPtr GetWndHandle()
            {
                return WndHandle.m_WndHandle;
            }
        }

        public const int SW_SHOWNOMAL = 1;
        [DllImport("User32.dll")]
        public static extern bool ShowWindowAsync(IntPtr hWnd, int cmdShow);
        [DllImport("User32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
    }
}
