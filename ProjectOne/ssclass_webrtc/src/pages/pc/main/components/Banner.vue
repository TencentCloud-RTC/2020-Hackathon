<template>
  <div class="banner-container">
    <div class="banner-container-box">
      <el-row>
        <el-col :span="0.5">
          <div class="logo">
            <img :src="logoImg" alt style="width:22px;" />
          </div>
        </el-col>
        <el-col class="el-col-room-name" :span="3.5">
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="roomInfo?roomInfo.roomName:''"
            placement="bottom-start"
          >
            <span>{{roomInfo?roomInfo.roomName:''}}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="2.5">
          <span>({{$t('banner.online')}} {{$func.getMemberCount()}}{{$t('banner.person')}} )</span>
        </el-col>
        <!-- 上课时间 -->
        <el-col :span="0.2">
          <i>|</i>
        </el-col>
        <el-col :span="2.5">
          <span style="margin-top:2px">{{$func.getLiveTime()}}</span>
        </el-col>
        <!-- 全屏 -->
        <!-- <el-col :span="0.2">
          <i>|</i>
        </el-col>
        <el-col :span="2.5">
          <span
            @click="fullscreen"
            @mouseenter="mouseEnter('fullscreen')"
            @mouseleave="mouseLeave"
            :class="{'mouseenter':enterCommand==='fullscreen'}"
          >{{isFullScreen?$t('banner.exitFullscreen'):$t('banner.fullscreen')}}</span>
        </el-col>-->
        <!-- 传输数据 -->
        <el-col :span="0.2" v-show="liveState===$constant.LiveState.Living">
          <i>|</i>
        </el-col>
        <el-col :span="9" v-show="liveState===$constant.LiveState.Living">
          <span style="font-size:9px">{{$func.getRtcStats()}}</span>
        </el-col>
      </el-row>
      <!-- 修改名字 -->
      <el-row>
        <el-col :span="2.5">
          <span
            @click="modifyUserName"
            @mouseenter="mouseEnter('userName')"
            @mouseleave="mouseLeave"
            :class="{'mouseenter':enterCommand==='userName'}"
          >
            <span>{{userName}}</span>
          </span>
        </el-col>
        <!-- 开始上课（只要老师可以） -->
        <el-col
          :span="2.5"
          v-show="userType===0 && (liveState===$constant.LiveState.NotStart
            || liveState===$constant.LiveState.TeacherLeave
            || liveState===$constant.LiveState.Quit)"
        >
          <el-button
            type="primary"
            size="mini"
            :round="true"
            @click="showDeviceOptionDlg()"
          >{{$t('banner.startRoom')}}</el-button>
        </el-col>
        <!-- 暂停上课（只有老师可以） -->
        <el-col :span="2.5" v-show="userType===0 && liveState===$constant.LiveState.Living">
          <el-button
            type="primary"
            size="mini"
            :round="true"
            @click="bannerBtn('pauseRoom')"
          >{{$t('banner.pauseRoom')}}</el-button>
        </el-col>
        <!-- 继续上课（只有老师可以） -->
        <el-col :span="2.5" v-show="userType===0 && liveState===$constant.LiveState.Pause">
          <el-button
            type="primary"
            size="mini"
            :round="true"
            @click="bannerBtn('resumeRoom')"
          >{{$t('banner.resumeRoom')}}</el-button>
        </el-col>
        <!-- 申请连麦（不是老师，直播中，没有申请，没有本地流） -->
        <el-col
          :span="2.5"
          v-show="userType != 0 
          && liveState===$constant.LiveState.Living 
          && requestType===$constant.LiveCommand.RequestNone 
          && !$webrtc.hasLocalStream()"
        >
          <el-button
            type="success"
            size="mini"
            :round="true"
            @click="bannerBtn('requestMic')"
          >{{$t('banner.requestMic')}}</el-button>
        </el-col>
        <!-- 申请视频（不是老师，直播中，没有申请，没有本地流） -->
        <el-col
          :span="2.5"
          v-show="userType != 0
            && liveState===$constant.LiveState.Living 
            && requestType===$constant.LiveCommand.RequestNone 
            && !$webrtc.hasLocalStream()"
        >
          <el-button
            type="success"
            size="mini"
            :round="true"
            @click="bannerBtn('requestVideo')"
          >{{$t('banner.requestVideo')}}</el-button>
        </el-col>
        <!-- 取消申请（不是老师，直播中，申请中，没有本地流） -->
        <el-col
          :span="2.5"
          v-show="userType!=0
            && liveState===$constant.LiveState.Living
            && requestType!=$constant.LiveCommand.RequestNone
            && !$webrtc.hasLocalStream()"
        >
          <el-button
            type="success"
            size="mini"
            :round="true"
            @click="bannerBtn('cancelRequest')"
          >{{$t('banner.cancelRequest')}}</el-button>
        </el-col>
        <!-- 下麦（不是老师，有本地流） -->
        <el-col :span="2.5" v-show="userType!=0 && $webrtc.hasLocalStream()">
          <el-button
            type="success"
            size="mini"
            :round="true"
            @click="bannerBtn('closeLink')"
          >{{$t('banner.closeLink')}}</el-button>
        </el-col>
        <!-- 设备调试 -->
        <el-col :span="2.5" v-show="!$webrtc.hasLocalStream()">
          <el-button
            type="primary"
            size="mini"
            :round="true"
            @click="bannerBtn('deviceTest')"
          >{{$t('banner.deviceTest')}}</el-button>
        </el-col>
        <!-- 设备切换 -->
        <el-col :span="2.5" v-show="$webrtc.hasLocalStream()">
          <el-button
            type="primary"
            size="mini"
            :round="true"
            @click="bannerBtn('deviceChange')"
          >{{$t('banner.deviceChange')}}</el-button>
        </el-col>
        <!-- 退出房间 -->
        <el-col
          :span="2.5"
          v-show="liveState===$constant.LiveState.Living || liveState===$constant.LiveState.Pause"
        >
          <el-button
            type="primary"
            size="mini"
            :round="true"
            @click="bannerBtn('quitRoom')"
          >{{$t('banner.quitRoom')}}</el-button>
        </el-col>
        <!-- 关闭房间（只有老师可以，如果是助教，那么老师一定为空） -->
        <el-col :span="2.5" v-show="userType!=2">
          <el-button
            type="danger"
            size="mini"
            :round="true"
            @click="bannerBtn('closeRoom')"
          >{{$t('banner.closeRoom')}}</el-button>
        </el-col>
        <!-- 反馈 -->
        <el-col :span="2.5">
          <span
            @mouseenter="mouseEnter('feedback')"
            @mouseleave="mouseLeave"
            :class="{'mouseenter':enterCommand==='feedback'}"
            @click="help"
          >
            <el-tooltip
              class="item"
              effect="light"
              popper-class="test"
              :content="$t('banner.feedback')"
              placement="bottom-start"
            >
              <i class="iconfont icon-feedback"></i>
            </el-tooltip>
          </span>
        </el-col>
        <!-- 帮助 -->
        <el-col :span="2.5">
          <span
            @mouseenter="mouseEnter('help')"
            @mouseleave="mouseLeave"
            :class="{'mouseenter':enterCommand==='help'}"
            @click="help"
          >
            <el-tooltip
              class="item"
              effect="light"
              popper-class="test"
              :content="$t('banner.help')"
              placement="bottom-start"
            >
              <i class="iconfont icon-help"></i>
            </el-tooltip>
          </span>
        </el-col>
      </el-row>
    </div>
    <!-- 屏幕分享 -->
    <el-dialog :title="$t('banner.deviceOption')" :visible.sync="deviceOptionDlg" width="26%">
      <div style="text-align:center">
        <el-checkbox :label="$t('banner.openCamera')" v-model="openVideo"></el-checkbox>
        <el-checkbox :label="$t('banner.openMicrophone')" v-model="openAudio"></el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="closeDeviceOptionDlg"
          :round="true"
          size="mini"
        >{{$t('system.okText')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Version from '@/constant/version'
import Constant from '@/constant/constant'
import LogEvent from '@/log/LogEvent'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      logoImg: require('@/assets/img/main/logo.png'),
      enterCommand: '',
      deviceOptionDlg: false,
      isFullScreen: false,
      fullScreenArray: []
    }
  },
  // 任何组件需要使用的值都写在computed 不需要的可以不用引入
  // 如果页面有数据变化造成的逻辑变化 写在watch 监听里 监听变化 然后做逻辑处理 
  // 数据单纯的变化 没有渲染 不需要加以 watch 监听
  computed: {
    ...mapState({
      userID: 'userID',
      userName: 'userName',
      roomID: 'roomID',
      userType: 'userType',
      roomInfo: 'roomInfo',
      requestType: 'requestType',
      liveState: 'liveState',
      liveSecond: 'liveSecond',
      teacher: 'teacher', // 老师信息
      assistants: 'assistants', // 助教信息
      students: 'students',// 学生信息
      cameraID: 'cameraID', // 当前的摄像头的id
      microphoneID: 'microphoneID', // 当前的麦克风id
      openAudio: 'openAudio',
      openVideo: 'openVideo',
    }),
    openAudio: {
      get () {
        return this.$store.state.openAudio
      },
      set (val) {
        return this.$store.commit('setOpenAudio', val)
      }
    },
    openVideo: {
      get () {
        return this.$store.state.openVideo
      },
      set (val) {
        return this.$store.commit('setOpenVideo', val)
      }
    }
  },
  created () {

  },
  mounted () {
    var self = this
    // 监控全屏事件
    window.onresize = function () {
      self.fullScreenArray.push(self.isFullScreen)
      if (self.fullScreenArray[self.fullScreenArray.length - 1] == self.fullScreenArray[self.fullScreenArray.length - 2]) {
        self.fullScreenArray[self.fullScreenArray.length - 1] = !self.fullScreenArray[self.fullScreenArray.length - 2]
        self.isFullScreen = !self.fullScreenArray[self.fullScreenArray.length - 2]
      }
    }
  },
  methods: {
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
      } else {
        this.$emit('bannerBtn', command)
      }
    },
    // 显示选择窗口（只对老师）
    showDeviceOptionDlg () {
      this.deviceOptionDlg = true
    },
    // 关闭房间
    closeDeviceOptionDlg () {
      if (!this.openVideo && !this.openAudio) {
        this.$message.notify(this, 'error', this.$t('webrtc.noDeviceSelected'))
        return
      }

      this.deviceOptionDlg = false

      // 开始上课
      this.bannerBtn('startRoom')
    },
    mouseEnter (command) {
      this.enterCommand = command
    },
    mouseLeave () {
      this.enterCommand = ''
    },
    // 全屏/取消全屏
    fullscreen () {
      // 日志
      this.$logReport.report(this.isFullscreen ? LogEvent.ExitFullscreen : LogEvent.Fullscreen, {
        errorCode: 0,
        errorDesc: '',
        timeCost: 0,
        data: '',
        ext: '',
      })
      if (this.isFullScreen) {
        this.isFullScreen = false
        this.$utils.fullscreen('', false)
      } else {
        this.isFullScreen = true
        this.$utils.fullscreen('', true)
      }
    },
    help () {
      alert(Version.info)
    },
    modifyUserName () {
      this.$message.prompt(
        this,
        this.$t('banner.modifyName'),
        this.$t('banner.plsInputNewName'),
      ).then(value => {
        if (value) {
          // 更新后台
          this.$api.modifyUserName({
            userID: this.userID,
            userType: this.userType,
            userName: value
          }).then(res => {
            if (res.code === 0) {
              this.$store.commit('setUserName', value)
            }
          })
        }
      })
    }
  }
}
</script>