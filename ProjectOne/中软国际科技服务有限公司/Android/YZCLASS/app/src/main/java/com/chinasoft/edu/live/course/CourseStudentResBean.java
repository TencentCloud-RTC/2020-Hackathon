package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.base.PageBean;

import java.util.List;

/**
 * 作者：young on 2020/5/9 16:27
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseStudentResBean {

    private List<CourseStudentBean> data;
    private int total;
    private PageBean page;

    public CourseStudentResBean() {
    }

    public List<CourseStudentBean> getData() {
        return data;
    }

    public void setData(List<CourseStudentBean> data) {
        this.data = data;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public PageBean getPage() {
        return page;
    }

    public void setPage(PageBean page) {
        this.page = page;
    }
}
