package com.chinasoft.edu.live.custom;

import android.content.Context;
import android.text.InputFilter;
import android.text.Spanned;
import android.util.AttributeSet;

import androidx.appcompat.widget.AppCompatEditText;

import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 作者：young on 2020/4/7 16:27
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class ForbidEmojiEditText extends AppCompatEditText {

    public ForbidEmojiEditText(Context context) {
        super(context);
    }

    public ForbidEmojiEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ForbidEmojiEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public void setFilters(InputFilter[] filters) {
        InputFilter emojiFilter = new InputFilter() {
            @Override
            public CharSequence filter(CharSequence source, int start, int end, Spanned dest,
                                       int dstart, int dend) {
                Pattern emoji = Pattern.compile(
                        "[\ud83c\udc00-\ud83c\udfff]|[\ud83d\udc00-\ud83d\udfff]|[\u2600-\u27ff]",
                        Pattern.UNICODE_CASE | Pattern.CASE_INSENSITIVE);
                Matcher emojiMatcher = emoji.matcher(source);
                if (emojiMatcher.find()) {
                    ToastUtil.toastShortMessage("不支持特殊符号输入");
                    return "";
                }
                return null;
            }
        };
        super.setFilters(new InputFilter[]{emojiFilter});
    }
}
