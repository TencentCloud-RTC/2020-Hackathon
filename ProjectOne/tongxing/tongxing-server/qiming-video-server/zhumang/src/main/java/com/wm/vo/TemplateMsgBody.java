package com.wangming.vo;


/**
 * description
 *
 * @author bruce
 * @date 2019/3/29
 */
public class TemplateMsgBody {
    public TemplateMsgBody(){}

    public TemplateMsgBody(Miniprogram miniprogram, Data data){
        this.miniprogram = miniprogram;
        this.data = data;
    }

    private String touser;

    private String template_id;

    private String url;

    private Miniprogram miniprogram;

    private Data data;

    public String getTouser() {
        return touser;
    }

    public void setTouser(String touser) {
        this.touser = touser;
    }

    public String getTemplate_id() {
        return template_id;
    }

    public void setTemplate_id(String template_id) {
        this.template_id = template_id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Miniprogram getMiniprogram() {
        return miniprogram;
    }

    public void setMiniprogram(Miniprogram miniprogram) {
        this.miniprogram = miniprogram;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    private class Miniprogram{
        public Miniprogram(){}

        private String appid;
        private String pagepath;

        public String getAppid() {
            return appid;
        }

        public void setAppid(String appid) {
            this.appid = appid;
        }

        public String getPagepath() {
            return pagepath;
        }

        public void setPagepath(String pagepath) {
            this.pagepath = pagepath;
        }
    }

    public static class Data{
        public Data(){}
        public Data(DataContent dataContent){
            this.first = dataContent;
        }
        private DataContent first;
        private DataContent keyword1;
        private DataContent keyword2;
        private DataContent keyword3;
        private DataContent keyword4;
        private DataContent keyword5;
        private DataContent remark;

        public DataContent getKeyword4() {
            return keyword4;
        }

        public void setKeyword4(DataContent keyword4) {
            this.keyword4 = keyword4;
        }

        public DataContent getKeyword5() {
            return keyword5;
        }

        public void setKeyword5(DataContent keyword5) {
            this.keyword5 = keyword5;
        }

        public DataContent getFirst() {
            return first;
        }

        public void setFirst(DataContent first) {
            this.first = first;
        }

        public DataContent getKeyword1() {
            return keyword1;
        }

        public void setKeyword1(DataContent keyword1) {
            this.keyword1 = keyword1;
        }

        public DataContent getKeyword2() {
            return keyword2;
        }

        public void setKeyword2(DataContent keyword2) {
            this.keyword2 = keyword2;
        }

        public DataContent getKeyword3() {
            return keyword3;
        }

        public void setKeyword3(DataContent keyword3) {
            this.keyword3 = keyword3;
        }

        public DataContent getRemark() {
            return remark;
        }

        public void setRemark(DataContent remark) {
            this.remark = remark;
        }
    }


}
