package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.BaseView;

import java.util.List;

/**
 * 作者：young on 2020/5/8 14:16
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public interface CourseLiveRoomView extends BaseView<BaseBean> {

    String getLiveRoomId();
    void onOutSuccessed();
    void onOutFailed();

    String getCourseNumber();
    String getSelfUserId();
    void disconnectVoice();

    void onVoiceStudentList(List<CourseOnVoiceStudentBean> onVoiceStudents);
}
