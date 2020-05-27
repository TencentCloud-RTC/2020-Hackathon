using System;
using System.Collections.Generic;
using System.Linq;
using System.Management;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CloudDesktop
{
    class Computer
    {
        public string CpuID;
        public string MacAddress;
        public string DiskID;
        public string IpAddress;
        public string LoginUserName;
        public string ComputerName;
        public string SystemType;
        public string TotalPhysicalMemory; //单位：M 
        private static Computer _instance;
        public static Computer Instance()
        {
            if (_instance == null)
                _instance = new Computer();
            return _instance;
        }

        public Computer()
        {
            CpuID = GetCpuID();
            MacAddress = GetMacAddress();
            DiskID = GetDiskID();
            IpAddress = GetIPAddress();
            LoginUserName = GetUserName();
            SystemType = GetSystemType();
            TotalPhysicalMemory = GetTotalPhysicalMemory();
            ComputerName = GetComputerName();
        }

        public string GetCpuID()
        {
            try
            {
                //获取CPU序列号代码 
                string cpuInfo = "";//cpu序列号 
                ManagementClass mc = new ManagementClass("Win32_Processor");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    cpuInfo = mo.Properties["ProcessorId"].Value.ToString();
                }
                moc = null;
                mc = null;
                return cpuInfo;
            }
            catch
            {
                return "";
            }
            finally
            {
            }

        }
        public string GetMacAddress()
        {
            try
            {
                //获取网卡硬件地址 
                string mac = "";
                ManagementClass mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    if ((bool)mo["IPEnabled"] == true)
                    {
                        mac = mo["MacAddress"].ToString();
                        break;
                    }
                }
                moc = null;
                mc = null;
                return mac;
            }
            catch
            {
                return "";
            }
            finally
            {
            }

        }
        public string GetIPAddress()
        {
            try
            {
                //获取IP地址 
                string st = "";
                ManagementClass mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    if ((bool)mo["IPEnabled"] == true)
                    {
                        //st=mo["IpAddress"].ToString(); 
                        System.Array ar;
                        ar = (System.Array)(mo.Properties["IpAddress"].Value);
                        st = ar.GetValue(0).ToString();
                        break;
                    }
                }
                moc = null;
                mc = null;
                return st;
            }
            catch
            {
                return "";
            }
            finally
            {
            }

        }

        public string GetDiskID()
        {
            try
            {
                //获取硬盘ID 
                String HDid = "";
                ManagementClass mc = new ManagementClass("Win32_DiskDrive");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    HDid = (string)mo.Properties["Model"].Value;
                }
                moc = null;
                mc = null;
                return HDid;
            }
            catch
            {
                return "";
            }
            finally
            {
            }

        }

        /// <summary> 
        /// 操作系统的登录用户名 
        /// </summary> 
        /// <returns></returns> 
        public string GetUserName()
        {
            try
            {
                string st = "";
                ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {

                    st = mo["UserName"].ToString();

                }
                moc = null;
                mc = null;
                return st;
            }
            catch
            {
                return "unknow";
            }
            finally
            {
            }

        }


        /// <summary> 
        /// PC类型 
        /// </summary> 
        /// <returns></returns> 
        public string GetSystemType()
        {
            try
            {
                string st = "";
                ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {

                    st = mo["SystemType"].ToString();

                }
                moc = null;
                mc = null;
                return st;
            }
            catch
            {
                return "unknow";
            }
            finally
            {
            }

        }

        /// <summary> 
        /// 物理内存 
        /// </summary> 
        /// <returns></returns> 
        public string GetTotalPhysicalMemory()
        {
            try
            {

                string st = "";
                ManagementClass mc = new ManagementClass("Win32_ComputerSystem");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {

                    st = mo["TotalPhysicalMemory"].ToString();

                }
                moc = null;
                mc = null;
                return st;
            }
            catch
            {
                return "unknow";
            }
            finally
            {
            }
        }
        /// <summary> 
        ///  
        /// </summary> 
        /// <returns></returns> 
        public string GetComputerName()
        {
            try
            {
                return System.Environment.GetEnvironmentVariable("ComputerName");
            }
            catch
            {
                return "unknow";
            }
            finally
            {
            }
        }

        public static string MD5Encrypt(string strText)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] result = md5.ComputeHash(System.Text.Encoding.Default.GetBytes(strText));
            string byte2String = "";
            for (int i = 0; i < result.Length; i++)
            {
                byte2String += result[i].ToString("X2");
            }
            return byte2String;
        }

        public static int GetMachineGUID()
        {
            int nMachineGUID = 0;
            Computer machine = Computer.Instance();
            if (machine != null)
            {
                string sMachineId = machine.GetCpuID() + machine.GetDiskID();
                if (string.IsNullOrEmpty(sMachineId))
                {
                    sMachineId = machine.GetMacAddress();
                }
                if (!string.IsNullOrEmpty(sMachineId))
                {
                    sMachineId = Computer.MD5Encrypt(sMachineId);

                    byte[] sMachineGUID = new byte[9];
                    sMachineGUID[8] = 0;
                    int nSum = 0;
                    int i = 0;
                    for (i = 0; i < sMachineId.Length; i++)
                    {
                        switch ((i % 4))
                        {
                            case 0:
                                nSum += sMachineId[i];
                                break;
                            case 1:
                                nSum += (sMachineId[i] * 16);
                                break;
                            case 2:
                                nSum += (sMachineId[i] * 16 * 16);
                                break;
                            case 3:
                                nSum += (sMachineId[i] * 16 * 16 * 16);
                                break;
                            default:
                                break;
                        }
                        if (i % 4 == 3)
                        {
                            sMachineGUID[i / 4] = (byte)(nSum % 9 + 1 + 0x30);
                            nSum = 0;
                        }
                    }
                    nMachineGUID = int.Parse(Encoding.Default.GetString(sMachineGUID));
                }
            }
            return nMachineGUID;
        }
    }


    public enum ENUM_MouseOperate
    {
        NoneOperate = 0,
        Move = 1,
        LeftDown = 2,
        LeftUp = 4,
        RightDown = 8,
        RightUp = 16,
        MiddleDown = 32,
        MiddleUp = 64,
        XDown = 128,
        XUp = 256,
        Wheel = 2048,
        VirtualDesk = 16384,
        Absolute = 32768,
    }


}
