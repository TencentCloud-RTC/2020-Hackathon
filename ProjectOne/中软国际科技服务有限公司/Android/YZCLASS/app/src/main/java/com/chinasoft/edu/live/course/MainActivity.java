package com.chinasoft.edu.live.course;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Toast;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.base.BaseActivity;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.custom.OnItemClickListener;
import com.chinasoft.edu.live.utils.SPUtils;
import com.scwang.smartrefresh.header.MaterialHeader;
import com.scwang.smartrefresh.layout.SmartRefreshLayout;
import com.scwang.smartrefresh.layout.api.RefreshLayout;
import com.scwang.smartrefresh.layout.listener.OnRefreshListener;
import com.tencent.imsdk.TIMCallBack;
import com.tencent.imsdk.TIMFriendshipManager;
import com.tencent.imsdk.TIMManager;
import com.tencent.imsdk.TIMUserProfile;
import com.tencent.imsdk.TIMValueCallBack;
import com.tencent.liteav.demo.trtc.debug.GenerateTestUserSig;
import com.tencent.trtc.TRTCCloudDef;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * @描述 首页
 * @作者 young
 * @时间 2020/4/27  13:41
 */
public class MainActivity extends BaseActivity implements CourseView{

    @BindView(R.id.recycler_view)
    RecyclerView recyclerView;
    @BindView(R.id.refreshLayout)
    SmartRefreshLayout refreshLayout;
    CourseAdapter adapter;
    List<CourseBean> mDatas = new ArrayList<>();

    CoursePresenter presenter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        initView();
        presenter = new CoursePresenter(this);
        initData();
    }



    private void initView() {
        LinearLayoutManager layoutManager = new LinearLayoutManager(MainActivity.this);
        layoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(layoutManager);

        adapter = new CourseAdapter(this,mDatas);
        recyclerView.setAdapter(adapter);
        refreshLayout.setEnableLoadMore(false);
        //设置 Header 为 贝塞尔雷达 样式
        refreshLayout.setRefreshHeader(new MaterialHeader(this));
        refreshLayout.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh(RefreshLayout refreshlayout) {
                initData();
            }
        });

        adapter.setOnItemClickListener(new OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position) {
                CourseBean courseBean = mDatas.get(position);
                Bundle bundle = new Bundle();
                bundle.putSerializable(Constants.PASS_KEY_COURSE_INFO_BEAN,courseBean);
                Intent intent = new Intent(MainActivity.this,CourseLiveRoomActivity.class);
                intent.putExtras(bundle);
                startActivity(intent);
            }
        });
    }

    private void initData() {
        TIMFriendshipManager.getInstance().getSelfProfile(new TIMValueCallBack<TIMUserProfile>() {
            @Override
            public void onError(int i, String s) {

            }

            @Override
            public void onSuccess(TIMUserProfile timUserProfile) {
                String nickName = timUserProfile.getNickName();
                SPUtils.put(MainActivity.this,Constants.SP_KEY_USER_NAME,nickName);
            }
        });
        presenter.getCourseList();
    }

    @Override
    public Activity getAtyContext() {
        return MainActivity.this;
    }

    @Override
    public void onSuccess(List<CourseBean> courseBeans) {
        mDatas.clear();
        mDatas.addAll(courseBeans);
        adapter.notifyDataSetChanged();
        if(refreshLayout!=null){
            refreshLayout.finishRefresh();
        }
    }

    @Override
    public void onFailed() {
        if(refreshLayout!=null){
            refreshLayout.finishRefresh();
        }
    }

    private long exitTime = 0;
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
            if ((System.currentTimeMillis() - exitTime) > 2000) {
                Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
                exitTime = System.currentTimeMillis();
            } else {

                presenter.loginOut();

            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void loginOutSuccessed() {
        TIMManager.getInstance().logout(new TIMCallBack() {
            @Override
            public void onError(int i, String s) {

            }

            @Override
            public void onSuccess() {
                finish();
            }
        });

    }

    @Override
    public void loginOutFailed() {

    }
}
