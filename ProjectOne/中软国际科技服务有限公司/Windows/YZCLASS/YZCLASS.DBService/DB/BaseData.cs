using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    public class BaseData
    {
        protected static string IMP_DOMAIN = ConfigurationManager.AppSettings["DBServiceUrl"]; 

        public DataResult GetResultData(string jsonString)
        {
            DataResult result = new DataResult();
            if (string.IsNullOrWhiteSpace(jsonString) == false)
            {
                result.Result = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(jsonString);
            }
            return result;
        }

        public DataResult PostResult(string impUrl, bool useAuthor = true)
        {
            return this.PostResult(impUrl, null, useAuthor);
        }

        protected DataResult PostResult(string impUrl, string jsonString, bool useAuthor = true)
        {
            return this.RequestResult(RequestMethod.POST, impUrl, jsonString, useAuthor);
        }

        protected DataResult GetResult(string impUrl, bool useAuthor = true)
        {
            return this.RequestResult(RequestMethod.GET, impUrl, null, useAuthor);
        }

        protected DataResult PutResult(string impUrl, string jsonString, bool useAuthor = true)
        {
            return this.RequestResult(RequestMethod.PUT, impUrl, jsonString, useAuthor);
        }

        protected DataResult DeleteResult(string impUrl, string jsonString, bool useAuthor = true)
        {
            return this.RequestResult(RequestMethod.DELETE, impUrl, jsonString, useAuthor);
        }

        private DataResult RequestResult(RequestMethod requestMethod, string impUrl, string jsonString, bool useAuthor = true)
        {
            try
            {
                //获取TOKEN
                if (useAuthor == true && Data.Authorization == null)
                {
                    return new DataResult
                    {
                        Code = 401,
                        Success = false,
                        Error = true,
                        Message = "Invalid token cannot access the changed resource!",
                    };
                }

                DataResult result = new DataResult();
                if (impUrl.StartsWith("/") == true)
                {
                    impUrl.TrimStart('/');
                }
                string url = IMP_DOMAIN + impUrl;
                string retString = this.RequestString(requestMethod, url, jsonString, useAuthor);
                dynamic ret = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(retString);
                int code = int.Parse(ret["code"].ToString());
                result.Code = code;
                result.Success = (code == 200);
                result.Error = ret["error"].ToString().ToLower() == "true";
                result.Message = ret["message"].ToString();
                try
                {
                    result.Result = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(ret["result"].ToString());
                }
                catch
                {
                    result.Result = ret["result"].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected string RequestString(RequestMethod requestMethod, string url, string data, bool useAuthor = true)
        {
            string responseResult = String.Empty;
            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(url);   //创建一个有效的httprequest请求，地址和端口和指定路径必须要和网页系统工程师确认正确，不然一直通讯不成功
            req.Method = requestMethod.ToString();
            if (useAuthor == true)
            {
                req.Headers.Add("Authorization", Data.Authorization);
            }

            if (string.IsNullOrEmpty(data) == false)
            {
                req.ContentType = "application/json;charset=UTF-8";
                req.ServicePoint.Expect100Continue = false;
                byte[] bytesToPost = Encoding.UTF8.GetBytes(data); //转换为bytes数据
                using (Stream reqStream = req.GetRequestStream())
                {
                    reqStream.Write(bytesToPost, 0, bytesToPost.Length);     //把要上传网页系统的数据通过post发送
                }
            }
            HttpWebResponse cnblogsRespone = null;
            try
            {
                cnblogsRespone = (HttpWebResponse)req.GetResponse();
            }
            catch (WebException ex)
            {
                cnblogsRespone = (HttpWebResponse)ex.Response;
            }

            StreamReader sr;
            using (sr = new StreamReader(cnblogsRespone.GetResponseStream()))
            {
                responseResult = sr.ReadToEnd();  //网页系统的json格式的返回值，在responseResult里，具体内容就是网页系统负责工程师跟你协议号的返回值协议内容
            }
            sr.Close();

            cnblogsRespone.Close();
            return responseResult;
        }

    }

    public enum RequestMethod
    {
        POST,
        GET,
        PUT,
        DELETE
    }
}
