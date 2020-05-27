using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.UI
{
    public class UserInfoTxtHelp
    {
        public void WriteInfo(UserInfo info)
        {
            try
            {
                string path = Environment.CurrentDirectory + "\\tempfile\\users\\" + info.UserName + ".txt";
                string str = string.Format("{0},{1},{2},{3}", info.UserName, info.Password, info.IsRememberPwd ? 1 : 0, info.IsAutoLogin ? 1 : 0);
                if (string.IsNullOrEmpty(info.UserNumber) == false)
                {
                    str += "," + info.UserNumber;
                }
                if (string.IsNullOrEmpty(info.HeadUrl) == false)
                {
                    str += "," + info.HeadUrl;
                }
                FileStream stream = new FileStream(path, FileMode.OpenOrCreate);
                StreamWriter write = new StreamWriter(stream, Encoding.UTF8);
                write.WriteLine(str);
                write.Close();
            }
            catch (Exception ex)
            {
            }
        }

        public List<UserInfo> ReadList()
        {
            List<UserInfo> list = new List<UserInfo>();
            try
            {
                FileStream stream = null;
                StreamReader reader = null;
                string dir = Environment.CurrentDirectory + "\\tempfile\\users\\";
                if (Directory.Exists(dir) == false)
                {
                    Directory.CreateDirectory(dir);
                }

                foreach (string file in Directory.GetFiles(dir))
                {
                    stream = new FileStream(file, FileMode.OpenOrCreate);
                    reader = new StreamReader(stream);
                    string line = reader.ReadLine();
                    string[] strs = null;
                    UserInfo info = null;
                    strs = line.Split(',');
                    info = new UserInfo();
                    info.UserName = strs[0].Trim();
                    info.Password = strs[1].Trim();
                    info.IsRememberPwd = (strs[2] == "1");
                    info.IsAutoLogin = (strs[3] == "1");
                    if (strs.Length > 4)
                    {
                        info.UserNumber = strs[4].Trim();
                    }
                    if (strs.Length > 5)
                    {
                        info.HeadUrl = strs[5].Trim();
                    }
                    list.Add(info);
                }
                reader.Close();
                stream.Close();
            }
            catch (Exception ex)
            {
            }
            return list;
        }
    }
}
