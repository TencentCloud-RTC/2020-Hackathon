﻿#pragma checksum "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "8835A3199D27601D6D192596E07B0C2F43F200DC"
//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

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
using ZYTool.UI.Course.ucMain;


namespace ZYTool.UI.Course.ucMain {
    
    
    /// <summary>
    /// ucTeacherIntroductionPart
    /// </summary>
    public partial class ucTeacherIntroductionPart : System.Windows.Controls.UserControl, System.Windows.Markup.IComponentConnector {
        
        
        #line 10 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Grid teacherIntroductionPart;
        
        #line default
        #line hidden
        
        
        #line 19 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Border bgBorder;
        
        #line default
        #line hidden
        
        
        #line 20 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Image img;
        
        #line default
        #line hidden
        
        
        #line 28 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBlock teacherName;
        
        #line default
        #line hidden
        
        
        #line 30 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.TextBlock teacherDes;
        
        #line default
        #line hidden
        
        
        #line 33 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields")]
        internal System.Windows.Controls.Grid btnDel;
        
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
            System.Uri resourceLocater = new System.Uri("/ZYTool.UI;component/course/ucmain/ucteacherintroductionpart.xaml", System.UriKind.Relative);
            
            #line 1 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
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
            this.teacherIntroductionPart = ((System.Windows.Controls.Grid)(target));
            return;
            case 2:
            this.bgBorder = ((System.Windows.Controls.Border)(target));
            return;
            case 3:
            this.img = ((System.Windows.Controls.Image)(target));
            return;
            case 4:
            this.teacherName = ((System.Windows.Controls.TextBlock)(target));
            return;
            case 5:
            this.teacherDes = ((System.Windows.Controls.TextBlock)(target));
            return;
            case 6:
            this.btnDel = ((System.Windows.Controls.Grid)(target));
            
            #line 33 "..\..\..\..\Course\ucMain\ucTeacherIntroductionPart.xaml"
            this.btnDel.MouseLeftButtonDown += new System.Windows.Input.MouseButtonEventHandler(this.btnDel_MouseLeftButtonDown);
            
            #line default
            #line hidden
            return;
            }
            this._contentLoaded = true;
        }
    }
}

