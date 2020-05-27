<template>
  <div class="stats-container">
    <el-dialog :title="$t('stats.title')" :visible="dialogShow" width="750px" @close="closeDialog">
      <el-table :data="members">
        <el-table-column property="userID" :label="$t('stats.userID')" width="172px"></el-table-column>
        <el-table-column property="userName" :label="$t('stats.userName')" width="120px"></el-table-column>
        <el-table-column property="osType" :label="$t('stats.osType')" width="108px"></el-table-column>
        <el-table-column :label="$t('stats.startTime')" width="120px">
          <template slot-scope="scope">{{$utils.right(scope.row.startTime,14)}}</template>
        </el-table-column>
        <el-table-column :label="$t('stats.signIn')" width="60px">
          <template slot-scope="scope">{{scope.row.signInTimes}}/{{scope.row.signInCount}}</template>
        </el-table-column>
        <el-table-column :label="$t('stats.qa')" width="60px">
          <template slot-scope="scope">{{scope.row.qaRightTimes}}/{{scope.row.qaCount}}</template>
        </el-table-column>
        <el-table-column :label="$t('stats.duration')" width="60px">
          <template slot-scope="scope">{{scope.row.duration}}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="success"
          :round="true"
          @click="getRoomMembers"
        >{{$t('stats.refresh')}}</el-button>
        <el-button
          type="primary"
          size="small"
          :round="true"
          @click="exportExcel"
        >{{$t('stats.exportExcel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialogShow: false,
      members: []
    }
  },
  computed: {
    ...mapState({
      roomID: 'roomID'
    })
  },
  methods: {
    setVisible () {
      this.dialogShow = true
      this.getRoomMembers()
    },
    getRoomMembers () {
      this.$api.getRoomMembers({
        roomID: this.roomID,
        groupName: '',
        pageIndex: 0,
        pageSize: 300
      }).then(res => {
        if (res.code === 0) {
          this.members = res.members
        }
      })
    },
    exportExcel () {
      if (this.members.length > 0) {
        var header = [
          this.$t('stats.userID'),
          this.$t('stats.userName'),
          this.$t('stats.osType'),
          this.$t('stats.startTime'),
          this.$t('stats.signInTimes'),
          this.$t('stats.signInCount'),
          this.$t('stats.qaRightTimes'),
          this.$t('stats.qaCount'),
          this.$t('stats.duration')]
        var fieldsName = [
          "userID",
          "userName",
          "osType",
          "startTime",
          "signInTimes",
          "signInCount",
          "qaRightTimes",
          "qaCount",
          "duration"]
        var fileName = this.$t('stats.title')
        this.$utils.exportExcel(header, fieldsName, fileName, this.members)
      }
    },
    closeDialog () {
      this.dialogShow = false
    }
  }
}
</script>
