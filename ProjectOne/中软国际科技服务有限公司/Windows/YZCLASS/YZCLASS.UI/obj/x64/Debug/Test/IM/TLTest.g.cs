﻿#pragma checksum "..\..\..\..\..\Test\IM\TLTest.xaml" "{8829d00f-11b8-4213-878b-770e8597ac16}" "EB7DBB244D3F3CBCB2DDB98471C026A9F4F1C1B1553DCF85CB651FF436A6FFDB"
//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

using IM;
using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms.Integration;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Media.Media3D;
using System.Windows.Media.TextFormatting;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Shell;
using ZYTool.UI;


namespace ZYTool.UI {
    
    
    /// <summary>
    /// TLTest
    /// </summary>
    public partial class TLTest : System.Windows.Window, System.Windows.Markup.IComponentConnector {
        
        
        #line 10 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Grid TLGrid;
        
        #line default
        #line hidden
        
        
        #line 15 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.StackPanel TLPanel;
        
        #line default
        #line hidden
        
        
        #line 57 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button button_smile;
        
        #line default
        #line hidden
        
        
        #line 63 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Button button_file;
        
        #line default
        #line hidden
        
        
        #line 66 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Primitives.Popup popupExpression;
        
        #line default
        #line hidden
        
        
        #line 68 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal IM.FaceUserControl faceUserControl;
        
        #line default
        #line hidden
        
        
        #line 80 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.RichTextBox txtMessage;
        
        #line default
        #line hidden
        
        
        #line 84 "..\..\..\..\..\Test\IM\TLTest.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Image imgSend;
        
        #line default
        #line hidden
        
        private bool _contentLoaded;
        
        /// <summary>
        /// InitializeComponent
        /// </summary>
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "4.0.0.0")]
        public void InitializeComponent() {
            if (_contentLoaded) {
                return;
            }
            _contentLoaded = true;
            System.Uri resourceLocater = new System.Uri("/ZYTool.UI;component/test/im/tltest.xaml", System.UriKind.Relative);
            
            #line 1 "..\..\..\..\..\Test\IM\TLTest.xaml"
            System.Windows.Application.LoadComponent(this, resourceLocater);
            
            #line default
            #line hidden
        }
        
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        [System.CodeDom.Compiler.GeneratedCodeAttribute("PresentationBuildTasks", "4.0.0.0")]
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Design", "CA1033:InterfaceMethodsShouldBeCallableByChildTypes")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1800:DoNotCastUnnecessarily")]
        void System.Windows.Markup.IComponentConnector.Connect(int connectionId, object target) {
            switch (connectionId)
            {
            case 1:
            this.TLGrid = ((System.Windows.Controls.Grid)(target));
            return;
            case 2:
            this.TLPanel = ((System.Windows.Controls.StackPanel)(target));
            return;
            case 3:
            this.button_smile = ((System.Windows.Controls.Button)(target));
            
            #line 57 "..\..\..\..\..\Test\IM\TLTest.xaml"
            this.button_smile.Click += new System.Windows.RoutedEventHandler(this.button_smile_Click);
            
            #line default
            #line hidden
            return;
            case 4:
            this.button_file = ((System.Windows.Controls.Button)(target));
            
            #line 63 "..\..\..\..\..\Test\IM\TLTest.xaml"
            this.button_file.Click += new System.Windows.RoutedEventHandler(this.button_file_Click);
            
            #line default
            #line hidden
            return;
            case 5:
            this.popupExpression = ((System.Windows.Controls.Primitives.Popup)(target));
            return;
            case 6:
            this.faceUserControl = ((IM.FaceUserControl)(target));
            return;
            case 7:
            this.txtMessage = ((System.Windows.Controls.RichTextBox)(target));
            return;
            case 8:
            this.imgSend = ((System.Windows.Controls.Image)(target));
            
            #line 84 "..\..\..\..\..\Test\IM\TLTest.xaml"
            this.imgSend.MouseLeftButtonDown += new System.Windows.Input.MouseButtonEventHandler(this.imgSend_MouseLeftButtonDown);
            
            #line default
            #line hidden
            return;
            }
            this._contentLoaded = true;
        }
    }
}

