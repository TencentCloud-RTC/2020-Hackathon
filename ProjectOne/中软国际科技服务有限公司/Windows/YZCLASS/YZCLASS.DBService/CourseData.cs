using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    /// <summary>
    /// <para>功能：课程数据模块接口</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.02.10</para>
    /// </summary>
    public interface ICourseData
    {
        DataResult QueryCourseList(string jsonString);
        DataResult createCourse(string jsonString);
        DataResult openShowing(string jsonString);
        DataResult closeShowing(string jsonString);
        
        DataResult getCourseInfo(string jsonString);

    }

    /// <summary>
    /// <para>功能：课程数据模块类</para>
    /// <para>作者：jiangkangping</para>
    /// <para>日期：2020.02.10</para>
    /// </summary>
    public class CourseData : BaseData, ICourseData
    {
        public DataResult QueryCourseList(string jsonString)
        {
            return base.PostResult("service-core/course/queryCourseList", jsonString);
        }

        public DataResult createCourse(string jsonString)
        {
            return base.PostResult("service-core/course/createCourse", jsonString);
        }
        public DataResult openShowing(string jsonString)
        {
            return base.PostResult("service-core/course/openShowing", jsonString);
        }
        public DataResult closeShowing(string jsonString)
        {
            return base.PostResult("service-core/course/closeShowing", jsonString);
        }

        public DataResult getCourseInfo(string jsonString)
        {
            return base.GetResult("service-core/course/getCourseInfo?" + jsonString);
        }
    }
}
