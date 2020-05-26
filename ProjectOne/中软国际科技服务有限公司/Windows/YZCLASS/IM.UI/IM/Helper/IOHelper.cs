using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IM.Helper
{
    public static class IOHelper
    {/// <summary>
     /// GetFileNameNoPath 获取不包括路径的文件名
     /// </summary>      
        public static string GetFileNameNoPath(string filePath)
        {
            return Path.GetFileName(filePath);
        }
        /// <summary>
        /// DeleteFile 删除文件
        /// </summary>
        /// <param name="filePath"></param>
        public static void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        /// <summary>
        /// 判断文件是否存在
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static bool IsExistFilePath(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
                return false;
            return File.Exists(filePath);
        }
        /// <summary>
        /// 将多个字符串合并成一个目录字符串
        /// </summary>
        /// <param name="paths"></param>
        public static string CombinePath(params string[] paths)
        {
            return Path.Combine(paths);
        }
        /// <summary>
        /// 得到文件的扩展名（开头包含“.”）
        /// </summary>
        /// <param name="path">文件目录字符串</param>
        /// <returns></returns>
        public static string GetFileExtension(string path)
        {
            if (string.IsNullOrEmpty(path))
                return null;
            return Path.GetExtension(path);
        }
        /// <summary>
        /// GetFileSize 获取目标文件的大小
        /// </summary>        
        public static long GetFileSize(string filePath)
        {
            long size = 0;
            if (!IsExistFilePath(filePath))
                return size;
            FileInfo info = new FileInfo(filePath);
            size = info.Length;
            return size;
        }
        /// <summary>
        /// 得到当前文件所在的目录名
        /// </summary>
        /// <param name="fileInfo"></param>
        /// <returns></returns>
        public static string GetDirecotryNameByFileInfo(string path)
        {
            if (!File.Exists(path))
                return null;
            FileInfo info = new FileInfo(path);
            if (info == null)
                return null;
            return info.DirectoryName;
        }
    }
}
