<template>
  <div class="container">
    <div class="el-video-box">
      <div
        class="video"
        ref="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.ShowVideo"
        id="teacherVideo"
      >
        <div class="el-video-icon-box">
          <span>{{teacher?teacher.userName:''}}</span>
          <span>
            <i
              v-show="userType===0 && hasVideo!=null"
              :class="hasVideo?'iconfont icon-videoNormal':'iconfont icon-videoClosed'"
              @click="operateVideo()"
            ></i>
            <i
              v-show="userType===0 && hasAudio!=null"
              :class="hasAudio?'iconfont icon-audioNormal':'iconfont icon-audioClosed'"
              @click="operateAudio()"
            ></i>
            <i
              v-show="userType===0"
              :class="isFullScreen?'iconfont icon-exitFullscreen':'iconfont icon-fullscreen'"
              @click="handleFullScreen('teacherVideo')"
            ></i>
          </span>
        </div>
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.VoiceLive"
      >
        <img :src="voiceLive" alt />
        <div class="el-video-icon-box">
          <span>{{teacher?teacher.userName:''}}</span>
          <span>
            <i
              v-show="userType===0"
              :class="openVideo?'iconfont icon-videoNormal':'iconfont icon-videoClosed'"
              @click="operateVideo()"
            ></i>
            <i
              v-show="userType===0"
              :class="openAudio?'iconfont icon-audioNormal':'iconfont icon-audioClosed'"
              @click="operateAudio()"
            ></i>
            <!-- <i
              v-show="userType===0"
              :class="openAudio?'iconfont icon-audioNormal':'iconfont icon-audioClosed'"
              @click="operateAudio()"
            ></i>-->
          </span>
        </div>
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.HasNoSteam"
      >
        <img :src="hasNoSteam" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.NotStart"
      >
        <img :src="liveNotStart" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.TeacherLeave"
      >
        <img :src="teacherLeave" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.LivePause"
      >
        <img :src="livePause" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.LiveOver"
      >
        <img :src="liveOver" alt />
      </div>
    </div>
  </div>
</template>

<script>
import Constant from '@/constant/constant'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      liveNotStart: require('@/assets/img/main/livenotstart.jpg'),
      livePause: require('@/assets/img/main/livepause.jpg'),
      liveOver: require('@/assets/img/main/liveover.jpg'),
      voiceLive: require('@/assets/img/main/voicelive.jpg'),
      hasNoSteam: require('@/assets/img/main/hasnostream.jpg'),
      teacherLeave: require('@/assets/img/main/teacherleave.jpg'),
    }
  },
  computed: {
    ...mapState({
      roomInfo: 'roomInfo',
      userID: 'userID',
      userName: 'userName',
      liveState: 'liveState',
      teacher: 'teacher',
      teacherHasAudio: 'teacherHasAudio',
      teacherHasVideo: 'teacherHasVideo',
      userType: 'userType',
      openVideo: 'openVideo',
      openAudio: 'openAudio',
      hasVideo: 'hasVideo',
      hasAudio: 'hasAudio',
    })
  },
  methods: {
    // 老师视频全屏和取消全屏
    handleFullScreen () {
      if (this.isFullScreen) {
        this.isFullScreen = false
        this.$utils.fullscreen('teacherVideo', false)
      } else {
        this.isFullScreen = true
        this.$utils.fullscreen('teacherVideo', true)
      }
    }
  }
}
</script>

<style lang="css" scoped>
.container {
  width: 300px;
  height: calc(100vh - 38px);
  position: absolute;
  top: 38px;
  right: 0;
  z-index: 50;
  background: #303030;
}
.container .el-video-box {
  position: relative;
  background: #222;
}
.container .el-video-box .video img {
  width: 100%;
  display: block;
  position: relative;
}
.container .el-video-box .video .el-video-icon-box {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 24px;
  background: #000;
  opacity: 0.6;
  text-align: center;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  padding: 0 10px;
  box-sizing: border-box;
}
.container .el-video-box .video .el-video-icon-box span {
  display: flex;
  align-items: center;
  color: #fff;
}
.container .el-video-box .video .el-video-icon-box span:chat-child {
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}
.container .el-video-box .video .el-video-icon-box i {
  margin-left: 2px;
  font-size: 20px;
  color: #fff;
}
.container .el-video-box .video .el-video-icon-box i:hover {
  color: #67c23a;
}
.container .el-video-box .video-shaow {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #ccc;
  font-size: 20px;
  z-index: 1998;
}
.container .el-video-box .video-shaow i {
  margin-right: 10px;
}
.container .el-video-box .video-shaow i:hover {
  color: #67c23a;
}
.container .el-video-box .video {
  height: 225px;
  overflow: hidden;
}
.container .el-video-box video {
  outline: none;
  display: block;
}
</style>