package com.chinasoft.edu.live.base;


/**
 * 作者：young on 2019-12-20 15:36
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：公共接口返回
 */
public class BaseResBean<T> extends BaseBean{

    private T result;
    public BaseResBean() {
        super();
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }
}
