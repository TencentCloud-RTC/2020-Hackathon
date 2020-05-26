using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml.Linq;

namespace IM
{
    /// <summary>
    /// FaceUserControl.xaml 的交互逻辑
    /// </summary>
    public partial class FaceUserControl : UserControl
    {
        Border Def_bd;

        public FaceUserControl()
        {
            InitializeComponent();
            this.Init();
          
            // 在此点之下插入创建对象所需的代码。
        }

        void Def_bd_MouseEnter(object sender, System.Windows.Input.MouseEventArgs e)
        {
            this.Img_Expender.Visibility = Visibility.Visible;
            String Img_Path = ((e.Source as Border).Child as Image).Tag.ToString();
            Stream imageStream = Application.GetResourceStream(new Uri("/IM.UI;component/IM/sysface/" + Img_Path+".png", UriKind.Relative)).Stream;
            System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(imageStream);
            this.Img_Expender.Image = bitmap;
        }

        void Def_bd_MouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
        {
            this.Img_Expender.Visibility = Visibility.Hidden;
        }

        void Def_bd_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            Image Img = (sender as Border).Child as Image;
            this.OnOnUserSelectFace(new OnUserSelectFaceEventArgs(Img.Tag.ToString() + ".png", "None", (sender as Border).ToolTip.ToString()));
            // this.Visibility = Visibility.Collapsed;
            Popup popup = ((Border)this.Parent)?.Parent as Popup;
            if (popup != null)
            {
                popup.IsOpen = false;
            }

        }



        /// <summary>
        ///      初始化默认分组
        /// </summary>
        public void Init()
        {
            XDocument adList = XDocument.Load(AppDomain.CurrentDomain.BaseDirectory + "/sysface/face.xml");
            var CM_FRIEND_TREEVIEW = from cm_FRIEND_TREEVIEW
                                         in adList.Descendants("StockFace").Elements("Face")
                                     select cm_FRIEND_TREEVIEW;
            //开始读取默认表情菜单
            foreach (var item in CM_FRIEND_TREEVIEW)
            {
                Def_bd = new Border();
                Def_bd.MouseEnter += new System.Windows.Input.MouseEventHandler(Def_bd_MouseEnter);
                Def_bd.MouseLeave += new System.Windows.Input.MouseEventHandler(Def_bd_MouseLeave);
                Def_bd.MouseDown += new System.Windows.Input.MouseButtonEventHandler(Def_bd_MouseDown);
                Def_bd.Height = 26;
                Def_bd.Width = 26;
                Def_bd.BorderBrush = Brushes.SkyBlue;
                Def_bd.BorderThickness = new Thickness(0.5);
                Def_bd.ToolTip = item.Attribute("name").Value;
                Def_bd.Style = (Style)this.FindResource("Normal_Border_Style");
                Image Def_img = new Image();
                Def_img.Stretch = Stretch.UniformToFill;
                Def_img.Margin = new Thickness(2, 2, 2, 2);
                Def_img.Source = new BitmapImage(new Uri("/IM.UI;component/IM/sysface/" + item.Attribute("md5").Value + "." + item.Attribute("type").Value, UriKind.Relative));
                //Def_img.Tag = item.Attribute("md5").Value + "." + item.Attribute("type").Value;
                Def_img.Tag = item.Attribute("md5").Value;
                Def_bd.Child = Def_img;
                this.WP_Def.Children.Add(Def_bd);
            }
            Read_AnyOtherFace();
        }

        /// <summary>
        ///     读取其他分组方法
        /// </summary>
        public void Read_AnyOtherFace()
        {
            XDocument adList = XDocument.Load(AppDomain.CurrentDomain.BaseDirectory + "/sysface/face.xml");
            var CM_FRIEND_TREEVIEW = from cm_FRIEND_TREEVIEW
                                         in adList.Descendants("StockFace").Elements("FaceGroup")
                                     select cm_FRIEND_TREEVIEW;
            //开始读取默认表情菜单
            foreach (var item in CM_FRIEND_TREEVIEW)
            {
                //读取1个分组 --> 创建TABPAGE
                TabItem tabItem = new TabItem();
                tabItem.Header = item.Attribute("name").Value;
                WrapPanel WP_Group = new WrapPanel();
                tabItem.Content = WP_Group;
                foreach (XElement element in item.Elements())
                {
                    Def_bd = new Border();
                    Def_bd.MouseEnter += new System.Windows.Input.MouseEventHandler(Def_bd_MouseEnter);
                    Def_bd.MouseLeave += new System.Windows.Input.MouseEventHandler(Def_bd_MouseLeave);
                    Def_bd.MouseDown += new System.Windows.Input.MouseButtonEventHandler(Def_bd_MouseDown);
                    Def_bd.Height = 30;
                    Def_bd.Width = 30;
                    Def_bd.BorderBrush = Brushes.SkyBlue;
                    Def_bd.BorderThickness = new Thickness(0.5);
                    Def_bd.ToolTip = element.Attribute("name").Value + " 快捷键: " + element.Attribute("shortcut").Value;
                    Def_bd.Style = (Style)this.FindResource("Normal_Border_Style");
                    Image Def_img = new Image();
                    Def_img.Stretch = Stretch.None;
                    Def_img.Margin = new Thickness(2, 2, 2, 2);
                    Def_img.Source = new BitmapImage(new Uri("/IM.UI;component/IM/sysface/" + element.Attribute("md5").Value + "_s." + element.Attribute("type").Value, UriKind.Relative));
                    //Def_img.Tag = element.Attribute("md5").Value + "_s." + element.Attribute("type").Value;
                    Def_img.Tag = element.Attribute("md5").Value;
                    Def_bd.Child = Def_img;
                    WP_Group.Children.Add(Def_bd);
                }
                this.TB.Items.Add(tabItem);
            }
        }

        #region 'OnUserSelectFace' event definition code

        /// <summary>
        ///     EventArgs derived type which holds the custom event fields
        /// </summary>
        public class OnUserSelectFaceEventArgs : System.EventArgs
        {
            /// <summary>
            ///     Use this constructor to initialize the event arguments
            ///     object with the custom event fields
            /// </summary>
            public OnUserSelectFaceEventArgs(String strFace_Path, String strShortCut, String strFace_Name)
            {
                this.Face_Path = strFace_Path;
                this.ShortCut = strShortCut;
                this.Face_Name = strFace_Name;
            }

            /// <summary>
            ///     TODO: Describe the purpose of this event argument here
            /// </summary>
            public readonly String Face_Path;

            /// <summary>
            ///     TODO: Describe the purpose of this event argument here
            /// </summary>
            public readonly String ShortCut;

            /// <summary>
            ///     TODO: Describe the purpose of this event argument here
            /// </summary>
            public readonly String Face_Name;

        }

        // Private delegate linked list (explicitly defined)
        private EventHandler<OnUserSelectFaceEventArgs> OnUserSelectFaceEventHandlerDelegate;

        /// <summary>
        ///     TODO: Describe the purpose of this event here
        /// </summary>
        public event EventHandler<OnUserSelectFaceEventArgs> OnUserSelectFace
        {
            // Explicit event definition with accessor methods
            add
            {
                OnUserSelectFaceEventHandlerDelegate = (EventHandler<OnUserSelectFaceEventArgs>)Delegate.Combine(OnUserSelectFaceEventHandlerDelegate, value);
            }
            remove
            {
                OnUserSelectFaceEventHandlerDelegate = (EventHandler<OnUserSelectFaceEventArgs>)Delegate.Remove(OnUserSelectFaceEventHandlerDelegate, value);
            }
        }

        /// <summary>
        ///     This is the method that is responsible for notifying
        ///     receivers that the event occurred
        /// </summary>
        protected virtual void OnOnUserSelectFace(OnUserSelectFaceEventArgs e)
        {
            if (OnUserSelectFaceEventHandlerDelegate != null)
            {
                OnUserSelectFaceEventHandlerDelegate(this, e);
            }
        }

        #endregion //('OnUserSelectFace' event definition code)

    }
}
