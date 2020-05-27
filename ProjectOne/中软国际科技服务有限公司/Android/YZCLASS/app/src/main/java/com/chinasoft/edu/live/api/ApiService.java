package com.chinasoft.edu.live.api;


import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.BaseListBean;
import com.chinasoft.edu.live.base.BaseResBean;
import com.chinasoft.edu.live.course.CourseListBean;
import com.chinasoft.edu.live.course.CourseOnVoiceStudentBean;
import com.chinasoft.edu.live.course.CourseOnVoiceStudentResBean;
import com.chinasoft.edu.live.course.CourseStudentBean;
import com.chinasoft.edu.live.course.CourseStudentResBean;
import com.chinasoft.edu.live.login.LoginResBean;

import java.util.List;
import java.util.Map;

import okhttp3.RequestBody;
import retrofit2.http.Body;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.HTTP;
import retrofit2.http.POST;
import rx.Observable;

/**
 * 作者：young on 2019-10-23 10:24
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：api接口
 */
public interface ApiService {

//    String API_SERVER_URL = "http://58.20.51.240:8046/";
    String API_SERVER_URL = "http://212.64.102.106:8046/";

    //登录
    @FormUrlEncoded
    @POST("server-uaa/oauth/token")
    Observable<BaseResBean<LoginResBean>> login(@FieldMap Map<String, String> fieldsMaps);
    //课程列表
    @POST("service-core/course/queryCourseList")
    Observable<BaseResBean<CourseListBean>> queryCourseList(@Body RequestBody requestBody);
    //退出登录
    @POST("service-core/user/loginOut")
    Observable<BaseBean> loginOut();
    //学员列表
    @POST("service-core/liveRoomStudent/queryStudentList")
    Observable<BaseResBean<CourseStudentResBean>> queryStudentList(@Body RequestBody requestBody);
    //退出直播间
    @POST("service-core/liveRoomStudent/outLiveRoom")
    Observable<BaseBean> outLiveRoom(@Body RequestBody requestBody);
    // 进入直播间
    @POST("service-core/liveRoomStudent/intoLiveRoom")
    Observable<BaseBean> intoLiveRoom(@Body RequestBody requestBody);
    // 上麦学生列表
    @POST("service-core/onlineVoice/queryOnlineMemberList")
    Observable<BaseResBean<CourseOnVoiceStudentResBean>> onVoiceStuednetList(@Body RequestBody requestBody);
    // 学生退出上麦
    @HTTP(method = "DELETE", path = "service-core/onlineVoice/deleteOnlineMember", hasBody = true)
    Observable<BaseBean> disconnectVoice(@Body RequestBody requestBody);



}
