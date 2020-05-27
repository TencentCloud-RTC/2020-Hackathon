<template>
  <div class="help-container">
    <el-dialog title="帮助" :visible="dialogShow" @close="closeDialog" width="30%">
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small" type="success" :round="true">分享</el-button>
        <el-button type="primary" size="small" :round="true">帮助</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogShow: false
    }
  },
  methods: {
    closeDialog () {
      this.dialogShow = false
      console.log('关闭dialog')
    },
    setVisible () {
      this.dialogShow = true
    }
  }
}
</script>
