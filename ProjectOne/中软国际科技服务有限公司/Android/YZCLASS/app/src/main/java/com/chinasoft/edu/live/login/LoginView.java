package com.chinasoft.edu.live.login;

import android.app.Activity;

import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

/**
 * 作者：young on 2020/5/6 09:50
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public interface LoginView {

    Activity getActyContext();
    String getLoginName();
    String getLoginPassWord();
    void onLoginSuccessed(LoginResBean loginResBean);
    void onLoginFailed(String errorMsg);

}
