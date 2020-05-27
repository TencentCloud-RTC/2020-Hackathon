import Constant from '@/constant/constant'
import TRTC from 'trtc-js-sdk'
import Vue from 'vue'

class Func {
  constructor() {}

  /**
   * 检查WebRTC是否支持
   */
  checkWebrtc() {
    TRTC.checkSystemRequirements().then((result) => {
      if (!result) {
        window.message.alert(new Vue(), window.i18n.t("webrtc.notSupport"))
      }
    })
  }

  /**
   * 获得系统信息
   */
  getSysInfo() {
    // 系统
    window.store.commit('setOsType', window.utils.getOsType())
    // 浏览器类型
    window.store.commit('setBrowserType', window.utils.getBrowserType())
    // 浏览器版本
    window.store.commit('setBrowserVersion', window.utils.getBrowserVersion())
    // 客户端类型
    window.store.commit('setUserAgent', window.utils.getUserAgent())
    // ip 地址
    window.store.commit('setIp', ipAddress ? ipAddress : '')
  }

  /**
   * 获得 query
   * 
   * @param {*} query 
   */
  getQuery(query) {
    // 用户id
    let userID = query.userID
    if (!userID || userID.length == 0) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.userIsNull'))
      return
    }

    // 用户名
    let userName = query.userName
    if (!userName || userName.length == 0) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.userIsNull'))
      return
    }

    // 用户类别
    let userType = query.userType
    if (userType === null) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.userTypeIsNull'))
      return
    }

    // 房间号
    let roomID = query.roomID
    if (!roomID || roomID.length == 0) {
      window.message.notify(new Vue(), 'error', window.i18n.t('webrtc.roomIsNull'))
      return
    }

    // 分组名
    let groupName = query.groupName
    if (groupName && groupName.length == 0) {
      window.store.commit('setGroupName', groupName)
    }

    window.store.commit('setUserType', Number(userType))
    window.store.commit('setUserID', userID)
    window.store.commit('setUserName', userName)
    window.store.commit('setRoomID', roomID)
    window.store.commit('setShowCommand', userType == 0 ? true : false)
    window.store.commit('setOpenPen', userType == 0 ? true : false)
  }

  /**
   * 获得用户id
   */
  async getUserID() {
    let itemID = "userID" + window.store.state.userType
    let userID = localStorage.getItem(itemID)

    if (!userID) {
      await window.api.getUserID({
        roomID: window.store.state.roomID,
        userType: window.store.state.userType
      }).then(res => {
        if (res.code === 0) {
          userID = res.userID
        }
      })
    }

    await window.store.commit('setUserID', userID)
  }

  /**
   * 是否是老师
   */
  isTeacher() {
    var userType = window.store.state.userType

    // 只有老师和助教才能接受
    if (userType === 0) {
      return true
    }

    return false
  }

  /**
   * https://trtc-1252463788.file.myqcloud.com/web/docs/Stream.html#play
   * 视频流播放
   * 
   * @param {*} stream 
   * @param {*} id 
   */
  streamPlay(stream, id, options) {
    if (options) {
      stream.play(id, options).then(() => {
        console.info('stream play success')
      }).catch((e) => {
        console.error('streamPlay', e.getCode)

        const errorCode = e.getCode();
        if (errorCode === 0x4043) {
          // PLAY_NOT_ALLOWED,引导用户手势操作恢复音视频播放
          console.warn('PLAY_NOT_ALLOWED')
          // stream.play()
          stream.resume()
        }
      })
    } else {
      stream.play(id).then(() => {
        console.info('stream play success')
      }).catch((e) => {
        const errorCode = e.getCode();
        if (errorCode === 0x4043) {
          // PLAY_NOT_ALLOWED,引导用户手势操作恢复音视频播放
          console.warn('PLAY_NOT_ALLOWED')
          stream.resume()
          // stream.play()
        }
      })
    }
  }

  /**
   * 获得老师视频状态
   */
  getTeacherVideoState() {
    var userType = window.store.state.userType
    var liveState = window.store.state.liveState

    // 没有声音，也没有视频，直播未开始(网络不好的时候，后台网络断线，但是前端好的)
    if (liveState === Constant.LiveState.NotStart) {
      return Constant.TeacherVideoState.NotStart
    } else if (liveState === Constant.LiveState.Living) { // 直播中
      var teacherHasAudio = window.store.state.teacherHasAudio
      var teacherHasVideo = window.store.state.teacherHasVideo
      if (teacherHasAudio && !teacherHasVideo) { // 有声音，没有视频(或者视频正在接收中)
        return Constant.TeacherVideoState.VoiceLive
      } else if (userType != 0 && teacherHasAudio == null && !teacherHasVideo == null) { // 没声音，也没有视频，老师离开
        return Constant.TeacherVideoState.HasNoStream
      } else { // 显示视频窗口, 如果为null，也显示视频
        return Constant.TeacherVideoState.ShowVideo
      }
    } else if (liveState === Constant.LiveState.Pause) { // 暂停
      return Constant.TeacherVideoState.LivePause
    } else if (liveState === Constant.LiveState.TeacherLeave) { // 老师离开
      return Constant.TeacherVideoState.TeacherLeave
    } else if (liveState === Constant.LiveState.Quit) { // 退出
      return Constant.TeacherVideoState.LiveOver
    } else if (liveState === Constant.LiveState.Close) { // 关闭
      return Constant.TeacherVideoState.LiveOver
    } else { // 显示视频窗口
      return Constant.TeacherVideoState.ShowVideo
    }
  }

  /**
   * 处理申请
   * 
   * @param {*} userID 
   * @param {*} userName 
   * @param {*} requestType 
   */
  handleRequest(userID, userName, requestType) {
    // 只有可操作人才能处理
    if (!this.isTeacher()) {
      return
    }

    // 拒绝连麦
    if (window.store.state.rejectRequest) {
      // 拒绝连麦命令
      window.webim.sendCommand(Constant.LiveCommand.RejectRequest, userID)
      // 后台更新状态
      this.setRequestType(userID, Constant.LiveCommand.RequestNone)
      return
    }

    // 增加申请列表
    window.func.addRequestMember(userID, userName, requestType)

    // 老师可以设置，自动连麦
    if (window.store.state.memberAutoLink) {
      // 后台更新状态
      this.setRequestType(userID, Constant.LiveCommand.RequestNone)
      // 发送连麦命令
      if (requestType === Constant.LiveCommand.RequestMic) {
        window.webim.sendCommand(Constant.LiveCommand.VoiceCall, userID)
      } else if (requestType === Constant.LiveCommand.RequestVideo) {
        window.webim.sendCommand(Constant.LiveCommand.VideoCall, userID)
      }
    }
  }

  /**
   * 设置申请类型
   * 
   * @param {*} userID 
   * @param {*} requestType 
   */
  addRequestMember(userID, userName, requestType) {
    // 申请成员类别
    var requestMembers = window.store.state.requestMembers
    if (!requestMembers) {
      requestMembers = []
    }

    // 添加成员
    requestMembers.push({
      userID: userID,
      userName: userName,
      requestType: requestType
    })

    // 存储
    window.store.commit('setRequestMembers', requestMembers)

    // 修改助教和学生的申请状态
    this.setMemberRequestType(userID, requestType)
  }

  /**
   * 取消申请
   * @param {*} userID 
   */
  removeRequestMember(userID) {
    // 现在的成员
    var oldRequestMembers = window.store.state.requestMembers

    var requestMembers = []
    oldRequestMembers.forEach(member => {
      // 其他成员，重新加入
      if (member.userID != userID) {
        requestMembers.push({
          userID: member.userID,
          userName: member.userName,
          requestType: member.requestType
        })
      }
    })

    // 存储
    window.store.commit('setRequestMembers', requestMembers)

    // 修改助教和学生的申请状态
    this.setMemberRequestType(userID, Constant.LiveCommand.RequestNone)
  }

  /**
   * 修改助教和学生的申请状态
   * 
   * @param {*} members 
   * @param {*} userID 
   * @param {*} requestType 
   */
  setMemberRequestType(userID, requestType) {
    // 先找助教，再找学生（因为助教少）
    var find = false
    var assistants = window.store.state.assistants
    assistants && assistants.some((member, index, arr) => {
      if (member.userID === userID) {
        find = true // 找到了
        if (requestType === Constant.LiveCommand.RequestNone) {
          member.requestType = 0
        } else if (requestType === Constant.LiveCommand.RequestMic) {
          member.requestType = 1
        } else if (requestType === Constant.LiveCommand.RequestVideo) {
          member.requestType = 2
        }

        // 修改助教数据
        arr[index] = member
        // 更新到store里面
        window.store.commit('setAssistants', arr)
        return true
      }
    })

    // 在助教里面找到了，就不要找了
    if (find) {
      return true
    }

    // 没找到，找学生
    var students = window.store.state.students
    students && students.some((member, index, arr) => {
      if (member.userID === userID) {
        find = true

        if (requestType === Constant.LiveCommand.RequestNone) {
          member.requestType = 0
        } else if (requestType === Constant.LiveCommand.RequestMic) {
          member.requestType = 1
        } else if (requestType === Constant.LiveCommand.RequestVideo) {
          member.requestType = 2
        }

        // 修改助教数据
        arr[index] = member
        // 更新到store里面
        window.store.commit('setStudents', arr)
        return true
      }
    })

    // 找到了，返回
    if (find) {
      return true
    }

    return false
  }

  /**
   * 在后台设置申请状态
   * 
   * @param {*} userID 
   * @param {*} requestType 
   */
  async setRequestType(userID, requestType) {
    // 转换比例
    var type = 0
    if (requestType === Constant.LiveCommand.RequestMic) {
      type = 1
    } else if (requestType === Constant.LiveCommand.RequestVideo) {
      type = 2
    }

    // 设置状态
    await window.api.setRequestType({
      roomID: window.store.state.roomID,
      userID: userID,
      requestType: type
    }).then(res => {
      if (res.code != 0) {
        console.error('setRequestType error', res)
      }
    })
  }

  /**
   * 添加成员流
   * 
   * @param {*} id 
   * @param {*} userID 
   * @param {*} stream 
   */
  async addMemberStream(id, userID, stream) {
    // 从请求列表中删除
    this.removeRequestMember(userID)

    // 老的列表
    var memberStreamList = window.store.state.memberStreamList
    if (!memberStreamList) {
      memberStreamList = []
    }

    // 从im中获取用户名称
    var userName = userID
    await window.webim.getUserProfile(userID, res => {
      userName = res.profile.nick
    })

    // stream hasVideo，hasAudio，有时是boolean，有时是数字，必须处理
    var hasAudio = window.utils.convert2Boolean(stream.hasAudio())
    var hasVideo = window.utils.convert2Boolean(stream.hasVideo())

    // 添加视频ID
    memberStreamList.push({
      id: id,
      userID: userID,
      userName: userName,
      stream: stream,
      hasAudio: hasAudio,
      hasVideo: hasVideo
    })

    // console.info('addMemberStream', memberStreamList)

    // 存储
    await window.store.commit('setMemberVideoList', memberStreamList)
  }

  /**
   * 删除用户流
   * 
   * @param {*} userID 
   */
  removeMemberSteam(userID) {
    // 现在的成员
    var oldMemberSteamList = window.store.state.memberStreamList

    var memberStreamList = []
    oldMemberSteamList.forEach(member => {
      // 其他成员，重新加入
      if (member.userID != userID) {
        memberStreamList.push({
          id: member.id,
          userID: member.userID,
          userName: member.userName,
          stream: member.stream,
          hasAudio: member.hasAudio,
          hasVideo: member.hasVideo
        })
      }
    })

    // 存储
    window.store.commit('setMemberVideoList', memberStreamList)
  }

  /**
   * 是否连接
   * 
   * @param {*} userID 
   */
  isMemberLinked(userID) {
    var find = false
    var memberStreamList = window.store.state.memberStreamList
    memberStreamList.some(member => {
      if (member.userID === userID) {
        find = true
        return true
      }
    })

    return find
  }

  /**
   * 设置用户音频状态
   * 
   * @param {*} userID 
   * @param {*} hasAudio 
   */
  setMemberAudioState(userID, hasAudio) {
    var memberStreamList = window.store.state.memberStreamList
    memberStreamList.some((member, index, arr) => {
      if (member.userID === userID) {
        // 设置音频
        member.hasAudio = hasAudio
        arr[index] = member
        // 更新到store里面
        window.store.commit('setMemberVideoList', arr)
        return true
      }
    })
  }

  /**
   * 设置用户视频状态
   * 
   * @param {*} userID 
   * @param {*} hasVideo 
   */
  setMemberVideoState(userID, hasVideo) {
    var memberStreamList = window.store.state.memberStreamList
    memberStreamList.some((member, index, arr) => {
      if (member.userID === userID) {
        // 设置音频
        member.hasVideo = hasVideo
        arr[index] = member
        // 更新到store里面
        window.store.commit('setMemberVideoList', arr)
        return true
      }
    })
  }

  /**
   * 设置用户视频流
   * 
   * @param {*} userID 
   * @param {*} stream 
   */
  setMemberVideoStream(userID, stream) {
    var memberStreamList = window.store.state.memberStreamList
    memberStreamList.some((member, index, arr) => {
      if (member.userID === userID) {
        // 设置音频
        member.stream = stream
        member.hasAudio = window.utils.convert2Boolean(stream.hasAudio())
        member.hasVideo = window.utils.convert2Boolean(stream.hasVideo())
        arr[index] = member
        // 更新到store里面
        window.store.commit('setMemberVideoList', arr)
        return true
      }
    })
  }

  /**
   * 收到答题消息
   * 
   * @param {*} userID 
   * @param {*} userName 
   * @param {*} answerJson 
   */
  addQaMember(userID, userName, answerJson) {
    if (!this.isTeacher()) {
      return
    }

    var answerObj = JSON.parse(answerJson)
    var answer = answerObj.answer
    var isRight = answerObj.isRight === 1 ? window.i18n.t('qa.correct') : window.i18n.t('qa.wrong')
    var costSecond = answerObj.costSecond

    // 答题人数
    var qaMemberCount = window.store.state.qaMemberCount

    // 只显示前300个
    if (qaMemberCount < 300) {
      var qaMembers = window.store.state.qaMembers

      var find = false
      qaMembers.some((member, index, arr) => {
        if (member.userID === userID) {
          find = true // 找到了

          // 修改助教数据
          member.userName = userName
          member.answer = answer
          member.isRight = isRight
          member.costSecond = costSecond

          arr[index] = member
          return true
        }
      })

      // 没找到
      if (!find) {
        window.store.commit('setQaMemberCount', qaMemberCount + 1)

        qaMembers.push({
          userID: userID,
          userName: userName,
          answer: answer,
          isRight: isRight,
          costSecond: costSecond
        })
      }

      // 设置
      window.store.commit('setQaMembers', qaMembers)
    }
  }

  /**
   * 添加用户签到信息
   * 
   * @param {*} userID 
   * @param {*} userName 
   */
  addSignInMember(userID, userName) {
    if (!this.isTeacher()) {
      return
    }

    // 签到人数
    var signInMemberCount = window.store.state.signInMemberCount
    window.store.commit('setSignInMemberCount', signInMemberCount + 1)

    // 只显示前100个
    if (signInMemberCount < 300) {
      var signInMembers = window.store.state.signInMembers

      signInMembers.push({
        userID: userID,
        userName: userName,
        signInTime: window.utils.getNowTime()
      })

      window.store.commit('setSignInMembers', signInMembers)
    }
  }

  /**
   * 获得网络传输
   */
  getRtcStats() {
    var rtcStats = window.store.state.rtcStats

    if (rtcStats && (rtcStats.bytesSent || rtcStats.bytesReceived)) {
      var text = ''
      if (rtcStats.bytesSent) {
        var sent = Math.abs((rtcStats.bytesSent / 1024 / 1024).toFixed(2))
        text += window.i18n.t('banner.rtcSent', {
          sent: sent > 0 ? sent : 0.01
        })
      }

      if (rtcStats.bytesReceived) {
        var received = Math.abs((rtcStats.bytesReceived / 1024 / 1024).toFixed(2))
        text += window.i18n.t('banner.rtcReceived', {
          received: received > 0 ? received : 0.01
        })
      }

      text += window.i18n.t('banner.rtcLost', {
        lost: Math.abs((rtcStats.packetsLost / 1024 / 1024).toFixed(2))
      })

      return text
    } else {
      return ''
    }
  }

  /**
   * 获得新消息数量
   */
  getNewMsgCount() {
    var newMsgCount = window.store.state.newMsgCount
    if (newMsgCount >= 0) {
      return "(" + newMsgCount + ")"
    }
    return "";
  }

  /**
   * 获得用户数量
   */
  getMemberCount() {
    return window.store.state.memberCount
  }

  /**
   * 获得直播时间
   */
  getLiveTime() {
    var roomInfo = window.store.state.roomInfo
    if (roomInfo && roomInfo.forceClose) { // 倒计时
      var now = window.utils.getNowTime()
      var endTime = roomInfo.endTime
      var leftSeconds = window.utils.timeDiffSeconds(now, endTime)
      return window.utils.formatSeconds(leftSeconds)
    } else { // 直播时长
      var liveSecond = window.store.state.liveSecond
      if (liveSecond > 0) {
        return window.utils.formatSeconds(liveSecond)
      }
    }

    return '00:00:00'
  }

  /**
   * 设置房间信息（直播中）
   * 
   * @param {*} liveRoom 
   */
  setLiveRoom(liveRoom) {
    if (liveRoom) {
      // 直播时长
      window.store.commit('setLiveSecond', liveRoom.liveSecond)

      // 直播状态监控(强制关闭)
      if (liveRoom.forceClose && window.utils.getNowTime() > liveRoom.endTime) {
        window.store.commit('setLiveState', Constant.LiveState.ForceClose)
      } else {
        if (liveRoom.liveState === Constant.LiveState.NotStart) {
          var teacherHasAudio = window.store.state.teacherHasAudio
          var teacherHasVideo = window.store.state.teacherHasVideo
          // 如果有音频或者视频，直播状态
          if (teacherHasAudio || teacherHasVideo) {
            window.store.commit('setLiveState', Constant.LiveState.Living)
          }
        } else {
          window.store.commit('setLiveState', liveRoom.liveState)
        }
      }

      // 班级成员信息
      window.store.commit('setTeacher', liveRoom.teacher)
      window.store.commit('setAssistants', liveRoom.assistants)
      window.store.commit('setStudents', liveRoom.students)

      // 禁言
      window.store.commit('setIsMuteChat', liveRoom.isMuteChat ? true : false)
      // 踢出
      window.store.commit('setIsKickOut', liveRoom.isKickOut ? true : false)

      // 成员数量
      window.store.commit('setMemberCount', liveRoom.memberCount)
    }
  }

  /**
   * 获取地区
   */
  async getLocation() {
    // 获得位置信息
    await window.api.getLocation({
      ip: ipAddress
    }).then(res => {
      if (res.code === 0) {
        window.store.commit('setCountry', res.country)
        window.store.commit('setProvince', res.province)
        window.store.commit('setCity', res.city)
        window.store.commit('setIsp', res.isp)
      }
    })
  }

  /**
   * 添加消息
   * 
   * @param {*} textMsg 
   */
  addTextMsg(textMsg) {
    if (textMsg.content && textMsg.content.length > 0) {
      console.error('textMsg4', textMsg.content.length)
      // 处理表情
      var content = window.utils.decodeText(textMsg.content)
      // 添加
      var imMsgList = window.store.state.imMsgList
      imMsgList.push({
        msgType: Constant.ImMsgType.Text,
        userID: textMsg.userID,
        userName: textMsg.userName,
        faceUrl: textMsg.faceUrl,
        content: content,
        sendTime: textMsg.sendTime,
        isSelf: textMsg.isSelf
      })
      window.store.commit("setImMsgList", imMsgList)
    }
  }

  /**
   * 添加图片消息
   * 
   * @param {*} imageMsg 
   */
  addImageMsg(imageMsg) {
    if (imageMsg.imageInfo) {
      var imMsgList = window.store.state.imMsgList
      imMsgList.push({
        msgType: Constant.ImMsgType.Image,
        userID: imageMsg.userID,
        userName: imageMsg.userName,
        faceUrl: imageMsg.faceUrl,
        imageInfo: imageMsg.imageInfo,
        sendTime: imageMsg.sendTime,
        isSelf: imageMsg.isSelf
      })
      window.store.commit("setImMsgList", imMsgList)
    }
  }

  /**
   * 添加文件消息
   * 
   * @param {*} userID 
   * @param {*} userName 
   * @param {*} faceUrl 
   * @param {*} iamgeInfo 
   * @param {*} sendTime 
   * @param {*} isSelf 
   */
  addFileMsg(userID, userName, faceUrl, fileInfo, sendTime, isSelf) {
    if (fileInfo) {
      var imMsgList = window.store.state.imMsgList
      imMsgList.push({
        msgType: Constant.ImMsgType.File,
        userID: userID,
        userName: userName,
        faceUrl: faceUrl,
        fileInfo: fileInfo,
        sendTime: sendTime,
        isSelf: isSelf
      })
      window.store.commit("setImMsgList", imMsgList)
    }
  }

  /**
   * 是否是手机端
   */
  isMobile() {
    var clientType = window.store.state.clientType
    if (clientType === Constant.ClientType.Mobile) {
      return true
    }

    return false
  }

  /**
   * 打开Safari麦克风
   */
  openSafariMic() {
    var option = {
      audio: true,
      video: false,
    }
    let localStream = TRTC.createStream(option)
    localStream.initialize().then(() => {
      console.error('openSafariMic')
    }).catch(error => {
      console.error('failed initialize localStream ' + error);
    })
  }
}

const func = new Func()
export default func