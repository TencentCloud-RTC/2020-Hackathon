package com.chinasoft.edu.live.utils;

import android.util.Log;

import com.chinasoft.edu.live.base.Constants;


/**
 * @ProjectName: Greeretail
 * @PackageName: com.gree.retail.util
 * @ClassDescribe:
 * @Author: Young
 * @CreatTime: 2019/1/14 9:43
 */
public class LogUtils {
    /**
     * 日志开关
     */
    // TODO
    public static final boolean isLog = true;

    public static void v(String tag, String message) {
        if (isLog) {
            Log.v(tag, message);
        }
    }

    public static void d(String tag, String message) {
        if (isLog) {
            Log.d(tag, message);
        }
    }

    public static void i(String tag, String message) {
        if (isLog) {
            Log.i(tag, message);
        }
    }
    public static void i(String message) {
        if (isLog) {
            Log.i(Constants.SP_NAME, message);
        }
    }
    public static void w(String tag, String message) {
        if (isLog) {
            Log.w(tag, message);
        }
    }

    public static void e(String tag, String message) {
        if (isLog) {
            Log.e(tag, message);
        }
    }
    public static void e(String message) {
        if (isLog) {
            Log.e(Constants.SP_NAME, message);
        }
    }
    public static void e(String tag, String message, Exception e) {
        if (isLog) {
            Log.e(tag, message, e);
        }
    }

}
