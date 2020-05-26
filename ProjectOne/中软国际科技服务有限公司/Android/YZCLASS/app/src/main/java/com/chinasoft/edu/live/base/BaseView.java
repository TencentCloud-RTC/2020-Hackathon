package com.chinasoft.edu.live.base;

import android.app.Activity;

/**
 *@描述 view基类
 *@作者 young
 *@时间 2020/4/27  14:29
 */
public interface BaseView<T> {
    Activity getAtyContext();
    void onSuccess(T t);
    void onFailed();
}
