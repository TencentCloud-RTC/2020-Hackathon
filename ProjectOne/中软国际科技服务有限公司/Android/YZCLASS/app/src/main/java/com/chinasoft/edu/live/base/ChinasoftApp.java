package com.chinasoft.edu.live.base;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;

import com.chinasoft.edu.live.utils.LogUtils;
import com.tencent.imsdk.TIMCallBack;
import com.tencent.imsdk.TIMConversation;
import com.tencent.imsdk.TIMConversationType;
import com.tencent.imsdk.TIMManager;
import com.tencent.imsdk.TIMMessage;
import com.tencent.imsdk.TIMSdkConfig;
import com.tencent.imsdk.session.SessionWrapper;
import com.tencent.qcloud.tim.uikit.TUIKit;
import com.tencent.qcloud.tim.uikit.base.IMEventListener;
import com.tencent.qcloud.tim.uikit.config.CustomFaceConfig;
import com.tencent.qcloud.tim.uikit.config.GeneralConfig;
import com.tencent.qcloud.tim.uikit.config.TUIKitConfigs;

import java.util.List;


/**
 * 作者：young on 2019-10-23 10:13
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class ChinasoftApp extends Application {
    private static final String TAG = ChinasoftApp.class.getSimpleName();
    private static ChinasoftApp instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        config();
    }

    private void config() {
        initTimConfig();
    }

    private void initTimConfig() {
        // 配置 Config，请按需配置
        TUIKitConfigs configs = TUIKit.getConfigs();
        configs.setSdkConfig(new TIMSdkConfig(Constants.APPID));
        configs.setCustomFaceConfig(new CustomFaceConfig());
        configs.setGeneralConfig(new GeneralConfig());
        if (SessionWrapper.isMainProcess(getApplicationContext())) {
            TUIKit.init(this, Constants.APPID, configs);
//            registerActivityLifecycleCallbacks(new StatisticActivityLifecycleCallback());
        }

        IMEventListener imEventListener = new IMEventListener() {
            @Override
            public void onNewMessages(List<TIMMessage> msgs) {

                for (int i = 0; i < msgs.size(); i++) {
                    TIMMessage timMessage = msgs.get(i);
                    if (timMessage.getSender().equals("administrator")) {
                        TIMConversation sysMsgConversation = TIMManager.getInstance().getConversation(TIMConversationType.C2C, "administrator");
                        sysMsgConversation.setReadMessage(timMessage, new TIMCallBack() {
                            @Override
                            public void onError(int i, String s) {

                            }

                            @Override
                            public void onSuccess() {

                            }
                        });
                    }
                    LogUtils.e(TAG, "onNewMessages____" + msgs.get(i).toString());
                }
//                CustomAVCallUIController.getInstance().onNewMessage(msgs);
            }
        };
        TUIKit.addIMEventListener(imEventListener);
    }


    public static Context getAppContext() {
        return instance == null ? null : instance.getApplicationContext();
    }


    @Override
    public void onTerminate() {
        // 程序终止的时候执行
        LogUtils.e(TAG, "onTerminate");
        super.onTerminate();
    }

    @Override
    public void onLowMemory() {
        // 低内存的时候执行
        LogUtils.e(TAG, "onLowMemory");
        super.onLowMemory();
    }

    @Override
    public void onTrimMemory(int level) {
        // 程序在内存清理的时候执行
        LogUtils.e(TAG, "onTrimMemory");
        super.onTrimMemory(level);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        LogUtils.e(TAG, "onConfigurationChanged");
        super.onConfigurationChanged(newConfig);
    }
}
