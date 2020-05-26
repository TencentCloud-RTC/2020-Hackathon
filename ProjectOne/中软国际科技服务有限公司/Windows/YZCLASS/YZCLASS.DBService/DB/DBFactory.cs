using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YZCLASS.DBService
{
    public class DBFactory
    {
        private static Data _data = null;

        public static Data Create()
        {
            if (_data == null)
            {
                _data = new Data();
                _data.Course = new CourseData();
                _data.My = new MyData();
                _data.LiveRoom = new LiveRoomData();
            }
            return _data;
        }
    }
}
