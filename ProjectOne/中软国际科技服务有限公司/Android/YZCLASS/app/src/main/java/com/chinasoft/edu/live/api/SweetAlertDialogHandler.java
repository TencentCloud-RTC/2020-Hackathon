package com.chinasoft.edu.live.api;

import android.content.Context;
import android.content.DialogInterface;
import android.os.Handler;
import android.os.Message;

import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * 作者：young on 2019/1/31 14:11
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class SweetAlertDialogHandler extends Handler {

    public static final int SHOW_PROGRESS_DIALOG = 1;
    public static final int DISMISS_PROGRESS_DIALOG = 2;

    private SweetAlertDialog pd;
    private Context context;
    private boolean cancelable;
    private ProgressCancelListener mProgressCancelListener;

    public SweetAlertDialogHandler(Context context, ProgressCancelListener mProgressCancelListener,
                                 boolean cancelable) {
        super();
        this.context = context;
        this.mProgressCancelListener = mProgressCancelListener;
        this.cancelable = cancelable;
    }

    private void initProgressDialog(){
        if (pd == null) {
            pd = new SweetAlertDialog(context,SweetAlertDialog.PROGRESS_TYPE);
            pd.setCancelable(cancelable);
            pd.setTitleText("数据加载中，请稍等......");
            if (cancelable) {
                pd.setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialogInterface) {
                        mProgressCancelListener.onCancelProgress();
                    }
                });
            }

            if (!pd.isShowing()) {
                pd.show();
            }
        }
    }

    private void dismissProgressDialog(){
        if (pd != null) {
            pd.dismiss();
            pd = null;
        }
    }

    @Override
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case SHOW_PROGRESS_DIALOG:
                initProgressDialog();
                break;
            case DISMISS_PROGRESS_DIALOG:
                dismissProgressDialog();
                break;
        }
    }
}
