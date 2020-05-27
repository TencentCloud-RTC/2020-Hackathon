package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.base.PageBean;

/**
 * 作者：young on 2020/5/8 14:36
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseStudentRequestBean {
    public CourseStudentRequestBean() {
    }

    public CourseStudentRequestBean(DataBean data, PageBean page) {
        this.data = data;
        this.page = page;
    }

    DataBean data;
    PageBean page;

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public PageBean getPage() {
        return page;
    }

    public void setPage(PageBean page) {
        this.page = page;
    }

    static class DataBean{
        String liveRoomId;

        public DataBean() {
        }

        public String getLiveRoomId() {
            return liveRoomId;
        }

        public void setLiveRoomId(String liveRoomId) {
            this.liveRoomId = liveRoomId;
        }
    }


}
