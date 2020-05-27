package com.chinasoft.edu.live.custom;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.chinasoft.edu.live.R;

/**
 * 作者：young on 2020/4/28 17:33
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CustomDialog extends Dialog implements View.OnClickListener {

    private TextView mContent;
    private TextView mConfirm, mCancel;
    private Context mContext;
    private String content;
    private OncloseListener listener;
    private String positiveName;
    private String negativeName;
    private String title;


    public CustomDialog(Context context) {
        super(context);
        this.mContext = context;
    }

    public CustomDialog(@NonNull Context context, int themeResId, String content) {
        super(context, themeResId);
        this.mContext = context;
        this.content = content;
    }

    public CustomDialog(@NonNull Context context, int themeResId, OncloseListener listener) {
        super(context, themeResId);
        this.mContext = context;
        this.listener = listener;
    }

    public CustomDialog(@NonNull Context context, int themeResId, String content, OncloseListener listener) {
        super(context, themeResId);
        this.mContext = context;
        this.content = content;
        this.listener = listener;
    }

    protected CustomDialog(@NonNull Context context, boolean cancelable, @Nullable OnCancelListener cancelListener) {
        super(context, cancelable, cancelListener);
        this.mContext = context;
    }



    /**
     * 设置弹框的提示内容
     * @param content 弹框的提示内容
     * @return
     */
    public CustomDialog setContent(String content) {
        this.content = content;

        return this;
    }
    public void setTime(String content) {
        mContent.setText(content);
    }

    /**
     * 设置弹框确认键的内容
     * @param name 确认键显示内容
     * @return
     */
    public CustomDialog setPositiveButton(String name) {
        this.positiveName = name;

        return this;
    }

    /**
     * 设置弹框取消键的内容
     * @param name 取消键显示内容
     * @return
     */
    public CustomDialog setNegativeButton(String name) {
        this.negativeName = name;
        return this;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.my_dialog);
        setCanceledOnTouchOutside(false);
        mContent = findViewById(R.id.dialog_content);
        mConfirm = findViewById(R.id.confirm);
        mCancel = findViewById(R.id.cancel);
        if(!TextUtils.isEmpty(positiveName)){
            mConfirm.setText(positiveName);
        }
        if(!TextUtils.isEmpty(content)){
            mContent.setText(content);
        }
        if(!TextUtils.isEmpty(negativeName)){
            mCancel.setText(negativeName);
        }

        mConfirm.setOnClickListener(this);
        mCancel.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.confirm:
                if (listener != null) {
                    listener.onClick(true);
                }
                this.dismiss();
                break;
            case R.id.cancel:
                if (listener != null) {
                    listener.onClick(false);
                }
                this.dismiss();
                break;
        }
    }

    public interface OncloseListener {
        void onClick(boolean confirm);
    }
}
