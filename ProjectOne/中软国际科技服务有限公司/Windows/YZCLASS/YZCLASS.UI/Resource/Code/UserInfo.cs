using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.UI
{
    public class UserInfo
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public bool IsRememberPwd { get; set; }

        public bool IsAutoLogin { get; set; }

        public string UserNumber { get; set; }

        public string HeadUrl { get; set; }

        public override string ToString()
        {
            return this.UserName;
        }
    }
}
