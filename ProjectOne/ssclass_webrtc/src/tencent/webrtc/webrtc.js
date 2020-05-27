// 总体：https://cloud.tencent.com/document/product/647/16863 (设备要求，防火墙)
// 版本：https://cloud.tencent.com/document/product/647/38958
// 代码：https://trtc-1252463788.file.myqcloud.com/web/docs/TRTC.html
// 云端混流：https://cloud.tencent.com/document/product/647/16827
// 转码收费：https://cloud.tencent.com/document/product/267/34175#.E7.9B.B4.E6.92.AD.E8.BD.AC.E7.A0.81
// Electron: https://www.npmjs.com/package/trtc-electron-sdk
// Electron: https://cloud.tencent.com/document/product/647/38549

import Constant from '@/constant/constant'
import TRTC from 'trtc-js-sdk'
import Vue from 'vue'

class WebRTC {
  constructor() {
    this.rtcClient = null
    this.screenClient = null

    this.localStream = null
    this.screenStream = null

    this.role = ''
    this.isJoined = false
    this.isPublished = false
    this.isScreenShare = false

    this.hasTeacher = false

    this.rtcStats = {
      rtt: 0,
      bytesSent: 0,
      packetsSent: 0,
      bytesReceived: 0,
      packetsReceived: 0,
      packetsLost: 0,
    }
  }

  /**
   * 是否支持屏幕分享
   */
  isSupportScreenShare() {
    return TRTC.isScreenShareSupported()
  }

  /**
   * 获得摄像头
   */
  getCameras(callback) {
    let promise = TRTC.getCameras()
    return promise.then(function (res) { // 创建成功
      callback && callback({
        code: 0,
        cameras: res
      })
    })
  }

  /**
   * 获得麦克风
   */
  getMicrophones(callback) {
    let promise = TRTC.getMicrophones()
    return promise.then(function (res) { // 创建成功
      callback && callback({
        code: 0,
        microphones: res
      })
    })
  }

  /**
   * 获得扬声器
   */
  getSpeakers(callback) {
    let promise = TRTC.getSpeakers()
    return promise.then(function (res) { // 创建成功
      callback && callback({
        code: 0,
        speakers: res
      })
    })
  }

  /**
   * 初始化
   * 
   * https://trtc-1252463788.file.myqcloud.com/web/docs/TRTC.Logger.html
   * https://trtc-1252463788.file.myqcloud.com/web/docs/TRTC.Logger.html#.LogLevel
   */
  init() {
    // 输出INFO以上日志等级
    TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.INFO);

    // webrtc 配置
    this.rtcOption = window.store.getters.rtcOption

    this.role = Constant.RoleType.Anchor

    // 角色，万人直播的时候才区分角色，视频通话都是 主播
    // if (this.rtcOption.liveScene === Constant.LiveScene.Live) {
    //   this.role = window.store.state.userType === 0 ? Constant.RoleType.Anchor : Constant.RoleType.Audience
    // } else {
    //   this.role = Constant.RoleType.Anchor
    // }
  }

  /**
   * 加入房间
   * 
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#join
   * 视频通话：https://cloud.tencent.com/document/product/647/32225
   * 万人直播：https://cloud.tencent.com/document/product/647/38751
   */
  async joinRoom(callback) {
    if (this.isJoined) {
      console.warn('duplicate RtcClient.join() observed')
      return
    }

    // 获得实例
    this.rtcClient = TRTC.createClient({
      sdkAppId: this.rtcOption.sdkAppID,
      userId: this.rtcOption.userID,
      userSig: this.rtcOption.userSig,
      mode: this.rtcOption.liveScene
    })

    // 处理 client 事件
    this.handleEvent()

    try {
      // 加入房间
      await this.rtcClient.join({
        roomId: this.rtcOption.liveID,
        role: this.role
      })

      //加入房间
      this.isJoined = true

      callback && callback({
        code: 0
      })
    } catch (error) {
      callback && callback({
        code: -1,
        desc: error.ErrorInfo
      })
    }
  }

  /**
   * 处理 事件
   */
  handleEvent() {
    // 处理 client 错误事件，错误均为不可恢复错误，建议提示用户后刷新页面
    this.rtcClient.on('error', err => {
      // window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.disconnected'))
      console.error('rtcClient Error:', err)
    })

    // 处理用户被踢事件，通常是因为房间内有同名用户引起，这种问题一般是应用层逻辑错误引起的
    // 应用层请尽量使用不同用户ID进房
    this.rtcClient.on('client-banned', err => {
      console.error('client has been banned for ' + err)
      // location.reload()
    })

    // 远端用户进房通知 - 仅限主动推流用户
    this.rtcClient.on('peer-join', event => {
      const userId = event.userId
      console.log('peer-join ' + userId)
    })

    // 远端用户退房通知 - 仅限主动推流用户
    this.rtcClient.on('peer-leave', event => {
      const userId = event.userId
      console.log('peer-leave ' + userId)
    })

    // 处理远端流增加事件
    this.rtcClient.on('stream-added', event => {
      const remoteStream = event.stream
      const id = remoteStream.getId()
      const remoteUserId = remoteStream.getUserId()

      // 远端流默认已订阅所有音视频，此处可指定只订阅音频或者音视频，不能仅订阅视频。
      // 如果不想观看该路远端流，可调用 this.rtcClient.unsubscribe(remoteStream) 取消订阅

      // 如果是屏幕分享
      if (remoteUserId === this.rtcOption.screenID) {
        // 取消订阅自己的屏幕分享流
        this.rtcClient.unsubscribe(remoteStream)
      } else {
        var teacher = window.store.state.teacher
        if (teacher && teacher.userID === remoteUserId) {
          // 老师视频
          this.hasTeacher = true
        }

        // 订阅其他一般远端流
        this.rtcClient.subscribe(remoteStream)
      }
    })

    // 远端流订阅成功事件
    this.rtcClient.on('stream-subscribed', event => {
      const remoteStream = event.stream
      const id = remoteStream.getId()
      const remoteUserId = remoteStream.getUserId()

      // 如果是老师
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === remoteUserId) {
        // 老师视频
        this.hasTeacher = true
        // 播放视频
        window.func.streamPlay(remoteStream, 'teacherVideo')
        // 直播状态(老师进来了，就是开始了)
        window.store.commit('setLiveState', Constant.LiveState.Living)
      } else {
        // 屏幕分享
        if (window.utils.right(remoteUserId, 7) === '_screen') {
          this.isScreenShare = true

          window.store.commit('setIsScreenShare', this.isScreenShare)
          window.func.streamPlay(remoteStream, 'screenShareVideo', {
            objectFit: 'contain'
          })
        } else {
          // 添加其他
          window.func.addMemberStream(id, remoteUserId, remoteStream)
        }
      }
    })

    // 处理远端流被删除事件
    this.rtcClient.on('stream-removed', event => {
      const remoteStream = event.stream
      const id = remoteStream.getId()
      const remoteUserId = remoteStream.getUserId()

      // 关闭远端流内部的音视频播放器
      remoteStream.stop()

      // 如果是老师
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === remoteUserId) {
        // 移除老师视频流
        this.hasTeacher = false
        // 老师 音视频状态
        window.store.commit('setTeacherHasAudio', null)
        window.store.commit('setTeacherHasVideo', null)
      } else {
        if (window.utils.right(remoteUserId, 7) === '_screen') { // 屏幕分享
          this.isScreenShare = false
          window.store.commit('setIsScreenShare', this.isScreenShare)
          window.message.notify(new Vue(), 'info', window.i18n.t('webrtc.screenShareIsClosed'))
        } else {
          // 其他人
          window.func.removeMemberSteam(remoteUserId)
        }
      }

      console.log(`stream-removed ID: ${id}  type: ${remoteStream.getType()}`)
    })

    // 处理远端流更新事件，在音视频通话过程中，远端流音频或视频可能会有更新
    this.rtcClient.on('stream-updated', event => {
      const remoteStream = event.stream
      const remoteUserId = remoteStream.getUserId()

      // 如果是老师
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === remoteUserId) {
        // hasVideo 此时才有数据
        window.store.commit('setTeacherHasAudio', window.utils.convert2Boolean(remoteStream.hasAudio()))
        window.store.commit('setTeacherHasVideo', window.utils.convert2Boolean(remoteStream.hasVideo()))
      } else {
        window.func.setMemberVideoStream(remoteUserId, remoteStream)
      }
    })

    // 远端流音视频mute状态通知（本地不通知）
    this.rtcClient.on('mute-audio', event => {
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === event.userId) { // 如果是老师
        window.store.commit('setTeacherHasAudio', false)
      } else {
        window.func.setMemberAudioState(event.userId, false) // 其他成员
      }
    })

    this.rtcClient.on('unmute-audio', event => {
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === event.userId) { // 如果是老师
        window.store.commit('setTeacherHasAudio', true)
      } else {
        window.func.setMemberAudioState(event.userId, true) // 其他成员
      }
    })

    this.rtcClient.on('mute-video', event => {
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === event.userId) { // 如果是老师
        window.store.commit('setTeacherHasVideo', 0)
      } else {
        window.func.setMemberVideoState(event.userId, false) // 其他成员
      }
    })

    this.rtcClient.on('unmute-video', event => {
      var teacher = window.store.state.teacher
      if (teacher && teacher.userID === event.userId) { // 如果是老师
        window.store.commit('setTeacherHasVideo', 1)
      } else {
        window.func.setMemberVideoState(event.userId, true) // 其他成员
      }
    })

    // 信令通道连接状态通知
    this.rtcClient.on('connection-state-changed', event => {
      console.log(`RtcClient state changed to ${event.state} from ${event.prevState}`)
    })
  }

  /**
   * 有本地流
   */
  hasLocalStream() {
    if (this.localStream && this.isPublished) {
      return true
    }
    return false
  }

  /**
   * 重新创建视频流
   */
  async reCreateLocalStream() {
    if (this.localStream) {
      await this.stopLocalStream()
    }

    await this.createLocalStream()
  }

  /**
   * 创建本地视频流
   * 
   * https://trtc-1252463788.file.myqcloud.com/web/docs/TRTC.html#.createStream
   * https://trtc-1252463788.file.myqcloud.com/web/docs/LocalStream.html#setVideoProfile
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#publish
   * https://trtc-1252463788.file.myqcloud.com/web/docs/LocalStream.html
   */
  async createLocalStream() {
    if (!this.isJoined) {
      console.error('请先加入房间再点击开始推流！')
      return
    }

    if (this.isPublished) {
      console.error('当前正在推流！')
      return
    }

    var clientType = window.store.state.clientType
    var openAudio = window.store.state.openAudio
    var openVideo = window.store.state.openVideo
    var microphoneId = window.store.state.microphoneID
    var cameraId = window.store.state.cameraID

    var streamOption = {
      audio: openAudio,
      video: openVideo
    }

    // 是否打开音频
    if (openAudio && !window.utils.strIsNull(microphoneId)) {
      streamOption.microphoneId = microphoneId
    }

    // 是否打开视频
    if (openVideo && !window.utils.strIsNull(cameraId)) {
      if (clientType === Constant.ClientType.Mobile) {
        streamOption.facingMode = cameraId
      } else {
        streamOption.cameraId = cameraId
      }
    }

    // 切换为主播权限
    // if (this.role === Constant.RoleType.Audience) {
    //   await this.switchRole(Constant.RoleType.Anchor)
    // }

    // 创建视频
    this.localStream = await TRTC.createStream(streamOption)
    // 推流
    await this.localStream.initialize().then(() => {
      // 添加视频
      var userType = window.store.state.userType
      if (userType === 0) {
        window.func.streamPlay(this.localStream, 'teacherVideo')
      } else {
        window.func.addMemberStream(this.localStream.getId(), window.store.state.userID, this.localStream)
      }

      // 本地状态改变
      this.localStream.on('player-state-changed', event => {
        console.log(`local stream ${event.type} player is ${event.state}`)
      })

      // 设置视频分辨率帧率和码率
      this.localStream.setVideoProfile(this.rtcOption.videoProfile)

      // 音频码率
      this.localStream.setAudioProfile('standard')

      // 发布本地流
      this.rtcClient.publish(this.localStream).then(() => {
        if (window.store.state.userType != 0) {
          // 申请成功了
          if (window.store.state.requesltType != Constant.LiveCommand.RequestNone) {
            window.store.commit('setRequestType', Constant.LiveCommand.RequestNone)
          }
        }

        // 本地是否有音视频
        var hasAudio = window.utils.convert2Boolean(this.localStream.hasAudio())
        var hasVideo = window.utils.convert2Boolean(this.localStream.hasVideo())
        // 本地音视频状态
        window.store.commit('setHasAudio', hasAudio)
        window.store.commit('setHasVideo', hasVideo)

        this.isPublished = true
      }).catch(error => {
        console.error('发布视频失败 -', error)
      })
    }).catch(error => {
      console.info('initialize error ', error)
      // 本地流初始化失败
      switch (error.name) {
        case 'NotFoundError':
          // 找不到满足请求参数的媒体类型（包括：音频、视频、屏幕分享）。例如：PC 没有摄像头，但是请求浏览器获取视频流，则会报此错误。
          // 建议在通话开始前引导用户检查通话所需的摄像头或麦克风等外设，若没有摄像头且需要进行语音通话，可在 TRTC.createStream({ audio: true, video: false }) 指明仅采集麦克风。
          window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.NotFoundError'))
          break
        case 'NotReadableError':
          // 提示用户：暂时无法访问摄像头/麦克风，请确保当前没有其他应用请求访问摄像头/麦克风，并重试。
          window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.NotReadableError'))
          break
        case 'NotAllowedError':
          // 用户拒绝了当前的浏览器实例的访问音频、视频、屏幕分享请求。	提示用户: 不授权摄像头/麦克风访问无法进行音视频通话
          window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.NotAllowedError'))
          break
        case 'OverConstrainedError':
          // cameraId/microphoneId 参数的值无效
          // 确保 cameraId/microphoneId 传值正确且有效
          window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.OverConstrainedError'))
          break
        case 'AbortError':
          // 由于某些未知原因导致设备无法被使用	
          window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.AbortError'))
          break
        default:
          break
      }
    })
  }

  /**
   * 停止本地视频
   */
  async stopLocalStream() {
    if (!this.isJoined) {
      console.error('请先加入房间再停止推流！')
      return
    }
    if (!this.isPublished) {
      console.error('当前尚未发布本地流！')
      this.removeLocalStream()
      return
    }

    try {
      // 停止发布本地流
      await this.rtcClient.unpublish(this.localStream).then(() => {
        // 如果是老师
        if (this.userType === 0) {
          this.hasTeacher = false
        } else {
          window.func.removeMemberSteam(window.store.state.userID)
        }

        this.removeLocalStream()

        window.store.commit('setHasAudio', null)
        window.store.commit('setHasVideo', null)

        this.isPublished = false
        console.info('停止发布本地流成功！')
      })
    } catch (error) {
      console.error('停止发布本地流失败！', error)
    }

    // 切换为观众权限
    // if (this.role === Constant.RoleType.Anchor) {
    //   await this.switchRole(Constant.RoleType.Audience)
    // }
  }

  /**
   * 移除本地视频
   */
  removeLocalStream() {
    this.localStream && this.localStream.close()
    this.localStream = null
  }

  /**
   * 网络监控
   */
  async getRtcStats() {
    var oldStats = this.rtcStats

    this.rtcStats = {
      rtt: 0,
      bytesSent: 0,
      packetsSent: 0,
      bytesReceived: 0,
      packetsReceived: 0,
      packetsLost: 0,
    }

    await this.getTransportStats()
    await this.getLocalAudioStats()
    await this.getLocalVideoStats()
    await this.getRemoteAudioStats()
    await this.getRemoteVideoStats()

    window.store.commit('setRtcStats', {
      rtt: this.rtcStats.rtt,
      bytesSent: this.rtcStats.bytesSent - oldStats.bytesSent,
      packetsSent: this.rtcStats.packetsSent - oldStats.packetsSent,
      bytesReceived: this.rtcStats.bytesReceived - oldStats.bytesReceived,
      packetsReceived: this.rtcStats.packetsReceived - oldStats.packetsReceived,
      packetsLost: this.rtcStats.packetsLost - oldStats.packetsLost,
    })
  }

  /**
   * 获取当前网络传输状况统计数据
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#getTransportStats
   */
  getTransportStats() {
    if (!this.rtcClient || !this.isPublished || (!this.localStream && !this.screenStream)) {
      return
    }

    this.rtcClient.getTransportStats().then(stats => {
      this.rtcStats.rtt = stats.rtt
    })
  }

  /**
   * 获取当前已发布本地流的音频统计数据
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#getLocalAudioStats
   */
  async getLocalAudioStats() {
    if (!this.rtcClient || !this.isPublished) {
      return
    }

    await this.rtcClient.getLocalAudioStats().then(stats => {
      for (let userId in stats) {
        this.rtcStats.bytesSent += stats[userId].bytesSent
        this.rtcStats.packetsSent += stats[userId].packetsSent
      }
    })
  }

  /**
   * 获取当前已发布本地流的视频统计数据
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#getLocalVideoStats
   */
  async getLocalVideoStats() {
    if (!this.rtcClient || !this.isPublished) {
      return
    }

    // 摄像头
    await this.rtcClient.getLocalVideoStats().then(stats => {
      for (let userId in stats) {
        this.rtcStats.bytesSent += stats[userId].bytesSent
        this.rtcStats.packetsSent += stats[userId].packetsSent
      }
    })

    // 屏幕分享
    if (this.screenClient) {
      await this.screenClient.getLocalVideoStats().then(stats => {
        for (let userId in stats) {
          this.rtcStats.bytesSent += stats[userId].bytesSent
          this.rtcStats.packetsSent += stats[userId].packetsSent
        }
      })
    }
  }

  /**
   * 获取当前所有远端流的音频统计数据
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#getRemoteAudioStats
   */
  async getRemoteAudioStats() {
    if (!this.rtcClient) {
      return
    }

    await this.rtcClient.getRemoteAudioStats().then(stats => {
      for (let userId in stats) {
        this.rtcStats.bytesReceived += stats[userId].bytesReceived
        this.rtcStats.packetsReceived += stats[userId].packetsReceived
        this.rtcStats.packetsLost += stats[userId].packetsLost
      }
    })
  }

  /**
   * 获取当前所有远端流的视频统计数据
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Client.html#getRemoteVideoStats
   */
  async getRemoteVideoStats() {
    if (!this.rtcClient) {
      return
    }

    await this.rtcClient.getRemoteVideoStats().then(stats => {
      for (let userId in stats) {
        this.rtcStats.bytesReceived += stats[userId].bytesReceived
        this.rtcStats.packetsReceived += stats[userId].packetsReceived
        this.rtcStats.packetsLost += stats[userId].packetsLost
      }
    })
  }

  /**
   * 创建屏幕分享
   * 
   * https://trtc-1252463788.file.myqcloud.com/web/docs/tutorial-06-advanced-screencast.html
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Stream.html#play （屏幕分享填充模式）
   */
  async screenShare() {
    if (!this.isJoined) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.plsJoinRoom'))
      return
    }

    // 使用一个独立的用户ID进行推送屏幕分享
    this.screenClient = TRTC.createClient({
      sdkAppId: this.rtcOption.sdkAppID,
      userId: this.rtcOption.screenID,
      userSig: this.rtcOption.screenSig,
      mode: this.rtcOption.liveScene
    })

    // 指明该 screenClient 默认不接收任何远端流 （它只负责发送屏幕分享流）
    this.screenClient.setDefaultMuteRemoteStreams(true)

    // 加入房间
    await this.screenClient.join({
      roomId: this.rtcOption.liveID
    }).then(() => {
      // 创建屏幕分享流
      this.screenStream = TRTC.createStream({
        audio: false,
        screen: true
      })

      // 屏幕清晰度
      this.screenStream.setScreenProfile(this.rtcOption.screenVideoProfile)

      // 初始化屏幕流
      this.screenStream.initialize().then(() => {
        this.screenClient.publish(this.screenStream).then(() => {
          this.isScreenShare = true
          window.store.commit('setIsScreenShare', this.isScreenShare)
        })
      })
    })

    // 监听屏幕分享停止事件
    this.screenStream.on('screen-sharing-stopped', event => {
      this.stopScreenShare()
      this.isScreenShare = false
      window.store.commit('setIsScreenShare', this.isScreenShare)
      console.log('screen sharing was stopped', event)
    })
  }

  /**
   * 停止屏幕分享
   */
  async stopScreenShare(callback) {
    if (!this.isScreenShare) {
      console.error('当前尚未发布屏幕流！')
      return
    }

    try {
      // 停止发布本地流
      await this.screenClient.unpublish(this.screenStream)
      this.screenStream = null
      console.info('停止发布屏幕流成功！')
    } catch (error) {
      console.error('停止发布屏幕流失败！' + error)
    }

    this.screenClient.leave().then(() => {
      this.isScreenShare = false
      window.store.commit('setIsScreenShare', this.isScreenShare)
      this.screenClient = null
      callback && callback({
        code: 0,
        cameras: res
      })
    }).catch(error => {
      console.error('屏幕分享退出房间: ', error)
    })
  }

  /**
   * 离开房间
   */
  async quitRoom(callback) {
    // 停止摄像头
    await this.stopLocalStream()
    // 停止屏幕分享
    await this.stopScreenShare()

    this.rtcClient && this.rtcClient.leave().then(() => {
      this.isJoined = false
      callback && callback({
        code: 0,
        cameras: res
      })
    }).catch(error => {
      console.error('leaving room failed: ' + error)
    })
  }

  /**
   * 切换媒体输入设备
   * 
   * https://trtc-1252463788.file.myqcloud.com/web/docs/LocalStream.html#switchDevice
   * @param {*} type audio, video
   * @param {*} deviceId (手机前置 user，后置 environment)
   */
  async switchDevice(type, deviceId, callback) {
    // 切换camera设备
    await this.localStream.switchDevice(type, deviceId).then(() => {
      callback && callback({
        code: 0,
        cameras: deviceId
      })
    }).catch(error => {
      console.error('switchDevice ' + error);
      callback && callback({
        code: -1,
        error: error
      })
    })
  }

  /**
   * 设置扬声器
   * 静音：https://trtc-1252463788.file.myqcloud.com/web/docs/RemoteStream.html?_ga=1.200257958.949422289.1580715992#setAudioVolume
   * 
   * @param {*} speakerID 
   */
  async setAudioOutput(speakerID, callback) {
    await this.localStream.setAudioOutput(speakerID).then(res => {
      callback && callback({
        code: 0,
        cameras: speakerID
      })
    }).catch(error => {
      console.error('changeSpeaker error ' + error);

      callback && callback({
        code: 0,
        error: error
      })
    })
  }

  /**
   * 切换角色
   * 
   * @param {*} role 
   */
  async switchRole(role) {
    // live互动直播模式下，观众连麦推流
    await this.rtcClient.switchRole(role).then(() => {
      console.info('switchRole success - ', role)
      this.role = role
    }).catch(error => {
      console.error('switchRole error ' + error);
    })
  }
}

const webrtc = new WebRTC()
export default webrtc