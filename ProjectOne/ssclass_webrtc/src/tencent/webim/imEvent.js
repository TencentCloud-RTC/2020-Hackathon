import Constant from '@/constant/constant'
import LogEvent from '@/log/LogEvent'
import TIM from 'tim-js-sdk'
import Vue from 'vue'

// https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/module-EVENT.html
class ImEvent {
  constructor() {}

  // 收到 SDK 发生错误通知，可以获取错误码和错误信息
  // event.name - TIM.EVENT.ERROR
  // event.data.code - 错误码
  // event.data.message - 错误信息
  // https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/module-EVENT.html#.ERROR
  onError({
    data
  }) {
    if (data.message === 'Network Error') {

    } else {
      console.error('im onError', data.message)
    }
  }

  // 网络状态发生改变
  // https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/module-EVENT.html#.NET_STATE_CHANGE
  onNetStateChange({
    data
  }) {
    if (data.state === TIM.TYPES.NET_STATE_CONNECTED) {
      console.info('connected net!')
    } else if (data.state === TIM.TYPES.NET_STATE_CONNECTING) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webim.netStateConnecting'))
    } else if (data.state === TIM.TYPES.NET_STATE_DISCONNECTED) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webim.netStateDisconnected'))
    }
  }

  // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
  // event.name - TIM.EVENT.SDK_READ
  onReadyStateUpdate({
    name
  }) {
    this.isSdkReady = name === TIM.EVENT.SDK_READY ? true : false
    if (this.isSdkReady) {
      // 初始化开始
      window.logReport.report(LogEvent.ImSdk_Init_End, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - this.startTime,
        data: '',
        ext: '',
      })

      // 更新个人资料
      this.updateMyProfile()

      // 发送我来了的消息
      this.sendCommand(Constant.UserCommand.ImComming)
    } else {
      // 初始化开始
      window.logReport.report(LogEvent.ImSdk_Init_End, {
        errorCode: -1,
        errorDesc: 'IM Not Ready！',
        timeCost: Date.now() - this.startTime,
        data: '',
        ext: '',
      })
    }
  }

  // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
  // event.name - TIM.EVENT.MESSAGE_RECEIVED
  // event.data - 存储 Message 对象的数组 - [Message]
  onReceiveMessage({
    data
  }) {
    if (data.length) {
      data.forEach(msg => {
        // var conversationType = msg.conversationType
        var userID = msg.from
        var userName = msg.nick
        var faceUrl = msg.avatar
        // var isSystemMessage = msg.isSystemMessage
        var sendTime = window.utils.timestamp2Str(msg.time * 1000)

        // 自己的消息不收
        if (userID === window.store.state.userID) {
          return
        }

        var elements = msg._elements

        // https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.ImagePayload
        elements.forEach(element => {
          if (element.type === 'TIMTextElem') {
            // 添加消息
            window.func.addTextMsg({
              userID: userID,
              userName: userName,
              faceUrl: faceUrl,
              content: element.content.text,
              sendTime: sendTime,
              isSelf: false
            })
            // 新消息数量
            window.store.commit('addNewMsgCount')
          } else if (element.type === 'TIMImageElem') {
            // 添加消息
            window.func.addImageMsg({
              userID: userID,
              userName: userName,
              faceUrl: faceUrl,
              imageInfo: element.content.imageInfoArray[0],
              sendTime: sendTime,
              isSelf: false
            })
            // 新消息数量
            window.store.commit('addNewMsgCount')
          } else if (element.type === 'TIMFileElem') {
            // 添加消息
            window.func.addFileMsg(userID, userName, faceUrl, element.content, sendTime, false)
            // 新消息数量
            window.store.commit('addNewMsgCount')
          } else if (element.type === 'TIMCustomElem') {
            if (element.content.extension === 'TXWhiteBoardExt') { // 白板消息
              window.webboard.addSyncData(element.content.data)
            } else {
              // 命令
              if (element.content.data === Constant.UserCommand.ImHere) { // ImHere 加入记录
                // window.func.addMember(JSON.parse(element.content.description))
              } else if (element.content.data === Constant.UserCommand.ImComming) { // 我来了

              } else if (element.content.data === Constant.UserCommand.IQuit) { // IQuit 命令

              } else if (element.content.data === Constant.LiveCommand.Start) { // 开始直播
                // 在main里面，监控处理
                window.store.commit('setLiveState', Constant.LiveState.Living)
              } else if (element.content.data === Constant.LiveCommand.Pause) { // 直播暂停
                // 在main里面，监控处理
                window.store.commit('setLiveState', Constant.LiveState.Pause)
              } else if (element.content.data === Constant.LiveCommand.Quit) { // 直播退出
                // 在main里面，监控处理
                window.store.commit('setLiveState', Constant.LiveState.Quit)
              } else if (element.content.data === Constant.LiveCommand.Close) { // 房间关闭
                // 在main里面，监控处理
                window.store.commit('setLiveState', Constant.LiveState.Close)
              } else if (element.content.data === Constant.LiveCommand.RequestMic || // 申请连麦
                element.content.data === Constant.LiveCommand.RequestVideo) { // 申请视频
                // 处理申请
                window.func.handleRequest(userID, userName, element.content.data)
              } else if (element.content.data === Constant.LiveCommand.RequestNone) { // 取消申请
                // 只有可操作人才能处理，清除申请列表
                window.func.removeRequestMember(userID, Constant.LiveCommand.RequestNone)
              } else if (element.content.data === Constant.LiveCommand.RejectRequest) { // 收到拒绝连麦
                // 只有可操作人才能处理，清除申请列表
                window.func.removeRequestMember(userID, Constant.LiveCommand.RequestNone)
                // 老师拒绝连麦
                window.message.notify(new Vue(), 'info', window.i18n.t('main.rejectRequest'))
              } else if (element.content.data === Constant.LiveCommand.VoiceCall) { // 上麦（收到老师命令）
                // 提醒
                window.message.notify(new Vue(), 'info', window.i18n.t('main.openYourMic'))
                // 打开音频
                window.store.commit('setOpenAudio', true)
                window.store.commit('setOpenVideo', false)
                window.webrtc.createLocalStream()
              } else if (element.content.data === Constant.LiveCommand.VideoCall) { // 视频通话（收到老师命令）
                // 提醒
                window.message.notify(new Vue(), 'info', window.i18n.t('main.openYourVideo'))
                // 打开视频
                window.store.commit('setOpenAudio', true)
                window.store.commit('setOpenVideo', true)
                window.webrtc.createLocalStream()
              } else if (element.content.data === Constant.LiveCommand.CloseLink) { // 关闭通话（收到老师命令）
                // 清除申请列表
                window.webrtc.stopLocalStream()
                // 提醒
                window.message.notify(new Vue(), 'info', window.i18n.t('main.closeYourLink'))
              } else if (element.content.data === Constant.LiveCommand.OpenPen) { // 打开画笔（收到老师命令）

              } else if (element.content.data === Constant.LiveCommand.ClosePen) { // 关闭画笔（收到老师命令）

              } else if (element.content.data === Constant.LiveCommand.ThumbsUp) { // 关闭画笔（收到老师命令）

              } else if (element.content.data === Constant.LiveCommand.StartSignIn) { // 发起签到
                window.store.commit('setSignInContent', element.content.extension)
                window.store.commit('setShowSignIn', true)
              } else if (element.content.data === Constant.LiveCommand.SignIn) { // 学生签到
                window.func.addSignInMember(userID, userName)
              } else if (element.content.data === Constant.LiveCommand.CloseSignIn) { // 结束签到
                window.store.commit('setShowSignIn', false)
              } else if (element.content.data === Constant.LiveCommand.StartQa) { // 显示答题
                window.store.commit('setQaContent', element.content.extension)
                window.store.commit('setShowQa', true)
              } else if (element.content.data === Constant.LiveCommand.SetAnswer) { // 学员答题
                window.func.addQaMember(userID, userName, element.content.extension)
              } else if (element.content.data === Constant.LiveCommand.CloseQa) { // 关闭答题
                window.store.commit('setShowQa', false)
              }
            }
          }
        })
      })
    }
  }

  // 收到消息被撤回的通知。使用前需要将SDK版本升级至v2.4.0或以上。
  // event.name - TIM.EVENT.MESSAGE_REVOKED
  // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
  onRevokedMessage({
    data
  }) {}

  // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
  // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
  // event.data - 存储 Conversation 对象的数组 - [Conversation]
  onConversationListUpdated({
    data
  }) {
    // console.error("===== onConversationListUpdated", data)
  }

  // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
  // event.name - TIM.EVENT.GROUP_LIST_UPDATED
  // event.data - 存储 Group 对象的数组 - [Group]
  onGroupListUpdated({
    data
  }) {
    // console.error("===== onGroupListUpdated", data)
  }

  // 收到新的群系统通知
  // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
  // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 <a href="https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.GroupSystemNoticePayload"> operationType 枚举值说明</a>
  // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
  onGroupSystemNoticeReceived({
    data
  }) {
    // console.error("===== onGroupSystemNoticeReceived", data)
  }

  // 收到自己或好友的资料变更通知
  // event.name - TIM.EVENT.PROFILE_UPDATED
  // event.data - 存储 Profile 对象的数组 - [Profile]
  onProfileUpdated({
    data
  }) {}

  // 收到黑名单列表更新通知
  // event.name - TIM.EVENT.BLACKLIST_UPDATED
  // event.data - 存储 userID 的数组 - [userID]
  onBlackListUpdated({
    data
  }) {}

  // 收到被踢下线通知
  // event.name - TIM.EVENT.KICKED_OUT
  // event.data.type - 被踢下线的原因，例如 :
  //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
  //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
  //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢。使用前需要将SDK版本升级至v2.4.0或以上。
  onKickedOut({
    data
  }) {}
}

export default ImEvent