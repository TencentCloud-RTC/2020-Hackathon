﻿/*
 * Module:   TRTC 关键类型定义
 *
 * Function: 分辨率、质量等级等枚举和常量值的定义
 *
 */

#ifndef __TRTCCLOUDDEF_H__
#define __TRTCCLOUDDEF_H__

#include "TXLiteAVBase.h"
#include <memory>

#ifndef _WINSOCKAPI_
#define _WINSOCKAPI_
#endif // !_WINSOCKAPI_

#include <Windows.h>

/// @defgroup TRTCCloudDef_cplusplus 关键类型定义
/// 腾讯云视频通话功能的关键类型定义
/// @{
/////////////////////////////////////////////////////////////////////////////////
//
//                    【（一）视频相关枚举值定义】
//
/////////////////////////////////////////////////////////////////////////////////


/**
 * 1.1 视频分辨率
 *
 * 此处仅定义横屏分辨率，如需使用竖屏分辨率（例如360 × 640），需要同时指定 TRTCVideoResolutionMode 为 Portrait。
 */
enum TRTCVideoResolution
{
    // 宽高比1:1
    TRTCVideoResolution_120_120     = 1,    ///< [C] 建议码率 VideoCall:80kbps   LIVE:120kbps
    TRTCVideoResolution_160_160     = 3,    ///< [C] 建议码率 VideoCall:100kbps  LIVE:150kbps
    TRTCVideoResolution_270_270     = 5,    ///< [C] 建议码率 VideoCall:200kbps  LIVE:120kbps
    TRTCVideoResolution_480_480     = 7,    ///< [C] 建议码率 VideoCall:350kbps  LIVE:120kbps
    
    // 宽高比4:3
    TRTCVideoResolution_160_120     = 50,   ///< [C] 建议码率 VideoCall:100kbps  LIVE:150kbps
    TRTCVideoResolution_240_180     = 52,   ///< [C] 建议码率 VideoCall:150kbps  LIVE:225kbps
    TRTCVideoResolution_280_210     = 54,   ///< [C] 建议码率 VideoCall:200kbps  LIVE:300kbps
    TRTCVideoResolution_320_240     = 56,   ///< [C] 建议码率 VideoCall:250kbps  LIVE:375kbps
    TRTCVideoResolution_400_300     = 58,   ///< [C] 建议码率 VideoCall:300kbps  LIVE:450kbps
    TRTCVideoResolution_480_360     = 60,   ///< [C] 建议码率 VideoCall:400kbps  LIVE:600kbps
    TRTCVideoResolution_640_480     = 62,   ///< [C] 建议码率 VideoCall:600kbps  LIVE:900kbps
    TRTCVideoResolution_960_720     = 64,   ///< [C] 建议码率 VideoCall:1000kbps LIVE:1500kbps
    
    // 宽高比16:9
    TRTCVideoResolution_160_90      = 100,  ///< [C] 建议码率 VideoCall:150kbps  LIVE:250kbps
    TRTCVideoResolution_256_144     = 102,  ///< [C] 建议码率 VideoCall:200kbps  LIVE:300kbps
    TRTCVideoResolution_320_180     = 104,  ///< [C] 建议码率 VideoCall:250kbps  LIVE:400kbps
    TRTCVideoResolution_480_270     = 106,  ///< [C] 建议码率 VideoCall:350kbps  LIVE:550kbps
    TRTCVideoResolution_640_360     = 108,  ///< [C] 建议码率 VideoCall:550kbps  LIVE:900kbps
    TRTCVideoResolution_960_540     = 110,  ///< [C] 建议码率 VideoCall:850kbps  LIVE:1300kbps
    TRTCVideoResolution_1280_720    = 112,  ///< [C] 建议码率 VideoCall:1200kbps LIVE:1800kbps
    TRTCVideoResolution_1920_1080   = 114,  ///< [S] 建议码率 VideoCall:2000kbps LIVE:3000kbps
};

/**
 * 1.2 视频分辨率模式
 *
 * - 横屏分辨率：TRTCVideoResolution_640_360 + TRTCVideoResolutionModeLandscape = 640 × 360
 * - 竖屏分辨率：TRTCVideoResolution_640_360 + TRTCVideoResolutionModePortrait  = 360 × 640
 */
enum TRTCVideoResolutionMode
{
    TRTCVideoResolutionModeLandscape = 0,               ///< 横屏分辨率
    TRTCVideoResolutionModePortrait = 1,                ///< 竖屏分辨率
};

/**
 * 1.3 视频流类型
 *
 * TRTC 内部有三种不同的音视频流，分别为：
 * - 主画面：最常用的一条线路，一般用来传输摄像头的视频数据。
 * - 小画面：跟主画面的内容相同，但是分辨率和码率更低。
 * - 辅流画面：一般用于屏幕分享或远程播片（例如老师播放视频给学生观看）。
 *
 * @note - 如果主播的上行网络和性能比较好，则可以同时送出大小两路画面。
 * @note - SDK 不支持单独开启小画面，小画面必须依附于主画面而存在。
 */
enum TRTCVideoStreamType
{
    TRTCVideoStreamTypeBig = 0,                         ///< 主画面视频流
    TRTCVideoStreamTypeSmall = 1,                       ///< 小画面视频流
    TRTCVideoStreamTypeSub = 2,                         ///< 辅流（屏幕分享）
};


/**
 * 1.4 画质级别
 *
 * TRTC SDK 对画质定义了六种不同的级别，Excellent 表示最好，Down 表示不可用。
 */
enum TRTCQuality
{
    TRTCQuality_Unknown   = 0,   ///< 未定义
    TRTCQuality_Excellent = 1,   ///< 最好
    TRTCQuality_Good      = 2,   ///< 好
    TRTCQuality_Poor      = 3,   ///< 一般
    TRTCQuality_Bad       = 4,   ///< 差
    TRTCQuality_Vbad      = 5,   ///< 很差
    TRTCQuality_Down      = 6,   ///< 不可用
};

/**
 * 1.5 视频画面填充模式
 *
 * 如果画面的显示分辨率不等于画面的原始分辨率，就需要您设置画面的填充模式:
 * - TRTCVideoFillMode_Fill，图像铺满屏幕，超出显示视窗的视频部分将被裁剪，画面显示可能不完整。
 * - TRTCVideoFillMode_Fit，图像长边填满屏幕，短边区域会被填充黑色，但画面的内容肯定是完整的。
 */
enum TRTCVideoFillMode
{
    /// 图像铺满屏幕，超出显示视窗的视频部分将被裁剪
    TRTCVideoFillMode_Fill = 0,
    /// 图像长边填满屏幕，短边区域会被填充黑色
    TRTCVideoFillMode_Fit = 1,
};

/**
 * 1.6 视频画面旋转方向
 *
 * TRTC SDK 提供了对本地和远程画面的旋转角度设置 API，下列的旋转角度都是指顺时针方向的。
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef LiteAVVideoRotation TRTCVideoRotation;
#define TRTCVideoRotation0 LiteAVVideoRotation0                                 ///< 顺时针旋转0度
#define TRTCVideoRotation90 LiteAVVideoRotation90                               ///< 顺时针旋转90度
#define TRTCVideoRotation180 LiteAVVideoRotation180                             ///< 顺时针旋转180度
#define TRTCVideoRotation270 LiteAVVideoRotation270                             ///< 顺时针旋转270度

/**
 * 1.7 美颜（磨皮）算法
 *
 * TRTC SDK 内置多种不同的磨皮算法，您可以选择最适合您产品定位的方案。
 */
enum TRTCBeautyStyle
{
    TRTCBeautyStyleSmooth = 0,                         ///< 光滑，适用于美女秀场，效果比较明显。
    TRTCBeautyStyleNature = 1,                         ///< 自然，磨皮算法更多地保留了面部细节，主观感受上会更加自然。
};

/**
 * 1.8 视频像素格式
 *
 * TRTC SDK 提供针对视频的自定义采集和自定义渲染功能，在自定义采集功能中，您可以用下列枚举值描述您采集的视频像素格式。
 * 在自定义渲染功能中，您可以指定您期望 SDK 回调的视频像素格式。
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef LiteAVVideoPixelFormat TRTCVideoPixelFormat;
#define TRTCVideoPixelFormat_Unknown LiteAVVideoPixelFormat_Unknown
#define TRTCVideoPixelFormat_I420 LiteAVVideoPixelFormat_I420                   ///< I420
#define TRTCVideoPixelFormat_Texture_2D LiteAVVideoPixelFormat_Texture_2D       ///< OpenGL 2D 纹理
#define TRTCVideoPixelFormat_BGRA32 LiteAVVideoPixelFormat_BGRA32               ///< BGRA32


/**
 * 1.9 视频数据包装格式
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef LiteAVVideoBufferType TRTCVideoBufferType;
#define TRTCVideoBufferType_Unknown LiteAVVideoBufferType_Unknown
#define TRTCVideoBufferType_Buffer LiteAVVideoBufferType_Buffer                 ///< 二进制 Buffer 类型
#define TRTCVideoBufferType_Texture LiteAVVideoBufferType_Texture               ///< 纹理类型


/////////////////////////////////////////////////////////////////////////////////
//
//                    【（二）网络相关枚举值定义】
//
/////////////////////////////////////////////////////////////////////////////////

/**
 * 2.1 应用场景
 *
 * TRTC 可用于视频会议和在线直播等多种应用场景，针对不同的应用场景，TRTC SDK 的内部会进行不同的优化配置：
 * - TRTCAppSceneVideoCall    ：视频通话场景，适合[1对1视频通话]、[300人视频会议]、[在线问诊]、[视频聊天]、[远程面试]等。              
 * - TRTCAppSceneLIVE         ：视频互动直播，适合[视频低延时直播]、[十万人互动课堂]、[视频直播 PK]、[视频相亲房]、[互动课堂]、[远程培训]、[超大型会议]等。
 * - TRTCAppSceneAudioCall    ：语音通话场景，适合[1对1语音通话]、[300人语音会议]、[语音聊天]、[语音会议]、[在线狼人杀]等。
 * - TRTCAppSceneVoiceChatRoom：语音互动直播，适合：[语音低延时直播]、[语音直播连麦]、[语聊房]、[K 歌房]、[FM 电台]等。
 */
enum TRTCAppScene
{
	/// 视频通话场景，支持720P、1080P高清画质，单个房间最多支持300人同时在线，最高支持50人同时发言。<br>
	/// 适合：[1对1视频通话]、[300人视频会议]、[在线问诊]、[视频聊天]、[远程面试]等。
    TRTCAppSceneVideoCall     = 0,  
	
	/// 视频互动直播，支持平滑上下麦，切换过程无需等待，主播延时小于300ms；支持十万级别观众同时播放，播放延时低至1000ms。<br>
	/// 适合：[视频低延时直播]、[十万人互动课堂]、[视频直播 PK]、[视频相亲房]、[互动课堂]、[远程培训]、[超大型会议]等。<br>
	/// 注意：此场景下，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。
    TRTCAppSceneLIVE          = 1,  
	
	/// 语音通话场景，支持 48kHz，支持双声道。单个房间最多支持300人同时在线，最高支持50人同时发言。<br>
	/// 适合：[1对1语音通话]、[300人语音会议]、[语音聊天]、[语音会议]、[在线狼人杀]等。
    TRTCAppSceneAudioCall     = 2,  
	
	/// 语音互动直播，支持平滑上下麦，切换过程无需等待，主播延时小于300ms；支持十万级别观众同时播放，播放延时低至1000ms。<br>
    /// 适合：[语音低延时直播]、[语音直播连麦]、[语聊房]、[K 歌房]、[FM 电台]等。<br>
	/// 注意：此场景下，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。
    TRTCAppSceneVoiceChatRoom = 3,  
};

/**
* 2.2 角色，仅适用于直播场景（TRTCAppSceneLIVE 和 TRTCAppSceneVoiceChatRoom）
*
* 在直播场景中，多数用户仅为观众，个别用户是主播，这种角色区分有利于 TRTC 进行更好的定向优化。
*
* - Anchor：主播，可以上行视频和音频，一个房间里最多支持50个主播同时上行音视频。
* - Audience：观众，只能观看，不能上行视频和音频，一个房间里的观众人数没有上限。
*/
enum TRTCRoleType
{
    TRTCRoleAnchor = 20,     ///< 主播
    TRTCRoleAudience = 21,   ///< 观众
};

/**
 * 2.3 流控模式
 *
 * TRTC SDK 内部需要时刻根据网络情况调整内部的编解码器和网络模块，以便能够对网络的变化做出反应。
 * 为了支持快速算法升级，SDK 内部设置了两种不同的流控模式：
 * - ModeServer：云端控制，默认模式，推荐选择。
 * - ModeClient：本地控制，用于 SDK 开发内部调试，客户请勿使用。
 *
 * @note 推荐您使用云端控制，这样每当我们升级 Qos 算法时，您无需升级 SDK 即可体验更好的效果。
 */
enum TRTCQosControlMode
{
    TRTCQosControlModeClient,                           ///< 客户端控制（用于 SDK 开发内部调试，客户请勿使用）
    TRTCQosControlModeServer,                           ///< 云端控制 （默认）
};

/**
 * 2.4 画质偏好
 *
 * 指当 TRTC SDK 在遇到弱网络环境时，您期望“保清晰”或“保流畅”，两种模式均会优先保障声音数据的传输。
 *
 * - Smooth：弱网下优先流畅性，当用户网络较差的时候画面也会比较模糊。
 * - Clear：默认值，弱网下优先清晰度，当用户网络较差的时候会出现卡顿，但画面清晰度不会大幅缩水。
 */
enum TRTCVideoQosPreference
{
    TRTCVideoQosPreferenceSmooth = 1,                   ///< 弱网下保流畅
    TRTCVideoQosPreferenceClear = 2,                    ///< 弱网下保清晰，默认值
};


/////////////////////////////////////////////////////////////////////////////////
//
//                    【（三）继承 TXLiteAVBase 的定义】
//
/////////////////////////////////////////////////////////////////////////////////


/**
* 3.1 音频帧的格式
*
* 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
*/
typedef LiteAVAudioFrameFormat TRTCAudioFrameFormat;
#define TRTCAudioFrameFormatNone LiteAVAudioFrameFormatNone
#define TRTCAudioFrameFormatPCM LiteAVAudioFrameFormatPCM

/**
 * 3.2 屏幕分享目标信息
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef LiteAVScreenCaptureSourceType TRTCScreenCaptureSourceType;
#define TRTCScreenCaptureSourceTypeUnknown LiteAVScreenCaptureSourceTypeUnknown
#define TRTCScreenCaptureSourceTypeWindow  LiteAVScreenCaptureSourceTypeWindow
#define TRTCScreenCaptureSourceTypeScreen  LiteAVScreenCaptureSourceTypeScreen
#define TRTCScreenCaptureSourceTypeCustom  LiteAVScreenCaptureSourceTypeCustom

typedef LiteAVImageBuffer TRTCImageBuffer;
typedef LiteAVScreenCaptureSourceInfo TRTCScreenCaptureSourceInfo;
typedef ILiteAVScreenCaptureSourceList ITRTCScreenCaptureSourceList;


/**
 * 3.3 设备列表
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef ILiteAVDeviceCollection ITRTCDeviceCollection;

/**
* 3.4 设备 Item 信息
*
* 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
*/
typedef ILiteAVDeviceInfo ITRTCDeviceInfo;

/////////////////////////////////////////////////////////////////////////////////
//
//                    【（四）更多枚举值定义】
//
/////////////////////////////////////////////////////////////////////////////////

/**
 * 4.1 Log 级别
 */
enum TRTCLogLevel
{
    TRTCLogLevelVerbose   = 0,   ///< 输出所有级别的 Log
    TRTCLogLevelDebug     = 1,   ///< 输出 DEBUG，INFO，WARNING，ERROR 和 FATAL 级别的 Log
    TRTCLogLevelInfo      = 2,   ///< 输出 INFO，WARNING，ERROR 和 FATAL 级别的 Log
    TRTCLogLevelWarn      = 3,   ///< 只输出WARNING，ERROR 和 FATAL 级别的 Log
    TRTCLogLevelError     = 4,   ///< 只输出ERROR 和 FATAL 级别的 Log
    TRTCLogLevelFatal     = 5,   ///< 只输出 FATAL 级别的 Log
    TRTCLogLevelNone      = 6,   ///< 不输出任何 SDK Log
};

/**
 * 4.2 设备操作
 */
enum TRTCDeviceState
{
    TRTCDeviceStateAdd    = 0,                          ///< 添加设备
    TRTCDeviceStateRemove = 1,                          ///< 移除设备
    TRTCDeviceStateActive = 2,                          ///< 设备已启用
};


/**
 * 4.3 设备类型
 */
enum TRTCDeviceType
{
    TRTCDeviceTypeUnknow  = -1,
    TRTCDeviceTypeMic     = 0,                          ///< 麦克风
    TRTCDeviceTypeSpeaker = 1,                          ///< 扬声器
    TRTCDeviceTypeCamera  = 2,                          ///< 摄像头
};


/**
 * 4.4 水印图片的源类型
 */
enum TRTCWaterMarkSrcType
{
    TRTCWaterMarkSrcTypeFile   = 0,                     ///< 图片文件路径，支持 BMP、GIF、JPEG、PNG、TIFF、Exif、WMF 和 EMF 文件格式
    TRTCWaterMarkSrcTypeBGRA32 = 1,                     ///< BGRA32格式内存块
    TRTCWaterMarkSrcTypeRGBA32 = 2,                     ///< RGBA32格式内存块
};


/////////////////////////////////////////////////////////////////////////////////
//
//                      【（五）TRTC 核心类型定义】
//
/////////////////////////////////////////////////////////////////////////////////

/**
* 5.1 进房相关参数
*
* 只有该参数填写正确，才能顺利调用 enterRoom 进入 roomId 所指定的音视频房间。
*/
struct TRTCParams
{

    ///【字段含义】应用标识（必填），腾讯视频云基于 sdkAppId 完成计费统计。
    ///【推荐取值】在 [实时音视频控制台](https://console.cloud.tencent.com/rav/) 创建应用后可在帐号信息页面中得到该 ID。
    uint32_t sdkAppId;

    ///【字段含义】用户标识（必填），当前用户的 userId，相当于用户名，使用 UTF-8 编码。
    ///【推荐取值】限制长度为32字节，只允许包含大小写英文字母（a-zA-Z）、数字（0-9）及下划线和连词符。
    const char* userId;

    ///【字段含义】用户签名（必填），当前 userId 对应的验证签名，相当于登录密码。
    ///【推荐取值】具体计算方法请参见 [如何计算UserSig](https://cloud.tencent.com/document/product/647/17275)。
    const char* userSig;

    ///【字段含义】房间号码（必填），在同一个房间内的用户可以看到彼此并进行视频通话。
    ///【推荐取值】取值范围：1 - 4294967294。
    uint32_t roomId;

    ///【字段含义】直播场景下的角色，仅适用于直播场景（TRTCAppSceneLIVE 和 TRTCAppSceneVoiceChatRoom），视频通话场景下指定无效。
    ///【推荐取值】默认值：主播（TRTCRoleAnchor）
    TRTCRoleType role;

    ///【字段含义】绑定腾讯云直播 CDN 流 ID[非必填]，设置之后，您就可以在腾讯云直播 CDN 上通过标准直播方案（FLV或HLS）播放该用户的音视频流。
    ///【推荐取值】限制长度为64字节，可以不填写，一种推荐的方案是使用 “sdkappid_roomid_userid_main” 作为 streamid，这样比较好辨认且不会在您的多个应用中发生冲突。
	///【特殊说明】要使用腾讯云直播 CDN，您需要先在[控制台](https://console.cloud.tencent.com/trtc/) 中的功能配置页开启“启动自动旁路直播”开关。
	///【参考文档】[CDN 旁路直播](https://cloud.tencent.com/document/product/647/16826)。
    const char* streamId;

    ///【字段含义】设置云端录制完成后的回调消息中的 "userdefinerecordid"  字段内容，便于您更方便的识别录制回调。        
    ///【推荐取值】限制长度为64字节，只允许包含大小写英文字母（a-zA-Z）、数字（0-9）及下划线和连词符。
    ///【参考文档】[云端录制](https://cloud.tencent.com/document/product/647/16823)。
    const char* userDefineRecordId;

    ///【字段含义】房间签名（非必填），当您希望某个房间只能让特定的 userId 进入时，需要使用 privateMapKey 进行权限保护。
    ///【推荐取值】仅建议有高级别安全需求的客户使用，更多详情请参见 [进房权限保护](https://cloud.tencent.com/document/product/647/32240)。
    const char* privateMapKey;

    ///【字段含义】业务数据（非必填），部分高级特性才需要使用该字段。
    ///【推荐取值】不建议使用
    const char* businessInfo;


    TRTCParams()
        : sdkAppId(0)
        , roomId(0)
        , userId(NULL)
        , userSig(NULL)
        , role(TRTCRoleAnchor)
        , privateMapKey(NULL)
        , businessInfo(NULL)
        , userDefineRecordId(NULL)
        , streamId(NULL)
    {

    }
};

/**
* 5.2 视频编码参数
*
* 该设置决定了远端用户看到的画面质量（同时也是云端录制出的视频文件的画面质量）。
*/
struct TRTCVideoEncParam
{
    ///【字段含义】 视频分辨率
    ///【推荐取值】 
	///    - 视频通话建议选择360 × 640及以下分辨率，resMode 选择 Portrait。
    ///    - 手机直播建议选择540 × 960，resMode 选择 Portrait。
    ///    - Window 和 iMac 建议选择640 × 360及以上分辨率，resMode 选择 Landscape。
    ///【特别说明】 
	///    TRTCVideoResolution 默认只能横屏模式的分辨率，例如640 × 360。
    ///    如需使用竖屏分辨率，请指定 resMode 为 Portrait，例如640 × 360结合 Portrait 则为360 × 640。
    TRTCVideoResolution videoResolution;

    ///【字段含义】分辨率模式（横屏分辨率 - 竖屏分辨率）
    ///【推荐取值】手机直播建议选择 Portrait，Window 和 Mac 建议选择 Landscape。
    ///【特别说明】如果 videoResolution 指定分辨率 640 × 360，resMode 指定模式为 Portrait，则最终编码出的分辨率为360 × 640。
    TRTCVideoResolutionMode resMode;

    ///【字段含义】视频采集帧率
    ///【推荐取值】15fps 或 20fps。5fps以下，卡顿感明显。10fps以下，会有轻微卡顿感。20fps以上，则过于浪费（电影的帧率为24fps）。
    ///【特别说明】很多 Android 手机的前置摄像头并不支持15fps以上的采集帧率，部分过于突出美颜功能的 Android 手机前置摄像头的采集帧率可能低于10fps。
    uint32_t videoFps;

    ///【字段含义】目标视频码率，SDK 会按照目标码率进行编码，只有在网络不佳的情况下才会主动降低视频码率。
    ///【推荐取值】请参考本 TRTCVideoResolution 在各档位注释的最佳码率，也可以在此基础上适当调高。
    ///            比如 TRTCVideoResolution_1280_720 对应 1200kbps 的目标码率，您也可以设置为 1500kbps 用来获得更好的清晰度观感。
    ///【特别说明】SDK 会尽可能按照 videoBitrate 指定的码率进行编码，只有在网络不佳的情况下才会主动降低视频码率。
    uint32_t videoBitrate;

    ///【字段含义】是否允许调整分辨率
    ///【推荐取值】 
	///     - 手机直播建议选择 false。
    ///     - 视频通话模式，若更关注流畅性，建议选择 true，此时若遇到带宽有限的弱网，SDK 会自动降低分辨率以保障更好的流畅度（仅针对 TRTCVideoStreamTypeBig 生效）。
    ///     - 默认值：false。
    ///【特别说明】若有录制需求，选择 true 时，请确保通话过程中，调整分辨率不会影响您的录制效果。
    bool enableAdjustRes;

    TRTCVideoEncParam()
        : videoResolution(TRTCVideoResolution_640_360)
        , resMode(TRTCVideoResolutionModeLandscape)
        , videoFps(15)
        , videoBitrate(550)
        , enableAdjustRes(false)
    {

    }
};

/**
* 5.3 网络流控相关参数
*
* 网络流控相关参数，该设置决定了SDK在各种网络环境下的调控方向（比如弱网下是“保清晰”或“保流畅”）
*/
struct TRTCNetworkQosParam
{
    ///【字段含义】弱网下是“保清晰”或“保流畅”
    ///【特别说明】
    ///   - 弱网下保流畅：在遭遇弱网环境时，画面会变得模糊，且出现较多马赛克，但可以保持流畅不卡顿。
    ///   - 弱网下保清晰：在遭遇弱网环境时，画面会尽可能保持清晰，但可能容易出现卡顿
    TRTCVideoQosPreference preference;

    ///【字段含义】视频分辨率（云端控制 - 客户端控制）
    ///【推荐取值】云端控制
    ///【特别说明】
    ///   - Server 模式（默认）：云端控制模式，若无特殊原因，请直接使用该模式
    ///   - Client 模式：客户端控制模式，用于 SDK 开发内部调试，客户请勿使用
    TRTCQosControlMode controlMode;

    TRTCNetworkQosParam()
        : preference(TRTCVideoQosPreferenceClear)
        , controlMode(TRTCQosControlModeServer)
    {

    }
};

/**
 * 5.4 视频质量
 *
 * 表示视频质量的好坏，通过这个数值，您可以在 UI 界面上用图标表征 userId 的通话线路质量
 */
struct TRTCQualityInfo
{
    const char* userId;                     ///< 用户标识
    TRTCQuality quality;                    ///< 视频质量

    TRTCQualityInfo()
        : userId(NULL)
        , quality(TRTCQuality_Unknown)
    {

    }
};

/**
 * 5.5 音量大小
 *
 * 表示语音音量的评估大小，通过这个数值，您可以在 UI 界面上用图标表征 userId 是否有在说话。
 */
struct TRTCVolumeInfo
{
    /// 说话者的 userId，字符编码格式为 UTF-8
    const char* userId;
    /// 说话者的音量， 取值范围0 - 100
    uint32_t volume;

    TRTCVolumeInfo()
        : userId(NULL)
        , volume(0)
    {

    }
};


/**
 * 5.6 视频帧数据
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef LiteAVVideoFrame TRTCVideoFrame;

/**
 * 5.7 音频帧数据
 *
 * 该定义仅用于兼容原有接口，具体定义参见 TXLiteAVBase.h 文件
 */
typedef LiteAVAudioFrame TRTCAudioFrame;


/**
 * 5.8 网络测速结果
 *
 * 您可以在用户进入房间前通过 TRTCCloud 的 startSpeedTest 接口进行测速 （注意：请不要在通话中调用），
 * 测速结果会每2 - 3秒钟返回一次，每次返回一个 IP 地址的测试结果。
 *
 * @note - quality 是内部通过评估算法测算出的网络质量，loss 越低，rtt 越小，得分便越高。
 * @note - upLostRate 是指上行丢包率。例如，0.3表示每向服务器发送10个数据包可能会在中途丢失3个。
 * @note - downLostRate 是指下行丢包率。例如，0.2表示每从服务器收取10个数据包可能会在中途丢失2个。
 * @note - rtt 是指当前设备到腾讯云服务器的一次网络往返时间，该值越小越好，正常数值范围是10ms - 100ms
 */
struct TRTCSpeedTestResult
{
    /// 服务器 IP 地址
    const char* ip;

    /// 网络质量，内部通过评估算法测算出的网络质量，loss 越低，rtt 越小，得分便越高
    TRTCQuality quality;

    /// 上行丢包率，范围是0 - 1.0，例如，0.3表示每向服务器发送10个数据包可能会在中途丢失3个。
    float upLostRate;

    /// 下行丢包率，范围是0 - 1.0，例如，0.2表示每从服务器收取10个数据包可能会在中途丢失2个。
    float downLostRate;

    /// 延迟（毫秒），指当前设备到腾讯云服务器的一次网络往返时间，该值越小越好，正常数值范围是10ms - 100ms
    int rtt;

    TRTCSpeedTestResult()
        : ip(NULL)
        , upLostRate(0.0f)
        , downLostRate(0.0f)
        , rtt(0)
    {

    }
};

/**
* 5.9 云端混流中每一路子画面的位置信息
*
* TRTCMixUser 用于指定每一路（即每一个 userId）视频画面的具体摆放位置
*/
struct TRTCMixUser
{
    /// 参与混流的 userId
    const char* userId;

    /// 参与混流的 roomId，跨房流传入的实际 roomId，当前房间流传入 roomId = NULL
    const char* roomId;

    /// 图层位置坐标以及大小，左上角为坐标原点(0,0) （绝对像素值）
    RECT rect;

    /// 图层层次（1 - 15）不可重复
    int zOrder;

    /// 该用户是不是只开启了音频
    bool pureAudio;

    /// 参与混合的是主路画面（TRTCVideoStreamTypeBig）或屏幕分享（TRTCVideoStreamTypeSub）画面
    TRTCVideoStreamType streamType;

    TRTCMixUser()
        : userId(NULL)
        , roomId(NULL)
        , rect()
        , zOrder(0)
        , pureAudio(false)
        , streamType(TRTCVideoStreamTypeBig)
    {
        rect.left = 0;
        rect.top = 0;
        rect.right = 0;
        rect.bottom = 0;
    }
};

/**
 * 5.10 混流参数配置模式
 *
 */
enum TRTCTranscodingConfigMode {
    /// 非法值
    TRTCTranscodingConfigMode_Unknown = 0,

    /// 全手动模式，灵活性最高，可以自由组合出各种混流方案，但易用性最差。
    /// 此模式下，您需要填写 TRTCTranscodingConfig 中的所有参数，并需要监听 TRTCCloudDelegate 中的 onUserVideoAvailable() 和 onUserAudioAvailable() 回调，
    /// 以便根据当前房间中各个上麦用户的音视频状态不断地调整 mixUsers 参数，否则会导致混流失败。
    TRTCTranscodingConfigMode_Manual = 1,

    /// 纯音频模式，适用于语音通话（AudioCall）和语音聊天室（VoiceChatRoom）等纯音频场景。
    /// 只需要在进房后通过 setMixTranscodingConfig() 接口设置一次，之后 SDK 就会自动把房间内所有上麦用户的声音混流到当前用户的直播流上。
    /// 此模式下，您无需设置 TRTCTranscodingConfig 中的 mixUsers 参数，只需设置 audioSampleRate、audioBitrate 和 audioChannels 等参数。
    TRTCTranscodingConfigMode_Template_PureAudio = 2,

    /// 预排版模式，通过占位符提前对各路画面进行排布
    /// 此模式下，您依然需要设置 mixUsers 参数，但可以将 userId 设置为占位符，可选的占位符有：
    /// - "$PLACE_HOLDER_REMOTE$"     :  指代远程用户的画面，可以设置多个。
    /// - "$PLACE_HOLDER_LOCAL_MAIN$" ： 指代本地摄像头画面，只允许设置一个。
    /// - "$PLACE_HOLDER_LOCAL_SUB$"  :  指代本地屏幕分享画面，只允许设置一个。
    /// 但是您可以不需要监听 TRTCCloudDelegate 中的 onUserVideoAvailable() 和 onUserAudioAvailable() 回调进行实时调整，
    /// 只需要在进房成功后调用一次 setMixTranscodingConfig() 即可，之后 SDK 会自动将真实的 userId 补位到您设置的占位符上。
    TRTCTranscodingConfigMode_Template_PresetLayout = 3,
    
    /// 屏幕分享模式，适用于在线教育场景等以屏幕分享为主的应用场景，仅支持 Windows 和 Mac 两个平台的 SDK。
    /// SDK 会先根据您（通过 videoWidth 和 videoHeight 参数）设置的目标分辨率构建一张画布，
    /// 当老师未开启屏幕分享时，SDK 会将摄像头画面等比例拉伸绘制到该画布上；当老师开启屏幕分享之后，SDK 会将屏幕分享画面绘制到同样的画布上。
    /// 这样操作的目的是为了确保混流模块的输出分辨率一致，避免课程回放和网页观看的花屏问题（网页播放器不支持可变分辨率）。
    /// 同时，连麦学生的声音会被默认混合到老师的音视频流中。
    ///
    /// 由于教学模式下的视频内容以屏幕分享为主，因此同时传输摄像头画面和屏幕分享画面是非常浪费带宽的。
    /// 推荐的做法是直接将摄像头画面通过 setLocalVideoRenderCallback 接口自定义绘制到当前屏幕上。
    /// 在该模式下，您无需设置 TRTCTranscodingConfig 中的 mixUsers 参数，SDK 不会混合学生的画面，以免干扰屏幕分享的效果。
    ///
    /// 您可以将 TRTCTranscodingConfig 中的 width × height 设为 0px × 0px，SDK 会自动根据用户当前屏幕的宽高比计算出一个合适的分辨率：
    /// - 如果老师当前屏幕宽度 <= 1920px，SDK 会使用老师当前屏幕的实际分辨率。
    /// - 如果老师当前屏幕宽度 > 1920px，SDK 会根据当前屏幕宽高比，选择 1920x1080(16:9)、1920x1200(16:10)、1920x1440(4:3) 三种分辨率中的一种。
    TRTCTranscodingConfigMode_Template_ScreenSharing = 4,
};

/**
* 5.11 云端混流（转码）配置
*
* 包括最终编码质量和各路画面的摆放位置
*/
struct TRTCTranscodingConfig
{
    ///【字段含义】转码 config 模式
    TRTCTranscodingConfigMode mode;

    ///【字段含义】腾讯云直播 AppID
    ///【推荐取值】请在 [实时音视频控制台](https://console.cloud.tencent.com/rav) 选择已经创建的应用，单击【帐号信息】后，在“直播信息”中获取
    uint32_t appId;

    ///【字段含义】腾讯云直播 bizid
    ///【推荐取值】请在 [实时音视频控制台](https://console.cloud.tencent.com/rav) 选择已经创建的应用，单击【帐号信息】后，在“直播信息”中获取
    uint32_t bizId;

    ///【字段含义】最终转码后的视频分辨率的宽度。
    ///【推荐取值】推荐值：360px ，如果你是纯音频推流，请将 width × height 设为 0px × 0px，否则混流后会携带一条画布背景的视频流。
    uint32_t videoWidth;

    ///【字段含义】最终转码后的视频分辨率的高度。
    ///【推荐取值】推荐值：640px ，如果你是纯音频推流，请将 width × height 设为 0px × 0px，否则混流后会携带一条画布背景的视频流。
    uint32_t videoHeight;

    ///【字段含义】最终转码后的视频分辨率的码率（kbps）。
    ///【推荐取值】如果填0，后台会根据videoWidth和videoHeight来估算码率，您也可以参考枚举定义TRTCVideoResolution_640_480的注释。
    uint32_t videoBitrate;

    ///【字段含义】最终转码后的视频分辨率的帧率（FPS）。
    ///【推荐取值】默认值：15fps，取值范围是 (0,30]。
    uint32_t videoFramerate;

    ///【字段含义】最终转码后的视频分辨率的关键帧间隔（又称为 GOP）。
    ///【推荐取值】默认值：2，单位为秒，取值范围是 [1,8]。
    uint32_t videoGOP;

    ///【字段含义】混合后画面的底色颜色，默认为黑色，格式为十六进制数字，比如：“0x61B9F1” 代表 RGB 分别为(97,158,241)。
    ///【推荐取值】默认值：0x000000，黑色
    uint32_t backgroundColor;

    ///【字段含义】最终转码后的音频采样率。
    ///【推荐取值】默认值：48000Hz。支持12000HZ、16000HZ、22050HZ、24000HZ、32000HZ、44100HZ、48000HZ。
    uint32_t audioSampleRate;

    ///【字段含义】最终转码后的音频码率。
    ///【推荐取值】默认值：64kbps，取值范围是 [32，192]。
    uint32_t audioBitrate;

    ///【字段含义】最终转码后的音频声道数
    ///【推荐取值】默认值：1。取值范围为 [1,2] 中的整型。
    uint32_t audioChannels;

    ///【字段含义】每一路子画面的位置信息
    TRTCMixUser* mixUsersArray;

    ///【字段含义】 数组 mixUsersArray 的大小
    uint32_t mixUsersArraySize;

    TRTCTranscodingConfig()
        : mode(TRTCTranscodingConfigMode_Unknown)
        , videoWidth(0)
        , videoHeight(0)
        , videoBitrate(0)
        , videoFramerate(15)
        , videoGOP(2)
        , audioSampleRate(64)
        , audioBitrate(48000)
        , audioChannels(1)
        , mixUsersArray(nullptr)
        , mixUsersArraySize(0)
        , backgroundColor(0)
    {}
};

/**
 * 5.12 CDN 旁路推流参数
 */
struct TRTCPublishCDNParam
{
    /// 腾讯云 AppID，请在 [实时音视频控制台](https://console.cloud.tencent.com/rav) 选择已经创建的应用，单击【帐号信息】，在“直播信息”中获取
    uint32_t appId;

    /// 腾讯云直播 bizid，请在 [实时音视频控制台](https://console.cloud.tencent.com/rav) 选择已经创建的应用，单击【帐号信息】，在“直播信息”中获取
    uint32_t bizId;

    /// 旁路转推的 URL
    const char* url;

    TRTCPublishCDNParam()
        : url(NULL)
        , appId(0)
        , bizId(0)
    {

    }
};

/**
* 5.13 录音参数
*
* 请正确填写参数，确保录音文件顺利生成。
*/
struct TRTCAudioRecordingParams {

    ///【字段含义】文件路径（必填），录音文件的保存路径。该路径需要用户自行指定，请确保路径存在且可写。
    ///【特别说明】该路径需精确到文件名及格式后缀，格式后缀决定录音文件的格式，目前支持的格式有 PCM、WAV 和 AAC。
    ///          例如，指定路径为 path/to/audio.aac，则会生成一个 AAC 格式的文件。
    ///          请指定一个有读写权限的合法路径，否则录音文件无法生成。
    const char * filePath;

    TRTCAudioRecordingParams()
        : filePath(nullptr)
    {

    }
};


/**
* 5.14 音效
*
*/
struct TRTCAudioEffectParam {

    ///【字段含义】音效 ID，
    ///【特殊说明】SDK 允许播放多路音效，因此需要音效 ID 进行标记，用于控制音效的开始、停止、音量等
    int effectId;

    ///【字段含义】音效路径，支持的文件格式：aac, mp3。
    const char * path;

    ///【字段含义】循环播放次数
    ///【推荐取值】取值范围为0 - 任意正整数，默认值：0。0表示播放音效一次；1表示播放音效两次；以此类推
    int loopCount;

    ///【字段含义】音效是否上行
    ///【推荐取值】YES：音效在本地播放的同时，会上行至云端，因此远端用户也能听到该音效；NO：音效不会上行至云端，因此只能在本地听到该音效。默认值：NO
    bool publish;

    ///【字段含义】音效音量
    ///【推荐取值】取值范围为0 - 100；默认值：100
    int volume;

    TRTCAudioEffectParam(const int _effectId, const char *_path)
        : loopCount(0)
        , publish(false)
        , volume(100)
    {
        effectId = _effectId;
        path = _path;
    }
};
/// @}

#endif /* __TRTCCLOUDDEF_H__ */
