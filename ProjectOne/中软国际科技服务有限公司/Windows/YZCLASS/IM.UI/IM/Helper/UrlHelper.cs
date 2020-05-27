using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace IM.Helper
{

    public class UrlHelper
    {

        /// <summary>
        /// 组装GET请求的URL
        /// </summary>
        /// <param name="url">URL网址，不能包含?</param>
        /// <param name="nvc">Get请求的参数</param>
        /// <returns>带参数的URL</returns>
        public static string CombGetUrl(string url, NameValueCollection nvc)
        {
            string result = string.Empty;
            if (nvc != null && nvc.Count > 0)
            {
                StringBuilder sb = new StringBuilder("?");
                string[] keys = nvc.AllKeys;
                for (int i = 0; i < keys.Length; i++)
                {
                    if (i == keys.Length - 1)
                        sb.Append(string.Format("{0}={1}", HttpUtility.UrlEncode(keys[i]), HttpUtility.UrlEncode(nvc[keys[i]])));
                    else
                        sb.Append(string.Format("{0}={1}&", HttpUtility.UrlEncode(keys[i]), HttpUtility.UrlEncode(nvc[keys[i]])));
                }
                result = url + sb.ToString();
            }
            return result;
        }
    }
}
