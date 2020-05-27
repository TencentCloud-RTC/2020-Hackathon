<template>
  <div class="qa-answer">
    <el-dialog
      :title="$t('qa.title')"
      :visible="dialogShow"
      @close="closeDialog"
      :width="dialogWidth"
      :close-on-click-modal="false"
      custom-class="examine-dialog"
    >
      <div class="el-question-box">
        <span>{{qaJson.question}}</span>
      </div>
      <el-form>
        <el-form-item label-width="200" class="el-options-form">
          <el-button
            :type="item.state?'success':'primary'"
            size="small"
            v-for="(item,index) in buttonList"
            :key="item.answer"
            @click="clickAnswer(item.answer,index)"
          >{{item.answer}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="small"
          @click="setAnswer"
          :round="true"
        >{{$t('qa.setAnswer')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Constant from '@/constant/constant'
export default {
  data () {
    return {
      dialogShow: false,
      dialogWidth: '27.3%',
      qaID: '',
      startTime: '',
      qaJson: '',
      buttonList: [],
      answerList: []
    }
  },
  computed: {
    ...mapState({
      roomInfo: 'roomInfo',
      userID: 'userID',
      userName: 'userName',
      qaContent: 'qaContent'
    })
  },
  watch: {
    qaContent (newVal, oldVal) {
      if (newVal != oldVal) {
        this.clearData()
        this.getQaContent()
      }
    }
  },
  mounted () {
    if (this.$func.isMobile()) {
      this.dialogWidth = '80%'
    }
  },
  methods: {
    setVisible () {
      this.dialogShow = true
    },
    getQaContent () {
      this.dialogShow = true

      this.qaJson = JSON.parse(this.qaContent)
      this.qaID = this.qaJson.qaID
      this.startTime = this.qaJson.startTime
      for (var i in this.qaJson.options) {
        this.buttonList.push({ answer: this.qaJson.options[i].toUpperCase(), state: false })
      }
    },
    clearData () {
      this.qaJson = ''
      this.answerList = []
      this.buttonList = []
    },
    clickAnswer (answer, idx) {
      if (this.buttonList[idx].state) {
        this.buttonList[idx].state = false
        this.answerList.splice(this.answerList.indexOf(answer), 1)
      } else {
        this.buttonList[idx].state = true
        this.answerList.push(answer)
      }
    },
    setAnswer () {
      if (this.answerList.length === 0) {
        this.$message.notify(this, 'error', this.$t('qa.plsSelectAnswer'))
        return
      } else {
        var answerObj = {
          qaID: this.qaID,
          answer: this.answerList.sort().join(',')
        }
        if (this.qaJson.rightAnswer === this.answerList.sort().join(',')) {
          answerObj.isRight = 1
        } else {
          answerObj.isRight = 0
        }

        // 发送信息
        this.$webim.sendCommandEx(Constant.LiveCommand.SetAnswer, JSON.stringify(answerObj))

        // 耗时
        var costSecond = this.$utils.timeDiffSeconds(this.startTime, this.$utils.getNowTime())
        // 提交答案
        this.$api.setAnswer({
          roomID: this.roomInfo.roomID,
          userID: this.userID,
          qaID: this.qaID,
          answer: this.answerList.sort().join(','),
          isRight: answerObj.isRight,
          costSecond: costSecond
        }).then(res => {
          if (res.code === 0) {
          } else {
            this.$message.notify(this, 'error', res.message)
          }
        })

        this.clearData()
        this.$store.commit('setShowQa', false)
        this.dialogShow = false
      }
    },
    closeDialog () {
      this.dialogShow = false
      this.clearData()
      this.$store.commit('setShowQa', false)
    }
  }
}
</script>

<style lang="css" scoped>
.qa-answer /deep/ .el-dialog__body {
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
