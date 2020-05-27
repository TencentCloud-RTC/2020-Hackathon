package com.chinasoft.edu.live.course;

import android.content.Context;
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
 * 作者：young on 2020/4/28 16:52
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseStudentAdapter extends RecyclerView.Adapter<CourseStudentAdapter.ItemViewHolder> {

    private Context context;
    private List<CourseStudentBean> mDatas;

    private OnItemClickListener onItemClickListener;

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

    public CourseStudentAdapter(Context context, List<CourseStudentBean> mDatas) {
        this.context = context;
        this.mDatas = mDatas;
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course_student, parent, false);
        return new ItemViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
       CourseStudentBean course = mDatas.get(position);
        holder.num.setText(String.valueOf(position+1));
        holder.name.setText(course.getNickname());
        GlideEngine.loadImage(holder.head,course.getHeadFileUrl());
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(onItemClickListener!=null){
                    onItemClickListener.onItemClick(view,position);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return mDatas != null ? mDatas.size() : 0;
    }


    class ItemViewHolder extends RecyclerView.ViewHolder {

        TextView num;
        TextView name;
        ImageView head;

        ItemViewHolder(View itemView) {
            super(itemView);
            num = itemView.findViewById(R.id.tv_num);
            name = itemView.findViewById(R.id.tv_name);
            head = itemView.findViewById(R.id.iv_head);
        }
    }
}
