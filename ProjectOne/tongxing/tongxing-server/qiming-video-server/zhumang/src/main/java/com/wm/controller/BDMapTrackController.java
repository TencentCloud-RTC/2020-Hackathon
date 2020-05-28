package com.wangming.controller;


import com.wangming.common.auto.model.BDMapTrack;
import com.wangming.service.BDMapTrackService;
import com.wangming.util.ResultVo;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 百度鹰眼服务器接口
 *
 * @author bruce
 * @date 2019/2/18
 */
@RestController
@RequestMapping("BDMap/track")
public class BDMapTrackController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private BDMapTrackService bdMapTrackService;

    /**
     * 查找entity最近一个轨迹点，支持实时纠偏。
     *
     * @param entity_name
     * @return
     */
    @RequestMapping(value = "/getlatestpoint", method = RequestMethod.GET)
    public ResultVo getLatestPoint(String entity_name) {
        if (StringUtils.isBlank(entity_name)) {
            return ResultVo.error("entityName 不能为空");
        }

        return this.bdMapTrackService.getLatestPoint(entity_name);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResultVo getdistance() {
        return null;
    }

    /**
     * 查询一个时间段内一个entity的连续轨迹信息，并进行纠偏。
     *
     * @return
     */
    @RequestMapping(value = "/gettrack", method = RequestMethod.GET)
    public ResultVo gettrack(String entity_name) {
        // 刷新到类的内存集合中
        if (StringUtils.isBlank(entity_name)) {
            return ResultVo.error("entityName 不能为空");
        }

        return ResultVo.success(this.bdMapTrackService.getTrack(entity_name));
//        return ResultVo.success("获取轨迹成功");
    }

    /**
     * 实时视频接通开始计时
     *
     * @param bdMapTrack
     */
    @RequestMapping(value = "/updateServiceStartDate", method = RequestMethod.POST)
    public void updateServiceStartDate(BDMapTrack bdMapTrack) {
        if (ObjectUtils.isEmpty(bdMapTrack)) {
            log.error("bdMapTrack 不能为空");
            return;
        }
        this.bdMapTrackService.updateServiceStartDate(bdMapTrack);
    }

    /**
     * 实时视频挂断计时结束
     *
     * @param bdMapTrack
     */
    @RequestMapping(value = "/updateServiceEndDate", method = RequestMethod.POST)
    public void updateServiceEndDate(BDMapTrack bdMapTrack) {
        if (ObjectUtils.isEmpty(bdMapTrack)) {
            log.error("bdMapTrack 不能为空");
            return;
        }
        this.bdMapTrackService.updateServiceEndDate(bdMapTrack);
    }

    /**
     * 前台从缓存定时获取实时轨迹
     *
     * @param entity_name
     */
    @RequestMapping(value = "/scheduleQetTrack", method = RequestMethod.GET)
    public ResultVo scheduleQetTrack(String entity_name) {
        if (StringUtils.isBlank(entity_name)) {
            log.error("entity_name 不能为空");
            return ResultVo.error("entity_name 不能为空");
        }
        List arrPoint = (List)this.bdMapTrackService.scheduleGetTrack(entity_name);
        if(ObjectUtils.isEmpty(arrPoint)){
            log.error("scheduleQetTrack 从缓存获取数据为空");
            return ResultVo.error("scheduleQetTrack 从缓存获取数据为空");
        }
        log.info("scheduleQetTrack get track from cache successfully");
        return ResultVo.success(arrPoint);
    }


}
