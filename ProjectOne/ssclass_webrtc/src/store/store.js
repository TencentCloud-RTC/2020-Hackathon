import Constant from '@/constant/constant'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 这里定义初始值
let state = {
  userID: '', // 用户id
  userName: localStorage.getItem("userName") || '', // 用户名
  userType: 0, // 用户类别 
  groupName: '', // 组名
  faceUrl: '', // 头像urll
  clientType: Constant.ClientType.PC, // 互动直播：0-PC；1-手机
  osType: '', // 系统
  browserType: '', // 浏览器类型
  browserVersion: '', // 浏览器版本
  userAgent: '', // 客户端类型
  country: '', // 国家
  province: '', // 省份
  city: '', // 城市
  isp: '', // 网络供应商,
  ip: '', // ip地址
  loginInfo: {}, // RTC登录信息
  roomID: '', // 房间id
  roomInfo: {}, // 房间信息
  requestType: Constant.LiveCommand.RequestNone, // 请求类型 'RequestNone'-没有; RequestMic-请求音频；RequestVideo-请求视频
  requestMembers: [], // 申请列表
  liveState: Constant.LiveState.NotStart, // 直播状态 NotStart-未开始; Living-直播中; Pause-暂停; Quit-结束; End-结束
  liveSecond: 0,
  cameraID: localStorage.getItem("cameraID") || '', // 当前的摄像头的id
  microphoneID: localStorage.getItem("microphoneID") || '', // 当前的麦克风id
  speakerID: localStorage.getItem("speakerID") || '', // 当前的扬声器id
  teacher: null, // 老师信息
  assistants: [], // 助教们信息
  students: [], // 学生们信息
  memberCount: 0, // 成员数量
  drawEnable: true, // 白板可否涂鸦
  currentFileID: null, // 当前选中文件
  courseFileList: [], // 白板中的课件列表
  currentBoardID: null, // 当前白板页
  whiteBoardList: [], // 白板页面
  boardPageIndex: 1, // 当前id
  boardPageCount: 1, // 白板数量
  showCommand: true, // 显示命令
  muteAll: false, // 屏蔽所有
  isMuteChat: false, // 被禁言
  isKickOut: false, // 被提出
  imMsgList: [], // im信息列表
  newMsgCount: 0, // 新消息数量
  showBaberrage: false, // 弹幕是否显示
  baberrageList: [], // 弹幕列表
  openAudio: true, // 打开麦克风
  openVideo: true, // 打开摄像头
  openPen: false, // 打开画笔
  hasAudio: null, // 音频状态
  hasVideo: null, // 视频状态
  teacherHasAudio: null, // 老师音频状态
  teacherHasVideo: null, // 老师视频状态
  maxTeacherVideo: false, // 最大化 老师老师摄像头
  maxMineVideo: false, // 最大化我的摄像头，不是老师
  memberAutoLink: false, // 成员自动连麦
  rejectRequest: false, // 拒绝连麦
  memberStreamList: [], // 成员视频列表
  showMemberVideo: false, //成员摄像头是否显示
  mobileWidth: '', //手机屏幕的宽度
  mobileHeight: '', //手机屏幕的高度
  isScreenShare: false, // 是否在分享屏幕
  rtcStats: null, // rtc统计,
  showSignIn: false,
  signInMemberCount: 0,
  signInMembers: [],
  showQa: false, // 显示答题
  qaContent: '', // 答题信息
  qaMemberCount: 0, // 答题数量
  qaMembers: [], // 答题人
  qaRightPercent: '0%', // 答题正确率
  signInContent: '', // 签到信息
}

// mutations 在组件里通过 this.$store.commit(functionName, value) 调用 是同步方式
const mutations = {
  setGroupName(state, groupName) {
    state.groupName = groupName
  },
  setUserID(state, userID) {
    state.userID = userID
    localStorage.setItem("userID" + state.userType, userID)
  },
  setUserName(state, userName) {
    state.userName = userName
    localStorage.setItem("userName", userName)
  },
  setUserType(state, userType) {
    state.userType = userType
  },
  setClientType(state, clientType) {
    state.clientType = clientType
  },
  setOsType(state, osType) {
    state.osType = osType
  },
  setBrowserType(state, browserType) {
    state.browserType = browserType
  },
  setBrowserVersion(state, browserVersion) {
    state.browserVersion = browserVersion
  },
  setUserAgent(state, userAgent) {
    state.userAgent = userAgent
  },
  setCountry(state, country) {
    state.country = country
  },
  setProvince(state, province) {
    state.province = province
  },
  setCity(state, city) {
    state.city = city
  },
  setIsp(state, isp) {
    state.isp = isp
  },
  setIp(state, ip) {
    state.ip = ip
  },
  setLoginInfo(state, loginInfo) {
    state.loginInfo = loginInfo
  },
  setRoomID(state, roomID) {
    state.roomID = roomID
  },
  setRoomInfo(state, roomInfo) {
    state.roomInfo = roomInfo
  },
  setLiveSecond(state, liveSecond) {
    state.liveSecond = liveSecond
  },
  setLiveState(state, liveState) {
    state.liveState = liveState
  },
  setRequestType(state, requestType) {
    state.requestType = requestType

    if (requestType === Constant.LiveCommand.RequestMic) {
      state.openAudio = true
      state.openVideo = false
    } else if (requestType === Constant.LiveCommand.RequestVideo) {
      state.openAudio = true
      state.openVideo = true
    } else if (requestType === Constant.LiveCommand.RequestNone) {
      state.openAudio = false
      state.openVideo = false
    }
  },
  setRequestMembers(state, requestMembers) {
    state.requestMembers = requestMembers
  },
  setCameraID(state, cameraID) {
    state.cameraID = cameraID
    localStorage.setItem("cameraID", cameraID)
  },
  setMicrophoneID(state, microphoneID) {
    state.microphoneID = microphoneID
    localStorage.setItem("microphoneID", microphoneID)
  },
  setSpeakerID(state, speakerID) {
    state.speakerID = speakerID
    localStorage.setItem("speakerID", speakerID)
  },
  setTeacher(state, teacher) {
    state.teacher = teacher
  },
  setAssistants(state, assistants) {
    state.assistants = assistants
  },
  setStudents(state, students) {
    state.students = students
  },
  setMemberCount(state, memberCount) {
    state.memberCount = memberCount
  },
  setDrawEnable(state, drawEnable) {
    state.drawEnable = drawEnable
  },
  setCurrentFileID(state, currentFileID) {
    state.currentFileID = currentFileID
  },
  setCourseFileList(state, courseFileList) {
    state.courseFileList = courseFileList
  },
  setCurrentBoardID(state, currentBoardID) {
    state.currentBoardID = currentBoardID
  },
  setWhiteBoardList(state, whiteBoardList) {
    state.whiteBoardList = whiteBoardList
  },
  setBoardPageIndex(state, boardPageIndex) {
    state.boardPageIndex = boardPageIndex
  },
  setBoardPageCount(state, boardPageCount) {
    state.boardPageCount = boardPageCount
  },
  setShowCommand(state, showCommand) {
    state.showCommand = showCommand
  },
  setMuteAll(state, muteAll) {
    state.muteAll = muteAll
  },
  setIsMuteChat(state, isMuteChat) {
    state.isMuteChat = isMuteChat
  },
  setIsKickOut(state, isKickOut) {
    state.isKickOut = isKickOut
  },
  setImMsgList(state, imMsgList) {
    state.imMsgList = imMsgList
  },
  setNewMsgCount(state, newMsgCount) {
    state.newMsgCount = newMsgCount
  },
  addNewMsgCount(state) {
    state.newMsgCount++
  },
  setShowBaberrage(state, showBaberrage) {
    state.showBaberrage = showBaberrage
  },
  setBaberrageList(state, baberrageList) {
    state.baberrageList = baberrageList
  },
  setOpenAudio(state, openAudio) {
    state.openAudio = openAudio
  },
  setOpenVideo(state, openVideo) {
    state.openVideo = openVideo
  },
  setOpenPen(state, openPen) {
    state.openPen = openPen
  },
  setHasAudio(state, hasAudio) {
    state.hasAudio = hasAudio
    // 如果是老师
    if (state.userType === 0) {
      state.teacherHasAudio = hasAudio
    }
  },
  setHasVideo(state, hasVideo) {
    state.hasVideo = hasVideo
    // 如果是老师
    if (state.userType === 0) {
      state.teacherHasVideo = hasVideo
    }
  },
  setTeacherHasAudio(state, teacherHasAudio) {
    state.teacherHasAudio = teacherHasAudio
  },
  setTeacherHasVideo(state, teacherHasVideo) {
    state.teacherHasVideo = teacherHasVideo
  },
  setRejectRequest(state, rejectRequest) {
    state.rejectRequest = rejectRequest
  },
  setMemberAutoLink(state, memberAutoLink) {
    state.memberAutoLink = memberAutoLink
  },
  setMemberVideoList(state, memberStreamList) {
    state.memberStreamList = memberStreamList
    // 是否显示
    if (memberStreamList && memberStreamList.length > 0) {
      state.showMemberVideo = true
    } else {
      state.showMemberVideo = false
    }
  },
  setMobileHeight(state, mobileHeight) {
    state.mobileHeight = mobileHeight
  },
  setMobileWidth(state, mobileWidth) {
    state.mobileWidth = mobileWidth
  },
  setIsScreenShare(state, isScreenShare) {
    state.isScreenShare = isScreenShare
  },
  setRtcStats(state, rtcStats) {
    state.rtcStats = rtcStats
  },
  setSignInContent(state, signInContent) {
    state.signInContent = signInContent
  },
  setShowSignIn(state, showSignIn) {
    state.showSignIn = showSignIn
  },
  setSignInMemberCount(state, signInMemberCount) {
    state.signInMemberCount = signInMemberCount
  },
  setSignInMembers(state, signInMembers) {
    state.signInMembers = signInMembers
  },
  setShowQa(state, showQa) {
    state.showQa = showQa
  },
  setQaContent(state, qaContent) {
    state.qaContent = qaContent
  },
  setQaMembers(state, qaMembers) {
    state.qaMembers = qaMembers
  },
  setQaMemberCount(state, qaMemberCount) {
    state.qaMemberCount = qaMemberCount
  },
  setQaRightPercent(state, qaRightPercent) {
    state.qaRightPercent = qaRightPercent
  }
}

// actions 在组件里通过 this.$store.dispatch(functionName, value) 调用 是异步方式 peomise返回 可以通过then(res)获得执行逻辑
// 事件触发后的逻辑操作
// 参数为事件函数
const actions = {

}

// getters 在组件内 通过 this.$store.getters.xxxx  
// 我们是直接通过this.$store.state.xxx 访问 但是this.$store.state.xxx只能访问单个变量 所以用到 mapState 来集中访问多个变量
// 返回改变后的数值
const getters = {
  imOption: state => {
    return {
      roomID: state.roomID, // 房间id
      skdAppID: state.loginInfo.sdkAppID, // IM SDK AppID
      userID: state.loginInfo.userID, // 用户id
      userSig: state.loginInfo.userSig, // IM 密钥
      userName: state.userName, // 用户名
      faceUrl: state.faceUrl || '', // 头像url
      userType: state.userType, // 用户类型
      sex: 0,
      groupID: state.roomInfo.liveID + '', // 直播房间
      groupName: state.roomInfo.roomName || state.roomInfo.liveID // 房间名
    }
  },
  rtcOption: state => {
    return {
      roomID: state.roomID, // 房间id
      sdkAppID: state.loginInfo.sdkAppID, // TRTC SDK APPID
      userID: state.loginInfo.userID, // 用户id
      userSig: state.loginInfo.userSig, // 密钥
      screenID: state.loginInfo.screenID, // 屏幕分享id
      screenSig: state.loginInfo.screenSig, // 屏幕分享 密钥
      liveID: state.roomInfo.liveID, // 直播房间
      liveScene: state.roomInfo.liveScene, //直播场景 视频通话-VideoCall, 万人直播-Live
      videoProfile: state.userType === 0 ? state.roomInfo.teacherVideoProfile : state.roomInfo.studentVideoProfile,
      screenVideoProfile: state.roomInfo.screenVideoProfile // 屏幕分享VideoProfile
    }
  },
  boardOption: state => {
    return {
      roomID: state.roomID, // 房间id
      sdkAppID: state.loginInfo.boardSdkAppID, // Board SDK AppID
      userID: state.loginInfo.userID, // 用户id
      userSig: state.loginInfo.boardUserSig, // Board 密钥
      liveID: state.roomInfo.liveID // 直播房间
    }
  },
  reportParam: state => {
    return {
      roomID: state.roomID, // 房间号
      liveID: state.roomInfo.liveID, // 房间号
      userID: state.userID, // 用户ID
      userName: state.userName, // 用户名
      userType: state.userType, // 用户类型
      roomName: state.roomInfo.roomName, // 房间名
      osType: window.utils.getOsType() // 客户端类型
    }
  },
  imUserInfo: state => {
    return {
      userID: state.userID,
      userName: state.userName,
      userType: state.userType,
      clientType: state.clientType,
      osType: state.osType,
      browserType: state.browserType,
      country: state.country,
      province: state.province,
      city: state.city,
      ip: state.ip,
    }
  },
  joinRoomParam: state => {
    return {
      roomID: state.roomID,
      userID: state.userID,
      groupName: state.groupName,
      userName: state.userName,
      userType: state.userType,
      osType: state.osType,
      browserType: state.browserType,
      browserVersion: state.browserVersion,
      clientType: state.clientType,
      ip: state.ip,
      country: state.country,
      province: state.province,
      city: state.city,
      isp: state.isp,
      loadMember: state.clientType === Constant.ClientType.PC ? 1 : 0
    }
  }
}

const Store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default Store