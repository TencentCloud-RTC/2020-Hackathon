package com.chinasoft.edu.live.course;

import android.app.Activity;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.base.BaseFragment;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.utils.LogUtils;
import com.scwang.smartrefresh.header.MaterialHeader;
import com.scwang.smartrefresh.layout.SmartRefreshLayout;
import com.scwang.smartrefresh.layout.api.RefreshLayout;
import com.scwang.smartrefresh.layout.listener.OnLoadMoreListener;
import com.scwang.smartrefresh.layout.listener.OnRefreshListener;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * 作者：young on 2020/4/28 11:35
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：课程学员列表
 */
public class CourseStudentFragment extends BaseFragment implements CourseStudentView{

    @BindView(R.id.recycler_view)
    RecyclerView recyclerView;
    @BindView(R.id.refreshLayout)
    SmartRefreshLayout refreshLayout;

    CourseStudentAdapter adapter;

    List<CourseStudentBean> mDatas = new ArrayList<>();

    CourseStudentPresenter presenter;

    String liveRoomId;
    int pageNumber = 1;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_student, container,
                false);
        ButterKnife.bind(this, rootView);
        presenter = new CourseStudentPresenter(this);
        Bundle bundle = getArguments();
        liveRoomId = bundle.getString(Constants.PASS_KEY_COURSE_ID);
        initView();
        initData();
        return rootView;
    }

    private void initView() {

        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity());
        layoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(layoutManager);
        adapter = new CourseStudentAdapter(getActivity(),mDatas);
        recyclerView.setAdapter(adapter);
        //设置 Header 为 贝塞尔雷达 样式
        refreshLayout.setRefreshHeader(new MaterialHeader(getActivity()));
        refreshLayout.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh(RefreshLayout refreshlayout) {
                pageNumber = 1;
                initData();
            }
        });
        refreshLayout.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore(@NonNull RefreshLayout refreshLayout) {
                pageNumber++;
               initData();
            }
        });

    }

    private void initData() {
        presenter.getStudentList(pageNumber);
    }

    @Override
    public String getLiveRoomId() {
        return liveRoomId;
    }

    @Override
    public Activity getAtyContext() {
        return getActivity();
    }

    @Override
    public void onSuccess(List<CourseStudentBean> courseStudentBeans) {
        if(refreshLayout!=null){
          refreshLayout.finishRefresh();
          refreshLayout.finishLoadMore();
        }
        if(pageNumber == 1){
            mDatas.clear();
        }
        if(courseStudentBeans!=null&&courseStudentBeans.size()>0){
            mDatas.addAll(courseStudentBeans);
        }
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onFailed() {

    }
}
