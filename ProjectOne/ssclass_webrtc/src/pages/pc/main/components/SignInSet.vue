<template>
  <div class="sign-in-container">
    <el-dialog :title="$t('signIn.title')" :visible="dialogShow" width="640px" :show-close="false">
      <div>{{$t('signIn.statsInfo',{memberCount:memberCount-1,signInMemberCount:signInMemberCount})}}</div>
      <el-table :data="signInMembers">
        <el-table-column property="userID" :label="$t('signIn.userID')" width="160px"></el-table-column>
        <el-table-column property="userName" :label="$t('signIn.userName')" width="160px"></el-table-column>
        <el-table-column property="signInTime" :label="$t('signIn.signInTime')"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="success"
          :round="true"
          @click="startSignIn"
        >{{$t('signIn.start')}}</el-button>
        <el-button
          type="primary"
          size="small"
          :round="true"
          @click="exportExcel"
        >{{$t('signIn.exportExcel')}}</el-button>
        <el-button
          type="primary"
          size="small"
          @click="closeDialog"
          :round="true"
        >{{$t('signIn.close')}}</el-button>
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
      dialogShow: false
    }
  },
  computed: {
    ...mapState({
      roomID: 'roomID',
      memberCount: 'memberCount',
      signInMemberCount: 'signInMemberCount',
      signInMembers: 'signInMembers'
    })
  },
  methods: {
    // 显示
    setVisible () {
      this.dialogShow = true
    },
    // 发起签到
    startSignIn () {
      var showSecond = 180

      this.$api.startSignIn({
        roomID: this.roomID,
        signInID: '',
        showSecond: showSecond
      }).then(res => {
        if (res.code === 0) {
          var jsonObj = new Object()
          jsonObj['signInID'] = res.signInID
          jsonObj['startTime'] = res.startTime
          jsonObj['showSecond'] = showSecond

          this.$webim.sendCommandEx(Constant.LiveCommand.StartSignIn, JSON.stringify(jsonObj))
          this.$message.notify(this, 'success', this.$t('signIn.startSuccess'))
        }
      })
    },
    // 结束签到
    stopSignIn () {
      this.$api.stopSignIn({
        roomID: this.roomID
      }).then(res => {
        if (res.code === 0) {
          this.$webim.sendCommand(Constant.LiveCommand.StopSignIn)
          this.dialogShow = false
        }
      })
    },
    exportExcel () {
      if (this.signInMembers.length > 0) {
        var header = [
          this.$t('signIn.userID'),
          this.$t('signIn.userName'),
          this.$t('signIn.signInTime')]
        var fieldsName = ["userID", "userName", "signInTime"]
        var fileName = this.$t('signIn.title')
        this.$utils.exportExcel(header, fieldsName, fileName, this.signInMembers)
      }
    },
    closeDialog () {
      this.$message.alert(this, this.$t('signIn.closeAlert'), 'okcancel').then(value => {
        if (value) {
          if (value === 'confirm') {
            // 更新后台
            this.$api.stopSignIn({
              roomID: this.roomID
            }).then(res => {
              if (res.code === 0) {
                this.$webim.sendCommand(Constant.LiveCommand.StopSignIn)
                this.dialogShow = false
              }
            })
          }
        }
      })
    }
  }
}
</script>
