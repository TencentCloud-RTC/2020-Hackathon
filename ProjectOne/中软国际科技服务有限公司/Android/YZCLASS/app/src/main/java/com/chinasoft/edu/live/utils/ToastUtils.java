package com.chinasoft.edu.live.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Timer;
import java.util.TimerTask;

/**
 * @ProjectName: Greeretail
 * @PackageName: com.gree.retail.util
 * @ClassDescribe:
 * @Author: Young
 * @CreatTime: 2019/1/14 9:41
 */
public class ToastUtils {

    private ToastUtils() {
        /* cannot be instantiated */
        throw new UnsupportedOperationException("cannot be instantiated");
    }

    public static boolean isShow = true;

    /**
     * 短时间显示Toast String 消息
     *
     * @param context
     * @param message
     */
    public static void showShort(Context context, CharSequence message) {
        if (isShow) {
//            Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_SHORT).show();
            Toast toast = Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_SHORT);
//            LinearLayout linearLayout = (LinearLayout) toast.getView();
//            TextView messageTextView = (TextView) linearLayout.getChildAt(0);
//            messageTextView.setTextSize(16);
            toast.setGravity(Gravity.CENTER, 0, 0);
            toast.show();
        }
    }

    /**
     * 短时间显示Toast res消息
     *
     * @param context
     * @param message
     */
    public static void showShort(Context context, int message) {
        if (isShow)
            Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

    /**
     * 长时间显示Toast String 消息
     *
     * @param context
     * @param message
     */
    public static void showLong(Context context, CharSequence message) {

        if (isShow) {
//            Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_SHORT).show();
            Toast toast = Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_LONG);
            toast.setGravity(Gravity.CENTER, 0, 0);
            toast.show();
        }
    }

    /**
     * 长时间显示Toast res消息
     *
     * @param context
     * @param message
     */
    public static void showLong(Context context, int message) {
        if (isShow)
            Toast.makeText(context.getApplicationContext(), message, Toast.LENGTH_LONG).show();
    }

    /**
     * 自定义显示Toast时间
     *
     * @param context
     * @param message
     *            String 消息
     * @param duration
     */
    public static void show(Context context, CharSequence message, int duration) {
        if (isShow)
            Toast.makeText(context.getApplicationContext(), message, duration).show();
    }

    /**
     * 自定义显示Toast时间 res消息
     *
     * @param context
     * @param message
     * @param duration
     */
    public static void show(Context context, int message, int duration) {
        if (isShow)
            Toast.makeText(context.getApplicationContext(), message, duration).show();
    }
    /**
     * 自定义显示Toast时间
     * @param context
     * @param message
     */
    @SuppressLint("ShowToast")
    public static void showMyToast(Context context,CharSequence message, final int cnt) {
        final Toast toast = Toast.makeText(context.getApplicationContext(),message, Toast.LENGTH_LONG);
        toast.setGravity(Gravity.CENTER, 0, 0);
        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                toast.show();
            }
        }, 0, 3000);
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                toast.cancel();
                timer.cancel();
            }
        }, cnt);
    }
    /**
     * 自定义显示Toast时间
     * @param context
     * @param message
     */
    @SuppressLint("ShowToast")
    public static void showMyToast(Context context,final Toast toast, final int cnt) {
        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                toast.show();
            }
        }, 0, 3000);
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                toast.cancel();
                timer.cancel();
            }
        }, cnt);
    }
}
