<template>
  <div class="apple-auth">
    <el-dialog
      :title="$t('appleAuth.title')"
      :visible="dialogShow"
      :width="dialogWidth"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="examine-dialog"
    >
      <div class="el-question-box">
        <span>{{$t('appleAuth.authAlert')}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="small"
          @click="authorize"
          v-show="!isShowClose"
          :round="true"
        >{{$t('appleAuth.setAuth')}}</el-button>
        <el-button
          type="danger"
          size="small"
          @click="closeDialog"
          v-show="isShowClose"
          :round="true"
        >{{$t('system.exit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TRTC from 'trtc-js-sdk'
export default {
  data () {
    return {
      dialogShow: false,
      dialogWidth: '27.3%',
      localStream: '',
      isShowClose: false
    }
  },
  mounted () {
    if (this.$func.isMobile()) {
      this.dialogWidth = '80%'
    }
  },
  methods: {
    authorize () {
      var browserType = this.$utils.getBrowserType()
      var osType = this.$utils.getOsType()
      if (browserType == "Safari" || osType == 'iPhone' || osType == 'iPad') {
        var option = {
          audio: true,
          video: true,
        }
        this.localStream = TRTC.createStream(option)
        this.localStream.initialize().then(() => {
          this.isShowClose = true
          console.error('openSafariMic')
        }).catch(error => {
          console.error('failed initialize localStream ' + error);
        })
      }
    },
    setVisible () {
      this.dialogShow = true
    },
    closeDialog () {
      this.localStream && this.localStream.close()
      this.localStream = null
      this.isShowClose = false
      this.dialogShow = false
    }
  }
}
</script>

<style lang="css" scoped>
.apple-auth /deep/ .el-dialog__body {
  padding: 5px 20px 30px !important;
}
.el-question-box {
  margin-bottom: 10px;
}
.el-input {
  width: 70%;
}
.el-form {
  display: flex;
  justify-content: center;
}
.el-form-item {
  margin-bottom: 0;
}
.el-table {
  max-height: 200px;
  overflow-y: scroll;
}
.el-table::before {
  position: fixed;
}
</style>
