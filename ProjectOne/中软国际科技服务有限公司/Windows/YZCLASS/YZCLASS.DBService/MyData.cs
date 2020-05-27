using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    /// <summary>
    /// <para>功能：个人数据模块接口</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.02.10</para>
    /// </summary>
    public interface IMyData
    {
        DataResult Login(string username, string password);
    }

    /// <summary>
    /// <para>功能：个人数据模块类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.02.10</para>
    /// </summary>
    public class MyData : BaseData, IMyData
    {
        public DataResult Login(string username, string password)
        {
            return this.Login("grant_type=password&username=" + username + "&password=" + password);
        }

        /*public DataResult LoginByVerifyCode(string phone, string verifyCode)
        {
            return this.Login("grant_type=phone&phone=" + phone + "&verifyCode=" + verifyCode);
        }

        public DataResult LoginByQRCode(string qrCode)
        {
            return this.Login("grant_type=QRCode&QRCode=" + qrCode);
        }*/

        private DataResult Login(string param)
        {
            string url = string.Format("{0}server-uaa/oauth/token?client_id=zy-titc-client&client_secret=zy-titc-secret&{1}", IMP_DOMAIN, param);
            DataResult result = new DataResult();
            try
            {
                string retString = base.RequestString(RequestMethod.GET, url, null, false);
                dynamic ret = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(retString);
                string authorization = string.Format("{0} {1}", ret["result"]["token_type"], ret["result"]["access_token"]);
                int code = int.Parse(ret["code"].ToString());
                result.Code = code;
                result.Success = (code == 200);
                result.Error = ret["error"].ToString().ToLower() == "true";
                result.Message = ret["message"].ToString();
                if (result.Success == true)
                {
                    //授权
                    Data.Authorization = authorization;
                }
            }
            catch (Exception ex)
            {
                result.Code = -100;
                result.Success = false;
                result.Error = true;
                if (ex.Message.Contains("401") == true)
                {
                    result.Message = ex.Message;
                }
                else
                {
                    result.Message = "login failure!";
                }
            }

            return result;
        }
    }
}
