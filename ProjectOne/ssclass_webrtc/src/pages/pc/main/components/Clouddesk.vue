<template>
  <div class="clouddesk-container">
    <el-dialog
      :title="$t('clouddesk.title')"
      :visible="dialogShow"
      @close="closeDialog"
      width="55%"
      height="500"
    >
      <el-form>
        <el-form-item label-width="200">
          <el-input
            prefix-icon="el-icon-search"
            auto-complete="off"
            v-model="searchInfo"
            :placeholder="$t('clouddesk.searchHint')"
            size="small"
          ></el-input>
          <el-button
            type="success"
            size="small"
            :round="true"
            @click="search"
          >{{$t('clouddesk.search')}}</el-button>
        </el-form-item>
        <el-form-item label-width="200">
          <el-button
            type="success"
            size="small"
            :round="true"
            @click="goback"
          >{{$t('clouddesk.goback')}}</el-button>
          <el-button
            type="success"
            size="small"
            :round="true"
            @click="createFolder"
          >{{$t('clouddesk.createFolder')}}</el-button>
          <el-popover placement="bottom-end" width="380" trigger="click" v-model="popoverShow">
            <div class="el-popover-box">
              <div class="el-popover-item">
                <div class="el-popover-item-tit">
                  <span>{{$t('clouddesk.staticFile')}}</span>
                  <input
                    type="file"
                    @change="uploadFile"
                    value="static"
                    style="opacity: 0;width:60px;height:30px;"
                    ref="referenceUpload"
                    accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, image/jpg, image/jpeg, image/bmp, image/png, image/gif"
                  />
                  <el-button
                    class="upload-button"
                    type="primary"
                    size="small"
                    :round="true"
                    @click="uploadFile"
                  >{{$t('clouddesk.staticFileUpload')}}</el-button>
                </div>
                <p class="el-popover-item-p">
                  <span>{{$t('clouddesk.staticFileComment')}}</span>
                </p>
              </div>
              <div class="el-popover-item">
                <div class="el-popover-item-tit">
                  <span>{{$t('clouddesk.animationPpt')}}</span>
                  <input
                    type="file"
                    @change="uploadFile"
                    value="animation"
                    style="opacity: 0;width:60px;height:30px;"
                    ref="referenceUpload1"
                    accept=".ppt, .pptx"
                  />
                  <el-button
                    class="upload-button"
                    type="primary"
                    size="small"
                    :round="true"
                    @click="uploadFile"
                  >{{$t('clouddesk.animationPptUpload')}}</el-button>
                </div>
                <p class="el-popover-item-p">
                  <span>{{$t('clouddesk.animationPptComment')}}</span>
                </p>
              </div>
              <div class="el-popover-item">
                <div class="el-popover-item-tit">
                  <span>{{$t('clouddesk.mediaFile')}}</span>
                  <input
                    type="file"
                    @change="uploadFile"
                    value="media"
                    style="opacity: 0;width:60px;height:30px;"
                    ref="referenceUpload2"
                    accept="video/mp4, video/mp3"
                  />
                  <el-button
                    class="upload-button"
                    type="primary"
                    size="small"
                    :round="true"
                    @click="uploadFile"
                  >{{$t('clouddesk.mediaFileUpload')}}</el-button>
                </div>
                <p class="el-popover-item-p">
                  <span>{{$t('clouddesk.mediaFileComment')}}</span>
                </p>
              </div>
            </div>
            <el-button
              class="button-new-tag upload-button"
              size="small"
              type="primary"
              :round="true"
              slot="reference"
            >{{$t('clouddesk.upload')}}</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
      <el-table :data="visibleFileList">
        <el-table-column property="fileName" :label="$t('clouddesk.fileName')">
          <template slot-scope="scope">
            <img :src="scope.row.fileIcon" alt />
            <span style="margin-left: 3px;">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column property="fileSize" :label="$t('clouddesk.fileSize')" width="88px"></el-table-column>
        <el-table-column property="uploadTime" :label="$t('clouddesk.uploadTime')" width="150px"></el-table-column>
        <el-table-column :label="$t('clouddesk.operate')" width="136px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              :round="true"
              @click="openFile(scope.row)"
            >{{getOpenText(scope.row)}}</el-button>
            <el-button
              type="danger"
              size="mini"
              :round="true"
              @click="deleteClouddeskFile(scope.row)"
            >{{$t('clouddesk.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="30%"
        :title="$t('clouddesk.progressTitle')"
        :visible="progressVisible"
        append-to-body
        @close="closeProgress"
      >
        <el-progress :percentage="percentage"></el-progress>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MessageBox } from 'element-ui';
export default {
  data () {
    return {
      percentage: 0,
      popoverShow: true,
      progressVisible: false,
      dialogShow: false,
      cloudFileList: [], //所有的文件列表
      visibleFileList: [], //可见的文件列表，查询需要
      path: [],
      refreshListTask: null, //更新任务
      createFolderName: '',   // 创建文件夹名称
      searchInfo: '',   //搜索文件名
    }
  },
  computed: {
    ...mapState({
      userID: 'userID'
    })
  },
  created () {
  },
  mounted () {
    this.getClouddeskFileList()
  },
  methods: {
    setVisible () {
      this.dialogShow = true
    },
    // 关闭上传进度条窗口
    closeProgress () {
      this.progressVisible = false
    },
    // 获取路径
    getPath () {
      var self = this

      var path = ""
      for (let item of self.path) {
        path += "/" + item
      }
      if (path.length > 0) {
        self.title = self.$t('clouddesk.folder') + path
      } else {
        self.title = self.$t('clouddesk.title')
      }

      return path
    },
    // 获得open 类型
    getOpenText (file) {
      var self = this

      if (file) {
        if (file.fileType === 'folder') {
          return self.$t('clouddesk.open')
        } else if (file.transcodeProgress >= 0 && file.transcodeProgress < 100) {
          return self.$t('clouddesk.transcoding')
        } else if (file.transcodeProgress === -1 || file.transcodeProgress === 100) {
          return self.$t('clouddesk.show')
        }
      }

      return ''
    },
    // 获得所有列表
    getClouddeskFileList () {
      var self = this

      // 获得房间信息
      this.$api.getClouddeskFileList({
        userID: self.userID,
        path: self.getPath()
      }).then(res => {
        if (res.code === 0) {
          self.cloudFileList = res.clouddeskFiles
          //替换html符号
          self.cloudFileList.forEach((item, index) => {
            self.cloudFileList[index].fileName = this.$utils.replaceHtmlSymbol(item.fileName);
            //如果有需要转换的，开启自动刷新，3秒刷一次
            if (item.transcodeProgress >= 0 && item.transcodeProgress < 100) {
              self.refreshClouddeskFileList()
            }
          })
          //要显示的文档列表
          self.visibleFileList = self.cloudFileList
        } else {
          self.$message.notify(self, 'error', res.message)
        }
      })
    },
    // 查询
    search () {
      var self = this;

      self.visibleFileList = [];
      var keyword = self.searchInfo
      for (let item of self.cloudFileList) {
        if (item.fileName.indexOf(keyword) != -1) {
          self.visibleFileList.push(item)
        }
      }
    },
    // 返回上一级
    goback () {
      var self = this

      var path = []
      for (var i = 0; i < self.path.length - 1; i++) {
        path.push(self.path[i])
      }
      self.path = path
      self.getClouddeskFileList()
    },
    // 创建文件夹
    createFolder () {
      this.$message.prompt(
        this,
        this.$t('clouddesk.createFolder'),
        this.$t('clouddesk.createFolderHint'),
      ).then(value => {
        if (value) {
          this.createFolderName = value

          // 添加文件
          this.$api.addClouddeskFile({
            userID: this.userID,
            path: this.getPath(),
            fileName: this.createFolderName
          }).then(res => {
            if (res.code === 0) {
              this.createFolderName = ''
              this.getClouddeskFileList()
            } else {
              this.$message.notify(this, 'error', res.message)
            }
          })
        }
      })
    },
    // 选择文件
    uploadFile (e) {
      var self = this
      // 静态'static', 动态'animation', 视频'media'
      var fileType = e.target.defaultValue

      this.popoverShow = false
      var file = e.target.files[0];
      var key = "user/" + this.userID + "/" + this.getPath() + file.name
      this.$refs.referenceUpload.value = null
      this.$refs.referenceUpload1.value = null
      this.$refs.referenceUpload2.value = null
      this.$cos.addFile(key, file, progress => {
        if (progress) {
          this.progressVisible = true
          this.percentage = Math.floor((progress.percent) * 100)
        }
        if (this.percentage === 100) {
          //清空上传文件的值 避免第二次上传同一文件不触发onchange
          //内部dialog显示隐藏
          this.progressVisible = false
        }
      }, res => {
        if (res.statusCode === 200) {
          // 添加文件
          this.$api.addClouddeskFile({
            userID: this.userID,
            path: this.getPath(),
            fileName: file.name,
            fileSize: file.size,
            cosUrl: res.Location,
            isStaticPpt: fileType === 'animation' ? 0 : 1,
          }).then(res => {
            if (res.code === 0) {
              this.getClouddeskFileList()
            } else {
              this.$message.notify(this, 'error', res.message)
            }
          })
        } else {
          this.$message.notify(this, 'error', res.message)
        }
      })
    },
    // 更新列表
    refreshClouddeskFileList: function () {
      var self = this

      this.stopRefreshListTask()
      this.getClouddeskFileList()
      this.refreshListTask = setTimeout(function () {
        self.refreshClouddeskFileList()
      }, 3000);
    },
    // 停止更新列表
    stopRefreshListTask: function () {
      clearTimeout(this.refreshListTask)
    },
    // 打开文件
    openFile (file) {
      if (file.fileType === "folder") { //打开文件夹
        this.path.push(file.fileName)
        this.getClouddeskFileList()
      } else {
        if (file.transcodeProgress === -1) {
          if (file.fileType === "mp4") {
            this.$webboard.openVideoFile(file.cosUrl, file.fileName)
          } else {
            this.$webboard.openImageUrl(file.cosUrl, file.fileName)
          }
        } else if (file.transcodeProgress === 100) {
          this.$webboard.openTranscodeFile(file.transcodeJson, file.fileName)
        }

        this.dialogShow = false
      }
    },
    // 删除文件
    deleteClouddeskFile (file) {
      var self = this;

      this.$message.alert(
        this,
        this.$t('clouddesk.deleteAlert'),
        'okcancel'
      ).then(action => {
        if (action === 'confirm') { // 点击了确认删除
          // 删除文件
          self.$api.deleteClouddeskFile({
            fileID: file.fileID,
            userID: file.userID,
            path: file.path,
            fileName: file.fileName
          }).then(res => {
            console.error('res', res)
            if (res.code === 0) {
              self.createFolderName = ''
              self.$message.notify(self, 'success', '删除成功')
              self.getClouddeskFileList()
            } else {
              self.$message.notify(self, 'error', res.message)
            }
          })
        }
      })
    },
    closeDialog () {
      this.dialogShow = false
    },
  }
}
</script>
