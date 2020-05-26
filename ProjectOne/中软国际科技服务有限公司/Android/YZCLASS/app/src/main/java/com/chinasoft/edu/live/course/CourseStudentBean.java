package com.chinasoft.edu.live.course;

/**
 * 作者：young on 2020/4/28 17:02
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseStudentBean {

    private String studentNumber;
    private String userNumber;
    private String nickname;
    private String headFileUrl;
    private int isTeacher;//是否是教师0否、1是

    public CourseStudentBean() {
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getUserNumber() {
        return userNumber;
    }

    public void setUserNumber(String userNumber) {
        this.userNumber = userNumber;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getHeadFileUrl() {
        return headFileUrl;
    }

    public void setHeadFileUrl(String headFileUrl) {
        this.headFileUrl = headFileUrl;
    }

    public int getIsTeacher() {
        return isTeacher;
    }

    public void setIsTeacher(int isTeacher) {
        this.isTeacher = isTeacher;
    }
}
