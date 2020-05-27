using COSXML.Model.Object;
using COSXML.Utils;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace YZCLASS.UI.Course.ucMain
{
    /// <summary>
    /// ucBaseInformation.xaml 的交互逻辑
    /// </summary>
    public partial class ucBaseInformation : UserControl
    {
        //public event EventHandler SelectImg;
        /// <summary>
        /// 课程封面文件名
        /// </summary>
        public string fileName;
        /// <summary>
        /// 文件真实名称
        /// </summary>
        public string fileRealName;
        /// <summary>
        /// 课程封面文件后缀
        /// </summary>
        public string fileSuffix;
        /// <summary>
        /// 课程封面文件大小
        /// </summary>
        public int fileSize;
        /// <summary>
        /// 课程封面url
        /// </summary>
        public string coverFileUrl;
        /// <summary>
        /// 本地文件绝对路径
        /// </summary>
        public string srcPath;
        /// <summary>
        /// 对象在存储桶中的位置，即称对象键
        /// </summary>
        public string key;


        public ucBaseInformation()
        {
            InitializeComponent();
            WaterMarkHelp.Init(this.courseName, this.lblCourseName);
            WaterMarkHelp.Init(this.courseDescription, this.lblCourseDescription);
        }

        public string CourseName
        {
            get
            {
                return this.courseName.Text;
            }
        }

        public string CourseDescription
        {
            get
            {
                return this.courseDescription.Text;
            }
        }

    }
}
