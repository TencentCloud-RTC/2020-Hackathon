<template>
  <div class="device-change">
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
      <!-- <div class="el-video-box" id="deviceTestVideo"></div> -->
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
      <!-- <el-progress
        :text-inside="true"
        :stroke-width="16"
        :percentage="levelNumber"
        status="success"
      ></el-progress>-->
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
          @click="hideDialog"
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
      diaWidth: '30%',
      newCameraID: '',
      newMicrophoneID: '',
      newSpeakerID: '',
      cameras: [],
      microphones: [],
      speakers: [],
    }
  },
  computed: {
    ...mapState({
      cameraID: 'cameraID',
      microphoneID: 'microphoneID',
      speakerID: 'speakerID'
    })
  },
  methods: {
    async setVisible () {
      try {
        // 获得摄像头
        await this.$webrtc.getCameras(res => {
          if (res.code === 0) {
            this.cameras = res.cameras
            if (this.$utils.strIsNull(this.cameraID)) {
              if (res.cameras.length) {
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
              if (res.microphones.length) {
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
      } catch (err) {
        this.dialogShow = true
      }
    },
    changeCamera (cameraID) {
      this.$webrtc.switchDevice('video', cameraID, res => {
        if (res.code === 0) {
          this.newCameraID = cameraID
          this.$store.commit('setCameraID', cameraID)
        } else {
          this.$message.notify(this, 'error', this.$t("deviceTest.cameraHasNull"))
        }
      })
    },
    changeMicrophone (microphoneID) {
      this.$webrtc.switchDevice('audio', microphoneID, res => {
        if (res.code === 0) {
          this.newMicrophoneID = microphoneID
          this.$store.commit('setMicrophoneID', microphoneID)
        } else {
          this.$message.notify(this, 'error', this.$t("deviceTest.microphoneHasNull"))
        }
      })
    },
    changeSpeaker (speakerID) {
      this.$webrtc.switchDevice(speakerID, res => {
        if (res.code === 0) {
          this.newSpeakerID = speakerID
          this.$store.commit('setSpeakerID', speakerID)
        } else {
          this.$message.notify(this, 'error', this.$t("deviceTest.speakerHasNull"))
        }
      })
    },
    hideDialog () {
      this.dialogShow = false
      //   this.localStream && this.localStream.close()
    },
    closeDialog () {
      this.dialogShow = false
      //   this.localStream && this.localStream.close()
    }
  }
}
</script>
