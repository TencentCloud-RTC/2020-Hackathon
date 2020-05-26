package com.chinasoft.edu.live.api;

/**
 * 作者：young on 2019/1/31 16:28
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：调用接口后的操作
 */
public interface OnSubscriberNextListener<T> {

    void onNext(T t);
    void onError(Throwable e);
}
