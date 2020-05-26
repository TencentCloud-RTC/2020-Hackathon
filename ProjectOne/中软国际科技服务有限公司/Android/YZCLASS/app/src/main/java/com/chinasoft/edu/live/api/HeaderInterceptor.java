package com.chinasoft.edu.live.api;

import android.text.TextUtils;

import com.chinasoft.edu.live.base.BaseActivity;
import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.ChinasoftApp;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.utils.JsonUtils;
import com.chinasoft.edu.live.utils.LogUtils;
import com.chinasoft.edu.live.utils.SPUtils;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

/**
 *@描述 请求头处理
 *@作者 young
 *@时间 2019/1/28  5:24 PM
 */
public class HeaderInterceptor implements Interceptor {

    private final String headerName = "Authorization";

    @Override
    public Response intercept(Chain chain) throws IOException {

//        String headerLocal = (String) SPUtils.get(ZhiYunApp.getAppContext(), Constants.TOKEN,"");
        BaseBean baseBean;
        Request request = rebuildRequest(chain.request());
        LogUtils.e("url___"+request.url());
        Response response = chain.proceed(request);
        String headName = response.header(headerName);
//        LogUtils.e("headers____\n"+response.headers().toString());
        if (!TextUtils.isEmpty(headName)) {
            SPUtils.put(ChinasoftApp.getAppContext(), Constants.TOKEN, headName);
            LogUtils.e("net_headerName____"+headName);
        }
        int code = response.code();
        if(code!= Constants.RES_OK){
//            LogUtils.e("response___"+code);
            ResponseBody responseBody = response.body();
            String responseStr = responseBody.string();
            baseBean = JsonUtils.deserialize(responseStr, BaseBean.class);
//            LogUtils.e("BaseBean___"+baseBean.toString());
            ToastUtil.toastShortMessage(baseBean.getMessage());
            if(code == Constants.RES_TOKEN_EXPIRE){
                String message = baseBean.getMessage();
                if(!TextUtils.isEmpty(message)&&TextUtils.equals("无效的令牌无法访问操作的资源!",message)){
                    BaseActivity.resetLogOut();
                }
            }
            LogUtils.e("HeaderInterceptor",responseStr);
        }
        return response;
    }
    private Request rebuildRequest(Request request) throws IOException {
        String headerLocal = (String) SPUtils.get(ChinasoftApp.getAppContext(), Constants.TOKEN,"");
        Request.Builder builder = request.newBuilder();
        builder.addHeader("Accept-Language","zh-US");
//        LogUtils.e("add language header success!");
        if(!TextUtils.isEmpty(headerLocal)){
            builder.addHeader(headerName, headerLocal);
            LogUtils.e("add Authorization header success!");
        }
        return builder.build();
    }

}
