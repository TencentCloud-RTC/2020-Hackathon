<template>
  <div
    class="el-center-video-box"
    v-show="memberStreamList && memberStreamList.length > 0"
    :style="boxStyle"
  >
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
      mobileWidth: 'mobileWidth',
      roomInfo: 'roomInfo'
    })
  },
  watch: {
    memberStreamList (newVal, oldVal) {
      if (newVal && newVal.length > 0) {
        this.ulStyle = "width:" + this.memberStreamList.length * 240 + "px;"
      }
    },
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

  }
}
</script>