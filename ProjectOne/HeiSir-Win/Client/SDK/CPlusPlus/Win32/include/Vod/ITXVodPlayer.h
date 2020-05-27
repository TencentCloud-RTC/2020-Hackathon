#ifndef __ITXVODPLAYER_H__
#define __ITXVODPLAYER_H__
/*
* Module:  ITXVodPlayer @ TXLiteAVSDK
*
* Function: 腾讯云视频通话播片功能的主要接口类
*
* 创建/使用/销毁ITXVodPlayer对象的示例代码：
* <pre>
*     ITXVodPlayer *vodPlayer = createTXVodPlayer("D:/video/test.mp4");
*     if(vodPlayer)
*     {
*         vodPlayer->start();
*     }
*     ----------------------------------
*     destroyTXVodPlayer(&vodPlayer);
*     vodPlayer = NULL;
* </pre>
*/

#include "TXLiteAVBase.h"
#include <memory>

class ITXVodPlayerCallback;
class ITXVodPlayer;

extern "C" {
    /**
    * \brief 用于动态加载dll时，导出TXVodPlayer C++对象。
    *
    * \return ITXVodPlayer对象指针，注意：delete ITXVodPlayer*会编译错误，需要调用destroyTXVodPlayer释放。
    */
    LITEAV_API ITXVodPlayer* createTXVodPlayer(const char *mediaFile, bool repeat = false);

    /**
    * \brief 析构ITXVodPlayer对象
    */
    LITEAV_API void destroyTXVodPlayer(ITXVodPlayer** pTXVodPlayer);
}

class ITXVodPlayer : public ILiteAVStreamDataSource
{
protected:
    virtual ~ITXVodPlayer() {};

public:
    /**
    * \brief 设置多媒体文件播放回调
    * \param callback 要使用的多媒体文件播放回调接收实例
    */
    virtual void setCallback(ITXVodPlayerCallback *callback) = 0;

    /**
    * \brief 开始多媒体文件播放
    * 
    * \note 用于TRTC播片场景下，TRTCSDK内部会自动调用该接口，用户无需自己手动调用
    */
    virtual void start() = 0;

    /**
    * \brief 暂停多媒体文件播放
    */
    virtual void pause() = 0;

    /**
    * \brief 恢复多媒体文件播放
    */
    virtual void resume() = 0;

    /**
    * \brief 停止多媒体文件播放
    * 
    * \note 用于TRTC播片场景下，TRTCSDK内部会自动调用该接口，用户无需自己手动调用
    */
    virtual void stop() = 0;

    /**
    * \brief 设置多媒体文件播放进度
    * \param msPos 播放进度（单位毫秒）
    */
    virtual void seek(uint64_t msPos) = 0;
};

enum TXVodPlayerError
{
    TXVodPlayerErrorFileNotExist,
    TXVodPlayerErrorFormatNotSupport
};

class ITXVodPlayerCallback
{
public:
    virtual ~ITXVodPlayerCallback() {};

    /**
    * \brief 当多媒体文件播放开始时，SDK会通过此回调通知
    *
    * \param msLength 多媒体文件总长度，单位毫秒
    */
    virtual void onVodPlayerStarted(uint64_t msLength) {}

    /**
    * \brief 当多媒体文件播放进度改变时，SDK会通过此回调通知
    *
    * \param msPos 多媒体文件播放进度，单位毫秒
    */
    virtual void onVodPlayerProgress(uint64_t msPos) {}

    /**
    * \brief 当多媒体文件播放暂停时，SDK会通过此回调通知
    */
    virtual void onVodPlayerPaused() {};

    /**
    * \brief 当多媒体文件播放恢复时，SDK会通过此回调通知
    */
    virtual void onVodPlayerResumed() {};

    /**
    * \brief 当多媒体文件播放停止时，SDK会通过此回调通知
    *
    * \param reason 停止原因，0表示用户主动停止，1表示文件播放完，2表示视频断流
    */
    virtual void onVodPlayerStoped(int reason) {};

    /**
    * \brief 当多媒体文件播放出错时，SDK会通过此回调通知
    *
    * \param error 错误码
    */
    virtual void onVodPlayerError(int error) = 0;
};

#endif //__ITXVODPLAYER_H__