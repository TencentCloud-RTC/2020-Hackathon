package com.chinasoft.edu.live.base;

/**
 * 作者：young on 2020-01-13 15:56
 * 邮箱：fuxiangyang@chinasoftinc.com
 * 描述：
 */
public class BaseBean {
    private int code;
    private boolean success;
    private boolean error;
    private String message;

    public BaseBean() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "BaseBean{" +
                "code=" + code +
                ", success=" + success +
                ", error=" + error +
                ", message='" + message + '\'' +
                '}';
    }
}
