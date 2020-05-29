package com.wangming.spring.service;

import com.wangming.scheduler.ScheduleManager;
import com.wangming.spring.base.ServiceTest;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/21
 */
public class TaskService extends ServiceTest{

    @Autowired
    private ScheduleManager scheduleManager;

    @Test
    public void ScheduleTest() throws Exception{
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("schedule01 添加成功");
            }
        };

        scheduleManager.addTask("schedule01",runnable,"0/10 * * * * ?");


    }
}
