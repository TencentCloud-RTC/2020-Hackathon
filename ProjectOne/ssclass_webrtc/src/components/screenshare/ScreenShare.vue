<template>
  <div class="el-center-canvas-modal" :style="boxStyle">
    <div class="el-screen-share" v-show="userType===0">
      <div class="el-screen-share-center">
        <img :src="screenShareImg" alt />
        <div class="el-screen-share-btn">
          <el-button
            type="primary"
            size="small"
            :round="true"
            @click="stopScreenShare"
          >{{$t('main.stopScreenShare')}}</el-button>
        </div>
      </div>
    </div>
    <div id="screenShareVideo" v-show="userType!=0" class="el-screen-share-video"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      screenShareImg: require('@/assets/img/main/screenshare.png'),
      boxStyle: 'width: calc(100vw - 300px);',
    }
  },
  computed: {
    ...mapState({
      userType: 'userType',
      roomInfo: 'roomInfo',
      isScreenShare: 'isScreenShare',
      showMemberVideo: 'showMemberVideo',
      mobileWidth: 'mobileWidth',
    })
  },
  watch: {
    mobileWidth (newVal, oldVal) {
      this.boxStyle = 'height: 200px;width: 100%;'
      this.boardStyle = 'height: 200px;'
    },
    showMemberVideo (newVal, oldVal) {
      if (newVal) {
        if (!this.$func.isMobile()) {
          this.boxStyle += 'width: calc(100vw - 400px);height:calc(100vh - 188px);margin-top:150px;'
        }
      } else {
        if (!this.$func.isMobile()) {
          this.boxStyle += 'width: calc(100vw - 400px);height:calc(100vh - 38px);'
        }
      }
    }
  },
  methods: {
    // 结束分享
    stopScreenShare () {
      this.$webrtc.stopScreenShare()
    },
  }
}
</script>

<style lang="css" scoped>
.el-center-canvas-modal {
  width: calc(100vw - 400px);
  height: calc(100vh - 38px);
  background: #282828;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-screen-share {
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;
}
.el-screen-share-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-screen-share-btn {
  text-align: center;
}
.el-screen-share-video {
  height: 100%;
  width: 100%;
}
</style>