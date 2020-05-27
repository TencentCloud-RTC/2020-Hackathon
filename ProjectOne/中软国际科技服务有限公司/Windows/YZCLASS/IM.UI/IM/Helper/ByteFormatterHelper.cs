using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IM.Helper
{
    /// <summary>
    /// 字节格式化显示方式
    /// </summary>
    public static class ByteFormatterHelper
    {
        private const float KB = 1024.0f;
        private const float MB = KB * 1024.0f;
        private const float GB = MB * 1024.0f;
        private const float TB = GB * 1024.0f;

        private const string BFormatPattern = "{0} B";
        private const string KBFormatPattern = "{0,25:N1} KB";
        private const string MBFormatPattern = "{0,25:N1} MB";
        private const string GBFormatPattern = "{0,25:N1} GB";
        private const string TBFormatPattern = "{0,25:N1} TB";

        public static string ToString(long size)
        {
            string result = string.Empty;
            if (size < KB)
            {
                result = string.Format(BFormatPattern, size);
            }
            else if (size >= KB && size < MB)
            {
                result = string.Format(KBFormatPattern, size / KB);
            }
            else if (size >= MB && size < GB)
            {
                result = string.Format(MBFormatPattern, size / MB);
            }
            else if (size >= GB && size < TB)
            {
                result = string.Format(GBFormatPattern, size / GB);
            }
            else
            {
                result = string.Format(TBFormatPattern, size / TB);
            }
            return result.Trim();
        }

        public static ESizeType GetSizeType(long size)
        {
            ESizeType result = ESizeType.KB;
            if (size < KB)
            {
                result = ESizeType.B;
            }
            else if (size >= KB && size < MB)
            {
                result = ESizeType.KB;
            }
            else if (size >= MB && size < GB)
            {
                result = ESizeType.MB;
            }
            else if (size >= GB && size < TB)
            {
                result = ESizeType.GB;
            }
            else
            {
                result = ESizeType.TB;
            }
            return result;
        }

        public static string ToString(long size, ESizeType type)
        {
            string result = string.Empty;
            switch (type)
            {
                case ESizeType.B:
                    result = string.Format(BFormatPattern, size);
                    break;
                case ESizeType.KB:
                    result = string.Format(KBFormatPattern, size / KB);
                    break;
                case ESizeType.MB:
                    result = string.Format(MBFormatPattern, size / MB);
                    break;
                case ESizeType.GB:
                    result = string.Format(GBFormatPattern, size / GB);
                    break;
                case ESizeType.TB:
                    result = string.Format(TBFormatPattern, size / TB);
                    break;
                default:
                    break;
            }
            return result.Trim();
        }

        public enum ESizeType
        {
            B,
            KB,
            MB,
            GB,
            TB
        }
    }
}
