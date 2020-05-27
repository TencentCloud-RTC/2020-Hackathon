<template>
  <div class="qa-container">
    <el-dialog :title="$t('qa.title')" :visible="dialogShow" width="50%" :show-close="false">
      <el-dialog
        custom-class="examine-dialog"
        width="37.5%"
        :title="subDialogTitle"
        :visible="innerVisible"
        append-to-body
        @close="closeQuestionDlg"
      >
        <div class="dialog-inner">
          <div v-if="setQuestionVisable">
            <el-input
              type="textarea"
              v-model="teaxarea.content"
              style="width:100%;margin-bottom:5px;"
              :placeholder="$t('qa.setQuestion')"
            ></el-input>
          </div>
          <div v-if="setQuestionVisable">
            <el-form class="el-options-form">
              <el-form-item label-width="200">
                <el-button
                  :type="item.state?'success':'primary'"
                  size="small"
                  v-for="(item,index) in optionList"
                  :key="item.option"
                  @click="clickOption(item.option,index)"
                  style="margin-right:10px;width:40px;"
                >{{item.option}}</el-button>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                size="small"
                :round="true"
                @click="addOption(optionList[optionList.length-1].option)"
                v-if="!alphabetLast"
                style="margin-right:10px;"
              >{{$t('qa.addOption')}}</el-button>
              <el-button
                type="success"
                size="small"
                :round="true"
                @click="startQa"
              >{{$t('qa.startQa')}}</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <div>{{$t('qa.statsInfo',{memberCount:memberCount-1,qaMemberCount:qaMemberCount,qaRightPercent:qaRightPercent})}}</div>
      <el-table :data="qaMembers">
        <el-table-column property="userID" :label="$t('qa.userID')" width="150"></el-table-column>
        <el-table-column property="userName" :label="$t('qa.userName')" width="150"></el-table-column>
        <el-table-column property="answer" :label="$t('qa.answer')" width="150"></el-table-column>
        <el-table-column property="isRight" :label="$t('qa.isRight')"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button
            v-show="false"
            size="small"
            type="primary"
            :round="true"
            @click="doYouKnow"
          >{{$t('qa.doYouKnow')}}</el-button>
        </div>
        <div>
          <el-button
            size="small"
            type="success"
            :round="true"
            @click="setQuestion"
          >{{$t('qa.setQuestion')}}</el-button>
          <el-button
            type="primary"
            size="small"
            :round="true"
            @click="exportExcel"
          >{{$t('qa.exportExcel')}}</el-button>
          <el-button
            type="primary"
            size="small"
            :round="true"
            @click="closeDialog"
          >{{$t('qa.closeQa')}}</el-button>
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
      subDialogTitle: '',
      dialogShow: false,
      innerVisible: false,
      setQuestionVisable: false,
      alphabet: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      alphabetLast: false,
      qaID: '',
      optionList: [],
      answerList: [],
      teaxarea: {
        content: ''
      }
    }
  },
  computed: {
    ...mapState({
      roomID: 'roomID',
      qaMembers: 'qaMembers',
      memberCount: 'memberCount',
      qaMemberCount: 'qaMemberCount',
      qaRightPercent: 'qaRightPercent',
    })
  },
  mounted () {
    this.initQa()
  },
  methods: {
    setVisible () {
      this.dialogShow = true
      this.initQa()
    },
    initQa () {
      this.qaID = ''
      this.optionList = [
        { option: 'A', state: false },
        { option: 'B', state: false },
        { option: 'C', state: false },
        { option: 'D', state: false }
      ]
      this.answerList = []
      this.teaxarea.content = ''

      this.$store.commit('setQaMemberCount', 0)
      this.$store.commit('setQaMembers', [])
    },
    addOption (option) {
      let idx = this.alphabet.indexOf(option)
      if (idx <= 24) {
        this.optionList.push({ option: this.alphabet[idx + 1], state: false })
        if (idx === 24) {
          this.alphabetLast = true
        }
      }
    },
    clickOption (option, idx) {
      if (this.optionList[idx].state) {
        this.optionList[idx].state = false
        this.answerList.splice(this.answerList.indexOf(option), 1)
      } else {
        this.optionList[idx].state = true
        this.answerList.push(option)
      }
    },
    doYouKnow () {
      console.error('听懂了么')
    },
    setQuestion () {
      this.setQuestionVisable = true
      this.innerVisible = true
    },
    startQa () {
      var jsonObj = new Object()
      jsonObj['question'] = this.teaxarea.content
      jsonObj['qaType'] = Constant.QaType.MultiChoice
      var arrOptions = new Array()
      for (let i = 0; i < this.optionList.length; i++) {
        arrOptions.push(this.optionList[i].option)
      }
      jsonObj['options'] = arrOptions
      // 答案
      if (this.answerList.length === 0) {
        this.$message.notify(this, 'error', this.$t('qa.plsSetRightAnswer'))
        return
      }
      jsonObj['rightAnswer'] = this.answerList.sort().join(',')

      // 更新后台
      this.$api.startQa({
        roomID: this.roomID,
        qaID: this.qaID,
        qaContent: JSON.stringify(jsonObj)
      }).then(res => {
        if (res.code === 0) {
          this.qaID = res.qaID
          jsonObj['qaID'] = this.qaID
          jsonObj['startTime'] = res.startTime
          // 发送命令
          this.$webim.sendCommandEx(Constant.LiveCommand.StartQa, JSON.stringify(jsonObj))
          this.innerVisible = false
        }
      })
    },
    closeQuestionDlg () {
      this.setQustionVisable = false
      this.innerVisible = false
    },
    exportExcel () {
      if (this.qaMembers.length > 0) {
        var header = [
          this.$t('qa.userID'),
          this.$t('qa.userName'),
          this.$t('qa.answer'),
          this.$t('qa.isRight'),]
        var fieldsName = ["userID", "userName", "answer", "isRight"]
        var fileName = this.$t('qa.title')
        this.$utils.exportExcel(header, fieldsName, fileName, this.qaMembers)
      }
    },
    closeDialog () {
      this.$message.alert(this, this.$t('qa.closeAlert'), 'okcancel').then(value => {
        if (value) {
          if (value === 'confirm') {
            // 更新后台
            this.$api.stopQa({
              roomID: this.roomID
            }).then(res => {
              if (res.code === 0) {
                this.$webim.sendCommand(Constant.LiveCommand.CloseQa)
                this.innerVisible = false
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

