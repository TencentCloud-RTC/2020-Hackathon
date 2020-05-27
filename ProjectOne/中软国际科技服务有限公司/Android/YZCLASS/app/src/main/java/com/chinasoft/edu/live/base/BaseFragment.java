package com.chinasoft.edu.live.base;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;


public abstract class BaseFragment extends Fragment {

    public FragmentActivity mActivity;

    /**
     * 此方法可以得到上下文对象
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mActivity = getActivity();
    }

    /*
     * 当Activity初始化之后可以在这里进行一些数据的初始化操作
     */
    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

    }

}
