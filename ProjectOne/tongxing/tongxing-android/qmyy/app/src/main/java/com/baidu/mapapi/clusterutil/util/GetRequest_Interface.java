package com.baidu.mapapi.clusterutil.util;

import com.baidu.mapapi.clusterutil.trtc.bean.SPKfAskHelp;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface GetRequest_Interface {
    @POST("spkf/templateMsg/sendTemplateMsgSPKF")
    Call<SPKfAskHelp> getSPKfAskHelp(@Body Map<String, String> spkfaskhelp);
}
