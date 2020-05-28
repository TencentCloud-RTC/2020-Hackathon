package com.wangming.controller;

import com.wangming.common.auto.model.UserInfo;
import com.wangming.service.UserInfoService;
import com.wangming.util.MD5Strategy;
import com.wangming.util.ResultVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 用户登陆等接口
 *
 * @author bruce
 * @date 2019/2/19
 */
@Api(value = "/userInfo", description = "用户操作 API")
@RestController
@RequestMapping("/userInfo")
public class UserInfoController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserInfoService userInfoService;

    @RequestMapping(value = "/login",method = RequestMethod.POST)
    public ResultVo login(@RequestBody UserInfo requestConfig){
        String userName = requestConfig.getUserName();
        String password = requestConfig.getPassword();
        String appid = requestConfig.getAppid();
        if(StringUtils.isBlank(userName) || StringUtils.isBlank(password)){
            return ResultVo.error("用户名、密码不能为空");
        }
        UserInfo userInfo = new UserInfo();
        userInfo.setUserName(userName);
        userInfo.setAppid(appid);
        UserInfo userInfo1 = userInfoService.getUserInfoByUsername(userInfo);

        if(ObjectUtils.isEmpty(userInfo1)){
            return ResultVo.error("用户名不存在");
        }
        List<String> list = new ArrayList<String>();
        list.add(password);

        userInfo.setPassword(MD5Strategy.encryptPasswd(list,""));

        UserInfo uinfo = this.userInfoService.login(userInfo);
        if(ObjectUtils.isEmpty(uinfo)){
            log.warn("用户名，密码不匹配");
            return ResultVo.error("用户名，密码不匹配");
        }
        return ResultVo.success(uinfo);

    }


    @ApiOperation(value="修改用户名密码接口")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userName",value = "用户名" ,required = true,dataType = "String", paramType = "query"),
            @ApiImplicitParam(name = "password",value = "新密码" ,required = true,dataType = "String", paramType = "query")
    })
    @RequestMapping(value = "/updateUserInfo",method = RequestMethod.POST)
    public ResultVo updateUserInfo(@RequestBody UserInfo userInfo){
        if(StringUtils.isNotBlank(userInfo.getUserName()) && StringUtils.isNotBlank(userInfo.getPassword())){
            List<String> list = new ArrayList<String>();
            list.add(userInfo.getPassword());
            userInfo.setPassword(MD5Strategy.encryptPasswd(list,""));
        }else{
            return ResultVo.error("用户名和新密码字段密码不能为空");
        }
        int result = this.userInfoService.updateUserInfo(userInfo);
        if(0 == result){
            return ResultVo.error("操作失败");
        }else{
            return ResultVo.success("操作成功");
        }

    }
}
