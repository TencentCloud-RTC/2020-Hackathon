<template>
  <li :style="liStyle" class="mobile-main">
    <div :id="getVideoID()" class="el-item-video-box" v-show="hasVideo" :style="boxStyle">
      <div class="el-center-video-icon-box">
        <span class="el-item-video-box-name">{{streamUserName}}</span>
      </div>
    </div>
    <div class="el-item-video-box el-item-audio-box" v-show="hasAudio && !hasVideo">
      <div class="el-center-video-icon-box">
        <span class="el-item-video-box-name">{{streamUserName}}</span>
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
      audioState: 'icon-audioNormal',
      boxStyle: '',
      liStyle: ''
    }
  },
  watch: {
    memberStreamList (newVal, oldVal) {
      if (newVal && newVal.length > 0) {
        this.$func.streamPlay(this.stream, this.getVideoID())
      }
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
    if (this.$func.isMobile()) {
      this.liStyle = 'height:' + (this.$store.state.mobileWidth / 4) / 16 * 9 + 'px'
      this.boxStyle = 'height:' + (this.$store.state.mobileWidth / 4) / 16 * 9 + 'px'
    }
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

<style lang="css" scoped>
.mobile-main .el-item-video-box {
  width: 100%;
  background: #000000;
  height: 100%;
  position: relative;
}
.mobile-main .el-center-video-icon-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5;
  background: #000000;
  opacity: 0.5;
  color: #fff;
  display: flex;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.mobile-main .el-center-video-icon-box .el-item-video-box-name {
  font-size: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mobile-main .el-center-video-icon-box .el-item-video-icon-box {
  display: flex;
  flex-wrap: nowrap;
}
.mobile-main .el-center-video-icon-box .el-item-video-icon-box i {
  font-size: 10px;
}
.mobile-main .el-item-audio-box {
  overflow: hidden;
}
.mobile-main .el-item-audio-box img {
  width: 100%;
}
.mobile-main .el-item-video-handle-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: 0.7;
  color: #fff;
  font-size: 20px;
  z-index: 6;
}
.mobile-main .el-item-video-handle-icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
}
.mobile-main .el-item-video-handle-icon-box i {
  margin-right: 10px;
  font-size: 10px !important;
}
</style>