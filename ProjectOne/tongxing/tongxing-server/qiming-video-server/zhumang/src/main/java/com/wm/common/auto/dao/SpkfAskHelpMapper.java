package com.wangming.common.auto.dao;

import com.wangming.common.auto.model.SpkfAskHelp;

public interface SpkfAskHelpMapper {
    /**
     * 根据主键删除数据库的记录
     *
     * @param id
     */
    int deleteByPrimaryKey(Long id);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insert(SpkfAskHelp record);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insertSelective(SpkfAskHelp record);

    /**
     * 根据主键获取一条数据库记录
     *
     * @param id
     */
    SpkfAskHelp selectByPrimaryKey(Long id);

    /**
     * 根据主键来更新部分数据库记录
     *
     * @param record
     */
    int updateByPrimaryKeySelective(SpkfAskHelp record);

    /**
     * 根据主键来更新数据库记录
     *
     * @param record
     */
    int updateByPrimaryKey(SpkfAskHelp record);
}