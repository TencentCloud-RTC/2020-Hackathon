package com.wangming.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.*;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/18
 */
public class ThreadPoolService {
    private final static Logger LOGGER = LoggerFactory.getLogger(ThreadPoolService.class);
    private final static ExecutorService MASTER_POOL;
    private final static ExecutorService SECONDARY_POOL;

    static {
        int cpuCoreSize = Runtime.getRuntime().availableProcessors();

        if (cpuCoreSize == 0) {
            cpuCoreSize = 1;
        }

        SECONDARY_POOL = new ThreadPoolExecutor(0, Integer.MAX_VALUE, 20L, TimeUnit.MINUTES, new SynchronousQueue<Runnable>());
        MASTER_POOL = new ThreadPoolExecutor(cpuCoreSize, cpuCoreSize, 0L, TimeUnit.MILLISECONDS, new SynchronousQueue<Runnable>(), new RejectedExecutionHandler() {
            @Override
            public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
                LOGGER.debug(String.format("主线程池已满%s，交由副线程池执行%s", executor.toString(), SECONDARY_POOL.toString()));
                SECONDARY_POOL.submit(r);
            }
        });
    }

}
