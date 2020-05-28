package com.wangming.util;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/18
 */
public class ResultVo<T> {
    /**
     * 状态码，0表示成功，其余表示失败。
     */
    private int code;

    /**
     * 正常请求响应内容。
     */
    private T content;

    /**
     * 异常响应信息。
     */
    private String errorMsg;

    public static <T> ResultVo<T> success(T content) {
        return new ResultVo<>(content);
    }

    public static ResultVo error(String errorMsg) {
        return new ResultVo(-1, errorMsg);
    }

    public ResultVo(T content) {
        this.content = content;
    }

    public ResultVo(int code, String errorMsg) {
        this.code = -1;
        this.errorMsg = errorMsg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
