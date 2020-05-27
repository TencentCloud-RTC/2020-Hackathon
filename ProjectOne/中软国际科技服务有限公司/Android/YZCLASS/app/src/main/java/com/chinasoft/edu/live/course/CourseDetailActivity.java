package com.chinasoft.edu.live.course;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.chinasoft.edu.live.R;
import com.chinasoft.edu.live.base.BaseActivity;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * @描述 课程详情
 * @作者 young
 * @时间 2020/4/28  09:13
 */
public class CourseDetailActivity extends BaseActivity {


    @BindView(R.id.iv_back)
    ImageView ivBack;
    @BindView(R.id.course_des)
    TextView courseDes;
    @BindView(R.id.tv_course_title)
    TextView tvCourseTitle;
    @BindView(R.id.tv_course_title_sub)
    TextView tvCourseTitleSub;
    @BindView(R.id.iv_teacher_head)
    ImageView ivTeacherHead;
    @BindView(R.id.tv_teacher_name)
    TextView tvTeacherName;
    @BindView(R.id.btn_into_course)
    Button btnIntoCourse;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course_detail);
        ButterKnife.bind(this);

    }

    @OnClick({R.id.iv_back, R.id.btn_into_course})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.iv_back:
                finish();
                break;
            case R.id.btn_into_course:
                Intent intent = new Intent(CourseDetailActivity.this,CourseLiveRoomActivity.class);
                startActivity(intent);
                break;
        }
    }
}
