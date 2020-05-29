package com.wangming.scheduler;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.CronTask;
import org.springframework.scheduling.config.ScheduledTask;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ScheduleManager implements SchedulingConfigurer {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    /**
     * 受ScheduleManager管理的任务集合
     */
    private final Map<Object, ScheduledTask> taskMap = new HashMap<>();
    /**
     * 定时任务注册器
     */

    private ScheduledTaskRegistrar taskRegistrar;

    /**
     * 系统启动时获取任务注册对象
     *
     * @param taskRegistrar 任务注册对象
     */
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        this.taskRegistrar = taskRegistrar;
        logger.info("scheduleManager has successfully acquired the taskRegistrar");
    }

    /**
     * 添加新任务，如果存在key一致的任务，则取消原任务的执行，但添加新任务失败时原任务不会停止
     *
     * @param key      任务key
     * @param runnable 新任务执行代码
     * @param cron     新任务cron表达式
     */
    public void addTask(Object key, Runnable runnable, String cron) {
        if (runnable != null && !StringUtils.isEmpty(cron)) {
            ScheduledTask oldTask = taskMap.get(key);
            taskMap.put(key, taskRegistrar.scheduleCronTask(new CronTask(runnable, cron)));
            if (oldTask != null) {
                oldTask.cancel();
            }
        }
    }

    /**
     * 重置任务的执行时机，修改失败时任务仍使用原有执行时机
     *
     * @param key  任务key
     * @param cron 任务新cron表达式
     */
//    public void modifyTask(Object key, String cron) {
//        ScheduledTask oldTask = taskMap.get(key);
//
//        if (oldTask != null && !StringUtils.isEmpty(cron)) {
//            taskMap.put(key, taskRegistrar.scheduleCronTask(new CronTask(oldTask.getTask().getRunnable(), cron)));
//            oldTask.cancel();
//        }
//    }

    /**
     * 取消任务执行
     *
     * @param key 任务key
     */
    public void cancelTask(Object key) {
        ScheduledTask task = taskMap.remove(key);
        if (task != null) {
            task.cancel();
        }
    }

    /**
     * 查看是否存在任务
     *
     * @param key 任务key
     * @return 如果任务存在返回true，否则返回false
     */
    public boolean existTask(Object key) {
        return taskMap.get(key) != null;
    }
}