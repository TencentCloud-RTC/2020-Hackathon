package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.base.BaseView;

import java.util.List;

/**
 * 作者：young on 2020/5/8 14:32
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public interface CourseStudentView extends BaseView<List<CourseStudentBean>> {

    String getLiveRoomId();

}
