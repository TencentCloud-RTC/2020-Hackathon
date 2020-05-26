package com.chinasoft.edu.live.course;

/**
 * 作者：young on 2020/5/6 17:17
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：自定义消息
 */
public class CustomMsgBean {

    public static final int STUDENT_APPLY = 1;
    public static final int STUDENT_OUT = 2;
    public static final int TEACHER_ACCEPT = 3;
    public static final int TEACHER_REFUSE = 4;

//    private int customType;//自定义消息类型 1学生请求连麦 2学生退出连麦 3教师同意连麦 3教师拒绝连麦
    private String userId;
    private String userName;

    public CustomMsgBean() {
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
