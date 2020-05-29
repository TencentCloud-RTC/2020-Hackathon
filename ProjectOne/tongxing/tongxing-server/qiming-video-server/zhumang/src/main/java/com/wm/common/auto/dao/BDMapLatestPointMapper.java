package com.wangming.common.auto.dao;

import com.wangming.common.auto.model.BDMapLatestPoint;

public interface BDMapLatestPointMapper {
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
    int insert(BDMapLatestPoint record);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insertSelective(BDMapLatestPoint record);

    /**
     * 根据主键获取一条数据库记录
     *
     * @param id
     */
    BDMapLatestPoint selectByPrimaryKey(Integer id);

    /**
     * 根据主键来更新部分数据库记录
     *
     * @param record
     */
    int updateByPrimaryKeySelective(BDMapLatestPoint record);

    /**
     * 根据主键来更新数据库记录
     *
     * @param record
     */
    int updateByPrimaryKey(BDMapLatestPoint record);
}