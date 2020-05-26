package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.base.BaseView;

import java.util.List;

/**
 * 作者：young on 2020/5/6 10:11
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public interface CourseView extends BaseView<List<CourseBean>> {

    void loginOutSuccessed();
    void loginOutFailed();
}
