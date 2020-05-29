package com.wangming.vo;

/**
 * description
 *
 * @author bruce
 * @date 2019/3/30
 */
public class DataContent {
    public DataContent(){};
    public DataContent(String value){
        this.value = value;
    }
    private String value;
    private String color;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
