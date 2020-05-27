package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.api.SubscriberOnNextListener;
import com.chinasoft.edu.live.api.SweetDialogSubscriber;
import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.BasePresenter;
import com.chinasoft.edu.live.base.BaseResBean;
import com.chinasoft.edu.live.base.Constants;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import java.util.List;

import okhttp3.RequestBody;
import rx.Subscriber;

/**
 * 作者：young on 2020/5/8 14:18
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseLiveRoomPresenter extends BasePresenter<CourseLiveRoomView> {

    public CourseLiveRoomPresenter(CourseLiveRoomView mvpView) {
        super(mvpView);
    }

    public void enterRoom(){
        String liveRoomId = mvpView.getLiveRoomId();
        RequestBody requestBody = json("liveRoomId",liveRoomId,"intoRoomChannel","Android");
        SweetDialogSubscriber<BaseBean> subscriber = new SweetDialogSubscriber<>(new SubscriberOnNextListener<BaseBean>() {
            @Override
            public void onNext(BaseBean result) {
                if(result.getCode() == Constants.RES_OK){
                    mvpView.onSuccess(result);
                }else{
                    mvpView.onFailed();
                    ToastUtil.toastShortMessage(""+result.getMessage());
                }
            }
        },mvpView.getAtyContext(),false);

        addSubscription(apiStores.intoLiveRoom(requestBody),subscriber);
    }
    public void exitRoom(){
        String liveRoomId = mvpView.getLiveRoomId();
        RequestBody requestBody = json("liveRoomId",liveRoomId);

        Subscriber<BaseBean> subscriber1 = new Subscriber<BaseBean>() {
            @Override
            public void onCompleted() {

            }

            @Override
            public void onError(Throwable e) {

            }

            @Override
            public void onNext(BaseBean baseBean) {
                if(baseBean.getCode() == Constants.RES_OK){
                    mvpView.onOutSuccessed();
                }else{
                    mvpView.onOutFailed();
                    ToastUtil.toastShortMessage(""+baseBean.getMessage());
                }
            }
        };
        SweetDialogSubscriber<BaseBean> subscriber = new SweetDialogSubscriber<>(new SubscriberOnNextListener<BaseBean>() {
            @Override
            public void onNext(BaseBean result) {
                if(result.getCode() == Constants.RES_OK){
                    mvpView.onOutSuccessed();
                }else{
                    mvpView.onOutFailed();
                    ToastUtil.toastShortMessage(""+result.getMessage());
                }
            }
        },mvpView.getAtyContext(),false);

        addSubscription(apiStores.outLiveRoom(requestBody),subscriber1);
    }

    public void getOnVoiceStudentList(){

        String courseNumber = mvpView.getCourseNumber();
        RequestBody requestBody = json("courseNumber",courseNumber);
        Subscriber<BaseResBean<CourseOnVoiceStudentResBean>> subscriber1 = new Subscriber<BaseResBean<CourseOnVoiceStudentResBean>>() {
            @Override
            public void onCompleted() {

            }

            @Override
            public void onError(Throwable e) {

            }

            @Override
            public void onNext(BaseResBean<CourseOnVoiceStudentResBean> baseBean) {
                if(baseBean.getCode() == Constants.RES_OK){
                    mvpView.onVoiceStudentList(baseBean.getResult().getList());
                }else{
                    ToastUtil.toastShortMessage(""+baseBean.getMessage());
                }
            }
        };

        addSubscription(apiStores.onVoiceStuednetList(requestBody),subscriber1);
    }

    public void disconnectVoice(){
        String courseNumber = mvpView.getCourseNumber();
        String userNumber = mvpView.getSelfUserId();
        RequestBody requestBody = json("courseNumber",courseNumber,"userNumber",userNumber);
        Subscriber<BaseBean> subscriber1 = new Subscriber<BaseBean>() {
            @Override
            public void onCompleted() {

            }

            @Override
            public void onError(Throwable e) {

            }

            @Override
            public void onNext(BaseBean baseBean) {
                if(baseBean.getCode() == Constants.RES_OK){
                    mvpView.disconnectVoice();
                }else{
                    ToastUtil.toastShortMessage(""+baseBean.getMessage());
                }
            }
        };

        addSubscription(apiStores.disconnectVoice(requestBody),subscriber1);
    }
}
