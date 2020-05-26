package com.chinasoft.edu.live.course;

import java.io.Serializable;

/**
 * 作者：young on 2020/4/27 17:55
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：课程数据模型
 */
public class CourseBean implements Serializable {

    private String courseName;//课程名称
    private String courseNumber;//课程编号
    private String coverFileUrl;//课程封面
    private String courseDes;//课程描述
    private String avchatRoomId;//聊天室id
    private String liveRoomId;//直播房间id
    private String isNoshowing;//直播状态：N 否 Y 是
    private CourseTeacher teacherInfo;//课程教师信息
    public CourseBean() {
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseNumber() {
        return courseNumber;
    }

    public void setCourseNumber(String courseNumber) {
        this.courseNumber = courseNumber;
    }

    public String getCoverFileUrl() {
        return coverFileUrl;
    }

    public void setCoverFileUrl(String coverFileUrl) {
        this.coverFileUrl = coverFileUrl;
    }

    public String getCourseDes() {
        return courseDes;
    }

    public void setCourseDes(String courseDes) {
        this.courseDes = courseDes;
    }

    public String getAvchatRoomId() {
        return avchatRoomId;
    }

    public void setAvchatRoomId(String avchatRoomId) {
        this.avchatRoomId = avchatRoomId;
    }

    public String getLiveRoomId() {
        return liveRoomId;
    }

    public void setLiveRoomId(String liveRoomId) {
        this.liveRoomId = liveRoomId;
    }

    public String getIsNoshowing() {
        return isNoshowing;
    }

    public void setIsNoshowing(String isNoshowing) {
        this.isNoshowing = isNoshowing;
    }

    public CourseTeacher getTeacherInfo() {
        return teacherInfo;
    }

    public void setTeacherInfo(CourseTeacher teacherInfo) {
        this.teacherInfo = teacherInfo;
    }
}
