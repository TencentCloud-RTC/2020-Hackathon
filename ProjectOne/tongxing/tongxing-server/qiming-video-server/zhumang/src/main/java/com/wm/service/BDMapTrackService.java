package com.wangming.service;

import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.google.common.cache.Cache;
import com.wangming.common.auto.dao.BDMapLatestPointMapper;
import com.wangming.common.auto.dao.BDMapTrackMapper;
import com.wangming.common.auto.model.BDMapLatestPoint;
import com.wangming.common.auto.model.BDMapTrack;
import com.wangming.common.manual.dao.BDMapTrackExtMapper;
import com.wangming.scheduler.ScheduleManager;
import com.wangming.util.*;
import com.wangming.vo.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.*;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/19
 */
@Service
public class BDMapTrackService {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Value("${baiduMap.service_id}")
    private String serviceId;

    @Value("${baiduMap.coord_type_output}")
    private String coordTypeTutput;

    @Value("${baiduMap.trackCron}")
    private String cron;

    @Autowired
    private Cache<Object, Object> cache;

    @Autowired
    private BDMapLatestPointMapper bdMapLatestPointMapper;

    @Autowired
    private BDMapTrackMapper bdMapTrackMapper;

    @Autowired
    private BDMapTrackExtMapper bdMapTrackExtMapper;

    @Autowired
    private CommonService commonService;

    @Autowired
    private ScheduleManager scheduleManager;


    public ResultVo getLatestPoint(final String entityName){

        String body = this.commonService.latestPoint(entityName);
//        {"status":0,"message":"成功","latest_point":{"longitude":0,"latitude":0,"loc_time":0}}
        JSONObject jsonObject = JSONUtil.parseObj(body);

        if(!"0".equals(jsonObject.get("status").toString())){
            return ResultVo.error("请求getLatestPoint失败 errcode："+jsonObject.get("status"));
        }

        JSONObject latestPoint = JSONUtil.parseObj(jsonObject.get("latest_point"));

        BDMapLatestPoint bdMapLatestPoint = JSONUtil.toBean(latestPoint, BDMapLatestPoint.class);

        //字段对应不上的要手工set
        if(!ObjectUtils.isEmpty(latestPoint.get("loc_time")) && !"0".equals(String.valueOf(latestPoint.get("loc_time")))){
            bdMapLatestPoint.setLocTime(DateUtil.parse(String.valueOf(latestPoint.get("loc_time")),"yyyy-MM-dd HH:mm") );
        }
        if(!ObjectUtils.isEmpty(latestPoint.get("radius"))){
            bdMapLatestPoint.setRadius(Double.valueOf(String.valueOf(latestPoint.get("radius"))));
        }
        if(!ObjectUtils.isEmpty(latestPoint.get("locate_mode"))){
            bdMapLatestPoint.setLocateMode(Integer.valueOf(String.valueOf(latestPoint.get("locate_mode"))));
        }

        bdMapLatestPoint.setServiceId(Integer.valueOf(serviceId));
        bdMapLatestPoint.setEntityName(entityName);
        bdMapLatestPoint.setCoordTypeOutput(coordTypeTutput);

        this.bdMapLatestPointMapper.insertSelective(bdMapLatestPoint);

        // 存放到缓存
        cache.put(Constants.latestPointKey(entityName),jsonObject);

        if(scheduleManager.existTask(entityName)){
            log.info("实时定时任务 {} 已经存在",entityName);
        }else{
            scheduleManager.addTask(entityName, new Runnable() {
                @Override
                public void run() {
                    String  body = commonService.latestPoint(entityName);
                    JSONObject jsonObject = JSONUtil.parseObj(body);
                    cache.put(Constants.latestPointKey(entityName),jsonObject);
                    log.info("entityname {} the latestPoint is ==> {}",Constants.latestPointKey(entityName),JSONUtil.toJsonStr(jsonObject));
                }
            },cron);
        }

        return ResultVo.success(jsonObject.get("latest_point"));

    }

    public Object getTrack(String entityName){

        String body = this.commonService.track(entityName);
        JSONObject jsonObject = JSONUtil.parseObj(body);

        log.debug("the return message: "+jsonObject.toString());
        if(!"0".equals(jsonObject.get("status").toString())){
            return ResultVo.error("请求getLatestPoint失败 errcode："+jsonObject.get("status"));
        }

        JSONObject startPoint = JSONUtil.parseObj(jsonObject.get("start_point"));

        JSONObject endPoint = JSONUtil.parseObj(jsonObject.get("end_point"));

        JSONArray points = JSONUtil.parseArray(jsonObject.get("points"));

        String size = jsonObject.get("size").toString();

        BDMapTrack bdMapTrack = new BDMapTrack();

        bdMapTrack.setServiceId(Integer.valueOf(serviceId));
        bdMapTrack.setEntityName(entityName);
        bdMapTrack.setCoordTypeOutput(coordTypeTutput);
        bdMapTrack.setUpdateDate(new Date());

        bdMapTrack.setPoints(points.toString());
        bdMapTrack.setStartPoint(startPoint.toString());
        bdMapTrack.setEndPoint(endPoint.toString());

        if(!ObjectUtils.isEmpty(size)){
            bdMapTrack.setSize(Integer.valueOf(size));
        }

        this.bdMapTrackMapper.insertSelective(bdMapTrack);

        List<Point> listPoint = JSONUtil.toList(points, Point.class);
        List arrPoint = new ArrayList<List>();

        for(Point p:listPoint){
            List tmp = new ArrayList<Double>();
            tmp.add(p.getLongitude());
            tmp.add(p.getLatitude());
            arrPoint.add(tmp);
        }

        // 存放到缓存
        cache.put(Constants.trackKey(entityName),arrPoint);

        if(scheduleManager.existTask(entityName)){
            log.info("轨迹定时任务 {} 已经存在",entityName);
        }else{
            scheduleManager.addTask(entityName, new Runnable() {
                @Override
                public void run() {
                    // 测试用
//                    BDMapTrack bdMapTrack1 = bdMapTrackMapper.selectByPrimaryKey(134);
//                    JSONArray points = JSONUtil.parseArray(bdMapTrack1.getPoints());
//                    List<Point> listPoint_ = JSONUtil.toList(points, Point.class);

                    String  body = commonService.track(entityName);
                    JSONObject jsonObject = JSONUtil.parseObj(body);
                    JSONArray points = JSONUtil.parseArray(jsonObject.get("points"));
                    List<Point> listPoint_ = JSONUtil.toList(points, Point.class);
                    List arrPoint_ = new ArrayList<List>();

                    for(Point point:listPoint_){
                        List tmp = new ArrayList<Double>();
                        tmp.add(point.getLongitude());
                        tmp.add(point.getLatitude());
                        arrPoint_.add(tmp);
                    }

                    cache.put(Constants.trackKey(entityName),arrPoint_);
                    log.info("entityname {} the track is ==> {}",Constants.trackKey(entityName),JSONUtil.toJsonStr(arrPoint_));
                }
            },cron);
        }
        return arrPoint;
    }

    public Object scheduleGetTrack(String entity_name){
        List<List> arrPoint = (List<List>)this.cache.getIfPresent(Constants.trackKey(entity_name));
        return arrPoint;
    }



    public void updateServiceStartDate(BDMapTrack bdMapTrack){
        this.bdMapTrackExtMapper.updateServiceStartDate(bdMapTrack);
    }

    public void updateServiceEndDate(BDMapTrack bdMapTrack){
        this.bdMapTrackExtMapper.updateServiceEndDate(bdMapTrack);
    }

}
