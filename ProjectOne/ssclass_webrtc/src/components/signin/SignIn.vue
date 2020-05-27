<template>
  <div class="sign-in">
    <el-dialog
      :title="$t('signIn.title')"
      :visible="dialogShow"
      :width="dialogWidth"
      @close="closeDialog"
    >
      <el-form>
        <div class="show-second">{{$t('signIn.showSecond',{showSecond:showSecond})}}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" size="small" @click="signIn" :round="true">{{$t('signIn.signIn')}}</el-button>
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
      dialogShow: false,
      dialogWidth: '20%',
      signInJson: '',
      signInID: '',
      showSecond: 180,
      closeTask: null,
    }
  },
  computed: {
    ...mapState({
      roomID: 'roomID',
      userID: 'userID',
      signInContent: 'signInContent'
    })
  },
  mounted () {
    if (this.$func.isMobile()) {
      this.dialogWidth = '80%'
    }
  },
  methods: {
    setVisible () {
      this.dialogShow = true
      this.getSignInContent()

      if (!this.closeTask) {
        this.closeTask = setInterval(() => {
          this.showSecond--
          if (this.showSecond <= 0) {
            this.closeDialog()
          }
        }, 1000)
      }
    },
    getSignInContent () {
      this.signInJson = JSON.parse(this.signInContent)
      this.signInID = this.signInJson.signInID
      this.startTime = this.signInJson.startTime
      this.showSecond = this.signInJson.showSecond
    },
    signIn () {
      this.$api.signIn({
        roomID: this.roomID,
        userID: this.userID,
        signInID: this.signInID
      }).then(res => {
        if (res.code === 0) {
          this.$webim.sendCommand(Constant.LiveCommand.SignIn)
          window.store.commit('setShowSignIn', false)
        }
      })
      this.dialogShow = false
    },
    closeDialog () {
      window.store.commit('setShowSignIn', false)
      clearInterval(this.closeTask)
      this.dialogShow = false
    }
  }
}
</script>

<style lang="css" scoped>
.el-input {
  width: 70%;
}
.el-form {
  display: flex;
  justify-content: space-between;
}
.el-form .show-second {
  font-size: 15px;
  width: 100%;
  text-align: center;
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
