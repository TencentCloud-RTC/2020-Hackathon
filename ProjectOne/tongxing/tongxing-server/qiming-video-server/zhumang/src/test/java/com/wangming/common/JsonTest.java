package com.wangming.common;

import cn.hutool.json.JSONUtil;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/21
 */
public class JsonTest {

    @Test
    public void test01(){
        List list1 = new ArrayList<Integer>();
        List list3 = new ArrayList<Integer>();
        List list2 = new ArrayList();

        list1.add(1.333111111111);
        list1.add(2.333111111111);
        list3.add(3.333111111111);
        list3.add(4.333311111111);

        list2.add(list1);
        list2.add(list3);
        System.out.println(JSONUtil.parse(list2).toString());
    }




}
