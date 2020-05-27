<template>
  <div class="device-test">
    <el-dialog
      :title="$t('deviceTest.title')"
      :visible="dialogShow"
      @close="closeDialog"
      :close-on-click-modal="true"
    >
      <el-form>
        <el-form-item :label="$t('deviceTest.camera')">
          <el-select
            v-model="newCameraID"
            :placeholder="$t('deviceTest.cameraHint')"
            size="small"
            @change="changeCamera"
          >
            <el-option
              v-for="item in cameras"
              :label="item.label"
              :value="item.deviceId"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="el-video-box" id="deviceTestVideo"></div>
      <el-form>
        <el-form-item :label="$t('deviceTest.microphone')">
          <el-select
            v-model="newMicrophoneID"
            :placeholder="$t('deviceTest.microphoneHint')"
            size="small"
            @change="changeMicrophone"
          >
            <el-option
              v-for="item in microphones"
              :label="item.label"
              :value="item.deviceId"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-progress
        :text-inside="true"
        :stroke-width="16"
        :percentage="levelNumber"
        status="success"
      ></el-progress>
      <el-form>
        <el-form-item :label="$t('deviceTest.speaker')">
          <el-select
            v-model="newSpeakerID"
            :placeholder="$t('deviceTest.speakerHint')"
            size="small"
            @change="changeSpeaker"
          >
            <el-option
              v-for="item in speakers"
              :label="item.label"
              :value="item.deviceId"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          @click="closeDialog"
          :round="true"
        >{{$t('system.exit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TRTC from 'trtc-js-sdk'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialogShow: false,
      newCameraID: '',
      newMicrophoneID: '',
      newSpeakerID: '',
      cameras: [],
      microphones: [],
      speakers: [],
      localStream: null,
      levelNumber: 0,
      audioLevelTask: null
    }
  },
  computed: {
    ...mapState({
      cameraID: 'cameraID',
      microphoneID: 'microphoneID',
      speakerID: 'speakerID'
    })
  },
  created () {
  },
  mounted () {
    clearInterval(this.audioLevelTask)
  },
  methods: {
    async setVisible () {
      // 停止声音
      clearInterval(this.audioLevelTask)

      // 获得摄像头
      await this.$webrtc.getCameras(res => {
        if (res.code === 0) {
          this.cameras = res.cameras
          if (this.$utils.strIsNull(this.cameraID)) {
            if (res.cameras.length > 0) {
              this.newCameraID = res.cameras[0].deviceId
              this.$store.commit('setCameraID', this.newCameraID)
            }
          } else {
            this.newCameraID = this.cameraID
          }
        }
      })

      // 获得麦克风
      await this.$webrtc.getMicrophones(res => {
        if (res.code === 0) {
          this.microphones = res.microphones
          if (this.$utils.strIsNull(this.microphoneID)) {
            if (res.microphones.length > 0) {
              this.newMicrophoneID = res.microphones[0].deviceId
              this.$store.commit('setMicrophoneID', this.newMicrophoneID)
            }
          } else {
            this.newMicrophoneID = this.microphoneID
          }
        }
      })
      // 获得扬声器
      await this.$webrtc.getSpeakers(res => {
        if (res.code === 0) {
          this.speakers = res.speakers
          if (this.$utils.strIsNull(this.speakerID)) {
            if (res.speakers.length) {
              this.newSpeakerID = res.speakers[0].deviceId
              this.$store.commit('setSpeakerID', this.newSpeakerID)
            }
          } else {
            this.newSpeakerID = this.speakerID
          }
        }
      })
      this.dialogShow = true

      this.getLocalStream()
    },
    // 本地摄像头
    getLocalStream () {
      var option = {
        audio: true,
        video: true,
      }

      if (this.cameraID) {
        option.cameraId = this.cameraID
      }
      if (this.microphoneID) {
        option.microphoneID = this.microphoneID
      }

      this.localStream = TRTC.createStream(option)
      this.localStream.initialize().then(() => {
        this.localStream.play('deviceTestVideo')
      }).catch(error => {
        console.error('failed initialize localStream ' + error);
      })

      this.audioLevelTask = setInterval(() => {
        this.level = this.localStream.getAudioLevel()
        this.levelNumber = this.level * 200
        if (!this.dialogShow) {
          clearInterval(deviceTestInterVal)
        }
      }, 200);
    },
    // 切换摄像头
    changeCamera (cameraID) {
      this.localStream.switchDevice('video', cameraID).then(res => {
        this.localStream.unmuteVideo()
        this.newCameraID = cameraID
        this.$store.commit('setCameraID', cameraID)
      }).catch(error => {
        this.$message.notify(this, 'error', this.$t("deviceTest.cameraHasNull"))
        console.error('changeCamera error ' + error);
      })
    },
    // 切换麦克风
    changeMicrophone (microphoneID) {
      this.localStream.switchDevice('audio', microphoneID).then(res => {
        this.localStream.unmuteAudio()
        this.newMicrophoneID = microphoneID
        this.$store.commit('setMicrophoneID', microphoneID)
      }).catch(error => {
        this.$message.notify(this, 'error', this.$t("deviceTest.microphoneHasNull"))
        console.error('changeCamera error ' + error);
      })
    },
    // 切换麦克风
    changeSpeaker (speakerID) {
      this.localStream.setAudioOutput(speakerID).then(res => {
        this.newSpeakerID = speakerID
        this.$store.commit('setSpeakerID', speakerID)
      }).catch(error => {
        this.$message.notify(this, 'error', this.$t("deviceTest.speakerHasNull"))
        console.error('changeSpeaker error ' + error);
      })
    },
    closeDialog () {
      this.dialogShow = false

      this.localStream && this.localStream.close()
      this.localStream = null

      // 清除定时器
      clearInterval(this.audioLevelTask)
    }
  }
}
</script>
