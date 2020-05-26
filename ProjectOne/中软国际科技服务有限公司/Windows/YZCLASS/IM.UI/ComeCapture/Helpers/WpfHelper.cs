using System;
using System.Windows.Threading;

namespace IM.UI
{
    public static class WpfHelper
    {
        public static Dispatcher MainDispatcher { get; set; }
        public static void SafeRun(this Action action)
        {
            if (MainDispatcher == null)
            {
                action();
                return;
            }

            if (!MainDispatcher.CheckAccess())
            {
                MainDispatcher.BeginInvoke(action);
                return;
            }
            action();
        }
    }
}
