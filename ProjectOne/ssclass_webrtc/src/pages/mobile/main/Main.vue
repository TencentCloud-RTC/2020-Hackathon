<template>
  <div
    class="el-moblie-main-box"
    :style="isBoardFullscreen || isVideoFullscreen?boardFullscreenStyle1:''"
  >
    <div class="el-mobile-main-banner" v-show="!isBoardFullscreen && !isVideoFullscreen">
      <div class="el-main-banner-lf">
        <span>{{roomInfo?roomInfo.roomName:''}}</span>
        <span
          style="font-size:9px;"
        >({{$t('banner.online')}} {{$func.getMemberCount()}}{{$t('banner.person')}})</span>
        <span style="font-size:9px;margin-left:2px;">{{rtcSubstr($func.getRtcStats())}}</span>
      </div>
      <div class="el-main-banner-rt">
        <span>{{$func.getLiveTime()}}</span>
      </div>
    </div>
    <div
      class="video"
      v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.ShowVideo"
      :class="[{'mobile-board-video':isBoardFullscreen}]"
      :style="videoFullscreenStyle"
    >
      <div id="teacherVideo" :style="teacherVideoStyle"></div>
      <member-video-panel ref="MemberVideo"></member-video-panel>
      <div class="el-mobile-video-icon" style="display:none;">
        <!--v-show="!isBoardFullscreen" -->
        <i
          :class="isVideoFullscreen?'iconfont icon-exitFullscreen':'iconfont icon-fullscreen'"
          @click="videoFullscreen"
        ></i>
      </div>
    </div>
    <div
      class="video"
      v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.VoiceLive && !isBoardFullscreen && !isVideoFullscreen"
      :style="teacherVideoStyle"
    >
      <img :src="voiceLive" alt />
    </div>
    <div
      class="video"
      v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.LivePause && !isBoardFullscreen && !isVideoFullscreen"
      :style="teacherVideoStyle"
    >
      <img :src="livePause" alt />
    </div>
    <div
      class="video"
      v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.NotStart && !isBoardFullscreen && !isVideoFullscreen"
      :style="teacherVideoStyle"
    >
      <img :src="liveNotStart" alt />
    </div>
    <div
      class="video"
      v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.TeacherLeave && !isBoardFullscreen && !isVideoFullscreen"
      :style="teacherVideoStyle"
    >
      <img :src="teacherLeave" alt />
    </div>
    <div class="el-mobile-main-tabs" v-show="!isBoardFullscreen && !isVideoFullscreen">
      <span
        class="el-mobile-main-tab"
        :class="{'el-mobile-main-tab-active': tabIndex === 0}"
        @click="clickTab('course')"
      >{{$t('main.courseware')}}</span>
      <span
        class="el-mobile-main-tab"
        :class="{'el-mobile-main-tab-active': tabIndex === 1}"
        @click="clickTab('chat')"
      >{{$t('main.chat')+$func.getNewMsgCount()}}</span>
    </div>
    <div class="el-mobile-main-content" v-show="tabIndex === 0 && !isVideoFullscreen">
      <div
        id="mobileWebboard"
        class="el-mobile-main-board"
        v-show="liveState===$constant.LiveState.Living && !isScreenShare"
        :class="isBoardFullscreen?'el-mobile-board-container':''"
        :style="isBoardFullscreen?boardFullscreenStyle:''"
      >
        <div class="el-mobile-main-board-full" style="display:none;">
          <i
            :class="isBoardFullscreen?'iconfont icon-exitFullscreen':'iconfont icon-fullscreen'"
            @click="boardFullscreen"
          ></i>
        </div>
        <web-board></web-board>
      </div>
      <screen-share v-show="isScreenShare"></screen-share>
      <div
        class="el-mobile-main-board"
        v-show="liveState!=$constant.LiveState.Living && !isBoardFullscreen"
      ></div>
      <div class="el-mobile-main-btns" v-show="!isBoardFullscreen && !isVideoFullscreen">
        <!-- 申请连麦 -->
        <el-button
          v-show="userType != 0
            && liveState===$constant.LiveState.Living 
            && requestType===$constant.LiveCommand.RequestNone 
            && !$webrtc.hasLocalStream()"
          type="success"
          size="mini"
          @click="bannerBtn('requestMic')"
        >{{$t('banner.requestMic')}}</el-button>
        <!-- 申请视频 -->
        <el-button
          v-show="userType != 0
            && liveState===$constant.LiveState.Living 
            && requestType===$constant.LiveCommand.RequestNone 
            && !$webrtc.hasLocalStream()"
          type="success"
          size="mini"
          @click="bannerBtn('requestVideo')"
        >{{$t('banner.requestVideo')}}</el-button>
        <!-- 取消申请 -->
        <el-button
          v-show="userType!=0
            && liveState===$constant.LiveState.Living
            && requestType!=$constant.LiveCommand.RequestNone
            && !$webrtc.hasLocalStream()"
          type="success"
          size="mini"
          @click="bannerBtn('cancelRequest')"
        >{{$t('banner.cancelRequest')}}</el-button>
        <!-- 下麦 -->
        <el-button
          v-show="userType!=0 && $webrtc.hasLocalStream()"
          type="success"
          size="mini"
          @click="bannerBtn('closeLink')"
        >{{$t('banner.closeLink')}}</el-button>
        <!-- 音频模式 -->
        <!-- <el-button
          v-show="hasVideo"
          type="success"
          size="mini"
          @click="bannerBtn(voiceMode)"
        >{{$t('banner.voiceMode')}}</el-button>-->
        <!-- 切换摄像头 -->
        <el-button
          v-show="hasVideo"
          type="success"
          size="mini"
          @click="bannerBtn('changeCamera')"
        >{{$t('banner.changeCamera')}}</el-button>
      </div>
      <div
        class="el-mobile-main-help"
        @click="cantPlay"
        v-if="osType == 'Android'"
      >{{$t('main.cantPlay')}}</div>
    </div>
    <div
      class="el-mobile-main-msg-content el-mobile-main-content"
      v-show="tabIndex === 1 && !isBoardFullscreen && !isVideoFullscreen"
      :style="msgContentStyle"
      @click="closeSendBox"
    >
      <div class="el-msg-box">
        <div
          class="msg"
          :class="item.isSelf?'el-msg-rt':'el-msg-lf'"
          v-for="(item, index) in imMsgList"
          :key="index"
        >
          <div class="el-msg-name">
            <span style="margin-right: 5px">{{item.userName}}</span>
            <span>{{$utils.right(item.sendTime,8)}}</span>
          </div>
          <div class="el-msg-content">
            <div class="el-msg-content-text" v-if="item.content">
              <template v-for="(msg,index) in item.content">
                <span v-if="msg.name === 'img'" :key="index">
                  <img :src="msg.src" width="20px" height="20px" />
                </span>
                <span v-else-if="msg.name === 'text'" :key="index">{{msg.text}}</span>
              </template>
            </div>
            <div class="el-msg-content-text el-msg-content-img" v-if="item.imageInfo">
              <img
                :src="item.imageInfo.imageUrl"
                alt
                :width="item.imageInfo.width>150?150:item.imageInfo.width"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="el-input-box" v-show="tabIndex === 1 && !isVideoFullscreen">
      <div class="el-input-send-box">
        <i class="iconfont icon-addBoard" @click="showOthers"></i>
        <el-input
          @click="closeEmojis"
          v-model="inputText"
          size="mini"
          :placeholder="$t('main.sendHint')"
          @keyup.enter.native="sendMsg"
        ></el-input>
        <i class="iconfont icon-emoji" @click="showEmojis"></i>
        <el-button type="success" size="mini" @click="sendMsg">{{$t('main.send')}}</el-button>
      </div>
      <div class="emojis" v-if="showEmojisBox">
        <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmojis(item)">
          <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px" />
        </div>
      </div>
      <div class="emojis" v-if="showOtherBox">
        <i class="iconfont icon-picture" @click="sendImageClick"></i>
        <!-- <i class="iconfont icon-toolcase" @click="sendFileClick"></i>
        <i class="iconfont icon-present"></i>-->
      </div>
    </div>
    <sign-in ref="signIn" v-show="showSignIn"></sign-in>
    <qa-answer ref="qaAnswer" v-show="showQa"></qa-answer>
    <input
      type="file"
      id="imagePicker"
      ref="imagePicker"
      @change="sendImage"
      accept="image/*"
      mutiple="mutiple"
      style="display:none"
    />
    <input
      type="file"
      id="filePicker"
      ref="filePicker"
      accept=".ppt, .pptx, .doc, .docx, .xls, .xlsc, .pdf, .mp4, .avi, .wmv"
      @change="sendFile"
      style="display:none"
    />
    <apple-auth v-show="isApple" ref="AppleAuthBrowser"></apple-auth>
  </div>
</template> 
<script>
import Constant from '@/constant/constant'
import { emojiMap, emojiName, emojiUrl } from '@/tencent/webim/emojiMap'
import ScreenShare from '@/components/screenshare/ScreenShare'
import webBoard from '@/components/webboard/WebBoard'
import qaAnswer from '@/components/qa/QaAnswer'
import signIn from '@/components/signin/SignIn'
import MemberVideoPanel from './components/MemberVideoPanel'
import AppleAuth from '@/components/apple/AppleAuth'
import { mapState } from 'vuex'
export default {
  components: {
    webBoard,
    signIn,
    qaAnswer,
    ScreenShare,
    MemberVideoPanel,
    AppleAuth
  },
  data () {
    return {
      showOtherBox: false,
      showEmojisBox: false,
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      liveNotStart: require('@/assets/img/main/livenotstart.jpg'),
      livePause: require('@/assets/img/main/livepause.jpg'),
      liveOver: require('@/assets/img/main/liveover.jpg'),
      voiceLive: require('@/assets/img/main/voicelive.jpg'),
      teacherLeave: require('@/assets/img/main/teacherleave.jpg'),
      tabIndex: 0,
      inputText: '',
      teacherVideoStyle: '',
      msgContentStyle: '',
      cameraType: 'user',         // 前置user; 后置 environment
      heartbeatTask: null,        // 心跳任务定时器
      liveStateTask: null,
      isBoardFullscreen: false,   // 课件是否全屏
      isVideoFullscreen: false,   // 老师视频是否全屏
      boardFullscreenStyle: '',   // 课件全屏下样式
      videoFullscreenStyle: '',   // 老师视频全屏下的样式
      isApple: false,             // 是否是苹果系统
    }
  },
  computed: {
    // 一般值都这样写进去 但是此时 在 data() 里 不能定义相同名称的的变量了 
    // 组件里需要的值 要这样引用 两种引用方式 比如userName绑定了v-model 就不能在这里引用了 
    // 在组件内需要修改引入的数据的 不要再this.abc = abc 而是应该 this.$store.commit(functionName, value)来做全局的改变
    ...mapState({
      roomID: 'roomID',
      userID: 'userID',
      userName: 'userName',
      teacher: 'teacher',
      assistants: 'assistants', // 助教信息
      students: 'students',// 学生信息
      userType: 'userType',
      imMsgList: 'imMsgList',
      roomInfo: 'roomInfo',
      liveState: 'liveState',
      liveSecond: 'liveSecond',
      osType: 'osType',
      browserType: 'browserType',
      browserVersion: 'browserVersion',
      clientType: 'clientType',
      requestType: 'requestType',
      country: 'country',
      province: 'province',
      city: 'city',
      isp: 'isp',
      hasVideo: 'hasVideo',
      isScreenShare: 'isScreenShare',
      showQa: 'showQa',
      showSignIn: 'showSignIn'
    }),
    mobileWidth: {
      get () {
        return this.$store.state.mobileWidth
      },
      set (val) {
        this.mobileWidth = val
      }
    },
    mobileHeight: {
      get () {
        return this.$store.state.mobileHeight
      },
      set (val) {
        return this.$store.commit('setLiveState', newVal)
      }
    }
  },
  watch: {
    liveState (newVal, oldVal) {
      // 不是老师的变化
      if (newVal && this.userType != 0) {
        if (newVal === Constant.LiveState.Living) { // 直播中
          // 学生和助教加入房间，必须先加入房间，否则不知道老师是谁
          this.joinRoom()
        } else if (newVal === Constant.LiveState.Pause) {  //暂停房间
          this.pauseRoom()
        } else if (newVal === Constant.LiveState.TeacherLeave) {  //暂停房间
          this.quitRoom()
        } else if (newVal === Constant.LiveState.Quit) {  // 退出房间
          this.quitRoom()
        } else if (newVal === Constant.LiveState.Close) {  // 关闭房间
          // 退出房间
          this.quitRoom()
        } else if (newVal === Constant.LiveState.ForceClose) {  // 强制关闭房间
          // 退出房间
          this.quitRoom()
          // 强制退出提示
          this.$message.alert(this, this.$t('main.forceClose'))
        }
      }
    },
    showQa (newVal, oldVal) {
      this.showQa = newVal
      if (newVal == true) {
        this.$refs.qaAnswer.setVisible()
      }
    },
    showSignIn (newVal, oldVal) {
      this.showSignIn = newVal
      if (newVal == true) {
        this.$refs.signIn.setVisible()
      }
    }
  },
  created () {
    // 获取页面参数
    this.$func.getQuery(this.$route.query)
    // 检查WebRTC是否支持
    this.$func.checkWebrtc()
    // 系统(0-pc;1-手机)
    this.$store.commit('setClientType', Constant.ClientType.Mobile)
    // 获得系统消息
    this.$func.getSysInfo()
  },
  mounted () {
    var osType = this.$utils.getOsType()
    if (this.osType === "iPhone" || this.osType === 'iPad') {
      this.isApple = true
      this.$refs.AppleAuthBrowser.setVisible()
    }
    this.$store.commit('setMobileWidth', document.body.clientWidth)
    this.$store.commit('setMobileHeight', window.screen.height)

    this.boardFullscreenStyle1 = 'height:' + this.mobileWidth + 'px;' + 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(90deg);'
    this.boardFullscreenStyle = 'width:' + this.mobileHeight + 'px;' + 'height:' + this.mobileWidth + 'px;'

    this.getTeacherVideoHeight()

    // 停止心跳
    this.stopHeartbeat()
    // 停止直播状态监控
    this.stopWatchLiveState()

    // 地理位置信息, 获得房间信息
    this.$func.getLocation().then(res => {
      this.getRoomInfo()
    }).catch(err => {
      this.getRoomInfo()
    })
  },
  beforeDestroy () {
    // 停止心跳
    this.stopHeartbeat()
    // 停止直播状态监控
    this.stopWatchLiveState()
  },
  // 退出时清除
  distroyed () {
  },
  methods: {
    // 截取丢包
    rtcSubstr (str) {
      return str.substr(str.lastIndexOf(',') + 1)
    },
    // 看不到画面怎么办
    cantPlay () {
      this.$router.push({ path: '/cantPlay', query: {} })
    },
    closeSendBox () {
      this.showEmojisBox = false
      this.showOtherBox = false
    },
    showOthers () {
      this.showEmojisBox = false
      this.showOtherBox = true
    },
    // 发送图片
    sendImage () {
      this.$webim.sendImageMessage(
        this.$refs.imagePicker.files[0]
      ).then(res => {
        this.showOtherBox = false
        this.$refs.imagePicker.value = null
      })
    },
    // 发送文件
    sendFile () {
      console.error(this.$refs.filePicker.files[0])
      this.$webim.sendFileMessage(
        this.$refs.filePicker.files[0]
      ).then(res => {
        this.showOtherBox = false
        this.$refs.filePicker.value = null
      })
    },
    sendImageClick () {
      this.$refs.imagePicker.click()
    },
    sendFileClick () {
      this.$refs.filePicker.click()
    },
    closeEmojis () {
      this.showEmojisBox = false
      this.showOtherBox = false
    },
    chooseEmojis (item) {
      console.log(item)
      this.inputText += item
      this.showEmojisBox = false
    },
    showEmojis () {
      this.showOtherBox = false
      this.showEmojisBox = true
    },
    // 申请连麦，申请视频，取消申请
    bannerBtn (command) {
      // 申请连麦，申请视频，取消申请
      if (command === 'requestMic' || command === 'requestVideo' || command === 'cancelRequest') {
        var requestType = Constant.LiveCommand.RequestNone

        if (command === 'requestMic') {
          requestType = Constant.LiveCommand.RequestMic
        } else if (command === 'requestVideo') {
          requestType = Constant.LiveCommand.RequestVideo
        }

        this.$store.commit('setRequestType', requestType)
        // 发送命令
        this.$webim.sendCommand(requestType)
        // 同步后台
        this.$func.setRequestType(this.userID, requestType)
      } else if (command === 'closeLink') {
        // 下麦
        this.$webrtc.stopLocalStream()
      } else if (command === 'voiceMode') {

      } else if (command === 'changeCamera') {
        this.cameraType = this.cameraType === 'user' ? 'environment' : 'user'
        this.$webrtc.switchDevice('video', this.cameraType)
      }
    },
    // 设置签到
    setSignInShow () {
      this.$refs.signIn.setVisible()
    },
    // 设置答题 
    setExamineShow () {
      this.$refs.qaAnswer.setAnswerVisible()
    },
    videoFullscreen () {
      if (this.isVideoFullscreen) {
        this.isVideoFullscreen = false
        this.videoFullscreenStyle = ''
        let fullwidth = this.$store.state.mobileWidth
        this.teacherVideoStyle = 'height:' + (fullwidth / 16 * 9) + 'px;'
      } else {
        this.isVideoFullscreen = true
        let fullwidth = this.$store.state.mobileWidth
        this.videoFullscreenStyle = 'width:' + this.mobileHeight + 'px;' + 'height:' + this.mobileWidth + 'px;'
        this.teacherVideoStyle = 'height:' + fullwidth + 'px;'
      }
    },
    boardFullscreen () {
      if (this.isBoardFullscreen) {
        this.isBoardFullscreen = false
        let fullwidth = this.$store.state.mobileWidth
        this.teacherVideoStyle = 'height:' + (fullwidth / 16 * 9) + 'px;'
      } else {
        this.isBoardFullscreen = true
        this.teacherVideoStyle = 'height: 45px;'
        let fullwidth = this.$store.state.mobileWidth
      }

      this.$webboard.resize()
    },
    // 获取登录信息
    getRoomInfo () {
      // 获得房间信息
      this.$api.getRoomInfo({
        roomID: this.roomID
      }).then(res => {
        if (res.code === 0) {
          // 日志初始化
          this.$logReport.init()
          // 获取房间信息
          this.$store.commit('setRoomInfo', res.roomInfo)
          // 获得登录信息
          this.getLoginInfo()
        } else {
          this.$message.notify(this, 'error', res.message)
        }
      })
    },
    // 获取登录信息
    getLoginInfo () {
      //获得登录信息
      this.$api.getLoginInfo({
        roomID: this.roomID,
        userID: this.userID
      }).then(res => {
        if (res.code === 0) {
          // 获得login信息
          this.$store.commit('setLoginInfo', res.loginInfo)

          // 初始化
          this.$webim.init()
          // 登录
          this.$webim.login()
          // 加入im群组
          this.$webim.joinGroup()
          // 初始化Webrtc
          this.$webrtc.init()
          // 初始化 云盘
          this.$cos.init()
          // 后台加入房间
          this.joinRoom()
        } else {
          // 获取登录信息失败
          this.$message.notify(this, 'error', this.$t('main.loginInfoError'))
        }
      })
    },
    // 加入房间
    joinRoom () {
      // 加入房间
      this.$api.joinRoom(
        this.$store.getters.joinRoomParam
      ).then(res => {
        if (res.code === 0) {
          // 设置房间信息
          this.$func.setLiveRoom(res)

          // 直播状态
          if (this.liveState === Constant.LiveState.Living) {
            // 这种情况，是老师刷新了
            // 初始化 Board
            this.$webboard.init()
            // 进入房间
            this.$webrtc.joinRoom()
            // 监控直播状态
            this.watchLiveState()
          }

          // 开始心跳监控
          this.startHeartbeat()
        } else {
          this.$message.notify(this, 'error', res.message)
        }
      })
    },
    // 开始心跳
    startHeartbeat () {
      if (!this.heartbeatTask) {
        this.heartbeatTask = setInterval(() => {
          // 加入房间
          this.$api.joinRoom(
            this.$store.getters.joinRoomParam
          ).then(res => {
            if (res.code === 0) {
              // 设置房间信息
              this.$func.setLiveRoom(res)
            }
          })
        }, this.userType === 0 ? 6000 : 25000)
      }
    },
    // 停止心跳
    stopHeartbeat () {
      clearInterval(this.heartbeatTask)
      this.heartbeatTask = null
    },
    // 直播状态
    watchLiveState () {
      if (!this.liveStateTask) {
        this.liveStateTask = setInterval(() => {
          if (this.liveState === Constant.LiveState.Living && this.liveSecond >= 0) {
            // webrtc 监控
            this.$webrtc.getRtcStats()
            // 增加市场
            var liveSecond = this.liveSecond + 1
            this.$store.commit('setLiveSecond', liveSecond)
          }
        }, 1000)
      }
    },
    // 停止计算时间
    stopWatchLiveState () {
      clearInterval(this.liveStateTask)
      this.liveStateTask = null
    },
    // 暂停房间
    pauseRoom () {
      // 停止监控
      this.stopWatchLiveState()

      this.$api.pauseRoom({
        roomID: this.roomID
      }).then(res => {
        if (res.code === 0) {
          this.$store.commit('setLiveState', Constant.LiveState.Pause)
          this.$webim.sendCommand(Constant.LiveCommand.Pause)
          this.$webrtc.quitRoom()
        }
      })
    },
    // 退出房间
    quitRoom () {
      // 停止心跳
      this.stopHeartbeat()
      // 停止监控
      this.stopWatchLiveState()

      // 退出信息
      this.$api.quitRoom({
        roomID: this.roomID,
        userID: this.userID,
        loginTime: this.loginTime
      }).then(res => {
        if (res.code === 0) {
          // 退出房间
          if (this.userType === 0) {
            this.$store.commit('setLiveState', Constant.LiveState.Quit)
            this.$webim.sendCommand(Constant.LiveCommand.Quit)
          }
          // 退出房间
          this.$webrtc.quitRoom()
          // 退出白板
          this.$webboard.quit()
        }
      })
    },
    clickTab (type) {
      if (type === 'course') {
        this.tabIndex = 0
      } else if (type === 'chat') {
        this.$store.commit('setNewMsgCount', 0)
        this.tabIndex = 1
      }
    },
    scrollToBottom () {
      this.$nextTick(() => {
        var container = this.$el.querySelector(".el-mobile-main-msg-content");
        container.scrollTop = container.scrollHeight;
      })
    },
    sendMsg () {
      if (this.inputText && this.inputText.length > 0) {
        this.$webim.sendTextMessage(this.inputText)
        this.$func.addTextMsg({
          userID: this.userID,
          userName: this.userName,
          faceUrl: '',
          content: this.inputText,
          sendTime: this.$utils.getNowTime(),
          isSelf: true
        })
        this.inputText = ''
        this.scrollToBottom()
      }
    },
    getTeacherVideoHeight () {
      let fullwidth = this.$store.state.mobileWidth
      this.teacherVideoStyle = 'height:' + (fullwidth / 16 * 9) + 'px;'
      this.msgContentStyle = 'height:' + (window.screen.availHeight - (fullwidth / 16 * 9) - 26 - 40) + 'px;'
    }
  }
}
</script>  
<style lang="css" scoped>
.el-mobile-main-banner {
  height: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  box-sizing: border-box;
  background: #26b26d;
  color: #fff;
  font-size: 14px;
}
.el-main-banner-lf {
  width: 85%;
  display: flex;
  align-items: center;
}
.el-main-banner-lf span {
  display: inline-block;
}
.el-main-banner-lf span:first-child {
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.video {
  overflow: hidden;
  position: relative;
}
.video img {
  width: 100%;
  display: block;
  /* margin-top: -50px; */
}
#mobileTeacherVideo {
  width: 100%;
  height: 150px;
}
.mobile-board-video {
  position: fixed;
  width: 80px;
  height: 45px;
  top: 0;
  right: 0;
  z-index: 2001;
}
.el-mobile-video-icon {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 24px;
  padding: 0 10px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 2001;
}
.el-mobile-main-tabs {
  display: flex;
  align-items: center;
  height: 40px;
  border-top: 1px solid #f0f0f0;
}
.el-mobile-main-tab {
  flex: 1;
  width: 50%;
  line-height: 39px;
  height: 100%;
  border-bottom: 1px solid transparent;
  text-align: center;
}
.el-mobile-main-tab-active {
  color: #26b26d !important;
  border-bottom: 1px solid #26b26d !important;
}
.el-mobile-main-content {
  /* padding: 10px; */
  box-sizing: border-box;
}
.el-mobile-main-board {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  position: relative;
}
.el-mobile-main-board-full {
  position: absolute;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 20;
}
.el-mobile-main-btns {
  padding: 0 10px;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.el-mobile-main-btns /deep/ .el-button--mini,
.el-button--mini.is-round {
  padding: 7px 10px;
}
.el-mobile-main-btns /deep/ .el-button {
  background: #26b26d !important;
}
.el-msg-box {
  width: 100%;
  float: left;
}
.el-mobile-main-msg-content {
  height: 450px;
  overflow-y: scroll;
  padding-top: 10px;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.el-member-box {
  font-size: 14px;
}
.member {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 10px;
  box-sizing: border-box;
  margin-left: 10px;
}
.el-member-name {
  display: inline-block;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 21px;
}
.msg {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}
.msg:last-child {
  margin-bottom: 0;
}
.el-msg-lf {
  float: left;
  padding-left: 10px;
}
.el-msg-rt {
  float: right;
  padding-right: 10px;
}
.msg .el-msg-name {
  font-size: 10px;
  margin-bottom: 3px;
}
.el-msg-rt .el-msg-name {
  text-align: right;
}
/* .el-msg-content span {
  display: inline-block;
  margin: 0;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 70%;
}
.el-msg-lf .el-msg-content span {
  background: #ececec;
  color: #181818;
  float: left;
}
.el-msg-rt .el-msg-content span {
  background: #26B26D;
  color: #181818;
  float: right;
} */
.el-mobile-main-msg-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #fff;
}
.el-mobile-main-msg-content::-webkit-scrollbar-button {
  display: none;
}
.el-mobile-main-msg-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #aeaeae;
}
.el-mobile-main-msg-content::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #fff;
}
.el-input-box {
  width: 100%;
  /* padding: 10px 0; */
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
}
.el-input-box .el-input-send-box {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
}
.el-input-box .el-input,
i {
  margin-right: 5px;
}
.el-input-box i {
  font-size: 24px;
  height: 24px;
}
.el-input-box .el-input /deep/ .el-input__inner {
  border-radius: 30px;
}
.el-input-box /deep/ .el-button {
  background: #26b26d !important;
}
.el-input-box .emojis {
  width: 100%;
  height: 160px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
  background: #f2f2f2;
}
.emoji {
  height: 32px;
  width: 32px;
  box-sizing: border-box;
}

.el-input-box .emojis i {
  font-size: 36px;
  height: 36px;
}

.el-msg-content-text {
  margin: 0;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 76%;
  vertical-align: middle;
}
.el-msg-lf .el-msg-content .el-msg-content-text {
  background: #ececec;
  color: #181818;
  float: left;
}
.el-msg-rt .el-msg-content .el-msg-content-text {
  background: #67c23a;
  color: #181818;
  float: right;
}
.el-msg-content .el-msg-content-text span {
  vertical-align: middle;
}
.el-msg-content .el-msg-content-text span img {
  vertical-align: middle;
}
.el-mobile-main-help {
  text-align: center;
  color: #26b26d;
  text-decoration-line: underline;
  margin: 10px 0;
}
</style>