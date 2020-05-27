<template>
  <div class="login">
    <el-row v-if="browserTipShow">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark grid-success">
          {{$t('login.browserTipLeft')}}
          <a
            href="http://www.suishenketang.com/WebRTC/help.html"
            style="color:#ff6666;text-decoration:none;"
          >{{$t('login.browserTipMiddle')}}</a>
          {{$t('login.browserTipRight')}}
        </div>
      </el-col>
    </el-row>
    <div class="login-container" :class="browserTipShow?'login-empty-height':'login-full-height'">
      <div class="login-box">
        <el-container>
          <el-aside width="50%">
            <div class="logo">
              <img :src="logoImg" alt />
            </div>
            <h3 class="name">{{roomInfo.roomName}}</h3>
            <div class="line-box">
              <div class="line"></div>
              <div class="line-top"></div>
            </div>
            <p class="el-p-text">
              {{$t('login.startTime')}}
              <span>{{roomInfo.startTime}}</span>
            </p>
            <p class="el-p-text">
              {{$t('login.duration')}}
              <span>{{duration}}</span>
            </p>
          </el-aside>
          <el-main>
            <div class="right">
              <img :src="rightImg" alt />
            </div>
            <div class="input-box">
              <el-input
                v-model="userName"
                :placeholder="$t('login.userIsNull')"
                prefix-icon="el-icon-user"
              ></el-input>
              <el-input
                v-model="password"
                :placeholder="$t('login.passwordIsNull')"
                prefix-icon="el-icon-unlock"
              ></el-input>
              <el-button type="success" @click="onLogin">{{$t('login.login')}}</el-button>
            </div>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import Constant from '@/constant/constant'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      logoImg: require('@/assets/img/login/logo.png'),
      rightImg: require('@/assets/img/login/right.png'),
      password: '',
      duration: '',
      browserTipShow: false
    }
  },
  computed: {
    // 一般值都这样写进去 但是此时 在 data() 里 不能定义相同名称的的变量了 
    // 组件里需要的值 要这样引用 两种引用方式 比如userName绑定了v-model 就不能在这里引用了 
    // 在组件内需要修改引入的数据的 不要再this.abc = abc 而是应该 this.$store.commit(functionName, value)来做全局的改变
    ...mapState({
      userID: 'userID',
      roomID: 'roomID',
      roomInfo: 'roomInfo',
      userType: 'userType'
    }),
    // userName 因为页面做了v-model绑定 所以需要体现出 get 和 set 让input可以修改这个值 不需要绑定v-model的 直接写在上面的 ...mapState
    userName: {
      get () {
        return this.$store.state.userName
      },
      set (val) {
        return this.$store.commit('setUserName', val)
      }
    }
  },
  created () {
    // 获取页面参数
    this.getQuery()
    // 系统
    this.$store.commit('setClientType', Constant.ClientType.PC)
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
    // 检查浏览器版本
    checkBrowser () {
      // 浏览器版本
      var browserType = this.$utils.getBrowserType()
      var browserVersion = this.$utils.getBrowserVersion()
      // 检测是否支持Chrome浏览器52版本以上
      if (browserType == "Chrome" || browserType == "360" || browserType == "QQBrowser") {
        if (browserVersion < 52) {
          this.browserTipShow = true
        }
      } else if (browserType != "Safari") {
        this.browserTipShow = true
      }
    },
    // 检查房间id
    checkRoomID () {
      // 房间号不能为空
      if (!this.roomID || this.roomID.length === 0) {
        this.$message.notify(this, 'error', this.$t("login.roomIsNull"))
        return
      }
    },
    // 登录
    onLogin () {
      if (this.browserTipShow) {
        this.$message.notify(this, 'error', this.$t("login.browserNotSupport"))
        return
      }

      if (this.password == this.roomInfo.teacherPassword) {//老师
        this.$store.commit('setUserType', 0)
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
        path: '/main',
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
@import "../../../assets/css/login.css";
</style>