package com.wangming.webconfig;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.concurrent.TimeUnit;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/20
 */
@Configuration
@ComponentScan({"com.wangming"})
public class ConfigBean extends WebMvcConfigurerAdapter{
    @Bean
    public Cache<Object, Object> guavaCache() {
        return CacheBuilder.newBuilder()
                .expireAfterWrite(60*60*24, TimeUnit.SECONDS)
                .concurrencyLevel(Runtime.getRuntime().availableProcessors())
                .build();
    }

}
