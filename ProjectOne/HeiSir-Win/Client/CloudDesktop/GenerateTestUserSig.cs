﻿using System;
using System.IO;
using System.Net;
using System.Text;
using CloudDesktop.Common;
using tencentyun;

/// <summary>
/// Module： GenerateTestUserSig
/// 
/// Function：用于生成测试用的 UserSig，UserSig 是腾讯云为其云服务设计的一种安全保护签名。
///           其计算方法是对 SDKAppID、UserID 和 EXPIRETIME 进行加密，加密算法为 HMAC-SHA256。
///      
/// Attention：请不要将如下代码发布到您的线上正式版本的 App 中，原因如下：
/// 
///            本文件中的代码虽然能够正确计算出 UserSig，但仅适合快速调通 SDK 的基本功能，不适合线上产品，
///            这是因为客户端代码中的 SECRETKEY 很容易被反编译逆向破解，尤其是 Web 端的代码被破解的难度几乎为零。
///             一旦您的密钥泄露，攻击者就可以计算出正确的 UserSig 来盗用您的腾讯云流量。
///             
///            正确的做法是将 UserSig 的计算代码和加密密钥放在您的业务服务器上，然后由 App 按需向您的服务器获取实时算出的 UserSig。
///            由于破解服务器的成本要高于破解客户端 App，所以服务器计算的方案能够更好地保护您的加密密钥。
///            
/// Reference：https://cloud.tencent.com/document/product/647/17275#Server
/// </summary>

namespace CloudDesktop
{
    class GenerateTestUserSig
    {
        /// <summary>
        /// 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
        /// 
        /// 进入腾讯云云通信[控制台](https://console.cloud.tencent.com/avc) 创建应用，即可看到 SDKAppId，
        /// </summary>
        /// <remarks>
        /// 它是腾讯云用于区分客户的唯一标识。
        /// </remarks>
        public const int SDKAPPID = 1400353109;

        /// <summary>
        /// 计算签名用的加密密钥
        /// 
        /// step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav) ，如果还没有应用就创建一个，
        /// step2.单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
        /// step3.点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
        /// </summary>
        /// <remarks>
        /// 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
        /// 文档：https://cloud.tencent.com/document/product/647/17275#GetFromServer
        /// </remarks>
        public const string SECRETKEY = @"";

        /// <summary>
        /// 签名过期时间，建议不要设置的过短
        /// 
        /// 时间单位：秒
        /// 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
        /// </summary>
        public const int EXPIRETIME = 604800;

        /// <summary>
        /// 混流接口功能实现需要补齐此账号信息。
        /// 
        /// 获取途径：腾讯云网页控制台->实时音视频->您的应用(eg客服通话)->账号信息面板可以获取 appid/bizid
        /// </summary>
        public const int APPID = 0;
        public const int BIZID = 0;

        private static GenerateTestUserSig mInstance;

        private GenerateTestUserSig()
        {
        }

        public static GenerateTestUserSig GetInstance()
        {
            if (mInstance == null)
            {
                mInstance = new GenerateTestUserSig();
            }
            return mInstance;
        }

        /// <summary>
        /// 计算 UserSig 签名
        /// 
        /// 函数内部使用 HMAC-SHA256 非对称加密算法，对 SDKAPPID、userId 和 EXPIRETIME 进行加密
        /// 
        /// 该方案仅适合本地跑通demo和功能调试，产品真正上线发布，要使用服务器获取方案避免私钥被破解。
        /// </summary>
        /// <remarks>
        /// 请不要将如下代码发布到您的线上正式版本的 App 中，原因如下：
        /// 
        /// 本文件中的代码虽然能够正确计算出 UserSig，但仅适合快速调通 SDK 的基本功能，不适合线上产品，
        /// 这是因为客户端代码中的 SECRETKEY 很容易被反编译逆向破解，尤其是 Web 端的代码被破解的难度几乎为零。
        /// 一旦您的密钥泄露，攻击者就可以计算出正确的 UserSig 来盗用您的腾讯云流量。
        /// 
        /// 正确的做法是将 UserSig 的计算代码和加密密钥放在您的业务服务器上，然后由 App 按需向您的服务器获取实时算出的 UserSig。
        /// 由于破解服务器的成本要高于破解客户端 App，所以服务器计算的方案能够更好地保护您的加密密钥。
        /// 
        /// 文档：https://cloud.tencent.com/document/product/647/17275#GetFromServer
        /// </remarks>
        public string GenTestUserSig(string userId)
        {
            var timeStamp = (DateTime.Now.Ticks - TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)).Ticks) / 10000;
            var sign = Computer.MD5Encrypt($"{timeStamp}-HeiSir.CloudDesktop-{userId}-{timeStamp}");
            return HttpPost($"https://{Program.HostName}/getUserSign", $"{{\"user\":\"{userId}\",\"t\":{timeStamp},\"sign\":\"{sign}\"}}");
        }

        #region 发送post请求
        public static string HttpPost(string url,string str)
        {

            string result = "";
            try
            {

                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";

                byte[] data = Encoding.UTF8.GetBytes(str);//把字符串转换为字节

                req.ContentLength = data.Length; //请求长度

                using (Stream reqStream = req.GetRequestStream()) //获取
                {
                    reqStream.Write(data, 0, data.Length);//向当前流中写入字节
                    reqStream.Close(); //关闭当前流
                }

                HttpWebResponse resp = (HttpWebResponse)req.GetResponse(); //响应结果
                Stream stream = resp.GetResponseStream();
                //获取响应内容
                using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
                {
                    result = reader.ReadToEnd();
                }
            }
            catch (Exception)
            {

            }
            return result;
        }
        #endregion

    }
}
