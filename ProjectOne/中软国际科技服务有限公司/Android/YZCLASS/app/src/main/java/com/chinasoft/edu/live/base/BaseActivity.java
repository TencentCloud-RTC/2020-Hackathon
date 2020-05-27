package com.chinasoft.edu.live.base;

import android.app.Activity;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.api.ProgressCancelListener;
import com.chinasoft.edu.live.api.SweetAlertDialogHandler;
import com.chinasoft.edu.live.login.LoginActivity;
import com.chinasoft.edu.live.utils.ActivityCollector;
import com.chinasoft.edu.live.utils.LogUtils;
import com.chinasoft.edu.live.utils.SPUtils;
import com.chinasoft.edu.live.utils.ToastUtils;
import com.tencent.imsdk.TIMCallBack;
import com.tencent.imsdk.TIMManager;
import com.tencent.imsdk.TIMMessage;
import com.tencent.qcloud.tim.uikit.TUIKit;
import com.tencent.qcloud.tim.uikit.base.IMEventListener;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;

/**
 *@描述 Activity基类
 *@作者 young
 *@时间 2020/4/27  14:26
 */
public abstract class BaseActivity extends FragmentActivity {

    private static final String TAG = BaseActivity.class.getSimpleName();

    // 监听做成静态可以让每个子类重写时都注册相同的一份。
    private static IMEventListener mIMEventListener = new IMEventListener() {
        @Override
        public void onForceOffline() {
            ToastUtil.toastLongMessage("您的帐号已在其它终端登录");
//            logout(ZhiYunApp.getAppContext(), false);
            resetLogOut();
        }

        @Override
        public void onUserSigExpired() {
            super.onUserSigExpired();
            ToastUtil.toastLongMessage("用户票据过期,请重新登录");
            resetLogOut();
        }

        @Override
        public void onNewMessages(List<TIMMessage> msgs) {
            super.onNewMessages(msgs);
        }
    };

    public static void resetLogOut() {
        SPUtils.put(ChinasoftApp.getAppContext(), Constants.TOKEN,"");
        SPUtils.put(ChinasoftApp.getAppContext(), Constants.SP_KEY_USER_PHONE,"");
        SPUtils.put(ChinasoftApp.getAppContext(), Constants.SP_KEY_USER_MAIL,"");
        SPUtils.put(ChinasoftApp.getAppContext(),Constants.SP_KEY_USER_FACE_URL,"");
        SPUtils.put(ChinasoftApp.getAppContext(),Constants.SP_KEY_USER_FACE_URL,"");
        TIMManager.getInstance().logout(new TIMCallBack() {
            @Override
            public void onError(int i, String s) {
                LogUtils.e("Tim_logout_error_"+s);
            }

            @Override
            public void onSuccess() {
                LogUtils.e("Tim_logout_success");
            }
        });
        logout(ChinasoftApp.getAppContext());

    }
    public static void logout(Context context) {
        ActivityCollector.finishAll();
        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addActivity(this);
        ActivityCollector.addActivity(this);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
            getWindow().setStatusBarColor(getResources().getColor(R.color.white));
            getWindow().setNavigationBarColor(getResources().getColor(R.color.navigation_bar_color));
            int vis = getWindow().getDecorView().getSystemUiVisibility();
            vis |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            vis |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            getWindow().getDecorView().setSystemUiVisibility(vis);
        }

//        TUIKit.addIMEventListener(mIMEventListener);

    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            View v = getCurrentFocus();
            if (isShouldHideInput(v, ev)) {
                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                if (imm != null) {
                    imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                }
            }
            return super.dispatchTouchEvent(ev);
        }
        // 必不可少，否则所有的组件都不会有TouchEvent了
        if (getWindow().superDispatchTouchEvent(ev)) {
            return true;
        }
        return onTouchEvent(ev);
    }

    public boolean isShouldHideInput(View v, MotionEvent event) {
        if (v != null && (v instanceof EditText)) {
            int[] leftTop = { 0, 0 };
            // 获取输入框当前的location位置
            v.getLocationInWindow(leftTop);
            int left = leftTop[0];
            int top = leftTop[1];
            int bottom = top + v.getHeight();
            int right = left + v.getWidth();
            return !(event.getX() > left) || !(event.getX() < right)
                    || !(event.getY() > top) || !(event.getY() < bottom);
        }
        return false;
    }


    private List<Activity> activityList;
    /**
     * 添加Activity到集合中
     */
    public void addActivity(Activity activity) {
        if (activityList == null) {
            activityList = new LinkedList<>();
        }
        activityList.add(activity);
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (activityList != null) {
            activityList.remove(this);
        }
        ActivityCollector.removeActivity(this);
    }




    @Override
    protected void onResume() {
        super.onResume();
    }

    //onPause()方法注销
    @Override
    protected void onPause() {
        super.onPause();
    }
}
