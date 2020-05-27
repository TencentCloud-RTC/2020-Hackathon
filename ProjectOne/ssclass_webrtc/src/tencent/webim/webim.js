// 总览：https://cloud.tencent.com/document/product/269/37416
// 版本：https://cloud.tencent.com/document/product/269/38492
// 客户端：https://cloud.tencent.com/document/product/269/37411
// 错误码：https://cloud.tencent.com/document/product/269/1671
// demo：https://github.com/tencentyun/TIMSDK
// https://cloud.tencent.com/document/product/269/37413

import LogEvent from '@/log/LogEvent'
import TIM from 'tim-js-sdk'
import COS from 'cos-js-sdk-v5'
import ImEvent from './imEvent'
import Vue from 'vue'

class WebIM {
  constructor() {
    this.tim = null
    this.imEvent = new ImEvent()

    this.isSdkReady = false
    this.lastErrCode = 0
    this.lastErrMessage = ''
  }

  /**
   * 初始化
   */
  init() {
    this.imOption = window.store.getters.imOption

    this.startTime = Date.now()

    // 日志
    window.logReport.report(LogEvent.ImSdk_Init, {
      errorCode: 0,
      errorDesc: '',
      timeCost: 0,
      data: '',
      ext: '',
    })

    // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
    let options = {
      SDKAppID: this.imOption.skdAppID // 接入时需要将0替换为您的即时通信应用的 SDKAppID
    }
    this.tim = TIM.create(options)

    this.tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
    // this.tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

    // 将腾讯云对象存储服务 SDK （以下简称 COS SDK）注册为插件，IM SDK 发送文件、图片等消息时，需要用到腾讯云的 COS 服务
    // HTML5 环境，注册 COS SDK
    this.tim.registerPlugin({
      'cos-js-sdk': COS
    })

    // 处理事件
    // SDK内部出错
    this.tim.on(TIM.EVENT.ERROR, this.imEvent.onError, this)
    // 网络状态发生改变
    this.tim.on(TIM.EVENT.NET_STATE_CHANGE, this.imEvent.onNetStateChange, this)
    // sdk 准备好了
    this.tim.on(TIM.EVENT.SDK_READY, this.imEvent.onReadyStateUpdate, this)
    // SDK NOT READT
    this.tim.on(TIM.EVENT.SDK_NOT_READY, this.imEvent.onReadyStateUpdate, this)
    // SDK 接受消息
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.imEvent.onReceiveMessage, this)
    // 撤销消息
    this.tim.on(TIM.EVENT.MESSAGE_REVOKED, this.imEvent.onRevokedMessage, this)
    // 收到会话列表更新通知
    this.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.imEvent.onConversationListUpdated)
    // 收到群组列表更新通知
    this.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, this.imEvent.onGroupListUpdated)
    // 收到新的群系统通知
    this.tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.imEvent.onGroupSystemNoticeReceived)
    // 收到自己或好友的资料变更通知
    this.tim.on(TIM.EVENT.PROFILE_UPDATED, this.imEvent.onProfileUpdated)
    // 收到黑名单列表更新通知
    this.tim.on(TIM.EVENT.BLACKLIST_UPDATED, this.imEvent.onBlackListUpdated)
    // 收到被踢下线通知
    this.tim.on(TIM.EVENT.KICKED_OUT, this.imEvent.onKickedOut)
  }

  /**
   * 登录
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#login
   */
  login() {
    let promise = this.tim.login({
      userID: this.imOption.userID,
      userSig: this.imOption.userSig
    })

    return promise.then(res => {
      // 登录成功
      window.logReport.report(LogEvent.ImSdk_Login_End, {
        errorCode: 0,
        errorDesc: '',
        timeCost: 0,
        data: '',
        ext: '',
      })
    }).catch(err => {
      console.error("im login error:", err)

      // 初始化开始
      window.logReport.report(LogEvent.ImSdk_Login_End, {
        errorCode: err.code,
        errorDesc: err.message,
        timeCost: 0,
        data: '',
        ext: '',
      })

      window.message.notify(new Vue(), 'error', err.message)
    })
  }

  /**
   * 登出
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#logout
   */
  logout() {
    let promise = this.tim.logout()

    return promise.then(res => {
      console.log(res.data) // 登出成功
    }).catch(err => {
      console.warn('logout error:', err)
    })
  }

  /**
   * 获取个人资料
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getMyProfile
   */
  getMyProfile() {
    let promise = this.tim.getMyProfile()
    return promise.then(res => {
      // window.store.commit('setUserInfo', res.data)
    }).catch(err => {
      // window.message.notify(new Vue(), 'error', err.message)
    })
  }

  /**
   * 获取其他用户资料
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getUserProfile
   */
  getUserProfile(userID, callback) {
    let promise = this.tim.getUserProfile({
      userIDList: [userID] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
    })
    return promise.then(res => {
      callback && callback({
        code: 0,
        profile: res.data[0]
      })
    }).catch(err => {
      callback && callback({
        code: -1,
        message: err
      })
    })
  }

  /**
   * 更新个人资料
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile
   * https://cloud.tencent.com/document/product/269/1500#.E8.B5.84.E6.96.99.E7.B3.BB.E7.BB.9F.E7.AE.80.E4.BB.8B
   */
  updateMyProfile() {
    var gender = TIM.TYPES.GENDER_UNKNOWN
    if (this.imOption.sex == 1) {
      gender = TIM.TYPES.GENDER_MALE
    } else if (this.imOption.sex == 2) {
      gender = TIM.TYPES.GENDER_FEMALE
    }
    // 修改个人标配资料
    let promise = this.tim.updateMyProfile({
      nick: this.imOption.userName,
      avatar: this.imOption.faceUrl,
      gender: gender,
      allowType: TIM.TYPES.ALLOW_TYPE_ALLOW_ANY
    })
    return promise.then(res => {
      // console.log(res.data); // 更新资料成功
    }).catch(err => {
      console.warn('updateMyProfile error:', err); // 更新资料失败的相关信息
    })
  }

  /**
   * 创建group
   * 创建 TIM.TYPES.GRP_AVCHATROOM（音视频聊天室） 后，需调用 joinGroup 接口加入群组后，才能进行消息收发流程。
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createGroup
   */
  createGroup() {
    let promise = this.tim.createGroup({
      groupID: this.imOption.groupID,
      name: this.imOption.groupName,
      type: TIM.TYPES.GRP_AVCHATROOM
    })
    return promise.then(res => { // 创建成功
      console.log(res.data.group) // 创建的群的资料
    }).catch(err => {
      console.warn('createGroup error:', err) // 创建群组失败的相关信息
    })
  }

  /**
   * 群主可调用该接口解散群组
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#dismissGroup
   */
  dismissGroup() {
    let promise = tim.dismissGroup(this.imOption.groupID)
    return promise.then(res => { // 解散成功
      console.log(res.data.groupID); // 被解散的群组 ID
    }).catch(err => {
      console.warn('dismissGroup error:', err) // 解散群组失败的相关信息
    })
  }

  /**
   * （申请）加群
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#joinGroup
   */
  joinGroup() {
    var startTime = Date.now()

    let promise = this.tim.joinGroup({
      groupID: this.imOption.groupID,
      type: TIM.TYPES.GRP_AVCHATROOM
    })

    return promise.then(res => {
      switch (res.data.status) {
        case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
          break
        case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
          // 登录成功
          break
        case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经群中
          // 登录成功
          break
        default:
          break
      }

      // 成功
      window.logReport.report(LogEvent.ImSdk_JoinGroup, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      })
    }).catch(err => {
      console.error('joinGroup error:', err) // 申请加群失败的相关信息
      console.error(this.imOption)

      // 失败
      window.logReport.report(LogEvent.ImSdk_JoinGroup, {
        errorCode: err.code,
        errorDesc: err.message,
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      })
    })
  }

  /**
   * 退出群组(群主只能退出私有群，其他的类型不能退出)
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#quitGroup
   */
  quitGroup() {
    var startTime = Date.now()

    let promise = this.tim.quitGroup(this.imOption.groupID)
    return promise.then(res => {
      // 成功
      window.logReport.report(LogEvent.ImSdk_QuitGroup, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      })
    }).catch(err => {
      // 成功
      window.logReport.report(LogEvent.ImSdk_QuitGroup, {
        errorCode: err.code,
        errorDesc: err.message,
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      })
    })
  }

  /**
   * 获得群成员列表
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getGroupMemberList
   */
  getGroupMemberList() {
    let promise = this.tim.getGroupMemberList({
      groupID: this.imOption.groupID,
      count: 100,
      offset: 0
    }) // 从0开始拉取100个群成员
    return promise.then(res => {
      console.log(res.data.memberList); // 群成员列表
    }).catch(err => {
      console.warn('getGroupMemberList error:', err);
    })
  }

  /**
   * 获取群成员资料，如禁言时间等 (每次查询的用户数上限是50)
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getGroupMemberProfile
   * @param userID
   */
  getGroupMemberProfile(userID) {
    let promise = this.tim.getGroupMemberProfile({
      groupID: this.imOption.groupID,
      userIDList: [userID], // 请注意：即使只拉取一个群成员的资料，也需要用数组类型，例如：userIDList: ['user1']
      memberCustomFieldFilter: ['user_type'], // 筛选群成员自定义字段：group_member_custom
    })
    return promise.then(res => {
      console.log(res.data.memberList) // 群成员列表
    }).catch(err => {
      console.warn('getGroupMemberProfile error:', err)
    })
  }

  /**
   * 发送文本消息，Web 端与小程序端相同
   * https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createTextMessage
   * @param {*} msgText 消息内容
   * @param {*} toUser 消息接收方的 userID 或 groupID
   */
  sendTextMessage(msgText, toUser) {
    // 参数数量
    if (!this.isSdkReady) {
      return
    }

    let conversationType = TIM.TYPES.CONV_C2C
    if (arguments.length === 1) {
      toUser = this.imOption.groupID
      conversationType = TIM.TYPES.CONV_GROUP
    }

    // 1.创建消息
    let message = this.tim.createTextMessage({
      to: toUser,
      conversationType: conversationType,
      payload: {
        text: msgText
      }
    })

    var self = this
    // 2. 发送消息
    let promise = this.tim.sendMessage(message)
    return promise.then(res => {
      // 发送成功
      self.saveImMsg(msgText, toUser)
    }).catch(err => {
      // 发送失败
      console.warn('sendTextMessage error:', err, this.imOption.groupID)
    })
  }

  /**
   * 发送图片
   * this.$refs.imagePicker.click()
   * 
   * @param {*} msgImage 
   * @param {*} toUser 
   */
  sendImageMessage(imgMsg, toUser) {
    // 参数数量
    if (!this.isSdkReady) {
      return
    }

    let conversationType = TIM.TYPES.CONV_C2C
    if (arguments.length === 1) {
      toUser = this.imOption.groupID
      conversationType = TIM.TYPES.CONV_GROUP
    }
    console.error('00000000')
    // 1.创建消息
    let message = this.tim.createImageMessage({
      to: toUser,
      conversationType: conversationType,
      payload: {
        file: imgMsg
      },
    })

    // 2. 发送消息
    let promise = this.tim.sendMessage(message)
    return promise.then(res => {
      // 发送成功
      if (res.data.message.from == this.imOption.userID) {
        window.func.addImageMsg({
          userID: this.imOption.userID,
          userName: this.imOption.userName,
          faceUrl: '',
          imageInfo: res.data.message.payload.imageInfoArray[0],
          sendTime: window.utils.getNowTime(),
          isSelf: true
        })
      }
    }).catch(err => {
      // 发送失败
      console.warn('sendImageMessage error:', err)
    })
  }

  /**
   * 发送文件
   * this.$refs.filePicker.click()
   * 
   * @param {*} fileMsg 
   * @param {*} toUser 
   */
  sendFileMessage(fileMsg, toUser) {
    // 参数数量
    if (!this.isSdkReady) {
      return
    }

    let conversationType = TIM.TYPES.CONV_C2C
    if (arguments.length === 1) {
      toUser = this.imOption.groupID
      conversationType = TIM.TYPES.CONV_GROUP
    }

    // 1.创建消息
    let message = this.tim.createFileMessage({
      to: toUser,
      conversationType: conversationType,
      payload: {
        file: fileMsg
      },
    })
    // 2. 发送消息
    let promise = this.tim.sendMessage(message)
    return promise.then(res => {
      // 发送成功
      console.info('sendImageMessage', JSON.stringify(res))
      if (res.data.message.from == this.imOption.userID) {
        window.func.addFileMsg(this.imOption.userID, this.imOption.userName, '', res.data.message.payload, window.utils.getNowTime(), true)
      }
    }).catch(err => {
      // 发送失败
      console.warn('sendImageMessage error:', err)
    })
  }

  /**
   * 保存消息
   * 
   * @param {*} message 
   * @param {*} toUser 
   */
  saveImMsg(message, toUser) {
    window.api.saveImMsg({
      roomID: window.store.state.roomID,
      userID: window.store.state.userID,
      userName: window.store.state.userName,
      message: message,
      reciverID: toUser
    }).then(res => {
      if (res.code != 0) {
        console.error('saveImMsg error!')
      }
    })
  }

  /**
   * 发送命令
   * @param {*} command 命令
   * @param {*} toUser 消息接收方的 userID，如果是group，则为空
   */
  sendCommand(command, toUser) {
    if (!this.isSdkReady) {
      return
    }

    // 参数数量
    let conversationType = TIM.TYPES.CONV_C2C
    if (arguments.length === 1) {
      toUser = this.imOption.groupID
      conversationType = TIM.TYPES.CONV_GROUP
    }

    // 扩展信息
    var extension = window.utils.split('_', command, 0)

    // 1.创建消息
    let message = this.tim.createCustomMessage({
      to: toUser,
      conversationType: conversationType,
      payload: {
        data: command, // 用于标识该消息的类型
        description: JSON.stringify(window.store.getters.imUserInfo), // 用户信息
        extension: extension
      }
    })

    // 2. 发送消息
    let promise = this.tim.sendMessage(message)
    return promise.then(res => {
      // 发送成功
      console.info("sendCommand 成功", command, toUser)
    }).catch(err => {
      // 发送失败
      console.error('sendCommand 错误:', err)
    })
  }

  /**
   * 发送命令（带扩展字符串）
   * @param {*} command 
   * @param {*} extension 
   */
  sendCommandEx(command, extension) {
    if (!this.isSdkReady) {
      return
    }

    var toUser = this.imOption.groupID
    var conversationType = TIM.TYPES.CONV_GROUP

    // 1.创建消息
    let message = this.tim.createCustomMessage({
      to: toUser,
      conversationType: conversationType,
      payload: {
        data: command, // 用于标识该消息的类型
        description: JSON.stringify(window.store.getters.imUserInfo), // 用户信息
        extension: extension
      }
    })

    // 2. 发送消息
    let promise = this.tim.sendMessage(message)
    return promise.then(res => {
      // 发送成功
      console.info("sendCommand 成功", command, extension)
    }).catch(err => {
      // 发送失败
      console.warn('sendCommand 错误:', err);
    })
  }

  /**
   * 发送白板消息
   */
  sendGroupBoardMsg(options, succ, fail) {
    if (!this.isSdkReady) {
      return
    }

    // 1.创建消息
    let message = this.tim.createCustomMessage({
      to: options.liveId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: options.msgText, // 发送的内容
        description: '', // 描述
        extension: 'TXWhiteBoardExt' // 扩展字段
      }
    })

    // 2. 发送消息
    let promise = this.tim.sendMessage(message)
    return promise.then(res => {
      // 发送成功
      // console.error("message 成功", res)
      succ && succ({
        code: 0
      })
    }).catch(err => {
      // 发送失败
      console.warn('sendMessage error:', err);
      fail && fail({
        code: err.code,
        message: err.message
      })
    })
  }

  /**
   * 获取unixTimestamp时间戳
   */
  getUnixTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
}

const webim = new WebIM()
export default webim