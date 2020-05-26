package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.api.SubscriberOnNextListener;
import com.chinasoft.edu.live.api.SweetDialogSubscriber;
import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.BasePresenter;
import com.chinasoft.edu.live.base.BaseResBean;
import com.chinasoft.edu.live.base.Constants;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import kotlin.jvm.internal.MutableLocalVariableReference;
import okhttp3.RequestBody;

/**
 * 作者：young on 2020/5/6 10:15
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CoursePresenter extends BasePresenter<CourseView> {

    public CoursePresenter(CourseView mvpView) {
        super(mvpView);
    }

    public void getCourseList(){
        RequestBody requestBody = json("appType","app");
        SweetDialogSubscriber<BaseResBean<CourseListBean>> subscriber = new SweetDialogSubscriber<>(new SubscriberOnNextListener<BaseResBean<CourseListBean>>() {
            @Override
            public void onNext(BaseResBean<CourseListBean> result) {
                if(result.getCode() == Constants.RES_OK){
                    mvpView.onSuccess(result.getResult().getMy());
                }else{
                    mvpView.onFailed();
                    ToastUtil.toastShortMessage(""+result.getMessage());
                }
            }
        },mvpView.getAtyContext(),false);
        addSubscription(apiStores.queryCourseList(requestBody),subscriber);
    }

    public void loginOut(){

        SweetDialogSubscriber<BaseBean> subscriber = new SweetDialogSubscriber<>(new SubscriberOnNextListener<BaseBean>() {
            @Override
            public void onNext(BaseBean result) {
                if(result.getCode() == Constants.RES_OK){
                    mvpView.loginOutSuccessed();
                }else{
                    mvpView.loginOutFailed();
                    ToastUtil.toastShortMessage(""+result.getMessage());
                }
            }
        },mvpView.getAtyContext(),false);

        addSubscription(apiStores.loginOut(),subscriber);
    }
}
