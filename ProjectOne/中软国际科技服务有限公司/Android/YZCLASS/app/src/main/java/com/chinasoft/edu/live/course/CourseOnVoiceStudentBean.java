package com.chinasoft.edu.live.course;

/**
 * 作者：young on 2020/5/11 10:21
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseOnVoiceStudentBean {


    private String userNumber;
    private String nickname;
    private String courseNumber;
    private String userAccount;
    private String headFileUrl;

    public CourseOnVoiceStudentBean() {
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

    public String getCourseNumber() {
        return courseNumber;
    }

    public void setCourseNumber(String courseNumber) {
        this.courseNumber = courseNumber;
    }

    public String getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public String getHeadFileUrl() {
        return headFileUrl;
    }

    public void setHeadFileUrl(String headFileUrl) {
        this.headFileUrl = headFileUrl;
    }
}
