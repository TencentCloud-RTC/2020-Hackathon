package com.chinasoft.edu.live.course;

import java.io.Serializable;

/**
 * 作者：young on 2020/5/6 13:58
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseTeacher implements Serializable {
    private String userAccount;
    private String nickname;
    private String faceImgPath;

    public CourseTeacher() {
    }

    public String getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public String getNickName() {
        return nickname;
    }

    public void setNickName(String nickName) {
        this.nickname = nickName;
    }

    public String getFaceImgPath() {
        return faceImgPath;
    }

    public void setFaceImgPath(String faceImgPath) {
        this.faceImgPath = faceImgPath;
    }
}
