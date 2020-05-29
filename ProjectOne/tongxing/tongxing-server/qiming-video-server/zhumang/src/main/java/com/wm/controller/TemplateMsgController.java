package com.wangming.controller;

import com.wangming.common.auto.model.SpkfAskHelp;
import com.wangming.service.TemplateMsgService;
import com.wangming.util.ResultVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 模板消息通知接口
 *
 * @author bruce
 * @date 2019/4/29
 */
@Api(value = "/templateMsg", description = "发送模板消息 API")
@RestController
@RequestMapping("/templateMsg")
public class TemplateMsgController {

    @Autowired
    private TemplateMsgService templateMsgService;


    @ApiOperation(value="发送视频客服求助信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appid",value = "应用的appid" ,required = true,dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "deviceId",value = "应用的设备编号，如果友盟推送则为 deviceToken" ,required = true,dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "roomId",value = "视频求助的房间号" ,required = true,dataType = "String", paramType = "query")
    })
    @RequestMapping(value = "/sendTemplateMsgSPKF",method = RequestMethod.POST)
    public ResultVo sendTemplateMsg(@RequestBody SpkfAskHelp spkfAskHelp){
        return ResultVo.success(this.templateMsgService.sendTemplateMsg(spkfAskHelp));
    }

    @ApiOperation(value="获取指定unionid用户，一周以内的求助信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "unionid",value = "用户对应的unionid" ,required = true,dataType = "String", paramType = "query")
    })
    @RequestMapping(value = "/getTemplateMsgByUnionid",method = RequestMethod.GET)
    public ResultVo getTemplateMsgByUnionid(String unionid){
        return ResultVo.success(this.templateMsgService.getTemplateMsgByUnionid(unionid));
    }
}
