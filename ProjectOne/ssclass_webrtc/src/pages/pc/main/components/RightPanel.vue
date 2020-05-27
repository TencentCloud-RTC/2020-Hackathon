<template>
  <div class="right-panel-container" :style="{width: panelWidth}">
    <div class="el-video-box">
      <div
        class="video"
        ref="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.ShowVideo"
        id="teacherVideo"
      >
        <div class="el-video-icon-box">
          <span>{{teacher?teacher.userName:''}}</span>
          <span>
            <i
              v-show="userType===0 && hasVideo!=null"
              :class="hasVideo?'iconfont icon-videoNormal':'iconfont icon-videoClosed'"
              @click="operateVideo()"
            ></i>
            <i
              v-show="userType===0 && hasAudio!=null"
              :class="hasAudio?'iconfont icon-audioNormal':'iconfont icon-audioClosed'"
              @click="operateAudio()"
            ></i>
            <i
              v-show="userType===0"
              :class="isFullScreen?'iconfont icon-exitFullscreen':'iconfont icon-fullscreen'"
              @click="handleFullScreen('teacherVideo')"
            ></i>
          </span>
        </div>
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.VoiceLive"
      >
        <img :src="voiceLive" alt />
        <div class="el-video-icon-box">
          <span>{{teacher?teacher.userName:''}}</span>
          <span>
            <i
              v-show="userType===0"
              :class="openVideo?'iconfont icon-videoNormal':'iconfont icon-videoClosed'"
              @click="operateVideo()"
            ></i>
            <i
              v-show="userType===0"
              :class="openAudio?'iconfont icon-audioNormal':'iconfont icon-audioClosed'"
              @click="operateAudio()"
            ></i>
            <!-- <i
              v-show="userType===0"
              :class="openAudio?'iconfont icon-audioNormal':'iconfont icon-audioClosed'"
              @click="operateAudio()"
            ></i>-->
          </span>
        </div>
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.HasNoSteam"
      >
        <img :src="hasNoSteam" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.NotStart"
      >
        <img :src="liveNotStart" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.TeacherLeave"
      >
        <img :src="teacherLeave" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.LivePause"
      >
        <img :src="livePause" alt />
      </div>
      <div
        class="video"
        v-show="$func.getTeacherVideoState() === $constant.TeacherVideoState.LiveOver"
      >
        <img :src="liveOver" alt />
      </div>
    </div>
    <div class="right-panel-tabs">
      <el-tabs v-model="activeTab" @tab-click="clickTab">
        <el-tab-pane :label="$t('rightPanel.chat')+$func.getNewMsgCount()" name="chat">
          <div class="el-msg-box">
            <div
              class="msg"
              :class="member.isSelf?'el-msg-rt':'el-msg-lf'"
              v-for="(member, index) in imMsgList"
              :key="index"
            >
              <!-- <div>{{JSON.stringify(member)}}</div> -->
              <!-- <img :src="member.imageInfo.url" alt=""> -->
              <div class="el-msg-name">
                <span style="margin-right: 5px">{{member.userName}}</span>
                <span>{{$utils.right(member.sendTime,8)}}</span>
              </div>
              <div class="el-msg-content">
                <div class="el-msg-content-text" v-if="member.content">
                  <template v-for="(item,index) in member.content">
                    <span v-if="item.name === 'img'" :key="index">
                      <img :src="item.src" width="20px" height="20px" />
                    </span>
                    <span v-else-if="item.name === 'text'" :key="index">{{item.text}}</span>
                  </template>
                </div>
                <div class="el-msg-content-text el-msg-content-img" v-if="member.imageInfo">
                  <img
                    :src="member.imageInfo.imageUrl"
                    style="display:block;"
                    :width="member.imageInfo.width>240?240:member.imageInfo.width"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('rightPanel.member')+'('+$func.getMemberCount()+$t('rightPanel.person')+')'"
          name="member"
        >
          <div class="el-member-box" v-show="teacher">
            <div
              class="member"
              @mouseenter="memberMouseEnter"
              @mouseleave="memberMouseLeave"
              :class="{'member-hover': teacherHover}"
              v-if="teacher"
            >
              <el-popover placement="bottom-start" trigger="click">
                <div class="el-popover-teacher el-popover-member">
                  <span>{{$t('rightPanel.location')}}: {{teacher?teacher.country:''}}{{teacher?teacher.province:''}}{{teacher?teacher.city:''}}</span>
                  <span>{{$t('rightPanel.osType')}}: {{teacher?teacher.osType:''}}</span>
                  <span>{{$t('rightPanel.browserType')}}: {{teacher?teacher.browserType:''}}</span>
                  <span>{{$t('rightPanel.isp')}}: {{teacher?teacher.isp:''}}</span>
                </div>
                <div slot="reference">
                  <i :class="getOsType(teacher?teacher.osType:'')"></i>
                  <span
                    class="el-member-name"
                  >{{teacher?teacher.userName:''}}({{$t('rightPanel.teacher')}})</span>
                </div>
              </el-popover>
            </div>
            <div
              v-show="assistants.length"
              class="member"
              v-for="(member,index) in assistants"
              :key="member.userID"
              @mouseenter="memberMouseEnter('assistants', index)"
              @mouseleave="memberMouseLeave('assistants')"
              :class="{'member-hover': assistantsIdx===index}"
            >
              <el-popover placement="bottom-start" trigger="click">
                <div class="el-popover-teacher el-popover-member">
                  <span>{{$t('rightPanel.location')}}: {{member.country}}{{member.province}}{{member.city}}</span>
                  <span>{{$t('rightPanel.osType')}}: {{member.osType}}</span>
                  <span>{{$t('rightPanel.browserType')}}: {{member.browserType}}</span>
                  <span>{{$t('rightPanel.isp')}}: {{member.isp}}</span>
                </div>
                <div slot="reference">
                  <i :class="getOsType(member.osType)"></i>
                  <span class="el-member-name">{{member.userName}}({{$t('rightPanel.assistant')}})</span>
                </div>
              </el-popover>
              <el-popover placement="bottom-end" trigger="click">
                <div class="el-popover-teacher el-popover-member el-popover-member-order">
                  <span @click="videoCall">{{$t('rightPanel.videoCall')}}</span>
                  <span @click="voiceCall">{{$t('rightPanel.voiceCall')}}</span>
                  <span @click="closeLink">{{$t('rightPanel.closeLink')}}</span>
                  <span @click="openPen">{{$t('rightPanel.openPen')}}</span>
                  <span @click="closePen">{{$t('rightPanel.closePen')}}</span>
                  <span @click="thumbsUp">{{$t('rightPanel.thumbsUp')}}</span>
                </div>
                <div slot="reference">
                  <div class="el-member-box-more" v-if="userType == 0 && assistantsIdx===index">
                    <i class="iconfont icon-more"></i>
                  </div>
                </div>
              </el-popover>
            </div>
            <div
              v-show="students.length"
              class="member"
              v-for="(member,index) in students"
              :key="member.userID"
              @mouseenter="memberMouseEnter('students', index)"
              @mouseleave="memberMouseLeave('students')"
              :class="{'member-hover': studentsIdx===index}"
            >
              <el-popover placement="bottom-start" trigger="click">
                <div class="el-popover-teacher el-popover-member">
                  <span>{{$t('rightPanel.location')}}: {{member.country}}{{member.province}}{{member.city}}</span>
                  <span>{{$t('rightPanel.osType')}}: {{member.osType}}</span>
                  <span>{{$t('rightPanel.browserType')}}: {{member.browserType}}</span>
                  <span>{{$t('rightPanel.isp')}}: {{member.isp}}</span>
                </div>
                <div slot="reference">
                  <i :class="getOsType(member.osType)"></i>
                  <span class="el-member-name">{{member.userName}}</span>
                </div>
              </el-popover>
              <div style="display:flex;">
                <input type="hidden" :value="member.requestType" />
                <div
                  v-show="$func.isTeacher()
                  && $func.isMemberLinked(member.userID) 
                  && studentsIdx===index"
                  class="el-member-list-students-teacher-handle"
                >
                  <!-- 断开 -->
                  <el-button
                    type="danger"
                    size="mini"
                    @click="closeLink(member)"
                  >{{$t('rightPanel.closeLink2')}}</el-button>
                </div>
                <div
                  v-show="liveState === $constant.LiveState.Living
                  && $func.isTeacher()
                  && !$func.isMemberLinked(member.userID) 
                  && member.requestType === 0
                  && studentsIdx===index"
                  class="el-member-list-students-teacher-handle"
                >
                  <!-- 连麦 -->
                  <el-button
                    type="success"
                    size="mini"
                    @click="voiceCall(member)"
                  >{{$t('rightPanel.voiceCall2')}}</el-button>
                  <!-- 视频 -->
                  <el-button
                    type="success"
                    size="mini"
                    @click="videoCall(member)"
                  >{{$t('rightPanel.videoCall2')}}</el-button>
                </div>
                <div
                  v-show="member.requestType!= 0"
                  style="color:#67c23a;"
                  class="el-member-list-students-handle"
                >
                  <i class="iconfont icon-rasehand" @mouseenter="mouseEnter"></i>
                  <!-- 同意 -->
                  <el-button
                    v-show="$func.isTeacher()"
                    type="success"
                    size="mini"
                    @click="agreen(member)"
                  >{{$t('rightPanel.agreen')}}</el-button>
                  <!-- 拒绝 -->
                  <el-button
                    v-show="$func.isTeacher()"
                    type="danger"
                    size="mini"
                    @click="reject(member)"
                  >{{$t('rightPanel.reject')}}</el-button>
                </div>
                <el-popover placement="bottom-end" trigger="click" v-model="memberCmdShow">
                  <div class="el-popover-teacher el-popover-member el-popover-member-order">
                    <span @click="voiceCall(member)">{{$t('rightPanel.voiceCall')}}</span>
                    <span @click="videoCall(member)">{{$t('rightPanel.videoCall')}}</span>
                    <span @click="closeLink(member)">{{$t('rightPanel.closeLink')}}</span>
                    <span @click="openPen(member)">{{$t('rightPanel.openPen')}}</span>
                    <span @click="closePen(member)">{{$t('rightPanel.closePen')}}</span>
                    <span @click="thumbsUp(member)">{{$t('rightPanel.thumbsUp')}}</span>
                  </div>
                  <div slot="reference" style="display:none;">
                    <div
                      class="el-member-box-more"
                      :class="{'el-member-box-more-active':userType == 0 && studentsIdx===index}"
                    >
                      <i class="iconfont icon-more"></i>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="el-fixed-bottom">
      <div class="el-switch-box el-switch-chat-box" v-show="activeTab==='chat'">
        <div class="el-fixed-icon-box">
          <i class="iconfont icon-picture" @click="handleSendImageClick"></i>
          <!-- <i class="iconfont icon-toolcase" @click="handleSendFileClick"></i>
          <i class="iconfont icon-present"></i>-->
        </div>
        <div>
          <el-switch
            :width="Number(32)"
            @change="switchCheck('showBaberrage')"
            v-model="showBaberrage"
            :active-value="1"
            :inactive-value="0"
            active-color="#67C23A"
            inactive-color="#4C5867"
            :active-text="$t('rightPanel.showBaberrage')"
          ></el-switch>
          <el-switch
            v-show="userType===0 && activeTab==='chat'"
            :width="Number(32)"
            @change="switchCheck('muteAll')"
            v-model="muteAll"
            active-color="#67C23A"
            :active-value="1"
            :inactive-value="0"
            inactive-color="#4C5867"
            :active-text="$t('rightPanel.muteAll')"
          ></el-switch>
        </div>
      </div>
      <div class="el-switch-box el-member-switch-box" v-show="userType===0 && activeTab==='member'">
        <el-switch
          :width="Number(32)"
          @change="switchCheck('memberAutoLink')"
          v-model="memberAutoLink"
          active-color="#67C23A"
          :active-value="1"
          :inactive-value="0"
          inactive-color="#4C5867"
          :active-text="$t('rightPanel.memberAutoLink')"
        ></el-switch>
        <el-switch
          :width="Number(32)"
          @change="switchCheck('rejectRequest')"
          v-model="rejectRequest"
          active-color="#67C23A"
          :active-value="1"
          :inactive-value="0"
          inactive-color="#4C5867"
          :active-text="$t('rightPanel.rejectRequest')"
        ></el-switch>
      </div>
      <div class="el-input-box" v-show="activeTab==='chat'">
        <el-input
          v-model="inputText"
          :placeholder="$t('rightPanel.sendHint')"
          @keyup.enter.native="sendMsg"
        ></el-input>
        <div class="send-header-bar">
          <el-popover placement="top" width="402" trigger="click" v-model="isShowEmojis">
            <div class="emojis">
              <div v-for="item in emojiName" class="emoji" :key="item" @click="showEmojis(item)">
                <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px" />
              </div>
            </div>
            <i class="iconfont icon-emoji" slot="reference" title="发表情"></i>
          </el-popover>
        </div>

        <el-button type="success" :round="true" @click="sendMsg">{{$t('rightPanel.send')}}</el-button>
      </div>
      <input
        type="file"
        id="imagePicker"
        ref="imagePicker"
        accept=".jpg, .jpeg, .png, .gif"
        @change="sendImage"
        style="display:none"
      />
      <input
        type="file"
        id="filePicker"
        ref="filePicker"
        accept=".ppt, .pptx, .doc, .docx, .xls, .xlsc, .pdf, .mp4, .avi, .wmv"
        @change="sendFile"
        style="display:none"
      />
    </div>
  </div>
</template>

<script>
import TRTC from 'trtc-js-sdk'
import Constant from '@/constant/constant'
import { mapState } from 'vuex'
import { emojiMap, emojiName, emojiUrl } from '@/tencent/webim/emojiMap'
export default {
  data () {
    return {
      isMouseEnter: false,
      liveNotStart: require('@/assets/img/main/livenotstart.jpg'),
      livePause: require('@/assets/img/main/livepause.jpg'),
      liveOver: require('@/assets/img/main/liveover.jpg'),
      voiceLive: require('@/assets/img/main/voicelive.jpg'),
      hasNoSteam: require('@/assets/img/main/hasnostream.jpg'),
      teacherLeave: require('@/assets/img/main/teacherleave.jpg'),
      activeTab: 'chat',
      member: 'teacher',
      rejectRequest: false,
      memberAutoLink: false,
      showBaberrage: false,
      muteAll: false,
      teacherHover: true,
      assistantsIdx: null,
      studentsIdx: null,
      requestMembersIdx: null,
      panelWidth: '400px',
      memberCmdShow: false,
      inputText: '',
      randomColor: ['red', 'green', 'blue', 'orange', 'purple', 'yellow', 'pink', 'grey'],
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      isFullScreen: false,  //老师摄像头是不是全屏
      fullScreenArray: [],
      imgUrl: '',
      isShowEmojis: false
    }
  },
  computed: {
    ...mapState({
      roomInfo: 'roomInfo',
      userID: 'userID',
      userName: 'userName',
      liveState: 'liveState',
      teacher: 'teacher',
      teacherHasAudio: 'teacherHasAudio',
      teacherHasVideo: 'teacherHasVideo',
      assistants: 'assistants',
      students: 'students',
      showCommand: 'showCommand',
      userType: 'userType',
      imMsgList: 'imMsgList',
      newMsgCount: 'newMsgCount',
      openVideo: 'openVideo',
      openAudio: 'openAudio',
      hasVideo: 'hasVideo',
      hasAudio: 'hasAudio',
    }),
    baberrageList: {
      get () {
        return this.$store.state.baberrageList
      },
      set () {
        this.$store.commit('setBaberrageList', this.baberrageList)
      }
    }
  },
  mounted () {
    this.rejectRequest = this.$store.state.rejectRequest
    this.memberAutoLink = this.$store.state.memberAutoLink
    this.showBaberrage = this.$store.state.showBaberrage
    this.muteAll = this.$store.state.muteAll
    var self = this
    // 监控全屏事件
    window.onresize = function () {
      self.fullScreenArray.push(self.isFullScreen)
      if (self.fullScreenArray[self.fullScreenArray.length - 1] == self.fullScreenArray[self.fullScreenArray.length - 2]) {
        self.fullScreenArray[self.fullScreenArray.length - 1] = !self.fullScreenArray[self.fullScreenArray.length - 2]
        self.isFullScreen = !self.fullScreenArray[self.fullScreenArray.length - 2]
      }
    }
  },
  methods: {
    // 老师视频全屏和取消全屏
    handleFullScreen () {
      if (this.isFullScreen) {
        this.isFullScreen = false
        this.$utils.fullscreen('teacherVideo', false)
      } else {
        this.isFullScreen = true
        this.$utils.fullscreen('teacherVideo', true)
      }

    },
    // 选择表情
    selectEmoji (emoji) {
      this.inputText += emoji.data
    },
    mouseEnter () {
      this.isMouseEnter = true
    },
    agreen (member) {
      // 同意连接
      if (member.requestType === 1) {
        this.$webim.sendCommand(Constant.LiveCommand.VoiceCall, member.userID)
      } else if (member.requestType === 2) {
        this.$webim.sendCommand(Constant.LiveCommand.VideoCall, member.userID)
      }
      // 后台更新
      this.$func.setRequestType(member.userID, Constant.LiveCommand.RequestNone)
    },
    reject (member) {
      // 拒绝连接
      this.$webim.sendCommand(Constant.LiveCommand.RejectRequest, member.userID)
      // 后台更新
      this.$func.setRequestType(member.userID, Constant.LiveCommand.RequestNone)
    },
    voiceCall (member) {
      this.$webim.sendCommand(Constant.LiveCommand.VoiceCall, member.userID)
      this.memberCmdShow = false
    },
    videoCall (member) {
      this.$webim.sendCommand(Constant.LiveCommand.VideoCall, member.userID)
      this.memberCmdShow = false
    },
    closeLink (member) {
      this.$webim.sendCommand(Constant.LiveCommand.CloseLink, member.userID)
      this.memberCmdShow = false
    },
    openPen (member) {
      this.$webim.sendCommand(Constant.LiveCommand.OpenPen, member.userID)
      this.memberCmdShow = false
    },
    closePen (member) {
      this.$webim.sendCommand(Constant.LiveCommand.ClosePen, member.userID)
      this.memberCmdShow = false
    },
    thumbsUp (member) {
      this.$webim.sendCommand(Constant.LiveCommand.ThumbsUp, member.userID)
      this.memberCmdShow = false
    },
    memberMouseLeave (memberType) {
      if (memberType === 'assistants') {
        this.assistantsIdx = null
      } else if (memberType === 'students') {
        this.studentsIdx = null
      } else {
        this.teacherHover = false
      }
    },
    memberMouseEnter (memberType, idx) {
      if (memberType === 'assistants') {
        this.assistantsIdx = idx
      } else if (memberType === 'students') {
        if (this.userType === 0) {
          this.studentsIdx = idx
          this.students[idx].isHover = true
        }
      } else {
        this.teacherHover = true
      }
    },
    getOsType (osType) {
      if (osType === 'Mac') {
        return 'iconfont icon-mac'
      } else if (osType.indexOf('Windows') > -1) {
        return 'iconfont icon-windows'
      } else if (osType === 'Android') {
        return 'iconfont icon-android'
      } else if (osType === 'iPad') {
        return 'iconfont icon-ipad'
      } else if (osType === 'iPhone') {
        return 'iconfont icon-iphone'
      }
    },
    switchCheck (name) {
      if (name === 'memberAutoLink') {
        this.$store.commit('setMemberAutoLink', this.memberAutoLink)
      } else if (name === 'rejectRequest') {
        this.$store.commit('setRejectRequest', this.rejectRequest)
      } else if (name === 'showBaberrage') {
        if (this.showBaberrage === 1) {
          this.$store.commit('setShowBaberrage', true)
        } else {
          this.$store.commit('setShowBaberrage', false)
        }
      } else if (name === 'muteAll') {
        this.$store.commit('setMuteAll', this.muteAll)
        // 发送命令
        this.$webim.sendCommand(this.muteAll ? Constant.LiveCommand.MuteAll : Constant.LiveCommand.UnMuteAll)
        // 更新后台
        this.$api.muteAll({
          roomID: this.roomID,
          muteState: this.muteAll ? 1 : 0
        }).then(res => {
          if (res.code != 0) {
            console.error('setRequestType error', res)
          }
        })
      }
    },
    operateVideo () {
      if (this.openVideo && !this.openAudio) {
        this.$message.notify(this, 'error', this.$t('webrtc.noDeviceSelected'))
        return
      }
      // 是否打开视频
      this.$store.commit('setOpenVideo', !this.openVideo)
      // 重新打开
      this.$webrtc.reCreateLocalStream()
    },
    operateAudio () {
      if (!this.openVideo && this.openAudio) {
        this.$message.notify(this, 'error', this.$t('webrtc.noDeviceSelected'))
        return
      }
      // 是否打开视频
      this.$store.commit('setOpenAudio', !this.openAudio)
      // 重新打开
      this.$webrtc.reCreateLocalStream()
    },
    clickTab (tab, event) {
      var container = this.$el.querySelector(".el-tabs__content");
      if (event.target.getAttribute('id') === 'tab-chat') {
        this.$store.commit('setNewMsgCount', 0)
        container.style.height = 'calc(100vh - 392px)'
        this.scrollToBottom()
      } else {
        this.$nextTick(() => {
          container.style.height = 'calc(100vh - 355px)'
          container.scrollTop = 0;
        })
      }
    },
    scrollToBottom () {
      this.$nextTick(() => {
        var container = this.$el.querySelector(".el-tabs__content");
        container.scrollTop = container.scrollHeight;
      })
    },
    sendMsg () {
      if (this.inputText && this.inputText.length > 0) {
        this.$webim.sendTextMessage(this.inputText)
        this.$func.addTextMsg({
          userID: this.userID,
          userName: this.userName,
          faceUrl: '',
          content: this.inputText,
          sendTime: this.$utils.getNowTime(),
          isSelf: true
        })
        if (this.$store.state.showBaberrage) {
          var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
          var out = []
          while (arr.length) {
            var index = parseInt(Math.random() * arr.length);
            out = arr.splice(index, 1)
          }
          var baberrageItem = { msg: this.inputText, time: 15, barrageStyle: this.randomColor[out[0]] }
          var baberrageList = []
          baberrageList.push(baberrageItem)
          this.$store.commit('setBaberrageList', baberrageList)
        }
        this.inputText = ''
        this.scrollToBottom()
      }
    },
    showEmojis (item) {
      this.inputText += item
      this.isShowEmojis = false
    },
    // 发送图片
    sendImage () {
      this.$webim.sendImageMessage(
        this.$refs.imagePicker.files[0]
      ).then(res => {
        this.scrollToBottom()
        this.$refs.imagePicker.value = null
      })
    },
    // 发送文件
    sendFile () {
      this.$webim.sendFileMessage(
        this.$refs.filePicker.files[0]
      ).then(res => {
        this.scrollToBottom()
        this.$refs.filePicker.value = null
      })
    },
    handleSendImageClick () {
      this.$refs.imagePicker.click()
    },
    handleSendFileClick () {
      this.$refs.filePicker.click()
    },
  }
}
</script>
