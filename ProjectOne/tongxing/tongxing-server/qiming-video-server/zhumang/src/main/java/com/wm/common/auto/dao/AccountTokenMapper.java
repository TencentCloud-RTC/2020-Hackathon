package com.wangming.common.auto.dao;

import com.wangming.common.auto.model.AccountToken;

public interface AccountTokenMapper {
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
    int insert(AccountToken record);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insertSelective(AccountToken record);

    /**
     * 根据主键获取一条数据库记录
     *
     * @param id
     */
    AccountToken selectByPrimaryKey(Integer id);

    /**
     * 根据主键来更新部分数据库记录
     *
     * @param record
     */
    int updateByPrimaryKeySelective(AccountToken record);

    /**
     * 根据主键来更新数据库记录
     *
     * @param record
     */
    int updateByPrimaryKey(AccountToken record);
}