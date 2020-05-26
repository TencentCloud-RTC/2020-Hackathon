package com.chinasoft.edu.live.login;

/**
 * 作者：young on 2019-12-25 14:59
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：登录接口返回
 */
public class LoginResBean {

    /**
     * {"access_token":"","token_type":"","expires_in":43015,"scope":"all","jti":"b22e4b1b-83c0-44a9-90e1-288fd5a48eef"}}
     */
    public LoginResBean() {
    }

    private String access_token;
    private String token_type;
    private int expires_in;
    private String scope;
    private String jti;

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public int getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(int expires_in) {
        this.expires_in = expires_in;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getJti() {
        return jti;
    }

    public void setJti(String jti) {
        this.jti = jti;
    }
}
