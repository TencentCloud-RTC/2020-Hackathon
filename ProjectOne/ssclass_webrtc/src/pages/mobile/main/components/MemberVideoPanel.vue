<template>
  <div class="mobile-el-center-video-box" v-show="memberStreamList && memberStreamList.length>0">
    <ul :style="ulStyle">
      <member-video
        :streamID="member.id"
        :streamUserID="member.userID"
        :streamUserName="member.userName"
        :stream="member.stream"
        :hasAudio="member.hasAudio"
        :hasVideo="member.hasVideo"
        :index="index"
        v-for="(member,index) in memberStreamList"
        :key="index"
      ></member-video>
    </ul>
  </div>
</template>

<script>
import memberVideo from './MemberVideo'
import { mapState } from 'vuex'
export default {
  components: {
    memberVideo
  },
  data () {
    return {
      ulStyle: '',
      boxStyle: ''
    }
  },
  computed: {
    // 一般值都这样写进去 但是此时 在 data() 里 不能定义相同名称的的变量了 
    // 组件里需要的值 要这样引用 两种引用方式 比如userName绑定了v-model 就不能在这里引用了 
    // 在组件内需要修改引入的数据的 不要再this.abc = abc 而是应该 this.$store.commit(functionName, value)来做全局的改变
    ...mapState({
      memberStreamList: 'memberStreamList',
      mobileWidth: 'mobileWidth'
    })
  },
  watch: {
    memberStreamList (newVal, oldVal) {
      if (newVal && newVal.length > 0) {
        this.boxStyle = 'height:' + (this.$store.state.mobileWidth/4)/16*9 + 'px;top: calc(210px - '+ (this.$store.state.mobileWidth/4)/16*9 + 'px)'
        this.ulStyle = "width:" + this.memberStreamList.length * (this.$store.state.mobileWidth/4) + "px;"
      }
    }
  },
  methods: {
    closeVideo (index) {
      console.log(index, '关闭摄像头')
    },
    closeMic (index) {
      console.log(index, '关闭麦克风')
    }
  },
  mounted () {
    if(this.$func.isMobile()) {
      this.boxStyle = 'height:' + (this.$store.state.mobileWidth/4)/16*9 + 'px;top: calc(210px - '+ (this.$store.state.mobileWidth/4)/16*9 + 'px)'
      this.ulStyle = "width:" + this.memberStreamList.length * (this.$store.state.mobileWidth/4) + "px;"
    }
  }
}
</script>

<style lang="css" scoped>
.mobile-el-center-video-box {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  /* width: 100%; */
  z-index: 49;
  overflow-x: scroll;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  background: #181818;
}
.mobile-el-center-video-box::-webkit-scrollbar {
  display: none;
}
.mobile-el-center-video-box ul {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.mobile-el-center-video-box li {
  float: left;
  margin-right: 2px;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  background: #fff;
}
.mobile-el-center-video-box li:last-child {
  margin-right: 0;
}
.mobile-el-center-video-box li .el-item-video-box {
  position: relative;
  height: 100%;
  width: 100%;
}
.mobile-el-center-video-box li .el-item-video-box .el-center-video-icon-box {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  color: #fff;
  text-align: center;
  background: #000;
  opacity: 0.6;
  border-top-right-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.mobile-el-center-video-box
  li
  .el-item-video-box
  .el-center-video-icon-box
  span:first-child {
  font-size: 12px;
}
.mobile-el-center-video-box li .el-center-video-icon-box i {
  font-size: 16px;
}
</style>
