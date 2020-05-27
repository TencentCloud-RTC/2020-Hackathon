using COSXML;
using COSXML.Auth;
using COSXML.Common;
using COSXML.Utils;
using System.Configuration;

namespace YZCLASS.UI
{
    public class QCloudServer
    {
        //开发者访问 COS 服务时拥有的用户维度唯一资源标识，用以标识资源
        public string appid = ConfigurationManager.AppSettings["COSAppId"]; //https://cloud.tencent.com/document/product/436/7751

        //存储桶所在的地域
        public string region = ConfigurationManager.AppSettings["COSRegion"];//https://cloud.tencent.com/document/product/436/6224

        //存储桶
        //public string bucketForObjectTest = "cct01-1300448553"; //https://cloud.tencent.com/document/product/436/13312

        //public string bucketForBucketTest = "cct01-1300448553";//https://cloud.tencent.com/document/product/436/13312

        //net sdk 服务类，提供了各个访问cos API 的接口
        public CosXml cosXml;

        private static QCloudServer instance;

        private QCloudServer()
        {
            InitCosXml();
        }

        private void InitCosXml()
        {
            // 初始化 CosXmlConfig
            CosXmlConfig config = new CosXmlConfig.Builder()
            .SetConnectionLimit(1024)
            .SetConnectionTimeoutMs(60000)
            .SetReadWriteTimeoutMs(40000)
            .IsHttps(true)
            .SetAppid(appid)
            .SetDebugLog(true)
            .SetRegion(region)
            .Build();


            //使用永久密钥方式， 不推荐
            //开发者拥有的项目身份识别 ID，用以身份认证
            string secretId = ConfigurationManager.AppSettings["COSSecretId"]; //https://cloud.tencent.com/document/product/436/7751
            //开发者拥有的项目身份密钥,用以身份认证
            string secretKey = ConfigurationManager.AppSettings["COSSecretKey"]; //https://cloud.tencent.com/document/product/436/7751
            //初始化 QCloudCredentialProvider,使用永久密钥，不推荐
            QCloudCredentialProvider cosCredentialProvider = new DefaultQCloudCredentialProvider(secretId, secretKey, 24*60*60);//24小时


            /**
            //使用临时密钥， 推荐
            //开发者拥有的项目身份识别 临时ID，用以身份认证
            string tmpSecretId = "AKIDDKvOgk2aFepaLEexK1_tHbzOu778an5opcNLCzr25-nZPKyZMlIRXBvtXjPJbcVl"; //https://cloud.tencent.com/document/product/436/14048
            //开发者拥有的项目身份 临时密钥,用以身份认证
            string tmpSecretKey = "xrW/xUJDm6tC2O5B1hLvg8AR9GbupYCvLLLtnVASU70="; //https://cloud.tencent.com/document/product/436/14048
            //临时密钥 token
            string tmpToken = "czEhzkyR6OFahWMMNXUoVvLcPczpJQ9D459a443c71f3232594eb0bb91d08f418ZA_oJTEvysSQ5XgMDtwSUKjIlAf7U041dECKeGeqlu-wdmNKpJuAQDnM3fWlJO15NDZ8jyr0s-XcdskERVyeiWAMbmBOWlVzaZ08TACNQgmHhN0xzgKS0cFah0mLdyED4cpHAACEiQQcBmSBEeybxBHaSULUCs44ARHmt_8-w2BChSAoEgHneWBQ87XtOyKKYP8rYF0iDpdmNfyIhdDFecAivpn8UQJLmPMcSqxfPjI5Qei2FSmGIv4CXqMKd3VfDjy8BJ8TQgzWoEh6EeLYbI3M1n1MNMhujlIP9cw0BCXAh7spMb2kv8uivtY_x7IJbG-SeBNyFXKR_3zbQSvK2USnP_niAhzvu3OLmOVxb3wCu9nOaaxl_isTGA8-2Cask1DaAmfW5CamAQN4K80DHEbAaxL3FbYp6C95IqjGKcwLsp4w-A9-wXQcGVi2To9Q-1q-2VJkXVJtI7LmAtbW-g"; //https://cloud.tencent.com/document/product/436/14048
            //临时密钥有效截止时间,UNIX 时间戳 
            long tmpExpireTime = 1573103859; //https://cloud.tencent.com/document/product/436/14048
            QCloudCredentialProvider cosCredentialProvider = new DefaultSessionQCloudCredentialProvider(tmpSecretId, tmpSecretKey, tmpExpireTime, tmpToken);
            */

            //初始化 CosXmlServer
            cosXml = new CosXmlServer(config, cosCredentialProvider);
           
        }

        public static QCloudServer GetInstance()
        {
            lock (typeof(QCloudServer))
            {
                if (instance == null)
                {
                    instance = new QCloudServer();
                }
            }
            return instance;
        }
    }
}
