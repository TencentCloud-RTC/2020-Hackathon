package com.chinasoft.edu.live.login;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.api.ProgressCancelListener;
import com.chinasoft.edu.live.api.SweetAlertDialogHandler;
import com.chinasoft.edu.live.base.BaseActivity;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.course.MainActivity;
import com.chinasoft.edu.live.utils.LogUtils;
import com.chinasoft.edu.live.utils.SPUtils;
import com.tencent.liteav.demo.trtc.debug.GenerateTestUserSig;
import com.tencent.qcloud.tim.uikit.TUIKit;
import com.tencent.qcloud.tim.uikit.base.IUIKitCallBack;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * @描述 登录
 * @作者 young
 * @时间 2020/4/27  14:25
 */
public class LoginActivity extends BaseActivity implements LoginView{

    @BindView(R.id.et_user_name)
    EditText etUserName;
    @BindView(R.id.et_oassword)
    EditText etOassword;
    @BindView(R.id.btn_login)
    Button btnLogin;

    LoginPresenter presenter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.bind(this);
        checkPermission(this);
        String loginName = (String) SPUtils.get(this,Constants.SP_KEY_USER_PHONE,"");
        if(!TextUtils.isEmpty(loginName)){
            etUserName.setText(loginName);
        }
        presenter = new LoginPresenter(this);
    }

    @OnClick(R.id.btn_login)
    public void onClick() {
        showProgressDialog();
        presenter.login();
    }

    @Override
    public Activity getActyContext() {
        return LoginActivity.this;
    }

    @Override
    public String getLoginName() {
        return etUserName.getText().toString().trim();
    }

    @Override
    public String getLoginPassWord() {
        return etOassword.getText().toString().trim();
    }

    @Override
    public void onLoginSuccessed(LoginResBean loginResBean) {
        String token = loginResBean.getAccess_token();
        String type = loginResBean.getToken_type();
        String auth_token = type + "\t" + token;
        SPUtils.put(LoginActivity.this, Constants.TOKEN, auth_token);
        SPUtils.put(LoginActivity.this,Constants.SP_KEY_USER_PHONE,getLoginName());
        timLogin();
    }

    @Override
    public void onLoginFailed(String errorMsg) {
        dismissProgressDialog();
        ToastUtil.toastShortMessage(errorMsg);
    }

    private SweetAlertDialogHandler mHandler = new SweetAlertDialogHandler(this, new ProgressCancelListener() {
        @Override
        public void onCancelProgress() {

        }
    }, false);

    protected void showProgressDialog() {
        if (mHandler == null) {
            mHandler = new SweetAlertDialogHandler(this, new ProgressCancelListener() {
                @Override
                public void onCancelProgress() {

                }
            }, false);
        }
        mHandler.obtainMessage(SweetAlertDialogHandler.SHOW_PROGRESS_DIALOG).sendToTarget();
    }

    protected void dismissProgressDialog() {
        if (mHandler != null) {
            mHandler.obtainMessage(SweetAlertDialogHandler.DISMISS_PROGRESS_DIALOG).sendToTarget();
            mHandler = null;
        }
    }

    private void timLogin() {
        String timLoginNumber = getLoginName();
        String timUserSig = GenerateTestUserSig.genTestUserSig(timLoginNumber);
        LogUtils.e("timUserSig____" + timUserSig);
        LogUtils.e("appID____" + Constants.APPID);
        TUIKit.login(timLoginNumber, timUserSig, new IUIKitCallBack() {
            @Override
            public void onError(String module, final int code, final String desc) {
                runOnUiThread(new Runnable() {
                    public void run() {
                        dismissProgressDialog();
                        ToastUtil.toastLongMessage("IM登录失败, errCode = " + code + ", errInfo = " + desc);
                    }
                });
                LogUtils.e("login_error", "imLogin errorCode = " + code + ", errorInfo = " + desc);
            }

            @Override
            public void onSuccess(Object data) {
                dismissProgressDialog();
                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    private static final int REQ_PERMISSION_CODE = 0x100;

    //权限检查
    public static boolean checkPermission(Activity activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            List<String> permissions = new ArrayList<>();
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(TUIKit.getAppContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(TUIKit.getAppContext(), Manifest.permission.CAMERA)) {
                permissions.add(Manifest.permission.CAMERA);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(TUIKit.getAppContext(), Manifest.permission.RECORD_AUDIO)) {
                permissions.add(Manifest.permission.RECORD_AUDIO);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(TUIKit.getAppContext(), Manifest.permission.READ_PHONE_STATE)) {
                permissions.add(Manifest.permission.READ_PHONE_STATE);
            }
            if (PackageManager.PERMISSION_GRANTED != ActivityCompat.checkSelfPermission(TUIKit.getAppContext(), Manifest.permission.READ_EXTERNAL_STORAGE)) {
                permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
            if (permissions.size() != 0) {
                String[] permissionsArray = permissions.toArray(new String[1]);
                ActivityCompat.requestPermissions(activity,
                        permissionsArray,
                        REQ_PERMISSION_CODE);
                return false;
            }
        }

        return true;
    }

    /**
     * 系统请求权限回调
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case REQ_PERMISSION_CODE:
                if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                    ToastUtil.toastLongMessage("未全部授权，部分功能可能无法使用！");
                }
                break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}
