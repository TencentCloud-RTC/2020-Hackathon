using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.UI
{
    public class UserSig
    {
        private int _appID = 0;

        private string _secretKey = "";

        /// <summary>
        /// 签名过期时间，建议不要设置的过短
        /// 
        /// 时间单位：秒
        /// 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
        /// </summary>
        public const int EXPIRETIME = 60480000;

        /// <summary>
        /// 混流接口功能实现需要补齐此账号信息。
        /// 
        /// 获取途径：腾讯云网页控制台->实时音视频->您的应用(eg客服通话)->账号信息面板可以获取 appid/bizid
        /// </summary>
        //public const int APPID = 0;
        //public const int BIZID = 0;

        public UserSig(int appID, string secretKey)
        {
            _appID = appID;
            _secretKey = secretKey;
        }
        
        public string Gen(string userId)
        {
            if (_appID == 0 || string.IsNullOrEmpty(_secretKey)) return null;
            TLSSigAPIv2 api = new TLSSigAPIv2(_appID, _secretKey);
            // 统一转换为UTF8，SDK内部是用UTF8编码。
            return api.GenSig(Util.UTF16To8(userId));
        }

    }
}
