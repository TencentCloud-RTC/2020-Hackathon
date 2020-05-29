package com.wangming.service;

import com.wangming.common.auto.dao.UserInfoMapper;
import com.wangming.common.auto.model.UserInfo;
import com.wangming.common.manual.dao.UserInfoExtMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * description
 *
 * @author bruce
 * @date 2019/2/19
 */
@Service
public class UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

    @Autowired
    private UserInfoExtMapper exUserInfoMapper;

    public UserInfo getUserInfoByUsername(UserInfo userInfo) {

        return exUserInfoMapper.getUserInfoByUsername(userInfo);
    }


    public UserInfo login(UserInfo userInfo){
        return this.exUserInfoMapper.login(userInfo);
    }

    public int updateUserInfo(UserInfo userInfo){
        return this.exUserInfoMapper.updateUserInfo(userInfo);
    }
}
