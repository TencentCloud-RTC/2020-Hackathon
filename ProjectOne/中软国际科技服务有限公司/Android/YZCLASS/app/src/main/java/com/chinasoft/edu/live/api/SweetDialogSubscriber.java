package com.chinasoft.edu.live.api;

import android.content.Context;

import com.chinasoft.edu.live.base.ChinasoftApp;
import com.chinasoft.edu.live.utils.LogUtils;
import com.chinasoft.edu.live.utils.ToastUtils;

import java.net.ConnectException;
import java.net.SocketTimeoutException;

import rx.Subscriber;

/**
 * 作者：young on 2019/1/31 14:16
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：自定义dialog
 */
public class SweetDialogSubscriber <T> extends Subscriber<T> implements ProgressCancelListener{

    private SubscriberOnNextListener<T> mListener;
    private Context mContext;
    private boolean cancelable;
    private SweetAlertDialogHandler mHandler;

    public SweetDialogSubscriber(SubscriberOnNextListener<T> listener,Context context,boolean cancelable){
        this.mListener = listener;
        this.mContext = context;
        this.cancelable = cancelable;
        mHandler = new SweetAlertDialogHandler(context,this,cancelable);

    }



    private void showProgressDialog(){
        if (mHandler != null) {
            mHandler.obtainMessage(SweetAlertDialogHandler.SHOW_PROGRESS_DIALOG).sendToTarget();
        }
    }

    private void dismissProgressDialog(){
        if (mHandler != null) {
            mHandler.obtainMessage(SweetAlertDialogHandler.DISMISS_PROGRESS_DIALOG).sendToTarget();
            mHandler = null;
        }
    }


    /**
     * 订阅开始时调用
     * 显示ProgressDialog
     */
    @Override
    public void onStart() {
        super.onStart();
        showProgressDialog();
    }

    @Override
    public void onCompleted() {
        dismissProgressDialog();
//        Toast.makeText(GreeApplication.getAppContext(),"获取数据完成！", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onError(Throwable e) {
        if (e instanceof SocketTimeoutException) {
            ToastUtils.showShort(ChinasoftApp.getAppContext(),"网络中断，请检查您的网络状态");
        } else if (e instanceof ConnectException) {
            ToastUtils.showShort(ChinasoftApp.getAppContext(),"网络链接失败，请检查您的网络状态");
        } else {
            LogUtils.e("error:" + e.getMessage());
        }
        dismissProgressDialog();
    }

    @Override
    public void onNext(T t) {
        if (mListener != null){
            mListener.onNext(t);
        }
    }

    @Override
    public void onCancelProgress() {
        if (!this.isUnsubscribed()){
            this.unsubscribe();
        }
    }
}
