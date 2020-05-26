package com.chinasoft.edu.live.custom;

/**
 * 作者：young on 2020/4/28 13:29
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public interface ActivityToFragmentListener {

    /**
     * 通过上麦申请
     */
    void acceptVoice();

    /**
     * 拒绝上麦申请
     */
    void refuseVoice();

    /**
     * 退出连麦
     */
    void outOfVoice();

}
