package com.chinasoft.edu.live.base;

/**
 * 作者：young on 2020/5/8 17:24
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class PageBean {

    private int pageNumbers;
    private int countPerPages;

    public PageBean() {
    }

    public int getPageNumbers() {
        return pageNumbers;
    }

    public void setPageNumbers(int pageNumbers) {
        this.pageNumbers = pageNumbers;
    }

    public int getCountPerPages() {
        return countPerPages;
    }

    public void setCountPerPages(int countPerPages) {
        this.countPerPages = countPerPages;
    }
}
