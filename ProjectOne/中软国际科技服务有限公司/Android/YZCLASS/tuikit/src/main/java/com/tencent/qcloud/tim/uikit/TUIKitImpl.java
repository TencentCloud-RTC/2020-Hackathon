package com.tencent.qcloud.tim.uikit;

import android.content.Context;
import android.text.TextUtils;

import com.tencent.imsdk.TIMCallBack;
import com.tencent.imsdk.TIMConnListener;
import com.tencent.imsdk.TIMConversation;
import com.tencent.imsdk.TIMGroupEventListener;
import com.tencent.imsdk.TIMGroupTipsElem;
import com.tencent.imsdk.TIMManager;
import com.tencent.imsdk.TIMMessage;
import com.tencent.imsdk.TIMMessageListener;
import com.tencent.imsdk.TIMRefreshListener;
import com.tencent.imsdk.TIMSNSChangeInfo;
import com.tencent.imsdk.TIMSdkConfig;
import com.tencent.imsdk.TIMUserConfig;
import com.tencent.imsdk.TIMUserStatusListener;
import com.tencent.imsdk.ext.message.TIMMessageReceipt;
import com.tencent.imsdk.ext.message.TIMMessageReceiptListener;
import com.tencent.imsdk.friendship.TIMFriendPendencyInfo;
import com.tencent.imsdk.friendship.TIMFriendshipListener;
import com.tencent.qcloud.tim.uikit.base.IMEventListener;
import com.tencent.qcloud.tim.uikit.base.IUIKitCallBack;
import com.tencent.qcloud.tim.uikit.component.face.FaceManager;
import com.tencent.qcloud.tim.uikit.config.GeneralConfig;
import com.tencent.qcloud.tim.uikit.config.TUIKitConfigs;
import com.tencent.qcloud.tim.uikit.modules.chat.C2CChatManagerKit;
import com.tencent.qcloud.tim.uikit.modules.conversation.ConversationManagerKit;
import com.tencent.qcloud.tim.uikit.modules.message.MessageRevokedManager;
import com.tencent.qcloud.tim.uikit.utils.BackgroundTasks;
import com.tencent.qcloud.tim.uikit.utils.FileUtil;
import com.tencent.qcloud.tim.uikit.utils.TUIKitLog;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import static com.tencent.qcloud.tim.uikit.utils.NetWorkUtils.sIMSDKConnected;

public class TUIKitImpl {

    private static final String TAG = "TUIKit";

    private static Context sAppContext;
    private static TUIKitConfigs sConfigs;
    private static List<IMEventListener> sIMEventListeners = new ArrayList<>();

    /**
     * TUIKit的初始化函数
     *
     * @param context  应用的上下文，一般为对应应用的ApplicationContext
     * @param sdkAppID 您在腾讯云注册应用时分配的sdkAppID
     * @param configs  TUIKit的相关配置项，一般使用默认即可，需特殊配置参考API文档
     */
    public static void init(Context context, int sdkAppID, TUIKitConfigs configs) {
        TUIKitLog.e(TAG, "init tuikit version: " + BuildConfig.VERSION_NAME);
        sAppContext = context;
        sConfigs = configs;
        if (sConfigs.getGeneralConfig() == null) {
            GeneralConfig generalConfig = new GeneralConfig();
            sConfigs.setGeneralConfig(generalConfig);
        }
        String dir = sConfigs.getGeneralConfig().getAppCacheDir();
        if (TextUtils.isEmpty(dir)) {
            TUIKitLog.e(TAG, "appCacheDir is empty, use default dir");
            sConfigs.getGeneralConfig().setAppCacheDir(context.getFilesDir().getPath());
        } else {
            File file = new File(dir);
            if (file.exists()) {
                if (file.isFile()) {
                    TUIKitLog.e(TAG, "appCacheDir is a file, use default dir");
                    sConfigs.getGeneralConfig().setAppCacheDir(context.getFilesDir().getPath());
                } else if (!file.canWrite()) {
                    TUIKitLog.e(TAG, "appCacheDir can not write, use default dir");
                    sConfigs.getGeneralConfig().setAppCacheDir(context.getFilesDir().getPath());
                }
            } else {
                boolean ret = file.mkdirs();
                if (!ret) {
                    TUIKitLog.e(TAG, "appCacheDir is invalid, use default dir");
                    sConfigs.getGeneralConfig().setAppCacheDir(context.getFilesDir().getPath());
                }
            }
        }
        initIM(context, sdkAppID);

        BackgroundTasks.initInstance();
        FileUtil.initPath(); // 取决于app什么时候获取到权限，即使在application中初始化，首次安装时，存在获取不到权限，建议app端在activity中再初始化一次，确保文件目录完整创建
        FaceManager.loadFaceFiles();
    }

    public static void login(String userid, String usersig, final IUIKitCallBack callback) {
        TIMManager.getInstance().login(userid, usersig, new TIMCallBack() {
            @Override
            public void onError(int code, String desc) {
                callback.onError(TAG, code, desc);
            }

            @Override
            public void onSuccess() {
                callback.onSuccess(null);
            }
        });
    }

    private static void initIM(Context context, int sdkAppID) {
        TIMSdkConfig sdkConfig = sConfigs.getSdkConfig();
        if (sdkConfig == null) {
            sdkConfig = new TIMSdkConfig(sdkAppID);
            sConfigs.setSdkConfig(sdkConfig);
        }
        GeneralConfig generalConfig = sConfigs.getGeneralConfig();
        sdkConfig.setLogLevel(generalConfig.getLogLevel());
        sdkConfig.enableLogPrint(generalConfig.isLogPrint());
        TIMManager.getInstance().init(context, sdkConfig);

        TIMUserConfig userConfig = new TIMUserConfig();
        userConfig.setReadReceiptEnabled(true);
        userConfig.setMessageReceiptListener(new TIMMessageReceiptListener() {
            @Override
            public void onRecvReceipt(List<TIMMessageReceipt> receiptList) {
                C2CChatManagerKit.getInstance().onReadReport(receiptList);
            }
        });
        userConfig.setUserStatusListener(new TIMUserStatusListener() {
            @Override
            public void onForceOffline() {
                for (IMEventListener l : sIMEventListeners) {
                    l.onForceOffline();
                }
                unInit();
            }

            @Override
            public void onUserSigExpired() {
                for (IMEventListener l : sIMEventListeners) {
                    l.onUserSigExpired();
                }
                unInit();
            }
        });

        userConfig.setConnectionListener(new TIMConnListener() {
            @Override
            public void onConnected() {
                sIMSDKConnected = true;
                for (IMEventListener l : sIMEventListeners) {
                    l.onConnected();
                }
            }

            @Override
            public void onDisconnected(int code, String desc) {
                sIMSDKConnected = false;
                for (IMEventListener l : sIMEventListeners) {
                    l.onDisconnected(code, desc);
                }
            }

            @Override
            public void onWifiNeedAuth(String name) {
                for (IMEventListener l : sIMEventListeners) {
                    l.onWifiNeedAuth(name);
                }
            }
        });

        userConfig.setRefreshListener(new TIMRefreshListener() {
            @Override
            public void onRefresh() {

            }

            @Override
            public void onRefreshConversation(List<TIMConversation> conversations) {
                ConversationManagerKit.getInstance().onRefreshConversation(conversations);
                for (IMEventListener l : sIMEventListeners) {
                    l.onRefreshConversation(conversations);
                }
            }
        });

        userConfig.setGroupEventListener(new TIMGroupEventListener() {
            @Override
            public void onGroupTipsEvent(TIMGroupTipsElem elem) {
                for (IMEventListener l : sIMEventListeners) {
                    l.onGroupTipsEvent(elem);
                }
            }
        });

        userConfig.setFriendshipListener(new TIMFriendshipListener() {
            @Override
            public void onAddFriends(List<String> list) {
                TUIKitLog.i(TAG, "onAddFriends: " + list.size());
            }

            @Override
            public void onDelFriends(List<String> list) {
                TUIKitLog.i(TAG, "onDelFriends: " + list.size());
            }

            @Override
            public void onFriendProfileUpdate(List<TIMSNSChangeInfo> list) {
                TUIKitLog.i(TAG, "onFriendProfileUpdate: " + list.size());
            }

            @Override
            public void onAddFriendReqs(List<TIMFriendPendencyInfo> list) {
                TUIKitLog.i(TAG, "onAddFriendReqs: " + list.size());
            }
        });

        TIMManager.getInstance().addMessageListener(new TIMMessageListener() {
            @Override
            public boolean onNewMessages(List<TIMMessage> msgs) {
                for (IMEventListener l : sIMEventListeners) {
                    l.onNewMessages(msgs);
                }
                return false;
            }
        });

        userConfig.setMessageRevokedListener(MessageRevokedManager.getInstance());
        TIMManager.getInstance().setUserConfig(userConfig);

    }

    public static void unInit() {
        ConversationManagerKit.getInstance().destroyConversation();
    }


    public static Context getAppContext() {
        return sAppContext;
    }

    public static TUIKitConfigs getConfigs() {
        if (sConfigs == null) {
            sConfigs = TUIKitConfigs.getConfigs();
        }
        return sConfigs;
    }

    public static void addIMEventListener(IMEventListener listener) {
        if (listener != null && !sIMEventListeners.contains(listener)) {
            sIMEventListeners.add(listener);
        }
    }

    public static void removeIMEventListener(IMEventListener listener) {
        if (listener == null) {
            sIMEventListeners.clear();
        } else {
            sIMEventListeners.remove(listener);
        }
    }
}
