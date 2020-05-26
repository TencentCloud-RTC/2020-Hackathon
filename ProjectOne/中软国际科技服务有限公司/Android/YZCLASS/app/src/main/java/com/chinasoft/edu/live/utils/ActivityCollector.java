package com.chinasoft.edu.live.utils;

import android.app.Activity;

import java.util.ArrayList;
import java.util.List;

/**
 * 作者：young on 2020-02-20 12:59
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class ActivityCollector {

    public static List<Activity> activities = new ArrayList<Activity>();

    public static void addActivity(Activity activity) {
        activities.add(activity);
    }

    public static void removeActivity(Activity activity) {
        activities.remove(activity);
    }

    public static void finishAll() {
        for (Activity activity : activities) {
            if (!activity.isFinishing()) {
                activity.finish();
            }
        }
    }
}
