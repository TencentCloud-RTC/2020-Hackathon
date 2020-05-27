/**
* Module:   TXLiteAVBase @ liteav
*
* Function: SDK 公共定义头文件
*
*/

#ifndef __TXLITEAVBASE_H__
#define __TXLITEAVBASE_H__

#include <stdint.h>

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

#include <Windows.h>

#ifdef LITEAV_EXPORTS
#define LITEAV_API __declspec(dllexport)
#else
#define LITEAV_API __declspec(dllimport)
#endif

extern "C" {
    /// @name SDK 导出基础功能接口
    /// @{
    /**
    * \brief 获取 SDK 版本号
    *
    * \return 返回 UTF-8 编码的版本号。
    */
    LITEAV_API const char* getLiteAvSDKVersion();
    /// @}
}

/// @addtogroup TRTCCloudDef_cplusplus
/// @{

/**
* 视频数据结构类型
*/
enum LiteAVVideoBufferType
{
    LiteAVVideoBufferType_Unknown = 0,
    LiteAVVideoBufferType_Buffer = 1,       ///< 二进制Buffer类型
    LiteAVVideoBufferType_Texture = 3,      ///< 纹理类型
};

/**
* 视频帧的格式
*/
enum LiteAVVideoPixelFormat
{
    LiteAVVideoPixelFormat_Unknown = 0,
    LiteAVVideoPixelFormat_I420 = 1,        ///< I420
    LiteAVVideoPixelFormat_Texture_2D = 2,  ///< OpenGL 2D 纹理
    LiteAVVideoPixelFormat_BGRA32 = 3,      ///< BGRA32
};

/**
* 音频帧的格式
*/
enum LiteAVAudioFrameFormat
{
    LiteAVAudioFrameFormatNone = 0,
    LiteAVAudioFrameFormatPCM,              ///< PCM，每个采样点占16bit数据量。
};

/**
* 视频画面旋转方向
*/
enum LiteAVVideoRotation
{
    LiteAVVideoRotation0 = 0,             ///< 顺时针旋转0度
    LiteAVVideoRotation90 = 1,             ///< 顺时针旋转90度
    LiteAVVideoRotation180 = 2,             ///< 顺时针旋转180度
    LiteAVVideoRotation270 = 3,             ///< 顺时针旋转270度
};

/*************************************************************************************************************************************************************************/

/**
* 视频帧数据
*/
struct LiteAVVideoFrame
{
    LiteAVVideoPixelFormat videoFormat;     ///< 视频帧的格式
    LiteAVVideoBufferType bufferType;       ///< 视频数据结构类型
    char* data;                             ///< 视频数据，字段bufferType是LiteAVVideoBufferType_Buffer时生效
    int textureId;                          ///< 视频纹理ID，字段bufferType是LiteAVVideoBufferType_Texture时生效
    uint32_t length;                        ///< 视频数据的长度，单位是字节，对于i420而言， length = width * height * 3 / 2，对于BGRA32而言， length = width * height * 4
    uint32_t width;                         ///< 画面的宽度
    uint32_t height;                        ///< 画面的高度
    uint64_t timestamp;                     ///< 时间戳，单位ms
    LiteAVVideoRotation rotation;           ///< 画面旋转角度

    LiteAVVideoFrame()
        : videoFormat(LiteAVVideoPixelFormat_Unknown)
        , data(NULL)
        , textureId(-1)
        , length(0)
        , width(640)
        , height(360)
        , timestamp(0)
        , rotation(LiteAVVideoRotation0)
    {

    }
};

/**
* 音频帧数据
*/
struct LiteAVAudioFrame
{
    LiteAVAudioFrameFormat audioFormat;     ///< 音频帧的格式
    char* data;                             ///< 音频数据
    uint32_t length;                        ///< 音频数据的长度
    uint32_t sampleRate;                    ///< 采样率
    uint32_t channel;                       ///< 声道数
    uint64_t timestamp;                     ///< 时间戳，单位ms

    LiteAVAudioFrame()
        : audioFormat(LiteAVAudioFrameFormatNone)
        , data(NULL)
        , length(0)
        , sampleRate(48000)
        , channel(1)
        , timestamp(0)
    {

    }
};




/////////////////////////////////////////////////////////////////////////////////
/// \brief【屏幕分享窗口信息 TRTCScreenCaptureSourceInfo】
///
/// \desc 您可以通过 getScreenCaptureSources() 枚举可共享的窗口列表，列表通过 ITRTCScreenCaptureSourceList 返回
/////////////////////////////////////////////////////////////////////////////////
enum LiteAVScreenCaptureSourceType
{
    LiteAVScreenCaptureSourceTypeUnknown = -1,
    LiteAVScreenCaptureSourceTypeWindow = 0,   ///< 该分享目标是某一个Windows窗口
    LiteAVScreenCaptureSourceTypeScreen = 1,   ///< 该分享目标是整个Windows桌面
    LiteAVScreenCaptureSourceTypeCustom = 2,
};

struct LiteAVImageBuffer
{
    const char* buffer;      ///< 图内容
    uint32_t length;         ///< 图缓存大小
    uint32_t width;          ///< 图宽
    uint32_t height;         ///< 图高
    LiteAVImageBuffer()
        : buffer(NULL)
        , length(0)
        , width(0)
        , height(0)
    {};
};

struct LiteAVScreenCaptureSourceInfo {
    LiteAVScreenCaptureSourceType type;              ///< 采集源类型
    HWND            sourceId;                        ///< 采集源ID；对于窗口，该字段指示窗口句柄；对于屏幕，该字段指示屏幕ID
    const char*     sourceName;                      ///< 采集源名称，UTF8编码
    LiteAVImageBuffer thumbBGRA;                     ///< 缩略图内容
    LiteAVImageBuffer iconBGRA;                      ///< 图标内容
    LiteAVScreenCaptureSourceInfo()
        : type(LiteAVScreenCaptureSourceTypeUnknown)
        , sourceId(0)
        , sourceName(NULL)
    {};
};

class ILiteAVScreenCaptureSourceList
{
protected:
    virtual ~ILiteAVScreenCaptureSourceList() {}
public:
    /**
    * \return 窗口个数
    */
    virtual uint32_t getCount() = 0;
    /**
    * \return 窗口信息
    */
    virtual LiteAVScreenCaptureSourceInfo getSourceInfo(uint32_t index) = 0;
    /**
    * \brief 遍历完窗口列表后，调用release释放资源。
    */
    virtual void release() = 0;
};

/////////////////////////////////////////////////////////////////////////////////
/// \brief【获取SDK当前使用设备信息 ILiteAVDeviceInfo】
///
/// \desc 您可以通过 setCurrentCameraDevice()/getCurrentMicDevice()/getCurrentSpeakerDevice 获取当前使用设备。
/////////////////////////////////////////////////////////////////////////////////
class ILiteAVDeviceInfo
{
protected:
    virtual ~ILiteAVDeviceInfo() {}
public:
    /**
    * \return 设备名称，字符编码格式是UTF-8
    */
    virtual const char* getDeviceName() = 0;

    /**
    * \return 设备PID，字符编码格式是UTF-8
    */
    virtual const char* getDevicePID() = 0;

    /**
    * \brief 获取完设备信息后，调用release释放资源。
    */
    virtual void release() = 0;
};

/////////////////////////////////////////////////////////////////////////////////
/// \brief【获取SDK设备信息接口 ITRTCDeviceCollection】
///
/// \desc 您可以通过 getMicDevicesList()/getSpeakerDevicesList()/getMicDevicesList 枚举硬件设备列表，列表通过 ITRTCDeviceCollection 返回
/////////////////////////////////////////////////////////////////////////////////
class ILiteAVDeviceCollection
{
protected:
    virtual ~ILiteAVDeviceCollection() {}
public:
    /**
    * \return 设备个数
    */
    virtual uint32_t getCount() = 0;

    /**
    * \return 设备名称，字符编码格式是UTF-8
    */
    virtual const char* getDeviceName(uint32_t index) = 0;

    /**
    * \return 设备PID，字符编码格式是UTF-8
    */
    virtual const char* getDevicePID(uint32_t index) = 0;

    /**
    * \brief 遍历完设备后，调用release释放资源。
    */
    virtual void release() = 0;
};



/*************************************************************************************************************************************************************************/

class ILiteAVStreamDataSource
{
public:
    /**
    * \brief SDK在成功请求到视频位后会调用该方法以通知数据源开始工作
    */
    virtual void onStart() = 0;

    /**
    * \brief SDK在不再需要用到该数据源的时候会调用该方法以通知数据源停止工作
    */
    virtual void onStop() = 0;

    /**
    * \brief SDK在需要视频帧时调用该方法以请求视频帧
    *
    * \param frame 用于存放请求到的视频帧，其中
    *                   bufferType      无效，暂时只支持LiteAVVideoBufferType_Buffer类型
    *                   videoFormat     必填
    *                   data            SDK已创建好buffer，数据源仅负责将视频数据拷贝其中
    *                   textureId       无效
    *                   length          必填，初始值指示data字段可用空间大小，需填写为可用数据大小
    *                   width           必填
    *                   height          必填
    *                   timestamp       可选
    *                   rotation        可选
    *
    * \return 可用数据大小，<0 表示出错
    */
    virtual int onRequestVideoFrame(LiteAVVideoFrame &frame) = 0;

    /**
    * \brief SDK在需要视频帧时调用该方法以请求音频帧
    *
    * \param frame 用于存放请求到的视频帧，其中
    *                   audioFormat     无效，暂时只支持LiteAVAudioFrameFormatPCM类型
    *                   data            SDK已创建好buffer，数据源仅负责将视频数据拷贝其中
    *                   length          必填，初始值指示data字段可用空间大小，需填写为可用数据大小
    *                   sampleRate      必填
    *                   channel         必填
    *                   timestamp       可选
    *
    * \return 可用数据大小，<0 表示出错
    */
    virtual int onRequestAudioFrame(LiteAVAudioFrame &frame) = 0;

public:
    typedef void(*OnDestoryCallback)(void*);

    ILiteAVStreamDataSource()
    {
        m_hOnDestoryCallbackMutex = CreateMutex(nullptr, FALSE, nullptr);
    }

    virtual ~ILiteAVStreamDataSource()
    {
        WaitForSingleObject(m_hOnDestoryCallbackMutex, INFINITE);
        if (m_pOnDestoryCallback)
        {
            m_pOnDestoryCallback(m_pOnDestoryCallbackParam);
        }
        ReleaseMutex(m_hOnDestoryCallbackMutex);
        CloseHandle(m_hOnDestoryCallbackMutex);
    }

    void setOnDestoryCallback(OnDestoryCallback callback, void* param)
    {
        WaitForSingleObject(m_hOnDestoryCallbackMutex, INFINITE);
        m_pOnDestoryCallback = callback;
        m_pOnDestoryCallbackParam = param;
        ReleaseMutex(m_hOnDestoryCallbackMutex);
    }
private:
    HANDLE m_hOnDestoryCallbackMutex = nullptr;
    OnDestoryCallback m_pOnDestoryCallback = nullptr;
    void *m_pOnDestoryCallbackParam = nullptr;

};
/// @}

#endif /* __TXLITEAVBASE_H__ */