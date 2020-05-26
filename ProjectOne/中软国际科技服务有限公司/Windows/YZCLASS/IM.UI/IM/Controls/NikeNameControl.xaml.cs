using IM.Model;
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

namespace IM.Controls
{
    /// <summary>
    /// NikeNameControl.xaml 的交互逻辑
    /// </summary>
    public partial class NikeNameControl : UserControl
    {
        MsgRule _Msg = null;
        public NikeNameControl()
        {
            InitializeComponent();
            this.Loaded += NikeNameControl_Loaded;
        }

        private void NikeNameControl_Loaded(object sender, RoutedEventArgs e)
        {
            _Msg = this.DataContext as MsgRule;
            this.lblNickName.Text = _Msg.NikeName;
        }
    }
}
