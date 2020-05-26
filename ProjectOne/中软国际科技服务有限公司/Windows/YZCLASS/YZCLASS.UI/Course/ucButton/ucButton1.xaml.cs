using System;
using System.Collections.Generic;
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

namespace YZCLASS.UI.Course.ucButton
{
    /// <summary>
    /// ucButton1.xaml 的交互逻辑
    /// </summary>
    public partial class ucButton1 : UserControl
    {
        public event EventHandler OnNext;

        public ucButton1()
        {
            InitializeComponent();
        }

        private void btnNext_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (this.OnNext != null)
            {
                this.OnNext(sender, e);
            }
            //FriendList fl = new FriendList();
            //fl.ShowDialog();
        }
    }
}
