package com.chinasoft.edu.live.course;

import com.chinasoft.edu.live.api.SubscriberOnNextListener;
import com.chinasoft.edu.live.api.SweetDialogSubscriber;
import com.chinasoft.edu.live.base.BaseBean;
import com.chinasoft.edu.live.base.BaseListBean;
import com.chinasoft.edu.live.base.BasePresenter;
import com.chinasoft.edu.live.base.BaseResBean;
import com.chinasoft.edu.live.base.Constants;
import com.chinasoft.edu.live.base.PageBean;
import com.tencent.qcloud.tim.uikit.utils.ToastUtil;

import okhttp3.RequestBody;

/**
 * 作者：young on 2020/5/8 14:34
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class CourseStudentPresenter extends BasePresenter<CourseStudentView> {

    public CourseStudentPresenter(CourseStudentView mvpView) {
        super(mvpView);
    }

    public void getStudentList(int pageNumbers){

        String liveRoomId = mvpView.getLiveRoomId();
        CourseStudentRequestBean.DataBean dataBean = new CourseStudentRequestBean.DataBean();
        dataBean.setLiveRoomId(liveRoomId);
        PageBean pageBean = new PageBean();
        pageBean.setCountPerPages(10);
        pageBean.setPageNumbers(pageNumbers);
        CourseStudentRequestBean requestBean = new CourseStudentRequestBean(dataBean,pageBean);
        RequestBody requestBody = toRequestBody(requestBean);
        SweetDialogSubscriber<BaseResBean<CourseStudentResBean>> subscriber = new SweetDialogSubscriber<>(new SubscriberOnNextListener<BaseResBean<CourseStudentResBean>>() {
            @Override
            public void onNext(BaseResBean<CourseStudentResBean> result) {
                if(result.getCode() == Constants.RES_OK){
                    mvpView.onSuccess(result.getResult().getData());
                }else{
                    mvpView.onFailed();
                    ToastUtil.toastShortMessage(""+result.getMessage());
                }
            }
        },mvpView.getAtyContext(),false);

        addSubscription(apiStores.queryStudentList(requestBody),subscriber);
    }
}
