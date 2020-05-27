<template>
  <div class="el-center-box" :style="boxStyle">
    <div class="el-tag-box" v-show="showCommand && !mobileWidth">
      <div class="el-tag-box-left">
        <el-tag
          v-for="(tag,index) in tags"
          :key="tag.name"
          :type="tag.type"
          closable
          @click="changeTag(index)"
          @close="closeTag(tag)"
        >{{tag.name}}</el-tag>
      </div>
      <div class="el-tag-box-right">
        <div class="el-tag-box-right-icon">
          <el-button class="button-new-tag" size="small" @click="addBoard">
            <i class="iconfont icon-addBoard"></i>
          </el-button>
          <el-popover placement="top-end" width="300" trigger="click" :value="tagListShow">
            <div class="el-popover-box">
              <div
                class="el-popover-item"
                v-for="(tag, index) in tags"
                :key="index"
                @click="changeTag(index)"
              >
                <span>{{tag.name}}</span>
                <i class="el-icon-close" @click.stop="closeTag(tag)"></i>
              </div>
              <div v-show="tags.length === 0" class="el-popover-item">暂无白板</div>
            </div>
            <el-button class="button-new-tag" size="small" slot="reference">
              <i class="iconfont icon-more"></i>
            </el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <nav-bar v-show="showCommand && !mobileWidth" @operateNav="operateNav"></nav-bar>
    <div id="webBoard" class="el-center-canvas" :style="boardStyle">
      <img :src="liveNotStartImg" v-show="userType!=0 && liveState!=$constant.LiveState.Living" alt />
    </div>
    <div class="el-center-bottom el-center-fixed" v-show="showCommand && !mobileWidth">
      <ul>
        <li
          @mouseenter="mouseEnter('mouse')"
          @mouseleave="mouseLeave('mouse')"
          :class="{'el-active-li':enterCommand==='mouse'}"
          @click="clickBar('mouse')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.mouse')"
            placement="top"
          >
            <i class="iconfont icon-mouse"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('pen')"
          @mouseleave="mouseLeave('pen')"
          :class="{'el-active-li':enterCommand==='pen'}"
          @click="clickBar('pen')"
        >
          <i class="iconfont icon-pen"></i>
        </li>
        <li
          @mouseenter="mouseEnter('text')"
          @mouseleave="mouseLeave('text')"
          :class="{'el-active-li':enterCommand==='text'}"
          @click="clickBar('text')"
        >
          <i class="iconfont icon-text"></i>
        </li>
        <li
          @mouseenter="mouseEnter('eraser')"
          @mouseleave="mouseLeave('eraser')"
          :class="{'el-active-li':enterCommand==='eraser'}"
          @click="clickBar('eraser')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.eraser')"
            placement="top"
          >
            <i class="iconfont icon-eraser"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('graphical')"
          @mouseleave="mouseLeave('graphical')"
          :class="{'el-active-li':enterCommand==='graphical'}"
          @click="clickBar('graphical')"
        >
          <i class="iconfont" :class="graphicalStyle"></i>
        </li>
        <li
          @mouseenter="mouseEnter('undo')"
          @mouseleave="mouseLeave('undo')"
          :class="{'el-active-li':enterCommand==='undo'}"
          @click="clickBar('undo')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.undo')"
            placement="top"
          >
            <i class="iconfont icon-undo"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('redo')"
          @mouseleave="mouseLeave('redo')"
          :class="{'el-active-li':enterCommand==='redo'}"
          @click="clickBar('redo')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.redo')"
            placement="top"
          >
            <i class="iconfont icon-redo"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('zoomIn')"
          @mouseleave="mouseLeave('zoomIn')"
          :class="{'el-active-li':enterCommand==='zoomIn'}"
          @click="clickBar('zoomIn')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.zoomIn')"
            placement="top"
          >
            <i class="iconfont icon-zoomIn"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('zoomOut')"
          @mouseleave="mouseLeave('zoomOut')"
          :class="{'el-active-li':enterCommand==='zoomOut'}"
          @click="clickBar('zoomOut')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.zoomOut')"
            placement="top"
          >
            <i class="iconfont icon-zoomOut"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('zoomDrag')"
          @mouseleave="mouseLeave('zoomDrag')"
          :class="{'el-active-li':enterCommand==='zoomDrag'}"
          @click="clickBar('zoomDrag')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.zoomDrag')"
            placement="top"
          >
            <i class="iconfont icon-zoomDrag"></i>
          </el-tooltip>
        </li>
        <li
          @mouseenter="mouseEnter('original')"
          @mouseleave="mouseLeave('original')"
          :class="{'el-active-li':enterCommand==='original'}"
          @click="clickBar('original')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.original')"
            placement="top"
          >
            <i class="iconfont icon-original"></i>
          </el-tooltip>
        </li>
        <li @click="clickBar('red')">
          <span class="el-color-red el-color-box"></span>
        </li>
        <li @click="clickBar('yellow')">
          <span class="el-color-yellow el-color-box"></span>
        </li>
        <li @click="clickBar('green')">
          <span class="el-color-green el-color-box"></span>
        </li>
        <li @click="clickBar('blue')">
          <span class="el-color-blue el-color-box"></span>
        </li>
        <li @click="clickBar('purple')">
          <span class="el-color-purple el-color-box"></span>
        </li>
        <li @click="clickBar('black')">
          <span class="el-color-black el-color-box"></span>
        </li>
        <li
          @mouseenter="mouseEnter('previous')"
          @mouseleave="mouseLeave('previous')"
          :class="{'el-active-li':enterCommand==='previous'}"
          @click="clickBar('previous')"
        >
          <i class="el-icon-arrow-left"></i>
        </li>
        <li>
          <span>{{boardPageIndex}}</span>
          <span>/</span>
          <span>{{boardPageCount}}</span>
        </li>
        <li
          @mouseenter="mouseEnter('next')"
          @mouseleave="mouseLeave('next')"
          :class="{'el-active-li':enterCommand==='next'}"
          @click="clickBar('next')"
        >
          <i class="el-icon-arrow-right"></i>
        </li>
        <li
          @mouseenter="mouseEnter('clearAll')"
          @mouseleave="mouseLeave('clearAll')"
          :class="{'el-active-li':enterCommand==='clearAll'}"
          @click="clickBar('clearAll')"
        >
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="$t('whiteboard.clearAll')"
            placement="top"
          >
            <i class="iconfont icon-clearAll"></i>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="el-style-box" v-if="graphicalShow && !mobileWidth">
      <ul>
        <li
          @mouseenter="mouseEnter('rect')"
          @mouseleave="mouseLeave('rect')"
          :class="{'el-active-li':enterCommand==='rect'}"
          @click="clickBar('rect','icon-rect')"
        >
          <i class="iconfont icon-rect"></i>
        </li>
        <li
          @mouseenter="mouseEnter('rectSolid')"
          @mouseleave="mouseLeave('rectSolid')"
          :class="{'el-active-li':enterCommand==='rectSolid'}"
          @click="clickBar('rectSolid','icon-rectSolid')"
        >
          <i class="iconfont icon-rectSolid"></i>
        </li>
        <li
          @mouseenter="mouseEnter('oval')"
          @mouseleave="mouseLeave('oval')"
          :class="{'el-active-li':enterCommand==='oval'}"
          @click="clickBar('oval','icon-oval')"
        >
          <i class="iconfont icon-oval"></i>
        </li>
        <li
          @mouseenter="mouseEnter('ovalSolid')"
          @mouseleave="mouseLeave('ovalSolid')"
          :class="{'el-active-li':enterCommand==='ovalSolid'}"
          @click="clickBar('ovalSolid','icon-ovalSolid')"
        >
          <i class="iconfont icon-ovalSolid"></i>
        </li>
      </ul>
    </div>
    <div class="el-brush-box" v-if="brushShow && !mobileWidth">
      <ul>
        <li
          @mouseenter="mouseEnter('brushThin3')"
          @mouseleave="mouseLeave('brushThin3')"
          :class="{'el-active-li':enterCommand==='brushThin3'}"
          @click="clickBar('brushThin3','icon-brushThin3')"
        >
          <i class="iconfont icon-brushThin3"></i>
        </li>
        <li
          @mouseenter="mouseEnter('brushThin2')"
          @mouseleave="mouseLeave('brushThin2')"
          :class="{'el-active-li':enterCommand==='brushThin2'}"
          @click="clickBar('brushThin2','icon-brushThin2')"
        >
          <i class="iconfont icon-brushThin2"></i>
        </li>
        <li
          @mouseenter="mouseEnter('brushThin1')"
          @mouseleave="mouseLeave('brushThin1')"
          :class="{'el-active-li':enterCommand==='brushThin1'}"
          @click="clickBar('brushThin1','icon-brushThin1')"
        >
          <i class="iconfont icon-brushThin1"></i>
        </li>
      </ul>
    </div>
    <div class="el-text-box" v-if="textShow && !mobileWidth">
      <ul>
        <li
          @mouseenter="mouseEnter('textSize4')"
          @mouseleave="mouseLeave('textSize4')"
          :class="{'el-active-li':enterCommand==='textSize4'}"
          @click="clickBar('textSize4','icon-textSize4')"
        >
          <i class="iconfont icon-textSize4"></i>
        </li>
        <li
          @mouseenter="mouseEnter('textSize3')"
          @mouseleave="mouseLeave('textSize3')"
          :class="{'el-active-li':enterCommand==='textSize3'}"
          @click="clickBar('textSize3','icon-textSize3')"
        >
          <i class="iconfont icon-textSize3"></i>
        </li>
        <li
          @mouseenter="mouseEnter('textSize2')"
          @mouseleave="mouseLeave('textSize2')"
          :class="{'el-active-li':enterCommand==='textSize2'}"
          @click="clickBar('textSize2','icon-textSize2')"
        >
          <i class="iconfont icon-textSize2"></i>
        </li>
        <li
          @mouseenter="mouseEnter('textSize1')"
          @mouseleave="mouseLeave('textSize1')"
          :class="{'el-active-li':enterCommand==='textSize1'}"
          @click="clickBar('textSize1','icon-textSize1')"
        >
          <i class="iconfont icon-textSize1"></i>
        </li>
      </ul>
    </div>
    <div
      v-show="currentFileID != '#DEFAULT' && !mobileWidth && showCommand"
      :class="thumbnailBoxShow === true?'el-thumbnail-box-right':thumbnailBoxShow === ''?'':'el-thumbnail-box-left'"
      class="el-thumbnail-box"
    >
      <ul class="el-thumbnail-ul" v-show="thumbnailList && thumbnailList.length>0 && !mobileWidth">
        <li
          class="el-thumbnail-li"
          v-for="(item,index) in thumbnailList"
          @click="changeBoard(item)"
          :key="index"
        >
          <span>{{index+1}}</span>
          <img :src="item.imageUrl" alt />
        </li>
      </ul>
      <span>
        <i :class="thumbnailBoxIcon" @click="handleBoardList"></i>
      </span>
    </div>
  </div>
</template>
    
<script>
import Constant from '@/constant/constant'
import LogEvent from '@/log/LogEvent'
import NavBar from './Navbar'
import { mapState } from 'vuex'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      liveNotStartImg: require('@/assets/img/main/liveNotStart.png'),
      thumbnailBoxShow: '',
      thumbnailBoxIcon: 'el-icon-arrow-right',
      graphicalStyle: 'icon-rect',
      boxStyle: 'height: calc(100vh - 38px);',
      boardStyle: '',
      enterCommand: '',
      graphicalShow: false,
      brushShow: false,
      textShow: false,
      inputData: '',
      tagListShow: false,
      tags: [], // 白板和课件文件列表
      thumbnailList: []
    }
  },
  computed: {
    ...mapState({
      userType: 'userType',
      roomInfo: 'roomInfo',
      showCommand: 'showCommand',
      currentFileID: 'currentFileID', // 当前选中文件
      courseFileList: 'courseFileList', // 白板中的课件列表
      currentBoardID: 'currentBoardID', // 当前白板页
      whiteBoardList: 'whiteBoardList', // 白板页面
      boardPageIndex: 'boardPageIndex', // 当前id
      boardPageCount: 'boardPageCount', // 白板数量
      mobileWidth: 'mobileWidth',
      liveState: 'liveState',
      openPen: 'openPen'
    }),
    showMemberVideo: {
      get () {
        return this.$store.state.showMemberVideo
      },
      set (newVal) {
        this.showMemberVideo = newVal
      }
    }
  },
  created () {
  },
  mounted () {
    // var self = this
    // // 监控全屏事件
    // window.onresize = function () {
    //   self.$webboard.resize()
    // }

    if (!this.$func.isMobile()) { // 手机不会显示工具条
      if (this.$store.state.showMemberVideo === true) {
        this.boxStyle = 'height: calc(100vh - 188px);margin-top: 150px;'
        this.boardStyle = 'height: calc(100vh - 188px);'
      } else if (this.$store.state.showMemberVideo === false) {
        if (this.showCommand) {
          this.boxStyle = 'height: calc(100vh - 38px);'
          this.boardStyle = 'height: calc(100vh - 94px);'
        } else {
          this.boxStyle = 'height: calc(100vh - 38px);'
          this.boardStyle = 'height: calc(100vh - 38px);'
        }

      }
    } else {
      this.boxStyle = 'height: 100%;width: 100%;'
      this.boardStyle = 'height: 100%;'
    }
  },
  watch: {
    openPen (newVal) {
      if (newVal) {
        this.$webrtc.setDrawEnable(this.openPen)
      }
    },
    mobileWidth (newVal, oldVal) {
      this.boxStyle = 'height: 100%;width: 100%;'
      this.boardStyle = 'height: 100%;background:#fff;'
    },
    inputData (newVal, oldVal) {
      this.$webboard.addSyncData(JSON.parse(newVal))
    },
    showMemberVideo (newVal, oldVal) {
      if (newVal === true && this.$store.state.showCommand == true) {
        if (!this.$func.isMobile()) {
          this.boxStyle += 'height: calc(100vh - 188px);margin-top: 150px;'
          this.boardStyle = 'height: calc(100vh - 188px);'
        }
      } else if (newVal === true && this.$store.state.showCommand == false) {
        if (!this.$func.isMobile()) {
          this.boxStyle += 'height: calc(100vh - 188px);margin-top: 150px;'
          this.boardStyle = 'height: calc(100vh - 188px);'
        }
      } else if (newVal === false && this.$store.state.showCommand == true) {
        if (!this.$func.isMobile()) {
          this.boxStyle += 'height: calc(100vh - 38px);margin-top:0;'
          this.boardStyle = 'height: calc(100vh - 100px);'
        }
      } else if (newVal === false && this.$store.state.showCommand == false) {
        if (!this.$func.isMobile()) {
          this.boxStyle += 'height: calc(100vh - 38px);margin-top:0'
          this.boardStyle = 'height: calc(100vh - 38px);'
        }
      }
    },
    showCommand (newVal, oldVal) {
      if (this.$store.state.showMemberVideo === true && newVal === true) {
        this.boardStyle += 'height: calc(100vh - 280px);'
        this.boxStyle = 'height: calc(100vh - 188px);margin-top: 150px;'
      } else if (this.$store.state.showMemberVideo === true && newVal === false) {
        this.boxStyle += 'height: calc(100vh - 188px);margin-top: 150px;'
        this.boardStyle = 'height: calc(100vh - 166px);'
      } else if (this.$store.state.showMemberVideo === false && newVal === true) {
        this.boardStyle += 'height: calc(100vh - 100px);margin-top:0'
        this.boxStyle = 'height: calc(100vh - 38px);'
      } else if (this.$store.state.showMemberVideo === false && newVal === false) {
        this.boardStyle += 'height: calc(100vh - 94px);margin-top:0'
        this.boxStyle = 'height: calc(100vh - 38px);'
      }
    },
    currentFileID (newVal, oldVal) {
      if (newVal) {
        if (newVal != Constant.WebBoard.WhiteBoardId) {
          // 从课件列表中拿到缩略图
          this.courseFileList.forEach(item => {
            if (item.fid === newVal) {
              this.thumbnailList = item.thumbnailList
            }
          })
        } else {
          this.thumbnailList = []
        }

        this.getTags()
      }
    },
    currentBoardID (newVal, oldVal) {
      if (newVal) {
        this.getTags()
      }
    },
    courseFileList (newVal, oldVal) {
      if (newVal) {
        this.getTags()
      }
    },
    whiteBoardList (newVal, oldVal) {
      if (newVal) {
        this.getTags()
      }
    }
  },
  methods: {
    operateNav (command) {
      this.$emit('operateNav', command)
    },
    getTags () {
      this.tags = []
      // 添加课件
      this.courseFileList.forEach(fileInfo => {
        var type = 'normal'
        if (fileInfo.fid === this.currentFileID) {
          type = 'seled'
        }

        this.tags.push({
          name: fileInfo.title,
          id: fileInfo.fid,
          type: type
        })
      })

      // 添加白板
      this.whiteBoardList.forEach(boardInfo => {
        var type = 'normal'
        if (this.currentFileID === Constant.WebBoard.WhiteBoardId && boardInfo.bid === this.currentBoardID) {
          type = 'seled'
        }

        this.tags.push({
          name: boardInfo.title,
          id: boardInfo.bid,
          type: type
        })
      })
    },
    addBoard () {
      this.$webboard.addBoard()
    },
    changeTag (index) {
      this.$webboard.switchFile(this.tags[index].id)
    },
    closeTag (tag) {
      if (window.utils.right(tag.id, 8) === Constant.WebBoard.WhiteBoardId) {
        this.$webboard.deleteBoard(tag.id)
      } else {
        this.$webboard.deleteFile(tag.id)
      }
    },
    handleBoardList () {
      if (this.thumbnailBoxShow === false) {
        this.thumbnailBoxShow = true
        this.thumbnailBoxIcon = 'el-icon-arrow-left'
      } else if (this.thumbnailBoxShow === true) {
        this.thumbnailBoxShow = false
        this.thumbnailBoxIcon = 'el-icon-arrow-right'
      } else {
        this.thumbnailBoxShow = true
        this.thumbnailBoxIcon = 'el-icon-arrow-left'
      }
    },
    changeBoard (boardInfo) {
      this.$webboard.gotoBoard(boardInfo.boardId)
    },
    clickBar (command, style) {
      if (command === 'rect' || command === 'rectSolid' || command === 'oval' || command === 'ovalSolid') {
        this.graphicalStyle = style
        this.graphicalShow = false
        this.$webboard.oprate(command)
      } else if (command === 'pen' || command === 'brushThin3' || command === 'brushThin2' || command === 'brushThin1') {
        this.brushShow = false
        this.$webboard.oprate(command)
      } else if (command === 'text' || command === 'textSize4' || command === 'textSize3' || command === 'textSize2' || command === 'textSize1') {
        this.textShow = false
        this.$webboard.oprate(command)
      } else {
        this.$webboard.oprate(command)
      }
    },
    mouseEnter (command) {
      this.enterCommand = command
      if (command === 'graphical' || command === 'rect' || command === 'rectSolid' || command === 'oval' || command === 'ovalSolid') {
        this.graphicalShow = true
        this.brushShow = false
        this.textShow = false
      } else if (command === 'pen' || command === 'brushThin3' || command === 'brushThin2' || command === 'brushThin1') {
        this.brushShow = true
        this.graphicalShow = false
        this.textShow = false
      } else if (command === 'text' || command === 'textSize4' || command === 'textSize3' || command === 'textSize2' || command === 'textSize1') {
        this.textShow = true
        this.graphicalShow = false
        this.brushShow = false
      } else {
        this.graphicalShow = false
        this.brushShow = false
        this.textShow = false
      }
    },
    mouseLeave (command) {
      if (command === 'graphical') {
        this.graphicalShow = true
      } else if (command === 'pen') {
        this.brushShow = true
      } else if (command === 'text') {
        this.textShow = true
      } else {
        this.enterCommand = ''
        this.graphicalShow = false
        this.brushShow = false
        this.textShow = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
.el-center-box {
  width: calc(100vw - 400px);
  height: calc(100vh - 38px);
  box-sizing: border-box;
  background: #282828;
  position: relative;
}
.el-center-canvas {
  background: #282828;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
  width: 100%;
}
.el-center-fixed ul {
  list-style: none;
  margin: 0;
  padding: 0 6px;
  display: flex;
}
ul li {
  font-size: 20px;
  color: #d6d6d6;
  box-sizing: border-box;
}
ul li span.el-color-box {
  width: 20px;
  height: 18px;
  border: 1px solid #d6d6d6;
  box-sizing: border-box;
}
ul li span.el-color-red {
  background: #ff0100;
}
ul li span.el-color-yellow {
  background: #ff9903;
}
ul li span.el-color-blue {
  background: #0000ff;
}
ul li span.el-color-green {
  background: #008000;
}
ul li span.el-color-black {
  background: #000000;
}
ul li span.el-color-purple {
  background: purple;
}
.el-center-fixed {
  position: absolute;
  z-index: 1200;
  background: #484848;
}
.el-center-bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.el-center-fixed li {
  position: relative;
  color: #d6d6d6;
}
.el-center-fixed li.el-active-li {
  color: #67c23a;
}
.el-choose-box {
  position: absolute;
  top: 36px;
  background: #484848;
  color: #d6d6d6;
  display: flex;
  padding: 6px 12px;
  box-sizing: border-box;
  border-radius: 5px;
}
.el-choose-box span {
  margin-right: 15px;
}
.el-choose-box span:last-child {
  margin-right: 0;
}
.el-center-bottom span {
  font-size: 14px;
}
.el-center-bottom /deep/ .el-input {
  width: 40px;
  padding: 0;
}
.el-center-bottom ul li {
  display: flex;
  padding: 4px 4.2px;
  align-items: center;
  justify-content: center;
}
.el-center-bottom ul li .el-page-jump {
  margin-right: 5px;
}
.el-center-bottom ul li .el-page-jump-right {
  margin-left: 5px;
}
.el-center-bottom /deep/ .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
  padding: 0 3px;
  text-align: center;
}
.el-center-bottom
  /deep/
  .el-input--mini
  .el-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.el-center-bottom /deep/ .el-input--mini .el-input__inner[type="number"] {
  -moz-appearance: textfield;
}
.el-style-box {
  position: absolute;
  bottom: 28px;
  left: 30%;
}
.el-style-box ul {
  background: #484848;
  list-style: none;
  padding: 0 6px;
  margin: 0;
  display: flex;
  border-radius: 4px;
}
.el-style-box ul li {
  padding: 4px 4.2px;
  height: 31px;
  box-sizing: border-box;
}
.el-style-box li.el-active-li {
  color: #67c23a;
}

.el-brush-box {
  position: absolute;
  bottom: 28px;
  left: 23%;
}
.el-brush-box ul {
  background: #484848;
  list-style: none;
  padding: 0 6px;
  margin: 0;
  display: flex;
  border-radius: 4px;
}
.el-brush-box ul li {
  padding: 4px 4.2px;
  height: 31px;
  box-sizing: border-box;
}
.el-brush-box li.el-active-li {
  color: #67c23a;
}

.el-text-box {
  position: absolute;
  bottom: 28px;
  left: 26%;
}
.el-text-box ul {
  background: #484848;
  list-style: none;
  padding: 0 6px;
  margin: 0;
  display: flex;
  border-radius: 4px;
}
.el-text-box ul li {
  padding: 4px 4.2px;
  height: 31px;
  box-sizing: border-box;
}
.el-text-box li.el-active-li {
  color: #67c23a;
}

.el-tag-box {
  background: #303030;
  color: #fff;
  height: 28px;
  display: flex;
  justify-content: space-between;
}
.el-tag-box .el-tag {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  color: #aeaeae;
  line-height: 32px;
  height: 28px;
  border: 0;
  margin-right: 2px;
  z-index: 0;
  position: relative;
  padding-right: 20px;
}
.el-tag-box .el-tag-box-left {
  width: 70%;
}
.el-tag-box .el-tag--seled {
  background: #282828;
  color: #fff;
}
.el-tag-box .el-tag--seled::before {
  background: #282828;
}
.el-tag-box-right-icon {
  background: #303030;
}
.el-tag-box .button-new-tag {
  height: 28px;
  line-height: 28px;
  box-sizing: border-box;
  padding-top: 0;
  padding-bottom: 0;
  background-color: #303030;
  border-color: #303030;
  color: #fff;
  border: 0;
  box-sizing: border-box;
}
.el-button--small,
.el-button--small.is-round {
  padding: 6px;
}
.el-tag-box-right-icon .iconfont {
  font-size: 15px;
}
.el-button + .el-button {
  margin-left: 0;
}
.el-tag-box /deep/ .el-input__inner {
  border-radius: 0 !important;
  height: 28px;
  border: 0;
  line-height: 28px;
  box-sizing: border-box;
}
.el-tag-box /deep/ .el-tag .el-tag__close {
  color: #aeaeae;
  position: absolute;
  top: 8px;
  right: 4px;
}
.el-tag-box /deep/ .el-tag.el-tag--seled .el-tag__close {
  color: #fff;
}
.el-tag-box /deep/ .el-tag .el-tag__close:hover {
  background: transparent;
}

.el-popover-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 24px;
  padding: 0 12px;
}

.el-popover-item:hover {
  background: #f0f0f0;
}
.el-popover-item span {
  font-size: 13px;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
}

.el-center-canvas {
  text-align: center;
}
.el-center-canvas img {
  position: relative;
  margin-top: calc((100vh - 188px) / 2);
}
.el-center-canvas::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #282828;
}
.el-center-canvas::-webkit-scrollbar-button {
  display: none;
}
.el-center-canvas::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #aeaeae;
}
.el-center-canvas::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #282828;
}

.el-thumbnail-box {
  position: absolute;
  width: 135px;
  left: -120px;
  top: 28px;
  z-index: 1999;
  height: 100%;
  display: flex;
}
.el-thumbnail-box-left {
  left: -120px;
  animation-name: hideMove;
  animation-duration: 0.2s;
}
.el-thumbnail-box-right {
  left: 0;
  animation-name: showMove;
  animation-duration: 0.2s;
}
@keyframes hideMove {
  from {
    left: 0;
  }
  to {
    left: -120px;
  }
}
@keyframes showMove {
  from {
    left: -120px;
  }
  to {
    left: 0;
  }
}
.el-thumbnail-ul {
  max-height: 100%;
  width: 120px;
  background: #484848;
  overflow-y: scroll;
  list-style: none;
  padding: 10px 6px 10px 10px;
  box-sizing: border-box;
  margin: 0 0 15px;
}
.el-thumbnail-box > span {
  width: 15px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.el-thumbnail-box > span i {
  background: #484848;
  padding: 15px 0;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.el-thumbnail-ul li {
  width: 100%;
  margin-bottom: 10px;
  position: relative;
}
.el-thumbnail-ul li:last-child {
  margin-bottom: 0;
}
.el-thumbnail-ul li img {
  width: 100%;
  display: block;
}
.el-thumbnail-ul li span {
  position: absolute;
  color: #fff;
  padding: 3px;
  text-align: center;
  vertical-align: middle;
  font-size: 10px;
  left: 0;
  bottom: 0;
  background: #323232;
}

.el-thumbnail-ul::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background: #484848;
}
.el-thumbnail-ul::-webkit-scrollbar-button {
  display: none;
}
.el-thumbnail-ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #aeaeae;
}
.el-thumbnail-ul::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #484848;
}
</style>