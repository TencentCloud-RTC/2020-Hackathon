package com.wangming.common.auto.dao;

import com.wangming.common.auto.model.BDMapTrack;

public interface BDMapTrackMapper {
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
    int insert(BDMapTrack record);

    /**
     * 插入数据库记录
     *
     * @param record
     */
    int insertSelective(BDMapTrack record);

    /**
     * 根据主键获取一条数据库记录
     *
     * @param id
     */
    BDMapTrack selectByPrimaryKey(Integer id);

    /**
     * 根据主键来更新部分数据库记录
     *
     * @param record
     */
    int updateByPrimaryKeySelective(BDMapTrack record);

    /**
     *
     * @param record
     */
    int updateByPrimaryKeyWithBLOBs(BDMapTrack record);

    /**
     * 根据主键来更新数据库记录
     *
     * @param record
     */
    int updateByPrimaryKey(BDMapTrack record);
}