package com.baidu.mapapi.clusterutil.ui;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;

import com.baidu.track.R;
import com.baidu.track.activity.MainActivity;
import com.baidu.track.activity.TracingActivity;

public class WelcomeActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {

                startActivity(new Intent(WelcomeActivity.this, MainActivity.class));
//                startActivity(new Intent(WelcomeActivity.this, QMMainActivity.class));
                finish();
            }
        }, 3000);
    }
}