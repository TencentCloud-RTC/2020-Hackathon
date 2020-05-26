using IM.Enum;
using IM.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace IM.Selectors
{
    public class ChatHistoryDataTemplateSelector : DataTemplateSelector
    {
        public DataTemplate TxtDataTemplateLeft { get; set; }
        public DataTemplate TxtDataTemplateRight { get; set; }
        public DataTemplate FileDataTemplateLeft { get; set; }
        public DataTemplate FileDataTemplateRight { get; set; }

        public override DataTemplate SelectTemplate(object item, DependencyObject container)
        {
            MsgRule fmModel = item as MsgRule;
            if (fmModel == null)
                return base.SelectTemplate(item, container);
            switch (fmModel.ContentType)
            {
                case ContentType.Text://文本
                    if(fmModel.IsMySelf)//判断是否是本人 (fmModel.LocalJid.ToLower() == Token.AccessToken.FromJid.ToLower())
                        return TxtDataTemplateRight;
                    else
                        return TxtDataTemplateLeft;
                case ContentType.File://文件
                    if (fmModel.IsMySelf)//判断是否是本人 (fmModel.LocalJid.ToLower() == Token.AccessToken.FromJid.ToLower())
                        return FileDataTemplateRight;
                    else
                        return FileDataTemplateLeft;
                default:
                    return base.SelectTemplate(item, container);
            }
        }
    }
}
