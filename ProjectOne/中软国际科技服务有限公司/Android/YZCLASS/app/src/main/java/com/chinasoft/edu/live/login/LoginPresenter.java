package com.chinasoft.edu.live.login;

import android.text.TextUtils;

import com.chinasoft.edu.live.base.BasePresenter;
import com.chinasoft.edu.live.base.BaseResBean;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.utils.LogUtils;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import java.util.HashMap;
import java.util.Map;

import rx.Subscriber;

/**
 * 作者：young on 2020/5/6 09:55
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class LoginPresenter extends BasePresenter<LoginView> {

    public LoginPresenter(LoginView mvpView) {
        super(mvpView);
    }

    public void login(){

        String username = mvpView.getLoginName();
        String password = mvpView.getLoginPassWord();

        if(TextUtils.isEmpty(username)){
            ToastUtil.toastShortMessage("账号不能为空！");
            return;
        }
        if(TextUtils.isEmpty(password)){
            ToastUtil.toastShortMessage("密码不能为空！");
            return;
        }

        String client_id = "zy-titc-client";
        String client_secret = "zy-titc-secret";
        String grant_type = "password";

        Map<String,String> request = new HashMap<>();
        request.put("username",username);
        request.put("password",password);
        request.put("client_id",client_id);
        request.put("client_secret",client_secret);
        request.put("grant_type",grant_type);


        Subscriber<BaseResBean<LoginResBean>> subscriber = new Subscriber<BaseResBean<LoginResBean>>() {
            @Override
            public void onCompleted() {
            }

            @Override
            public void onError(Throwable e) {
                LogUtils.e(e.getMessage());
                mvpView.onLoginFailed(e.getMessage());
            }

            @Override
            public void onNext(BaseResBean<LoginResBean> loginResBeanBaseResBean) {
                if(loginResBeanBaseResBean.getCode() == Constants.RES_OK){
                    mvpView.onLoginSuccessed(loginResBeanBaseResBean.getResult());
                }else {
                    ToastUtil.toastShortMessage("" + loginResBeanBaseResBean.getMessage());
                }
            }
        };
        addSubscription(apiStores.login(request),subscriber);
    }

}
