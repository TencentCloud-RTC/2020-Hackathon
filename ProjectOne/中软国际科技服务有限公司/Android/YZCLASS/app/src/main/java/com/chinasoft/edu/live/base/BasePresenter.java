package com.chinasoft.edu.live.base;


import com.chinasoft.edu.live.api.ApiClient;
import com.chinasoft.edu.live.api.ApiService;
import com.chinasoft.edu.live.api.JsonRequestBody;
import com.chinasoft.edu.live.utils.JsonUtils;
import com.chinasoft.edu.live.utils.LogUtils;
import com.google.gson.Gson;

import java.util.Map;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import rx.Observable;
import rx.Subscriber;
import rx.android.schedulers.AndroidSchedulers;
import rx.schedulers.Schedulers;
import rx.subscriptions.CompositeSubscription;

/**
 *@描述 presenter基类
 *@作者 young
 *@时间 2020/4/27  14:30
 */
public class BasePresenter<V> {

    public V mvpView;

    protected ApiService apiStores;
    private CompositeSubscription mCompositeSubscription;

    public BasePresenter(V mvpView) {
        this.mvpView = mvpView;
        attachView(mvpView);
    }

    public BasePresenter() {
    }

    public void attachView(V mvpView) {
        this.mvpView = mvpView;
        apiStores = ApiClient.retrofit().create(ApiService.class);
    }

    public void detachView() {
        this.mvpView = null;
        onUnsubscribe();
    }

    private Gson mGson;
    /**
     * 创建application/json数据体
     *
     * @param params 参数键值对 key1,value1,key2,value2...
     * @return RequestBody
     */
    protected RequestBody json(Object... params) {
        if(mGson==null){
            mGson = new Gson();
        }
        return json(mGson, params);
    }
    protected RequestBody toRequestBody(Object object){
        String param = JsonUtils.serialize(object);
        LogUtils.e("RequestBody__"+param);
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json;charset=utf-8"),param);
        return requestBody;
    }
    /**
     * 创建application/json数据体
     *
     * @param gson   使用指定的Gson进行序列化
     * @param params 参数键值对 key1,value1,key2,value2...
     * @return RequestBody
     */
    protected RequestBody json(Gson gson, Object... params) {
        JsonRequestBody body = JsonRequestBody.getInstance();
        Map<String, Object> map = body.getMap();
        String key = null;
        for (Object param : params) {
            if (key == null) {
                key = (String) param;
            } else {
                map.put(key, param);
                key = null;
            }
        }
        return body.build(gson);
    }
    //RXjava取消注册，以避免内存泄露
    public void onUnsubscribe() {
        if (mCompositeSubscription != null && mCompositeSubscription.hasSubscriptions()) {
            mCompositeSubscription.unsubscribe();
        }
    }


    protected  <T> void addSubscription(Observable<T> observable, Subscriber<T> subscriber) {
        if (mCompositeSubscription == null) {
            mCompositeSubscription = new CompositeSubscription();
        }
        mCompositeSubscription.add(observable
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(subscriber));
    }


}
