package com.chinasoft.edu.live.course;

import android.content.Context;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.custom.OnItemClickListener;
import com.tencent.qcloud.tim.uikit.component.picture.imageEngine.impl.GlideEngine;

import java.util.List;

/**
 * 作者：young on 2020/4/27 17:48
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：课程列表
 */
public class CourseAdapter extends RecyclerView.Adapter<CourseAdapter.ItemViewHolder> {

    private Context context;
    private List<CourseBean> mDatas;

    private OnItemClickListener onItemClickListener;

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

    public CourseAdapter(Context context, List<CourseBean> mDatas) {
        this.context = context;
        this.mDatas = mDatas;
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course, parent, false);
        return new ItemViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        CourseBean course = mDatas.get(position);
        String courseStatus = course.getIsNoshowing();
        boolean isShowing = TextUtils.equals("Y",courseStatus);
        holder.tvTitle.setText(course.getCourseName());
        holder.tvSubTitle.setText(course.getCourseDes());
        holder.tvStatus.setVisibility(isShowing?View.VISIBLE:View.GONE);
        holder.ivStatus.setVisibility(isShowing?View.VISIBLE:View.GONE);

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(onItemClickListener!=null){
                    onItemClickListener.onItemClick(view,position);
                }
            }
        });
        GlideEngine.loadImage( holder.ivCourseCover,course.getCoverFileUrl());

    }

    @Override
    public int getItemCount() {
        return mDatas != null ? mDatas.size() : 0;
    }

    class ItemViewHolder extends RecyclerView.ViewHolder {

        TextView tvTitle;
        TextView tvSubTitle;
        ImageView ivCourseCover;
        ImageView ivStatus;
        TextView tvStatus;

        ItemViewHolder(View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tv_course_title);
            ivStatus = itemView.findViewById(R.id.iv_live);
            tvStatus = itemView.findViewById(R.id.tv_status);
            tvSubTitle = itemView.findViewById(R.id.tv_course_title_sub);
            ivCourseCover = itemView.findViewById(R.id.iv_course_cover);
        }
    }
}
