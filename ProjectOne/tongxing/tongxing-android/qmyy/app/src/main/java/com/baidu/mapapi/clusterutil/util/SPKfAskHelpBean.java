package com.baidu.mapapi.clusterutil.util;

public class SPKfAskHelpBean {

    String appid;
    String deviceId;

    public SPKfAskHelpBean(String appid, String deviceId, String room_id) {
        this.appid = appid;
        this.deviceId = deviceId;
        this.room_id = room_id;
    }

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getRoom_id() {
        return room_id;
    }

    public void setRoom_id(String room_id) {
        this.room_id = room_id;
    }

    String room_id;
}
