using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.UI
{
    /// <summary>
    /// <para>功能：日志类(共通)</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2019.11.28</para>
    /// </summary>
    public class Log
    {
        private log4net.ILog ILog { get; set; }

        private Log()
        {
        }

        public static Log GetLog(Type type)
        {
            Log log = new Log();
            log.ILog = log4net.LogManager.GetLogger(type);
            return log;
        }

        /// <summary>
        /// 写信息内容的日志
        /// </summary>
        /// <param name="message"></param>
        public void Info(string message)
        {
            this.ILog.Info(message);
        }

        /// <summary>
        /// 写警告内容的日志
        /// </summary>
        /// <param name="message"></param>
        public void Warn(string message)
        {
            this.ILog.Warn(message);
        }

        /// <summary>
        /// 写调试内容的日志
        /// </summary>
        /// <param name="message"></param>
        public void Debug(string message)
        {
            this.ILog.Debug(message);
        }
    }
}
