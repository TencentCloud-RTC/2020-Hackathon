package com.wangming.common;

import com.wangming.util.MD5Strategy;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/20
 */
public class Password {



    @Test
    public void myPassword(){

        List<String> list = new ArrayList<String>();
        list.add("wangming");

        List<String> list2 = new ArrayList<String>();
        list2.add(String.valueOf(new Date().getTime()));
        System.out.println(MD5Strategy.encryptPasswd(list2,""));

    }
}
