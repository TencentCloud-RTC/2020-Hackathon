#ifndef __ITRTCCLOUD_H__
#define __ITRTCCLOUD_H__
/*
 * Module:   ITRTCCloud @ TXLiteAVSDK
 *
 * SDK VERSION 6.0
 *
 * Function: 腾讯云视频通话功能的主要接口类
 *
 * Nouns[1]: 主流 - TRTC 里称摄像头这一路的画面叫做“主流”（或主路）画面。
 * Nouns[2]: 辅流(substream) - TRTC 里称屏幕分享或者播片这一路的画面叫做“辅流”（或辅路）画面。
 * Nouns[3]: 播片(vodplay) - TRTC 的 Windows 版本支持将本地的一个视频文件分享出去，这个功能成为“播片”。
 *
 * 创建/使用/销毁 ITRTCCloud 对象的示例代码：
 * <pre>
 *     ITRTCCloud *trtcCloud = getTRTCShareInstance();
 *     if(trtcCloud)
 *     {
 *         std::string version(trtcCloud->getSDKVersion());
 *     }
 *     //--------------------------------------------------
 *     destroyTRTCShareInstance();
 *     trtcCloud = NULL;
 * </pre>
 */

#include "TRTCCloudCallback.h"
#include "TRTCCloudDef.h"
#include <windows.h>

class ITRTCCloud;

/// @defgroup ITRTCCloud_cplusplus ITRTCCloud
/// 腾讯云视频通话功能的主要接口类
/// @{
extern "C" {
    /// @name 创建与销毁 ITRTCCloud 单例
    /// @{
    /**
    * \brief 用于动态加载 dll 时，获取 ITRTCCloud 对象指针。
    *
    * \return 返回 ITRTCCloud 单例对象的指针，注意：delete ITRTCCloud*会编译错误，需要调用 destroyTRTCCloud 释放单例指针对象。
    */
    LITEAV_API ITRTCCloud* getTRTCShareInstance();

    /**
    * \brief 释放 ITRTCCloud 单例对象。
    */
    LITEAV_API void destroyTRTCShareInstance();
    /// @}
}

class ITRTCCloud
{
protected:
    virtual ~ITRTCCloud() {};

public:
    /////////////////////////////////////////////////////////////////////////////////
    //
    //                       设置 TRTCCloudCallback 回调
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 设置 TRTCCloudCallback 回调
    /// @{
    /**
    * 设置回调接口 ITRTCCloudCallback
    *
    * 您可以通过 ITRTCCloudCallback 获得来自 SDK 的各种状态通知，详见 ITRTCCloudCallback.h 中的定义
    *
    * @param callback 事件回调指针
    */
    virtual void addCallback(ITRTCCloudCallback* callback) = 0;

    /**
    * 移除事件回调
    *
    * @param callback 事件回调指针
    */
    virtual void removeCallback(ITRTCCloudCallback* callback) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （一）房间相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 房间相关接口函数
    /// @{
    /**
    * 1.1 进入房间
    *
    * 调用接口后，您会收到来自 TRTCCloudCallback 中的 onEnterRoom(result) 回调:
    * - 如果加入成功，result 会是一个正数（result > 0），表示加入房间的时间消耗，单位是毫秒（ms）。
    * - 如果加入失败，result 会是一个负数（result < 0），表示进房失败的错误码。
    *
    * 进房失败的错误码含义请参见[错误码](https://cloud.tencent.com/document/product/647/32257)。
    *
    *  - {@link TRTCAppSceneVideoCall}：<br>
    *           视频通话场景，支持720P、1080P高清画质，单个房间最多支持300人同时在线，最高支持50人同时发言。<br>
    *           适合：[1对1视频通话]、[300人视频会议]、[在线问诊]、[视频聊天]、[远程面试]等。<br>
    *  - {@link TRTCAppSceneAudioCall}：<br>
    *           语音通话场景，支持 48kHz，支持双声道。单个房间最多支持300人同时在线，最高支持50人同时发言。<br>
    *           适合：[1对1语音通话]、[300人语音会议]、[语音聊天]、[语音会议]、[在线狼人杀]等。<br>
    *  - {@link TRTCAppSceneLIVE}：<br>
    *           视频互动直播，支持平滑上下麦，切换过程无需等待，主播延时小于300ms；支持十万级别观众同时播放，播放延时低至1000ms。<br>
    *           适合：[视频低延时直播]、[十万人互动课堂]、[视频直播 PK]、[视频相亲房]、[互动课堂]、[远程培训]、[超大型会议]等。<br>
    *  - {@link TRTCAppSceneVoiceChatRoom}：<br>
    *           语音互动直播，支持平滑上下麦，切换过程无需等待，主播延时小于300ms；支持十万级别观众同时播放，播放延时低至1000ms。<br>
    *           适合：[语音低延时直播]、[语音直播连麦]、[语聊房]、[K 歌房]、[FM 电台]等。<br>
    *
    * @param param 进房参数，请参考 TRTCParams
    * @param scene 应用场景，目前支持视频通话（VideoCall）、在线直播（Live）、语音通话（AudioCall）、语音聊天室（VoiceChatRoom）四种场景。
    *
    * @note
    *  1. 当 scene 选择为 TRTCAppSceneLIVE 或 TRTCAppSceneVoiceChatRoom 时，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。<br>
    *  2. 不管进房是否成功，enterRoom 都必须与 exitRoom 配对使用，在调用 exitRoom 前再次调用 enterRoom 函数会导致不可预期的错误问题。
    */
    virtual void enterRoom(const TRTCParams& params, TRTCAppScene scene) = 0;

    /**
    * 1.2 离开房间
    *
    * 调用 exitRoom() 接口会执行退出房间的相关逻辑，例如释放音视频设备资源和编解码器资源等。
    * 待资源释放完毕，SDK 会通过 TRTCCloudCallback 中的 onExitRoom() 回调通知您。
    *
    * 如果您要再次调用 enterRoom() 或者切换到其他的音视频 SDK，请等待 onExitRoom() 回调到来后再执行相关操作。
    * 否则可能会遇到如摄像头、麦克风设备被强占等各种异常问题。
    */
    virtual void exitRoom() = 0;

    /**
    * 1.3 切换角色，仅适用于直播场景（TRTCAppSceneLIVE 和 TRTCAppSceneVoiceChatRoom）
    *
    * 在直播场景下，一个用户可能需要在“观众”和“主播”之间来回切换。
    * 您可以在进房前通过 TRTCParams 中的 role 字段确定角色，也可以通过 switchRole 在进房后切换角色。
    *
    * @param role 目标角色，默认为主播：
    *  - {@link TRTCRoleAnchor} 主播，可以上行视频和音频，一个房间里最多支持50个主播同时上行音视频。
    *  - {@link TRTCRoleAudience} 观众，只能观看，不能上行视频和音频，一个房间里的观众人数没有上限。
    */
    virtual void switchRole(TRTCRoleType role) = 0;

    /**
    * 1.4 请求跨房通话（主播 PK）
    *
    * TRTC 中两个不同音视频房间中的主播，可以通过“跨房通话”功能拉通连麦通话功能。使用此功能时，
    * 两个主播无需退出各自原来的直播间即可进行“连麦 PK”。
    *
    * 例如：当房间“001”中的主播 A 通过 connectOtherRoom() 跟房间“002”中的主播 B 拉通跨房通话后，
    * 房间“001”中的用户都会收到主播 B 的 onUserEnter(B) 回调和 onUserVideoAvailable(B,true) 回调。
    * 房间“002”中的用户都会收到主播 A 的 onUserEnter(A) 回调和 onUserVideoAvailable(A,true) 回调。
    *
    * 简言之，跨房通话的本质，就是把两个不同房间中的主播相互分享，让每个房间里的观众都能看到两个主播。
    *
    * <pre>
    *                 房间 001                     房间 002
    *               -------------               ------------
    *  跨房通话前：| 主播 A      |             | 主播 B     |
    *              | 观众 U V W  |             | 观众 X Y Z |
    *               -------------               ------------
    *
    *                 房间 001                     房间 002
    *               -------------               ------------
    *  跨房通话后：| 主播 A B    |             | 主播 B A   |
    *              | 观众 U V W  |             | 观众 X Y Z |
    *               -------------               ------------
    * </pre>
    *
    * 跨房通话的参数考虑到后续扩展字段的兼容性问题，暂时采用了 JSON 格式的参数，要求至少包含两个字段：
    * - roomId：房间“001”中的主播 A 要跟房间“002”中的主播 B 连麦，主播 A 调用 connectOtherRoom() 时 roomId 应指定为“002”。
    * - userId：房间“001”中的主播 A 要跟房间“002”中的主播 B 连麦，主播 A 调用 connectOtherRoom() 时 userId 应指定为 B 的 userId。
    *
    * 跨房通话的请求结果会通过 TRTCCloudCallback 中的 onConnectOtherRoom() 回调通知给您。
    *
    * <pre>
    *   //此处用到 jsoncpp 库来格式化 JSON 字符串
    *   Json::Value jsonObj;
    *   jsonObj["roomId"] = 002;
    *   jsonObj["userId"] = "userB";
    *   Json::FastWriter writer;
    *   std::string params = writer.write(jsonObj);
    *   trtc.ConnectOtherRoom(params.c_str());
    * </pre>
    *
    * @param params JSON 字符串连麦参数，roomId 代表目标房间号，userId 代表目标用户 ID。
    *
    **/
    virtual void connectOtherRoom(const char* params) = 0;

    /**
    * 1.5 关闭跨房连麦
    *
    * 跨房通话的退出结果会通过 TRTCCloudCallback 中的 onDisconnectOtherRoom() 回调通知给您。
    */
    virtual void disconnectOtherRoom() = 0;

    /**
    * 1.6 设置音视频数据接收模式（需要在进房前设置才能生效）
    *
    * 为实现进房秒开的绝佳体验，SDK 默认进房后自动接收音视频。即在您进房成功的同时，您将立刻收到远端所有用户的音视频数据。
    * 若您没有调用 startRemoteView，视频数据将自动超时取消。
    * 若您主要用于语音聊天等没有自动接收视频数据需求的场景，您可以根据实际需求选择接收模式。
    *
    * \param autoRecvAudio true：自动接收音频数据；false：需要调用 muteRemoteAudio 进行请求或取消。默认值：true
    * \param autoRecvVideo true：自动接收视频数据；false：需要调用 startRemoteView/stopRemoteView 进行请求或取消。默认值：true
    *
    * \note 需要在进房前设置才能生效。
    **/
    virtual void setDefaultStreamRecvMode(bool autoRecvAudio, bool autoRecvVideo) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （二）CDN 相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name CDN 相关接口函数
    /// @{

    /**
    * 2.1 开始向腾讯云的直播 CDN 推流
    *
    * 该接口会指定当前用户的音视频流在腾讯云 CDN 所对应的 StreamId，进而可以指定当前用户的 CDN 播放地址。
    *
    * 例如：如果我们采用如下代码设置当前用户的主画面 StreamId 为 user_stream_001，那么该用户主画面对应的 CDN 播放地址为：
    * “http://yourdomain/live/user_stream_001.flv”，其中 yourdomain 为您自己备案的播放域名，
    * 您可以在直播[控制台](https://console.cloud.tencent.com/live) 配置您的播放域名，腾讯云不提供默认的播放域名。
    *
    * <pre>
    *  ITRTCCloud *trtcCloud = getTRTCShareInstance();
    *  trtcCloud->enterRoom(params, TRTCAppSceneLIVE);
    *  trtcCloud->startLocalPreview(HWND);
    *  trtcCloud->startLocalAudio();
    *  trtcCloud->startPublishing("user_stream_001", TRTCVideoStreamTypeBig);
    * </pre>
    *
    * 您也可以在设置 enterRoom 的参数 TRTCParams 时指定 streamId, 而且我们更推荐您采用这种方案。
    *
    * @param streamId 自定义流 Id。
    * @param type 仅支持 TRTCVideoStreamTypeBig 和 TRTCVideoStreamTypeSub。
    * @note 您需要先在实时音视频 [控制台](https://console.cloud.tencent.com/rav/) 中的功能配置页开启“启动自动旁路直播”才能生效。
    */
    virtual void startPublishing(const char* streamId, TRTCVideoStreamType type) = 0;
    
    /**
    * 2.2 停止向腾讯云的直播 CDN 推流
    */
    virtual void stopPublishing() = 0;

    /**
    * 2.3 开始向友商云的直播 CDN 转推
    *
    * 该接口跟 startPublishing() 类似，但 startPublishCDNStream() 支持向非腾讯云的直播 CDN 转推。
    * 使用 startPublishing() 绑定腾讯云直播 CDN 不收取额外的费用。
    * 使用 startPublishCDNStream() 绑定非腾讯云直播 CDN 需要收取转推费用，且需要通过工单联系我们开通。
    * 
    * @param param 转推参数
    */
    virtual void startPublishCDNStream(const TRTCPublishCDNParam& param) = 0;

    /**
    * 2.4 停止向非腾讯云地址转推
    */
    virtual void stopPublishCDNStream() = 0;

    /**
    * 2.5 设置云端的混流转码参数
    *
    * 如果您在实时音视频 [控制台](https://console.cloud.tencent.com/trtc/) 中的功能配置页开启了“启动自动旁路直播”功能，
    * 房间里的每一路画面都会有一个默认的直播 [CDN 地址](https://cloud.tencent.com/document/product/647/16826)。
    *
    * 一个直播间中可能有不止一位主播，而且每个主播都有自己的画面和声音，但对于 CDN 观众来说，他们只需要一路直播流，
    * 所以您需要将多路音视频流混成一路标准的直播流，这就需要混流转码。
    *
    * 当您调用 setMixTranscodingConfig() 接口时，SDK 会向腾讯云的转码服务器发送一条指令，目的是将房间里的多路音视频流混合为一路,
    * 您可以通过 mixUsers 参数来调整每一路画面的位置，以及是否只混合声音，也可以通过 videoWidth、videoHeight、videoBitrate 等参数控制混合音视频流的编码参数。
    *
    * <pre>
    * 【画面1】=> 解码 ====> \
    *                         \
    * 【画面2】=> 解码 =>  画面混合 => 编码 => 【混合后的画面】
    *                         /
    * 【画面3】=> 解码 ====> /
    *
    * 【声音1】=> 解码 ====> \
    *                         \
    * 【声音2】=> 解码 =>  声音混合 => 编码 => 【混合后的声音】
    *                         /
    * 【声音3】=> 解码 ====> /
    * </pre>
    *
    * 参考文档：[云端混流转码](https://cloud.tencent.com/document/product/647/16827)。
    *
    * @param config 请参考 TRTCCloudDef.h 中关于 TRTCTranscodingConfig 的介绍。如果传入 nil 则取消云端混流转码。
    * @note 关于云端混流的注意事项：
    *  - 云端转码会引入一定的 CDN 观看延时，大概会增加1 - 2秒。
    *  - 调用该函数的用户，会将连麦中的多路画面混合到自己当前这路画面中。
    */
    virtual void setMixTranscodingConfig(TRTCTranscodingConfig* config) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （三）视频相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name  视频相关接口函数
    /// @{
    /**
    * 3.1 开启本地视频的预览画面
    *
    * 这个接口会启动默认的摄像头，可以通过 setCurrentCameraDevice 接口选用其他摄像头
    * 当开始渲染首帧摄像头画面时，您会收到 TRTCCloudCallback 中的 onFirstVideoFrame(null) 回调。
    *
    * @param rendHwnd 承载预览画面的 HWND
    */
    virtual void startLocalPreview(HWND rendHwnd) = 0;

    /**
    * 3.2 停止本地视频采集及预览
    */
    virtual void stopLocalPreview() = 0;

    /**
    * 3.3 暂停/恢复推送本地的视频数据
    *
    * 当暂停推送本地视频后，房间里的其它成员将会收到 onUserVideoAvailable(userId, false) 回调通知
    * 当恢复推送本地视频后，房间里的其它成员将会收到 onUserVideoAvailable(userId, true) 回调通知
    *
    * @param mute true：暂停；false：恢复
    */
    virtual void muteLocalVideo(bool mute) = 0;

    /**
    * 3.4 开始显示远端视频画面
    *
    * 在收到 SDK 的 onUserVideoAvailable(userId, true) 通知时，可以获知该远程用户开启了视频，
    * 此后调用 startRemoteView(userId) 接口加载该用户的远程画面时，可以用 loading 动画优化加载过程中的等待体验。
    * 待该用户的首帧画面开始显示时，您会收到 onFirstVideoFrame(userId) 事件回调。
    *
    * @param userId   对方的用户标识
    * @param rendHwnd 承载预览画面的窗口句柄
    */
    virtual void startRemoteView(const char* userId, HWND rendHwnd) = 0;

    /**
    * 3.5 停止显示远端视频画面，同时不再拉取该远端用户的视频数据流
    *
    * 调用此接口后，SDK 会停止接收该用户的远程视频流，同时会清理相关的视频显示资源。
    *
    * @param userId 对方的用户标识
    */
    virtual void stopRemoteView(const char* userId) = 0;

    /**
    * 3.6 停止显示所有远端视频画面，同时不再拉取远端用户的视频数据流
    *
    * @note 如果有屏幕分享的画面在显示，则屏幕分享的画面也会一并被关闭。
    */
    virtual void stopAllRemoteView() = 0;

    /**
    * 3.7 暂停/恢复接收指定的远端视频流
    *
    * 该接口仅暂停/恢复接收指定的远端用户的视频流，但并不释放显示资源，所以如果暂停，视频画面会冻屏在 mute 前的最后一帧。
    *
    * @param userId 对方的用户标识
    * @param mute  是否暂停接收
    */
    virtual void muteRemoteVideoStream(const char* userId, bool mute) = 0;

    /**
    * 3.8 暂停/恢复接收所有远端视频流
    *
    * 该接口仅暂停/恢复接收所有远端用户的视频流，但并不释放显示资源，所以如果暂停，视频画面会冻屏在 mute 前的最后一帧。
    *
    * @param mute 是否暂停接收
    */
    virtual void muteAllRemoteVideoStreams(bool mute) = 0;

    /**
    * 3.9 设置视频编码器相关参数
    *
    * 该设置决定了远端用户看到的画面质量（同时也是云端录制出的视频文件的画面质量）
    *
    * @param params 视频编码参数，详情请参考 TRTCCloudDef.h 中的 TRTCVideoEncParam 定义
    */
    virtual void setVideoEncoderParam(const TRTCVideoEncParam& params) = 0;

    /**
    * 3.10 设置网络流控相关参数
    *
    * 该设置决定了 SDK 在各种网络环境下的调控策略（例如弱网下是“保清晰”还是“保流畅”）
    *
    * @param params 网络流控参数，详情请参考 TRTCCloudDef.h 中的 TRTCNetworkQosParam 定义
    */
    virtual void setNetworkQosParam(const TRTCNetworkQosParam& params) = 0;

    /**
    * 3.11 设置本地图像的渲染模式
    *
    * @param mode 填充（画面可能会被拉伸裁剪）或适应（画面可能会有黑边），默认值：TRTCVideoFillMode_Fit
    */
    virtual void setLocalViewFillMode(TRTCVideoFillMode mode) = 0;

    /**
    * 3.12 设置远端图像的渲染模式
    *
    * @param userId 用户 ID
    * @param mode 填充（画面可能会被拉伸裁剪）或适应（画面可能会有黑边），默认值：TRTCVideoFillMode_Fit
    */
    virtual void setRemoteViewFillMode(const char* userId, TRTCVideoFillMode mode) = 0;

    /**
    * 3.13 设置本地图像的顺时针旋转角度
    *
    * @param rotation 支持 TRTCVideoRotation90 、 TRTCVideoRotation180 以及 TRTCVideoRotation270 旋转角度，默认值：TRTCVideoRotation0
    */
    virtual void setLocalViewRotation(TRTCVideoRotation rotation) = 0;

    /**
    * 3.14 设置远端图像的顺时针旋转角度
    *
    * @param userId 用户 ID
    * @param rotation 支持 TRTCVideoRotation90 、 TRTCVideoRotation180 以及 TRTCVideoRotation270 旋转角度，默认值：TRTCVideoRotation0
    */
    virtual void setRemoteViewRotation(const char* userId, TRTCVideoRotation rotation) = 0;

    /**
    * 3.15 设置视频编码输出的（也就是远端用户观看到的，以及服务器录制下来的）画面方向
    *
    * @param rotation 目前支持 TRTCVideoRotation0 和 TRTCVideoRotation180 旋转角度，默认值：TRTCVideoRotation0
    */
    virtual void setVideoEncoderRotation(TRTCVideoRotation rotation) = 0;

    /**
    * 3.16 设置本地摄像头预览画面的镜像模式
    *
    * @param mirror 镜像模式，默认值：false（非镜像模式）
    */
    virtual void setLocalViewMirror(bool mirror) = 0;

    /**
    * 3.17 设置编码器输出的画面镜像模式
    *
    * 该接口不改变本地摄像头的预览画面，但会改变另一端用户看到的（以及服务器录制的）画面效果。
    *
    * @param mirror 是否开启远端镜像, true：远端画面镜像；false：远端画面非镜像。默认值：false
    */
    virtual void setVideoEncoderMirror(bool mirror) = 0;

    /**
    * 3.18 开启大小画面双路编码模式
    *
    * 如果当前用户是房间中的主要角色（例如主播、老师、主持人等），并且使用 PC 或者 Mac 环境，可以开启该模式。
    * 开启该模式后，当前用户会同时输出【高清】和【低清】两路视频流（但只有一路音频流）。
    * 对于开启该模式的当前用户，会占用更多的网络带宽，并且会更加消耗 CPU 计算资源。
    *
    * 对于同一房间的远程观众而言：
    * - 如果用户的下行网络很好，可以选择观看【高清】画面
    * - 如果用户的下行网络较差，可以选择观看【低清】画面
    *
    * @param enable 是否开启小画面编码，默认值：false
    * @param smallVideoParam 小流的视频参数
    */
    virtual void enableSmallVideoStream(bool enable, const TRTCVideoEncParam& smallVideoParam) = 0;

    /**
    * 3.19 选定观看指定 userId 的大画面还是小画面
    *
    * 此功能需要该 userId 通过 enableEncSmallVideoStream 提前开启双路编码模式。
    * 如果该 userId 没有开启双路编码模式，则此操作无效。
    *
    * @param userId 用户 ID
    * @param type 视频流类型，即选择看大画面还是小画面，默认为 TRTCVideoStreamTypeBig
    */
    virtual void setRemoteVideoStreamType(const char* userId, TRTCVideoStreamType type) = 0;

    /**
    * 3.20 设定观看方优先选择的视频质量
    *
    * 低端设备推荐优先选择低清晰度的小画面。
    * 如果对方没有开启双路视频模式，则此操作无效。
    *
    * @param type 默认观看大画面还是小画面，默认为 TRTCVideoStreamTypeBig
    */
    virtual void setPriorRemoteVideoStreamType(TRTCVideoStreamType type) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （四）音频相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 音频相关接口函数
    /// @{

    /**
    * 4.1 开启本地音频的采集和上行
    *
    * 该函数会启动麦克风采集，并将音频数据传输给房间里的其他用户。
    * SDK 并不会默认开启本地的音频上行，也就说，如果您不调用这个函数，房间里的其他用户就听不到您的声音。
    *
    * @note TRTC SDK 并不会默认打开本地的麦克风采集。
    */
    virtual void startLocalAudio() = 0;

    /**
    * 4.2 关闭本地音频的采集和上行
    *
    * 当关闭本地音频的采集和上行，房间里的其它成员会收到 onUserAudioAvailable(false) 回调通知。
    */
    virtual void stopLocalAudio() = 0;

    /**
    * 4.3 静音/取消静音本地的音频
    *
    * 当静音本地音频后，房间里的其它成员会收到 onUserAudioAvailable(userId, false) 回调通知。
    * 当取消静音本地音频后，房间里的其它成员会收到 onUserAudioAvailable(userId, true) 回调通知。
    *
    * 与 stopLocalAudio 不同之处在于，muteLocalAudio(true) 并不会停止发送音视频数据，而是继续发送码率极低的静音包。
    * 由于 MP4 等视频文件格式，对于音频的连续性是要求很高的，使用 stopLocalAudio 会导致录制出的 MP4 不易播放。
    * 因此在对录制质量要求很高的场景中，建议选择 muteLocalAudio，从而录制出兼容性更好的 MP4 文件。
    *
    * @param mute true：静音；false：取消静音
    */
    virtual void muteLocalAudio(bool mute) = 0;

    /**
    * 4.4 静音/取消静音指定的远端用户的声音
    *
    * @param userId 用户 ID
    * @param mute true：静音；false：取消静音
    *
    * @note 静音时会停止接收该用户的远端音频流并停止播放，取消静音时会自动拉取该用户的远端音频流并进行播放。
    */
    virtual void muteRemoteAudio(const char* userId, bool mute) = 0;

    /**
    * 4.5  静音/取消静音所有用户的声音
    *
    * @param mute true：静音；false：取消静音
    *
    * @note 静音时会停止接收所有用户的远端音频流并停止播放，取消静音时会自动拉取所有用户的远端音频流并进行播放。
    */
    virtual void muteAllRemoteAudio(bool mute) = 0;

    /**
    * 4.6 设置 SDK 采集音量。
    *
    * @param volume 音量大小，取值0 - 100，默认值为100
    */
    virtual void setAudioCaptureVolume(int volume) = 0;

    /**
    * 4.7 获取 SDK 采集音量
    */
    virtual int getAudioCaptureVolume() = 0;

    /**
    * 4.8 设置 SDK 播放音量。
    *
    * @note 该函数会控制最终交给系统播放的声音音量，会影响录制本地音频文件的音量大小，但不会影响耳返的音量
    *
    * @param volume 音量大小，取值0 - 100，默认值为100
    */
    virtual void setAudioPlayoutVolume(int volume) = 0;

    /**
    * 4.9 获取 SDK 播放音量
    */
    virtual int getAudioPlayoutVolume() = 0;

    /**
    * 4.10 启用或关闭音量大小提示
    *
    * 开启此功能后，SDK 会在 onUserVoiceVolume() 中反馈对每一路声音音量大小值的评估。
    * 我们在 Demo 中有一个音量大小的提示条，就是基于这个接口实现的。
    * 如希望打开此功能，请在 startLocalAudio() 之前调用。
    *
    * @param interval 设置 onUserVoiceVolume 回调的触发间隔，单位为ms，最小间隔为100ms，如果小于等于0则会关闭回调，建议设置为300ms
    */
    virtual void enableAudioVolumeEvaluation(uint32_t interval) = 0;

    /**
     * 4.11 开始录音
     *
     * 该方法调用后， SDK 会将通话过程中的所有音频(包括本地音频，远端音频，BGM等)录制到一个文件里。
     * 无论是否进房，调用该接口都生效。
     * 如果调用 exitRoom 时还在录音，录音会自动停止。
     *
     * @param audioRecordingParams 录音参数，请参考TRTCAudioRecordingParams
     * @return 0：成功；-1：录音已开始；-2：文件或目录创建失败；-3：后缀指定的音频格式不支持
     */
    virtual int startAudioRecording(const TRTCAudioRecordingParams& audioRecordingParams) = 0;

    /**
     * 4.12 停止录音
     *
     * 如果调用 exitRoom 时还在录音，录音会自动停止。
     */
    virtual void stopAudioRecording() = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （五）摄像头相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 摄像头相关接口函数
    /// @{
    /**
    * 5.1 获取摄像头设备列表
    *
    * 示例代码：
    * <pre>
    *  ITRTCDeviceCollection * pDevice = m_pCloud->getCameraDevicesList();
    *  for (int i = 0; i < pDevice->getCount(); i++)
    *  {
    *      std::wstring name = UTF82Wide(pDevice->getDeviceName(i));
    *  }
    *  pDevice->release();
    *  pDevice = null;
    * </pre>
    *
    * @note 如果 delete ITRTCDeviceCollection*指针会编译错误，SDK 维护 ITRTCDeviceCollection 对象的生命周期。
    * @return 摄像头管理器对象指针 ITRTCDeviceCollection*
    */
    virtual ITRTCDeviceCollection* getCameraDevicesList() = 0;

    /**
    * 5.2 设置要使用的摄像头
    *
    * @param deviceId 从 getCameraDevicesList 中得到的设备 ID
    */
    virtual void setCurrentCameraDevice(const char* deviceId) = 0;

    /**
    * 5.3 获取当前使用的摄像头
    *
    * @return ITRTCDeviceInfo 设备信息，能获取设备 ID 和设备名称
    */
    virtual ITRTCDeviceInfo* getCurrentCameraDevice() = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （六）音频设备相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 音频设备相关接口函数
    /// @{
    /**
    * 6.1 获取麦克风设备列表
    *
    *  示例代码：
    * <pre>
    *  ITRTCDeviceCollection * pDevice = m_pCloud->getMicDevicesList();
    *  for (int i = 0; i < pDevice->getCount(); i++)
    *  {
    *      std::wstring name = UTF82Wide(pDevice->getDeviceName(i));
    *  }
    *  pDevice->release();
    *  pDevice = null;
    * </pre>
    *
    * @return 麦克风管理器对象指针 ITRTCDeviceCollection*
    * @note 如果 delete ITRTCDeviceCollection* 指针会编译错误，SDK 维护 ITRTCDeviceCollection 对象的生命周期。
    */
    virtual ITRTCDeviceCollection* getMicDevicesList() = 0;

    /**
    * 6.2 获取当前选择的麦克风
    *
    * @return ITRTCDeviceInfo 设备信息，能获取设备 ID 和设备名称
    */
    virtual ITRTCDeviceInfo* getCurrentMicDevice() = 0;

    /**
    * 6.3 设置要使用的麦克风
    *
    * 选择指定的麦克风作为录音设备，不调用该接口时，默认选择索引为0的麦克风
    *
    * @param micId 从 getMicDevicesList 中得到的设备 ID
    */
    virtual void setCurrentMicDevice(const char* micId) = 0;

    /**
    * 6.4 获取系统当前麦克风设备音量
    *
    * @note 查询的是系统硬件音量大小。
    *
    * @return 音量值，范围是0 - 100
    */
    virtual uint32_t getCurrentMicDeviceVolume() = 0;

    /**
    * 6.5 设置系统当前麦克风设备的音量
    *
    * @note 该接口的功能是调节系统采集音量，如果用户直接调节 WIN 系统设置的采集音量时，该接口的设置结果会被用户的操作所覆盖。
    *
    * @param volume 麦克风音量值，范围0 - 100
    */
    virtual void setCurrentMicDeviceVolume(uint32_t volume) = 0;

    /**
    * 6.6 获取扬声器设备列表
    *
    *  示例代码：
    * <pre>
    *  ITRTCDeviceCollection * pDevice = m_pCloud->getSpeakerDevicesList();
    *  for (int i = 0; i < pDevice->getCount(); i++)
    *  {
    *      std::wstring name = UTF82Wide(pDevice->getDeviceName(i));
    *  }
    *  pDevice->release();
    *  pDevice = null;
    * </pre>
    *
    * @return 扬声器管理器对象指针 ITRTCDeviceCollection*
    * @note 如果 delete ITRTCDeviceCollection* 指针会编译错误，SDK 维护 ITRTCDeviceCollection 对象的生命周期。
    */
    virtual ITRTCDeviceCollection* getSpeakerDevicesList() = 0;

    /**
    * 6.7 获取当前的扬声器设备
    *
    * @return ITRTCDeviceInfo 设备信息，能获取设备 ID 和设备名称
    */
    virtual ITRTCDeviceInfo* getCurrentSpeakerDevice() = 0;

    /**
    * 6.8 设置要使用的扬声器
    *
    * @param speakerId 从 getSpeakerDevicesList 中得到的设备 ID
    */
    virtual void setCurrentSpeakerDevice(const char* speakerId) = 0;

    /**
    * 6.9 获取系统当前扬声器设备音量
    *
    * @note 查询的是系统硬件音量大小。
    *
    * @return 扬声器音量，范围0 - 100
    */
    virtual uint32_t getCurrentSpeakerVolume() = 0;

    /**
    * 6.10 设置系统当前扬声器设备音量
    *
    * @note 该接口的功能是调节系统播放音量，如果用户直接调节 WIN 系统设置的播放音量时，该接口的设置结果会被用户的操作所覆盖。
    *
    * @param volume 设置的扬声器音量，范围0 - 100
    */
    virtual void setCurrentSpeakerVolume(uint32_t volume) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （七）图像前处理相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 美颜相关接口函数
    /// @{
    /**
    * 7.1 设置美颜、美白、红润效果级别
    *
    * SDK 内部集成了两套风格不同的磨皮算法，一套我们取名叫“光滑”，适用于美女秀场，效果比较明显。
    * 另一套我们取名“自然”，磨皮算法更多地保留了面部细节，主观感受上会更加自然。
    *
    * @param style     美颜风格，光滑或者自然，光滑风格磨皮更加明显，适合娱乐场景。
    * @param beauty    美颜级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显
    * @param white     美白级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显
    * @param ruddiness 红润级别，取值范围0 - 9，0表示关闭，1 - 9值越大，效果越明显，该参数暂未生效
    */
    virtual void setBeautyStyle(TRTCBeautyStyle style, uint32_t beauty, uint32_t white, uint32_t ruddiness) = 0;

    /**
    * 7.2 设置水印
    *
    * 水印的位置是通过 xOffset, yOffset, fWidthRatio 来指定的。
    * - xOffset：水印的坐标，取值范围为0 - 1的浮点数。
    * - yOffset：水印的坐标，取值范围为0 - 1的浮点数。
    * - fWidthRatio：水印的大小比例，取值范围为0 - 1的浮点数。
    *
    * @param streamType 要设置水印的流类型(TRTCVideoStreamTypeBig、TRTCVideoStreamTypeSub)
    * @param srcData    水印图片源数据（传 NULL 表示去掉水印）
    * @param srcType    水印图片源数据类型（传 NULL 时忽略该参数）
    * @param nWidth     水印图片像素宽度（源数据为文件路径时忽略该参数）
    * @param nHeight    水印图片像素高度（源数据为文件路径时忽略该参数）
    * @param xOffset    水印显示的左上角 x 轴偏移
    * @param yOffset    水印显示的左上角 y 轴偏移
    * @param fWidthRatio 水印显示的宽度占画面宽度比例（水印按该参数等比例缩放显示）
    * @note 只支持主路视频流
    */
    virtual void setWaterMark(TRTCVideoStreamType streamType, const char* srcData, TRTCWaterMarkSrcType srcType, uint32_t nWidth, uint32_t nHeight, float xOffset, float yOffset, float fWidthRatio) = 0;

    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （八）屏幕共享相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 屏幕共享相关接口函数
    /// @{
    /**
    * 8.1 启动屏幕分享
    *
    * @param rendHwnd 承载预览画面的 HWND，可以设置为 nullptr，表示不显示屏幕分享的预览效果。
    * @param type 屏幕分享使用的线路，可以设置为主路（TRTCVideoStreamTypeBig）或者辅路（TRTCVideoStreamTypeSub），默认使用辅路。
    * @param params 屏幕分享的画面编码参数，可以设置为 nullptr，表示让 SDK 选择最佳的编码参数（分辨率、码率等）。
    *
    * @note 一个用户同时最多只能上传一条主路（TRTCVideoStreamTypeBig）画面和一条辅路（TRTCVideoStreamTypeSub）画面，
    * 默认情况下，屏幕分享使用辅路画面，如果使用主路画面，建议您提前停止摄像头采集（stopLocalPreview）避免相互冲突。
    */
    virtual void startScreenCapture(HWND rendHwnd, TRTCVideoStreamType type, TRTCVideoEncParam* params) = 0;
    
    /**
    * 8.2 停止屏幕采集
    */
    virtual void stopScreenCapture() = 0;
    
    /**
    * 8.3 暂停屏幕分享
    */
    virtual void pauseScreenCapture() = 0;

    /**
    * 8.4 恢复屏幕分享
    */
    virtual void resumeScreenCapture() = 0;

    /**
    * 8.5 枚举可分享的屏幕窗口，建议在 startScreenCapture 之前调用
    *
    * 如果您要给您的 App 增加屏幕分享功能，一般需要先显示一个窗口选择界面，这样用户可以选择希望分享的窗口。
    * 通过如下函数，您可以获得可分享窗口的 ID、类型、窗口名称以及缩略图。
    * 拿到这些信息后，您就可以实现一个窗口选择界面，当然，您也可以使用我们在 Demo 源码中已经实现好的一个界面。
    *
    * @note 返回的列表中包括屏幕和应用窗口，屏幕会在列表的前面几个元素中。
    * @note 如果 delete ITRTCScreenCaptureSourceList*指针会编译错误，SDK 维护 ITRTCScreenCaptureSourceList 对象的生命周期。
    *
    * @param thumbSize 指定要获取的窗口缩略图大小，缩略图可用于绘制在窗口选择界面上
    * @param iconSize  指定要获取的窗口图标大小
    *
    * @return 窗口列表包括屏幕
    */
    virtual ITRTCScreenCaptureSourceList* getScreenCaptureSources(const SIZE &thumbSize, const SIZE &iconSize) = 0;
 
    /**
    * 8.6 设置屏幕共享参数，该方法在屏幕共享过程中也可以调用
    *
    * 如果您期望在屏幕分享的过程中，切换想要分享的窗口，可以再次调用这个函数而不需要重新开启屏幕分享。
    *
    * 支持如下四种情况：
    * - 共享整个屏幕：sourceInfoList 中 type 为 Screen 的 source，captureRect 设为 { 0, 0, 0, 0 }
    * - 共享指定区域：sourceInfoList 中 type 为 Screen 的 source，captureRect 设为非 NULL，例如 { 100, 100, 300, 300 }
    * - 共享整个窗口：sourceInfoList 中 type 为 Window 的 source，captureRect 设为 { 0, 0, 0, 0 }
    * - 共享窗口区域：sourceInfoList 中 type 为 Window 的 source，captureRect 设为非 NULL，例如 { 100, 100, 300, 300 }
    *
    *
    * @param source            指定分享源
    * @param captureRect       指定捕获的区域
    * @param captureMouse      指定是否捕获鼠标指针
    * @param highlightWindow   指定是否高亮正在共享的窗口，以及当捕获图像被遮挡时高亮遮挡窗口提示用户移走遮挡
    *
    */
    virtual void selectScreenCaptureTarget(const TRTCScreenCaptureSourceInfo &source, const RECT& captureRect, bool captureMouse = true, bool highlightWindow = true) = 0;

    /**
    * 8.7 开始显示远端用户的辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）
    *
    * - startRemoteView() 用于显示主路画面（TRTCVideoStreamTypeBig，一般用于摄像头）。
    * - startRemoteSubStreamView() 用于显示辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）。
    *
    * @param userId  对方的用户标识
    * @param rendHwnd 渲染画面的 HWND
    * @note 请在 onUserSubStreamAvailable 回调后再调用这个接口。
    */
    virtual void startRemoteSubStreamView(const char* userId, HWND rendHwnd) = 0;

    /**
    * 8.8 停止显示远端用户的辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）。
    * @param userId 对方的用户标识
    */
    virtual void stopRemoteSubStreamView(const char* userId) = 0;

    /**
    * 8.9 设置辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）的显示模式
    * - setRemoteViewFillMode() 用于设置远端主路画面（TRTCVideoStreamTypeBig，一般用于摄像头）的显示模式。
    * - setRemoteSubStreamViewFillMode() 用于设置远端辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）的显示模式。
    *
    * @param userId 用户的 ID
    * @param mode 填充（画面可能会被拉伸裁剪）或适应（画面可能会有黑边），默认值：TRTCVideoFillMode_Fit
    */
    virtual void setRemoteSubStreamViewFillMode(const char* userId, TRTCVideoFillMode mode) = 0;

    /**
    * 8.10 设置辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）的顺时针旋转角度
    * - setRemoteViewRotation() 用于设置远端主路画面（TRTCVideoStreamTypeBig，一般用于摄像头）的旋转角度。
    * - setRemoteSubStreamViewRotation() 用于设置远端辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）的旋转角度。
    *
    * @param userId 用户 ID
    * @param rotation 支持90、180、270旋转角度
    */
    virtual void setRemoteSubStreamViewRotation(const char* userId, TRTCVideoRotation rotation) = 0;

    /**
    * 8.11 设置屏幕分享的编码器参数
    * - setVideoEncoderParam() 用于设置远端主路画面（TRTCVideoStreamTypeBig，一般用于摄像头）的编码参数。
    * - setSubStreamEncoderParam() 用于设置远端辅路画面（TRTCVideoStreamTypeSub，一般用于屏幕分享）的编码参数。
    * 该设置决定远端用户看到的画面质量，同时也是云端录制出的视频文件的画面质量。
    *
    * @param params 辅流编码参数，详情请参考 TRTCCloudDef.h 中的 TRTCVideoEncParam 定义
    * @note 即使使用主路传输屏幕分享的数据（在调用 startScreenCapture 时设置 type=TRTCVideoStreamTypeBig），依然要使用此接口更新屏幕分享的编码参数。
    */
    virtual void setSubStreamEncoderParam(const TRTCVideoEncParam& params) = 0;

    /**
    * 8.12 设置屏幕分享的混音音量大小
    *
    * 这个数值越高，屏幕分享音量的占比就越高，麦克风音量占比就越小，所以不推荐设置得太大，否则麦克风的声音就被压制了。
    *
    * @param volume 设置的混音音量大小，范围0 - 100
    */
    virtual void setSubStreamMixVolume(uint32_t volume) = 0;

    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （九）自定义采集和渲染
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 自定义采集和渲染
    /// @{

    /**
    * 9.1 启用视频自定义采集模式
    *
    * 开启该模式后，SDK 不在运行原有的视频采集流程，只保留编码和发送能力。
    * 您需要用 sendCustomVideoData() 不断地向 SDK 塞入自己采集的视频画面。
    *
    * @param enable 是否启用，默认值：false
    */
    virtual void enableCustomVideoCapture(bool enable) = 0;

    /**
    * 9.2 向 SDK 投送自己采集的视频数据
    *
    * TRTCVideoFrame 推荐如下填写方式（其他字段不需要填写）：
    * - pixelFormat：仅支持 LiteAVVideoPixelFormat_I420。
    * - bufferType：仅支持 LiteAVVideoBufferType_Buffer。
    * - data：视频帧 buffer。
    * - length：视频帧数据长度，I420 格式下，其值等于：width × height × 3 / 2。
    * - width：视频图像长度。
    * - height：视频图像宽度。
    * - timestamp：如果 timestamp 间隔不均匀，会严重影响音画同步和录制出的 MP4 质量。
    *
    * 参考文档：[自定义采集和渲染](https://cloud.tencent.com/document/product/647/34066)。
    *
    * @param frame 视频数据，支持 I420 格式数据。
    * @note - SDK 内部有帧率控制逻辑，目标帧率以您在 setVideoEncoderParam 中设置的为准，太快会自动丢帧，太慢则会自动补帧。
    * @note - 可以设置 frame 中的 timestamp 为 0，相当于让 SDK 自己设置时间戳，但请“均匀”地控制 sendCustomVideoData 的调用间隔，否则会导致视频帧率不稳定。
    */
    virtual void sendCustomVideoData(TRTCVideoFrame* frame) = 0;

    /**
    * 9.3 启用音频自定义采集模式
    * 开启该模式后，SDK 停止运行原有的音频采集流程，只保留编码和发送能力。
    * 您需要用 sendCustomAudioData() 不断地向 SDK 塞入自己采集的音频数据。
    *
    * @param enable 是否启用，默认值：false
    */
    virtual void enableCustomAudioCapture(bool enable) = 0;

    /**
    * 9.4 向 SDK 投送自己采集的音频数据
    *
    * TRTCAudioFrame 推荐如下填写方式（其他字段不需要填写）：
    * - audioFormat：仅支持 LiteAVAudioFrameFormatPCM。
    * - data：音频帧 buffer。
    * - length：音频帧数据长度，推荐每帧20ms采样数。【PCM格式、48000采样率、单声道的帧长度：48000 × 0.02s × 1 × 16bit = 15360bit = 1920字节】。
    * - sampleRate：采样率，仅支持48000。
    * - channel：频道数量（如果是立体声，数据是交叉的），单声道：1； 双声道：2。
    * - timestamp：如果 timestamp 间隔不均匀，会严重影响音画同步和录制出的 MP4 质量。
    *
    * 参考文档：[自定义采集和渲染](https://cloud.tencent.com/document/product/647/34066)。
    *
    * @param frame 音频帧，仅支持 LiteAVAudioFrameFormatPCM 格式。目前只支持单声道，仅支持48K采样率，LiteAVAudioFrameFormatPCM 格式。
    * @note 可以设置 frame 中的 timestamp 为 0，相当于让 SDK 自己设置时间戳，但请“均匀”地控制 sendCustomAudioData 的调用间隔，否则会导致声音断断续续。
    */
    virtual void sendCustomAudioData(TRTCAudioFrame* frame) = 0;

    /**
    * 9.5 设置本地视频自定义渲染
    *
    * @note              设置此方法，SDK 内部会把采集到的数据回调出来，SDK 跳过 HWND 渲染逻辑
                         调用 setLocalVideoRenderCallback(TRTCVideoPixelFormat_Unknown, TRTCVideoBufferType_Unknown, nullptr) 停止回调
    * @param pixelFormat 指定回调的像素格式
    * @param bufferType  指定视频数据结构类型
    * @param callback    自定义渲染回调
    * @return 0：成功；<0：错误
    */
    virtual int setLocalVideoRenderCallback(TRTCVideoPixelFormat pixelFormat, TRTCVideoBufferType bufferType, ITRTCVideoRenderCallback* callback) = 0;

    /**
    * 9.6 设置远端视频自定义渲染
    *
    * 此方法同 setLocalVideoRenderDelegate，区别在于一个是本地画面的渲染回调， 一个是远程画面的渲染回调。
    *
    * @note              设置此方法，SDK 内部会把远端的数据解码后回调出来，SDK 跳过 HWND 渲染逻辑
                         调用 setRemoteVideoRenderCallback(userId, TRTCVideoPixelFormat_Unknown,  TRTCVideoBufferType_Unknown, nullptr) 停止回调。
    * @param userId      用户标识
    * @param pixelFormat 指定回调的像素格式
    * @param bufferType  指定视频数据结构类型
    * @param callback    自定义渲染回调
    * @return 0：成功；<0：错误
    */
    virtual int setRemoteVideoRenderCallback(const char* userId, TRTCVideoPixelFormat pixelFormat, TRTCVideoBufferType bufferType, ITRTCVideoRenderCallback* callback) = 0;

    /**
    * 9.7 设置音频数据回调
    *
    * 设置此方法，SDK 内部会把声音模块的数据（PCM 格式）回调出来，包括：
    * - onCapturedAudioFrame：本机麦克风采集到的音频数据
    * - onPlayAudioFrame：混音前的每一路远程用户的音频数据
    * - onMixedPlayAudioFrame：各路音频数据混合后送入扬声器播放的音频数据
    *
    * @param callback  声音帧数据（PCM 格式）的回调，callback = nullptr 则停止回调数据
    * @return 0：成功；<0：错误
    */
    virtual int setAudioFrameCallback(ITRTCAudioFrameCallback* callback) = 0;

    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （十）自定义消息发送
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 自定义消息发送
    /// @{
    /**
    * 10.1 发送自定义消息给房间内所有用户
    *
    * 该接口可以借助音视频数据通道向当前房间里的其他用户广播您自定义的数据，但因为复用了音视频数据通道，
    * 请务必严格控制自定义消息的发送频率和消息体的大小，否则会影响音视频数据的质量控制逻辑，造成不确定性的问题。
    *
    * @param cmdId    消息 ID，取值范围为1 - 10
    * @param data     待发送的消息，最大支持1KB（1000字节）的数据大小
    * @param dataSize 待发送的数据大小
    * @param reliable 是否可靠发送，可靠发送的代价是会引入一定的延时，因为接收端要暂存一段时间的数据来等待重传
    * @param ordered  是否要求有序，即是否要求接收端接收的数据顺序和发送端发送的顺序一致，这会带来一定的接收延时，因为在接收端需要暂存并排序这些消息
    * @return true：消息已经发出；false：消息发送失败
    *
    * @note 本接口有以下限制：
    *       - 发送消息到房间内所有用户，每秒最多能发送30条消息。
    *       - 每个包最大为1KB，超过则很有可能会被中间路由器或者服务器丢弃。
    *       - 每个客户端每秒最多能发送总计8KB数据。
    *       - 将 reliable 和 ordered 同时设置为 true 或 false，暂不支持交叉设置。
    *       - 强烈建议不同类型的消息使用不同的 cmdID，这样可以在要求有序的情况下减小消息时延。
    */
    virtual bool sendCustomCmdMsg(uint32_t cmdId, const uint8_t* data, uint32_t dataSize, bool reliable, bool ordered) = 0;

    /**
    * 10.2 将小数据量的自定义数据嵌入视频帧中
    *
    * 跟 sendCustomCmdMsg 的原理不同，sendSEIMsg 是将数据直接塞入视频数据头中。因此，即使视频帧被旁路到了直播 CDN 上，
    * 这些数据也会一直存在。但是由于要把数据嵌入视频帧中，所以数据本身不能太大，推荐几个字节就好。
    *
    * 最常见的用法是把自定义的时间戳（timstamp）用 sendSEIMsg 嵌入视频帧中，这种方案的最大好处就是可以实现消息和画面的完美对齐。
    *
    * @param data          待发送的数据，最大支持1kb（1000字节）的数据大小
    * @param dataSize      待发送的数据大小
    * @param repeatCount   发送数据次数
    * @return true：消息已通过限制，等待后续视频帧发送；false:消息被限制发送
    *
    * @note 本接口有以下限制：
    *       - 数据在接口调用完后不会被即时发送出去，而是从下一帧视频帧开始带在视频帧中发送。
    *       - 发送消息到房间内所有用户，每秒最多能发送30条消息（与 sendCustomCmdMsg 共享限制）。
    *       - 每个包最大为1KB，若发送大量数据，会导致视频码率增大，可能导致视频画质下降甚至卡顿（与 sendCustomCmdMsg 共享限制）。
    *       - 每个客户端每秒最多能发送总计8KB数据（与 sendCustomCmdMsg 共享限制）。
    *       - 若指定多次发送（repeatCount>1），则数据会被带在后续的连续 repeatCount 个视频帧中发送出去，同样会导致视频码率增大。
    *       - 如果 repeatCount>1，多次发送，接收消息 onRecvSEIMsg 回调也可能会收到多次相同的消息，需要去重。
    */
    virtual bool sendSEIMsg(const uint8_t* data, uint32_t dataSize, int32_t repeatCount) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （十一）背景混音相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 背景混音相关接口函数
    /// @{
    /**
    * 11.1 启动播放背景音乐
    *
    * @param path 音乐文件路径，支持的文件格式：aac, mp3。
    */
    virtual void playBGM(const char* path) = 0;

    /**
    * 11.2 停止播放背景音乐
    */
    virtual void stopBGM() = 0;

    /**
    * 11.3 暂停播放背景音乐
    */
    virtual void pauseBGM() = 0;

    /**
    * 11.4 继续播放背景音乐
    */
    virtual void resumeBGM() = 0;

    /**
    * 11.5 获取音乐文件总时长，单位毫秒
    *
    * @param path 音乐文件路径，如果 path 为空，那么返回当前正在播放的 music 时长
    * @return     成功返回时长，失败返回-1
    */
    virtual uint32_t getBGMDuration(const char* path) = 0;

    /**
    * 11.6 设置 BGM 播放进度
    *
    * @param pos 单位毫秒
    */
    virtual void setBGMPosition(uint32_t pos) = 0;

    /**
    * 11.7 设置背景音乐播放音量的大小
    *
    * 播放背景音乐混音时使用，用来控制背景音乐播放音量的大小，
    * 该接口会同时控制远端播放音量的大小和本地播放音量的大小，
    * 因此调用该接口后，setBGMPlayoutVolume和setBGMPublishVolume设置的音量值会被覆盖
    *
    * @param volume 音量大小，100为正常音量，取值范围为0 - 100；默认值：100
    */
    virtual void setBGMVolume(uint32_t volume) = 0;

    /**
    * 11.8 设置背景音乐本地播放音量的大小
    *
    * 播放背景音乐混音时使用，用来控制背景音乐在本地播放时的音量大小。
    *
    * @param volume 音量大小，100为正常音量，取值范围为0 - 100；默认值：100
    */
    virtual void setBGMPlayoutVolume(uint32_t volume) = 0;

    /**
    * 11.9 设置背景音乐远端播放音量的大小
    *
    * 播放背景音乐混音时使用，用来控制背景音乐在远端播放时的音量大小。
    *
    * @param volume 音量大小，100为正常音量，取值范围为0 - 100；默认值：100
    */
    virtual void setBGMPublishVolume(uint32_t volume) = 0;

#ifndef _WIN64
    /**
    * 11.10 打开系统声音采集（64位 SDK 尚不支持系统混音能力）
    *
    * 开启后可以采集整个操作系统的播放声音（path 为空）或某一个播放器（path 不为空）的声音，
    * 并将其混入到当前麦克风采集的声音中一起发送到云端。
    *
    * @param path
    *    - path 为空，代表采集整个操作系统的声音。
    *    - path 填写 exe 程序（如 QQ音乐）所在的路径，将会启动此程序并只采集此程序的声音。
    *
    */
    virtual void startSystemAudioLoopback(const char* path = nullptr) = 0;

    /**
    * 11.11 关闭系统声音采集。
    */
    virtual void stopSystemAudioLoopback() = 0;

    /**
    * 11.12 设置系统声音采集的音量。
    *
    * @param volume 音量大小，取值范围为0 - 100。
    */
    virtual void setSystemAudioLoopbackVolume(uint32_t volume) = 0;
#endif
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （十二）音效相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 音效相关接口函数
    /// @{
    /**
    * 12.1 播放音效
    *
    * 每个音效都需要您指定具体的 ID，您可以通过该 ID 对音效的开始、停止、音量等进行设置。
    * 支持的文件格式：aac, mp3。
    *
    * @note 若您想同时播放多个音效，请分配不同的 ID 进行播放。因为使用同一个 ID 播放不同音效，SDK 将会停止上一个 ID 对应的音效播放，再启动新的音效播放。
    *
    * @param effect 音效
    */
    virtual void playAudioEffect(TRTCAudioEffectParam* effect) = 0;

    /**
    * 12.2 设置音效音量
    *
    * @note 会覆盖通过 setAllAudioEffectsVolume 指定的整体音效音量。
    *
    * @param effectId 音效 ID
    * @param volume   音量大小，取值范围为0 - 100；默认值：100
    */
    virtual void setAudioEffectVolume(int effectId, int volume) = 0;

    /**
    * 12.3 停止音效
    *
    * @param effectId 音效 ID
    */
    virtual void stopAudioEffect(int effectId) = 0;

    /**
    * 12.4 停止所有音效
    */
    virtual void stopAllAudioEffects() = 0;

    /**
    * 12.5 设置所有音效的音量
    *
    * @note 该操作会覆盖通过 setAudioEffectVolume 指定的单独音效音量。
    *
    * @param volume 音量大小，取值范围为0 - 100；默认值：100
    */
    virtual void setAllAudioEffectsVolume(int volume) = 0;

    /**
    * 12.6 暂停音效
    *
    * @param effectId 音效 Id
    */
    virtual void pauseAudioEffect(int effectId) = 0;

    /**
    * 12.7 恢复音效
    *
    * @param effectId 音效 Id
    */
    virtual void resumeAudioEffect(int effectId) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （十三）设备和网络测试
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 设备和网络测试
    /// @{
    /**
    * 13.1 开始进行网络测速（视频通话期间请勿测试，以免影响通话质量）
    *
    * 测速结果将会用于优化 SDK 接下来的服务器选择策略，因此推荐您在用户首次通话前先进行一次测速，这将有助于我们选择最佳的服务器。
    * 同时，如果测试结果非常不理想，您可以通过醒目的 UI 提示用户选择更好的网络。
    *
    * @note 测速本身会消耗一定的流量，所以也会产生少量额外的流量费用。
    *
    * @param sdkAppId 应用标识
    * @param userId 用户标识
    * @param userSig 用户签名
    */
    virtual void startSpeedTest(uint32_t sdkAppId, const char* userId, const char* userSig) = 0;

    /**
    * 13.2 停止网络测速
    */
    virtual void stopSpeedTest() = 0;

    /**
    * 13.3 开始进行摄像头测试
    *
    * 会触发 onFirstVideoFrame 回调接口
    *
    * @note 在测试过程中可以使用 setCurrentCameraDevice 接口切换摄像头。
    * @param rendHwnd 承载预览画面的 HWND
    */
    virtual void startCameraDeviceTest(HWND rendHwnd) = 0;

    /**
    * 13.4 停止摄像头测试
    */
    virtual void stopCameraDeviceTest() = 0;

    /**
    * 13.5 开启麦克风测试
    *
    * 回调接口 onTestMicVolume 获取测试数据
    *
    * 该方法测试麦克风是否能正常工作，volume 的取值范围为0 - 100。
    *
    * @param interval 反馈音量提示的时间间隔（ms），建议设置到大于 200 毫秒
    */
    virtual void startMicDeviceTest(uint32_t interval) = 0;

    /**
    * 13.6 停止麦克风测试
    */
    virtual void stopMicDeviceTest() = 0;

    /**
    * 13.7 开启扬声器测试
    *
    * 回调接口 onTestSpeakerVolume 获取测试数据
    *
    * 该方法播放指定的音频文件测试播放设备是否能正常工作。如果能听到声音，说明播放设备能正常工作。
    *
    * @param testAudioFilePath 音频文件的绝对路径，路径字符串使用 UTF-8 编码格式，支持文件格式：WAV、MP3
    */
    virtual void startSpeakerDeviceTest(const char* testAudioFilePath) = 0;

    /**
    * 13.8 停止扬声器测试
    */
    virtual void stopSpeakerDeviceTest() = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （十四）LOG 相关接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name LOG 相关接口函数
    /// @{
    /**
    * 14.1 获取 SDK 版本信息
    *
    * @return UTF-8 编码的版本号。
    */
    virtual const char* getSDKVersion() = 0;

    /**
    * 14.2 设置 Log 输出级别
    *
    * @param level 参见 TRTCLogLevel，默认值：TRTCLogLevelNone
    */
    virtual void setLogLevel(TRTCLogLevel level) = 0;

    /**
    * 14.3 启用或禁用控制台日志打印
    *
    * @param enabled 指定是否启用，默认为禁止状态
    */
    virtual void setConsoleEnabled(bool enabled) = 0;

    /**
    * 14.4 启用或禁用 Log 的本地压缩
    *
    *  开启压缩后，Log 存储体积明显减小，但需要腾讯云提供的 Python 脚本解压后才能阅读。
    *  禁用压缩后，Log 采用明文存储，可以直接用记事本打开阅读，但占用空间较大。
    *
    * @param enabled 指定是否启用，默认为禁止状态
    */
    virtual void setLogCompressEnabled(bool enabled) = 0;

    /**
    * 14.5 设置日志保存路径
    *
    * @note 日志文件默认保存在 C:/Users/[系统用户名]/AppData/Roaming/Tencent/liteav/log，即 %appdata%/Tencent/liteav/log 下，如需修改，必须在所有方法前调用。
    * @param path 存储日志的文件夹，例如 "D:\\Log"，UTF-8 编码
    */
    virtual void setLogDirPath(const char* path) = 0;

    /**
    * 14.6 设置日志回调
    *
    * @param callback 日志回调
    */
    virtual void setLogCallback(ITRTCLogCallback* callback) = 0;

    /**
    * 14.7 显示仪表盘
    *
    * 仪表盘是状态统计和事件消息浮层 view，方便调试。
    *
    * @param showType 0：不显示；1：显示精简版；2：显示全量版，默认为不显示
    */
    virtual void showDebugView(int showType) = 0;

    /**
    * 14.8 调用实验性 API 接口
    *
    * @note 该接口用于调用一些实验性功能
    * @param jsonStr 接口及参数描述的 JSON 字符串
    */
    virtual void callExperimentalAPI(const char *jsonStr) = 0;
    /// @}

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （十五） 弃用接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    /// @name 弃用接口函数
    /// @{

    /**
    * 15.1 设置麦克风的音量大小
    *
    * @deprecated 从 v6.9 版本开始废弃
    * @note 使用 setAudioCaptureVolume 接口替代。 
    */
    virtual __declspec(deprecated("warning :setMicVolumeOnMixing is deprecated, use setAudioCaptureVolume instead.")) \
        void setMicVolumeOnMixing(uint32_t volume) {};
    
    /**
    * 15.2 启动屏幕分享
    *
    * @deprecated 从 v7.2 版本开始废弃
    * @note 使用 startScreenCapture(HWND rendHwnd, TRTCVideoStreamType type, TRTCVideoEncParam* params) 接口替代。
    */
    virtual __declspec(deprecated("warning :startScreenCapture(HWND rendHwnd) is deprecated, \
                                  use startScreenCapture(HWND rendHwnd, TRTCVideoStreamType type, TRTCVideoEncParam* params) instead.")) \
        void startScreenCapture(HWND rendHwnd) {};
    /// @}
};
/// @}

#endif /* __ITRTCCLOUD_H__ */
