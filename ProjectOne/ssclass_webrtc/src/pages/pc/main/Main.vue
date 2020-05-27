<template>
  <div class="main-container" ref="imageTofile">
    <div
      class="main-tip-box"
      @click="showRequestTips"
      v-show="userType === 0 && requestMembers.length"
    >
      <i class="el-icon-arrow-left"></i>
    </div>
    <help v-show="operateCommand === 'help'" ref="help"></help>
    <request-list ref="RequestListTip" v-show="showRequestTip"></request-list>
    <banner @bannerBtn="bannerBtn"></banner>
    <right-panel ref="rightPanel"></right-panel>
    <clouddesk v-show="operateCommand === 'clouddesk'" ref="clouddesk"></clouddesk>
    <qa v-show="operateCommand === 'qa'" ref="qa"></qa>
    <qa-answer v-show="showQa" ref="qaAnswer"></qa-answer>
    <sign-in-set v-show="operateCommand === 'signInSet'" ref="signInSet"></sign-in-set>
    <sign-in v-show="showSignIn" ref="signIn"></sign-in>
    <device-test v-show="deviceTestShow" ref="deviceTest"></device-test>
    <device-change v-show="deviceChangeShow" ref="deviceChange"></device-change>
    <web-board @operateNav="operateNav" v-show="!isScreenShare"></web-board>
    <screen-share v-show="isScreenShare"></screen-share>
    <member-video-panel ref="MemberVideo"></member-video-panel>
    <stats v-show="operateCommand === 'stats'" ref="stats"></stats>
    <apple-auth v-show="isApple" ref="AppleAuthBrowser"></apple-auth>
  </div>
</template>

<script>
import Constant from '@/constant/constant'
import LogEvent from '@/log/LogEvent'
import WebBoard from '@/components/webboard/WebBoard'
import ScreenShare from '@/components/screenshare/ScreenShare'
import QaAnswer from '@/components/qa/QaAnswer'
import SignIn from '@/components/signin/SignIn'
import Banner from './components/Banner'
import RightPanel from './components/RightPanel'
import Clouddesk from './components/Clouddesk'
import Qa from './components/Qa'
import SignInSet from './components/SignInSet'
import Stats from './components/Stats'
import Help from './components/Help'
import DeviceTest from './components/DeviceTest'
import DeviceChange from './components/DeviceChange'
import MemberVideoPanel from './components/MemberVideoPanel'
import RequestList from './components/RequestList'
import html2canvas from 'html2canvas'
import AppleAuth from '@/components/apple/AppleAuth'

import { mapState } from 'vuex'
export default {
  components: {
    htmlUrl: '',
    Help,
    Banner,
    DeviceTest,
    DeviceChange,
    MemberVideoPanel,
    WebBoard,
    RightPanel,
    Clouddesk,
    Qa,
    QaAnswer,
    SignInSet,
    SignIn,
    RequestList,
    ScreenShare,
    Stats,
    AppleAuth
  },
  data () {
    return {
      notSupport: true,          // 浏览器检查
      deviceTestShow: false,      // 设备检测
      deviceChangeShow: false,    // 设备切换
      operateCommand: null,       // 右边命令
      heartbeatTask: null,        // 心跳任务定时器
      liveStateTask: null,        // 直播监控任务
      showRequestTip: false,      // 获取用户的申请信息
      isApple: false,             // 是否是safari浏览器
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
      roomInfo: 'roomInfo',
      liveState: 'liveState',
      liveSecond: 'liveSecond',
      osType: 'osType',
      browserType: 'browserType',
      browserVersion: 'browserVersion',
      clientType: 'clientType',
      country: 'country',
      province: 'province',
      city: 'city',
      isp: 'isp',
      requestMembers: 'requestMembers',
      isScreenShare: 'isScreenShare',
      showQa: 'showQa',
      showSignIn: 'showSignIn'
    })
  },
  created () {
    // 获取页面参数
    this.$func.getQuery(this.$route.query)
    // 检查WebRTC是否支持
    this.$func.checkWebrtc()
    // 系统
    this.$store.commit('setClientType', Constant.ClientType.PC)
    // 获得系统消息
    this.$func.getSysInfo()
  },
  mounted () {
    var browserType = this.$utils.getBrowserType()
    if (browserType == "Safari") {
      this.isApple = true
      this.$refs.AppleAuthBrowser.setVisible()
    }
    // 停止心跳
    this.stopHeartbeat()
    // 停止监控
    this.stopWatchLiveState()

    // 地理位置信息, 获得房间信息
    this.$func.getLocation().then(res => {
      this.getRoomInfo()
    }).catch(err => {
      this.getRoomInfo()
    })

    // 添加监控
    window.addEventListener('beforeunload', this.beforeunloadHandler, false);
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
      if (newVal == true) {
        this.$refs.qaAnswer.setVisible()
      }
    },
    showSignIn (newVal, oldVal) {
      if (newVal == true) {
        this.$refs.signIn.setVisible()
      }
    }
  },
  beforeDestroy () {
    //在 beforeDestroy 钩子移除beforeunload事件
    window.removeEventListener('beforeunload', this.beforeunloadHandler, false);

    // 停止心跳
    this.stopHeartbeat()
    // 停止监控
    this.stopWatchLiveState()
  },
  // 退出时清除
  distroyed () {
  },
  methods: {
    handleTips () {
      this.showRequestTip = false
    },
    showRequestTips () {
      this.showRequestTip = true
      this.$refs.RequestListTip.setVisible()
    },
    //beforeunload监听事件
    async beforeunloadHandler (e) {
      await this.$webim.sendCommand(Constant.UserCommand.IQuit)

      // 退出房间
      await this.quitRoom()

      // 退出房间
      await this.$logReport.report(LogEvent.Quit_Main, {
        errorCode: 0,
        errorDesc: '',
        timeCost: 0,
        data: '',
        ext: '',
      })
    },
    // 工具条
    bannerBtn (command) {
      if (command === 'deviceTest') {
        this.deviceTestShow = true
        this.$refs.deviceTest.setVisible()
      } else if (command === 'deviceChange') {
        this.deviceChangeShow = true
        this.$refs.deviceChange.setVisible()
      } else if (command === 'startRoom') {
        this.startRoom()
      } else if (command === 'pauseRoom') {
        this.pauseRoom()
      } else if (command === 'resumeRoom') {
        this.resumeRoom()
      } else if (command === 'quitRoom') {
        this.quitRoom()
      } else if (command === 'closeRoom') {
        this.closeRoom()
      } else if (command === 'help') {
        this.operateCommand = 'help'
        this.$refs.help.setVisible()
      }
    },
    // 命令条
    operateNav (command) {
      if (command === 'clouddesk') {
        this.operateCommand = 'clouddesk'
        this.$refs.clouddesk.setVisible()
      } else if (command === 'screenShare') {
        // 是否支持屏幕分享
        if (!this.$webrtc.isSupportScreenShare()) {
          this.$message.notify(this, 'error', this.$t('webrtc.notSupportScreenShare'))
          return
        }
        this.$webrtc.screenShare()
      } else if (command === 'qa') {
        this.operateCommand = 'qa'
        this.$refs.qa.setVisible()
      } else if (command === 'signIn') {
        this.operateCommand = 'signInSet'
        this.$refs.signInSet.setVisible()
      } else if (command === 'stats') {
        this.operateCommand = 'stats'
        this.$refs.stats.setVisible()
      } else if (command === 'clock') {
        // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        html2canvas(this.$refs.imageTofile, {
          backgroundColor: null,
          useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
        }).then((canvas) => {
          let url = canvas.toDataURL('image/png')
          this.htmlUrl = url
          console.info('screenshot', url)
          // 把生成的base64位图片上传到服务器,生成在线图片地址
        })
      }
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

          // 只有老师才 初始化 Board
          if (this.userType == 0) {
            this.$webboard.init()
          }
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
            if (this.userType === 0) {
              this.startRoom()
            } else {
              // 初始化 Board
              this.$webboard.init()
              // 进入房间
              this.$webrtc.joinRoom()
              // 监控直播状态
              this.watchLiveState()
            }
          }

          // 开始心跳监控
          this.startHeartbeat()
        } else {
          this.$message.notify(this, 'error', res.message)
        }
      })
    },
    // 开始心跳（心跳的目的是为了）
    // 老师和学生，获得成员信息, 老师和学生监控信息不同
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
    // 开始房间
    startRoom () {
      // 加入房间
      this.$webrtc.joinRoom(res => {
        if (res.code === 0) {
          // 如果是老师打开本地视频
          this.$webrtc.createLocalStream()

          // 开始房间直播
          this.$api.startRoom({
            roomID: this.roomID
          }).then(res => {
            if (res.code === 0) {
              this.$store.commit('setLiveState', Constant.LiveState.Living)

              // 班级成员信息
              this.$store.commit('setLiveSecond', res.liveSecond)
              // 开始心跳
              this.startHeartbeat()
              // 开始监控
              this.watchLiveState()
            } else {
              this.$message.notify(this, 'error', res.message)
            }
          })

          this.$webim.sendCommand(Constant.LiveCommand.Start)
        }
      })
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
    // 暂停房间（只有老师可以操作）
    resumeRoom () {
      // 加入房间
      this.$webrtc.joinRoom(res => {
        if (res.code === 0) {
          // 如果是老师打开本地视频
          this.$webrtc.createLocalStream()

          // 恢复房间
          this.$api.resumeRoom({
            roomID: this.roomID
          }).then(res => {
            if (res.code === 0) {
              // 开始心跳
              this.startHeartbeat()
              // 开始监控
              this.watchLiveState()
            }
          })
          this.$webim.sendCommand(Constant.LiveCommand.Start)
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
        userID: this.userID
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
    // 关闭房间（只有老师可以操作）
    closeRoom () {
      // 确定是否关闭
      this.$message.alert(this, this.$t('main.closeRoomAlert'), 'okcancel').then(res => {
        if (res === 'cancel') {
          return
        }
      })

      // 老师还在房间，不能关闭
      if (this.userType != 0 && this.teacher) {
        this.$message.notify(this, 'error', this.$t('main.cantCloseWithTeacher'))
        return
      }

      // 停止心跳
      this.stopHeartbeat()
      // 停止监控
      this.stopWatchLiveState()

      this.$api.closeRoom({
        roomID: this.roomID,
        userID: this.userID
      }).then(res => {
        if (res.code === 0) {
          // 关闭房间
          if (this.userType === 0) {
            this.$store.commit('setLiveState', Constant.LiveState.Close)
            this.$webim.sendCommand(Constant.LiveCommand.Close)
          }
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../assets/css/main.css";
</style>