<template>
  <div class="request-list-container">
    <el-dialog
      :title="$t('requestList.title')"
      :visible="dialogShow"
      width="25%"
      :modal="false"
      @close="closeDialog"
    >
      <div class="el-dialog-body-box" v-for="(member,index) in requestMembers" :key="index">
        <div>
          <span>{{member.userName}}</span>
          <span>{{member.requestType==$constant.LiveCommand.RequestMic?$t('requestList.requestMic'):$t('requestList.requestVideo')}}</span>
        </div>
        <div>
          <el-button
            size="mini"
            type="success"
            :round="true"
            @click="agreen(member,index)"
          >{{$t('requestList.agreen')}}</el-button>
          <el-button
            type="danger"
            size="mini"
            :round="true"
            @click="reject(member,index)"
          >{{$t('requestList.reject')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Constant from '@/constant/constant'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialogShow: true,
    }
  },
  computed: {
    ...mapState({
      requestMembers: 'requestMembers',
    }),
  },
  methods: {
    closeDialog () {
      this.dialogShow = false
    },
    getStyle (member) {
      return 'margin-top:' + (40 + Number(member)) + 'px !important;'
    },
    // 同意
    agreen (member, index) {
      // 同意连接
      if (member.requestType === Constant.LiveCommand.RequestMic) {
        this.$webim.sendCommand(Constant.LiveCommand.VoiceCall, member.userID)
      } else if (member.requestType === Constant.LiveCommand.RequestVideo) {
        this.$webim.sendCommand(Constant.LiveCommand.VideoCall, member.userID)
      }

      // 后台更新
      this.$func.setRequestType(member.userID, Constant.LiveCommand.RequestNone)

      this.removeRequest(member, index)
    },
    // 拒绝
    reject (member, index) {
      this.$webim.sendCommand(Constant.LiveCommand.RejectRequest, member.userID)

      // 后台更新
      this.$func.setRequestType(member.userID, Constant.LiveCommand.RequestNone)

      this.removeRequest(member, index)
    },
    // 删除请求
    removeRequest (member, index) {
      this.requestMembers.splice(index, 1)
      this.$store.commit('setRequestMembers', this.requestMembers)
      if (this.requestMembers.length === 0) {
        this.dialogShow = false
        this.$emit('closeRequestTips')
      }

      this.$func.removeRequestMember(member.userID)
    },
    setVisible () {
      this.dialogShow = true
    }
  },
  mounted () {
  }
}
</script>
