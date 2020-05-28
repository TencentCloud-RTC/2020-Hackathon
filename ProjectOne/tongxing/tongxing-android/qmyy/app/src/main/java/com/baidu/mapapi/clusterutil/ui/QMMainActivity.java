package com.baidu.mapapi.clusterutil.ui;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.View;
import android.widget.FrameLayout;

import com.baidu.mapapi.clusterutil.fragment.QMMapFragment;
import com.baidu.mapapi.clusterutil.fragment.QMRTCFragment;
import com.baidu.mapapi.map.MapFragment;
import com.baidu.track.R;

public class QMMainActivity extends Activity {
    public static String mVideoFile = "";
    private FragmentManager fragmentManager;
    private QMMapFragment qmMapFragment;
    private QMMapFragment qmMapFragment1;
    private QMRTCFragment qmrtcFragment;
    private QMRTCFragment qmrtcFragment1;
    private FragmentTransaction transaction;
    private FrameLayout max_fl;
    private FrameLayout min_fl;
    private String[] TAGS = new String[]{"tag1", "tag2"};
    private FragmentTransaction fragmentTransaction;
    boolean isShow = true;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qmmain);
        max_fl = findViewById(R.id.max_fl);
        min_fl = findViewById(R.id.min_fl);
        min_fl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showFragment(isShow);
            }
        });
        showFragment(isShow);

    }

    private void showFragment(boolean b) {

        qmMapFragment = new QMMapFragment();
        qmrtcFragment = new QMRTCFragment();
        qmMapFragment1 = new QMMapFragment();
        qmrtcFragment1 = new QMRTCFragment();
        fragmentTransaction = getFragmentManager().beginTransaction();
        fragmentTransaction.add(R.id.max_fl, qmMapFragment);//亮
        fragmentTransaction.add(R.id.max_fl, qmrtcFragment);//暗


        fragmentTransaction.add(R.id.min_fl, qmMapFragment1);//亮
        fragmentTransaction.add(R.id.min_fl, qmrtcFragment1);//暗
        if (b) {
            isShow = false;
            fragmentTransaction.show(qmMapFragment);
            fragmentTransaction.show(qmrtcFragment1);

            fragmentTransaction.hide(qmrtcFragment);
            fragmentTransaction.hide(qmMapFragment1);

            fragmentTransaction.commit();
        } else {
            isShow = true;
            fragmentTransaction.hide(qmMapFragment);
            fragmentTransaction.hide(qmrtcFragment1);

            fragmentTransaction.show(qmrtcFragment);
            fragmentTransaction.show(qmMapFragment1);
            fragmentTransaction.commit();
        }

    }

}
