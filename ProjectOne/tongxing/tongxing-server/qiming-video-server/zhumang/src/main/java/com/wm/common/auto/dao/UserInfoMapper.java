package com.wangming.common.auto.dao;

import com.wangming.common.auto.model.UserInfo;

public interface UserInfoMapper {
    /**
     * 根据主键删除数据库的记录
     *
     * @param id
     */
    int deleteByPrimaryKey(Integer id);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insert(UserInfo record);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insertSelective(UserInfo record);

    /**
     * 根据主键获取一条数据库记录
     *
     * @param id
     */
    UserInfo selectByPrimaryKey(Integer id);

    /**
     * 根据主键来更新部分数据库记录
     *
     * @param record
     */
    int updateByPrimaryKeySelective(UserInfo record);

    /**
     * 根据主键来更新数据库记录
     *
     * @param record
     */
    int updateByPrimaryKey(UserInfo record);
}