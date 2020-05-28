package com.wangming.util;

import okhttp3.MediaType;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/18
 */
public class Constants {
    public static MediaType JSON_TYPE = MediaType.parse("application/json; charset=utf-8");




    /**
     * 百度接口列表
     */
    //查询某 entity 的实时位置
    public static String getlatestpoint = "https://yingyan.baidu.com/api/v3/track/getlatestpoint";

    //查询某 entity 一段时间内的轨迹里程
    public static String getdistance = "https://yingyan.baidu.com/api/v3/track/getdistance";

    //查询某 entity 一段时间内的轨迹点
    public static String gettrack = "https://yingyan.baidu.com/api/v3/track/gettrack";

    public static String latestPointKey(String key){
        return String.format("%s:latestPoint",key);
    }

    public static String trackKey(String key){
        return String.format("%s:track",key);
    }


    public interface appid{
        //        启明瞳app
        String QMTAPP = "wx9f9ad001076e5651";
        //        启明电台app
        String QMDTAPP = "wx181556c055aac149";
        //        启明出行app
        String QMCXAPP = "wx564f498013ce5076";
        //        我能帮帮忙小程序
        String WNBBMXCX = "wxe8861b848e9ce4ca";
        //        启明瞳小程序
        String QMTXCX = "wxce8e592adfc78ceb";
        //        启明瞳服务号
        String QMTFWH = "wxa4137801758c1854";
        //        我能帮帮忙服务号
        String WNBBMFWH = "wxcf77238b2c0d9de3";
    }

    public interface wxapi{
        /**
         * 微信公众号发送模板消息接口
         */
        String WX_SEND_TEMPLATE_MESSAGE_URL = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s";
    }

    public interface templateIds{
        String WNBBM01 = "702uhQuejg1vbaRXDpn3wWCv4yqSWT7iDBX2o6xXokg";
    }
}
