<template>
  <div class="el-mobile-login-box">
    <div class="el-mobile-login-modal" v-show="guideShow">
      <img :src="iOsGuideImg" alt />
    </div>
    <div class="login-bg">
      <img :src="logoImg" alt />
    </div>
    <div class="login-info-box">
      <div class="login-info-title">{{roomInfo.roomName}}</div>
      <div class="login-info">
        <div>
          {{$t('login.startTime')}}
          <span>{{roomInfo.startTime}}</span>
        </div>
        <div>
          {{$t('login.duration')}}
          <span>{{duration}}</span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="login-float">
      <el-container>
        <el-main>
          <div class="input-box">
            <el-input
              class="el-login-input"
              v-model="userName"
              :placeholder="$t('login.userIsNull')"
              prefix-icon="el-icon-user"
            ></el-input>
            <el-input
              v-model="password"
              :placeholder="$t('login.passwordIsNull')"
              prefix-icon="el-icon-unlock"
            ></el-input>
            <el-button type="success" @click="onLogin" :round="true">{{$t('login.login')}}</el-button>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Constant from '@/constant/constant'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      logoImg: require('@/assets/img/login/logo_mobile.png'),
      iOsGuideImg: require('@/assets/img/login/ios_weixin_guide.png'),
      password: '',
      duration: '',
      guideShow: false
    }
  },
  created () {
    // 获取页面参数
    this.getQuery()
    // 系统
    this.$store.commit('setClientType', Constant.ClientType.Mobile)
    // 获得系统消息
    this.$func.getSysInfo()
    //获得房间信息
    this.getRoomInfo()
  },
  mounted () {
    // 检查浏览器版本号
    this.checkBrowser()
    // 检查WebRTC是否支持
    this.$func.checkWebrtc()
    // 检查roomID
    this.checkRoomID()
  },
  computed: {
    // 一般值都这样写进去 但是此时 在 data() 里 不能定义相同名称的的变量了 
    // 组件里需要的值 要这样引用 两种引用方式 比如userName绑定了v-model 就不能在这里引用了 
    // 在组件内需要修改引入的数据的 不要再this.abc = abc 而是应该 this.$store.commit(functionName, value)来做全局的改变
    ...mapState({
      userID: 'userID',
      userName: 'userName',
      roomID: 'roomID',
      roomInfo: 'roomInfo',
      userType: 'userType'
    })
  },
  methods: {
    // 获取查询
    getQuery () {
      let query = this.$route.query
      this.$store.commit('setRoomID', query.roomID)
      this.password = query.password
    },
    // 获得房间信息
    getRoomInfo () {
      this.$api.getRoomInfo({
        roomID: this.roomID
      }).then(res => {
        if (res.code === 0) {
          this.$store.commit('setRoomInfo', res.roomInfo)
          this.duration = this.$utils.getDuration(res.roomInfo.startTime, res.roomInfo.endTime)

          // 课堂已经结束
          if (res.roomInfo.isEnd === 1) {
            this.$message.alert(this, this.$t('login.liveIsEnd', { time: res.roomInfo.closeTime, user: res.roomInfo.closerName }))
            return
          }
        } else {
          this.$message.notify(this, 'error', res.message)
        }
      })
    },
    // 关闭提示
    closeTip () {
      this.guideShow = false
    },
    // 检查浏览器版本
    checkBrowser () {
      // 浏览器版本
      var osType = this.$utils.getOsType()
      var browserType = this.$utils.getBrowserType()

      // 苹果手机不支持微信和QQ，支持Safri、Chrome 和 QQ浏览器
      if (osType === 'iPhone' || osType === 'iPad') {
        if (browserType != 'Safari' && browserType != 'Chrome') {
          this.guideShow = true
          return
        }
      }

      // 检测是否支持Chrome浏览器60版本以上
      var version = this.$utils.getBrowserVersion()
      if (browserType == "Chrome" || browserType == "360" || browserType == "QQBrowser") {
        if (version < 60) {
          this.$message.notify(this, 'error', this.$t("webrtc.notSupport"))
          return
        }
      }
    },
    // 检查房间id
    checkRoomID () {
      // 房间号不能为空
      if (!this.roomID || this.roomID.len === 0) {
        this.$message.notify(this, 'error', this.$t("login.roomIsNull"))
        return
      }
    },
    // 登录
    onLogin () {
      if (this.password == this.roomInfo.teacherPassword) { //老师
        this.$message.notify(this, 'error', this.$t("login.teacherCantUseMobile"))
        return
      } else if (this.password == this.roomInfo.assistantPassword) {
        this.$store.commit('setUserType', 1)
      } else if (this.password == this.roomInfo.studentPassword) {
        this.$store.commit('setUserType', 2)
      } else if (this.password == this.roomInfo.overseerPassword) {
        this.$store.commit('setUserType', 3)
      } else {
        this.$message.notify(this, 'error', this.$t("login.passwordIsError"))
        return
      }

      // 获得用户id
      this.$func.getUserID()

      // 用户名
      this.$store.commit('setUserName', this.userName)

      if (!this.userName) {
        this.$message.notify(this, 'error', this.$t("login.userIsNull"))
        return
      }

      // 检查老师
      this.$api.getRoomTeacher({
        roomID: this.roomID
      }).then(res => {
        if (res.code === 0) {
          var teacherID = res.teacherID;
          var teacherName = res.teacherName;

          if (teacherID && teacherID.length > 0) {
            if (this.userType === 0 && teacherID != this.userID) {
              this.$message.alert(this, this.$t('login.hasTeacher', { teacherName: teacherName }))
            } else if (this.userType != 0 && teacherID == this.userID) {  //和老师id相同
              this.$message.alert(this, this.$t('login.isTeacherID'), 'default')
            } else {
              this.goMainWindow()
            }
          } else {
            this.goMainWindow()
          }
        }
      })
    },
    // 跳转到 主界面
    goMainWindow () {
      this.$router.replace({
        path: '/mMain',
        query: {
          roomID: this.roomInfo.roomID,
          roomName: this.roomInfo.roomName,
          userID: this.userID,
          userName: this.userName,
          userType: this.userType
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
@import "../../../assets/css/login_mobile.css";
</style>