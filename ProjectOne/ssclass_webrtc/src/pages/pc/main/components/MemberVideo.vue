<template>
  <li class="member-video-container">
    <div :id="getVideoID()" class="el-item-video-box" v-show="hasVideo">
      <div class="el-center-video-icon-box">
        <span class="el-item-video-box-name">{{streamUserName}}</span>
        <span class="el-item-video-icon-box">
          <i
            v-show="$func.isTeacher() || userID === streamUserID"
            class="iconfont"
            :class="videoState"
            @click="operateVideo(index)"
          ></i>
          <i
            v-show="$func.isTeacher() || userID === streamUserID"
            class="iconfont"
            :class="audioState"
            @click="closeAudio(index)"
            @mouseenter="enterIcon('audio')"
            @mouseleave="leaveIcon('audio')"
          ></i>
          <i
            v-show="$func.isTeacher() || userID === streamUserID"
            class="iconfont"
            :class="isFullScreen?'icon-fullscreen':'icon-exitFullscreen'"
            @click="fullScreen(index)"
            @mouseenter="enterIcon('full')"
            @mouseleave="leaveIcon('full')"
          ></i>
          <i
            v-show="$func.isTeacher() || userID === streamUserID"
            class="iconfont icon-closeAll"
            @click="closeAll(index)"
            @mouseenter="enterIcon('close')"
            @mouseleave="leaveIcon('close')"
          ></i>
        </span>
      </div>
    </div>
    <div class="el-item-video-box el-item-audio-box" v-show="hasAudio && !hasVideo">
      <div class="el-center-video-icon-box">
        <span class="el-item-video-box-name">{{streamUserName}}</span>
        <span class="el-item-video-icon-box">
          <i
            class="iconfont icon-videoClosed"
            :class="videoState"
            @click="operateVideo(index)"
            @mouseenter="enterIcon('video')"
            @mouseleave="leaveIcon('video')"
          ></i>
          <i
            class="iconfont"
            :class="audioState"
            @click="closeAudio(index)"
            @mouseenter="enterIcon('audio')"
            @mouseleave="leaveIcon('audio')"
          ></i>
          <i
            class="iconfont icon-closeAll"
            @click="closeAll(index)"
            @mouseenter="enterIcon('close')"
            @mouseleave="leaveIcon('close')"
          ></i>
        </span>
      </div>
      <img :src="hasAudioImg" alt />
    </div>
  </li>
</template>

<script>
import Constant from '@/constant/constant'
import { mapState } from 'vuex'
export default {
  props: {
    streamID: {
      type: String,
      default () { }
    },
    streamUserID: {
      type: String,
      default () { }
    },
    streamUserName: {
      type: String,
      default () { }
    },
    stream: {
      type: Object,
      default () { }
    },
    hasAudio: {},
    hasVideo: {},
    index: {
      type: Number,
      default () { }
    }
  },
  data () {
    return {
      hasAudioImg: require('@/assets/img/main/memberVoice.jpg'),
      iconActive: null,
      isFullScreen: true,
      videoState: 'icon-videoNormal',
      audioState: 'icon-audioNormal'
    }
  },
  computed: {
    ...mapState({
      userID: 'userID',
    }),
  },
  mounted () {
    // 播放视频
    this.$func.streamPlay(this.stream, this.getVideoID())
    // this.stream.play(this.getVideoID())
  },
  methods: {
    getVideoID () {
      return 'v_' + this.streamID
    },
    operateVideo (index) {
      console.log('operateVideo')
      if (this.hasVideo) {
        // 如果视频中 关闭视频
        // this.$emit('operateVideo', index)
        this.$webim.sendCommand(Constant.LiveCommand.OpenCamera, this.streamUserID)
        this.videoState = 'icon-videoClosed'
      } else {
        this.$webim.sendCommand(Constant.LiveCommand.CloseCamera, this.streamUserID)
        this.videoState = 'icon-videoNormal'
      }
    },
    closeAudio (index) {
      if (this.hasAudio) {
        this.$webim.sendCommand(Constant.LiveCommand.CloseMic, this.streamUserID)
        this.audioState = 'icon-audioClosed'
        // this.$emit('closeAudio', index)
      } else {
        this.$webim.sendCommand(Constant.LiveCommand.openMic, this.streamUserID)
        this.audioState = 'icon-audioNormal'
      }
    },
    fullScreen (index) {
      console.log('fullScreen')
      this.isFullScreen = !this.isFullScreen
    },
    closeAll (index) {
      console.log('closeAll')
      this.$webim.sendCommand(Constant.LiveCommand.CloseLink, this.streamUserID)
    },
    enterIcon (type) {
      console.log('1234567')
      this.iconActive = type
    },
    leaveIcon (type) {
      this.iconActive = null
    }
  }
}
</script>
