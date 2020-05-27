using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    /// <summary>
    /// <para>功能：数据结果类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.02.10</para>
    /// </summary>
    public class DataResult
    {
        public int Code { get; set; }

        public bool Success { get; set; }

        public bool Error { get; set; }

        public string Message { get; set; }

        public dynamic Result { get; set; }

        public DataResult()
        {
            this.Code = 200;
            this.Success = true;
            this.Error = false;
            this.Message = "业务操作成功 !";
        }
    }
}
