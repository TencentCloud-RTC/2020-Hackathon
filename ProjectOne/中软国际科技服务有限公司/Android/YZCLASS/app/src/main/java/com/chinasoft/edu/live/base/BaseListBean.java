package com.chinasoft.edu.live.base;

import com.chinasoft.edu.live.base.BaseBean;

import java.util.List;

/**
 * 作者：young on 2020/5/8 17:22
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class BaseListBean<T> extends BaseBean {

    private List<T> data;
    private int total;
    private PageBean page;


    public BaseListBean() {
        super();
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public PageBean getPage() {
        return page;
    }

    public void setPage(PageBean page) {
        this.page = page;
    }
}
