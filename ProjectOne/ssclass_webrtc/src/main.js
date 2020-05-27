import Vue from 'vue'
import App from './App'
import router from './router'
import Constant from '@/constant/constant'
import Message from '@/utils/messageBox'
import Utils from '@/utils/utils'
import Func from '@/utils/func'
import Api from '@/api/api'
import store from '@/store/store'
import i18n from '@/i18n/i18n'
import Cos from '@/tencent/cos/cos'
import WebIM from '@/tencent/webim/webim'
import WebRTC from '@/tencent/webrtc/webrtc'
import WebBoard from '@/tencent/webboard/webboard'
import LogReport from '@/log/logReport'
import ElementUI from 'element-ui'
import {
  vueBaberrage
} from 'vue-baberrage'

import "babel-polyfill"
import '@/assets/css/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole)

Vue.use(ElementUI)
Vue.use(vueBaberrage)

window.api = Api
window.i18n = i18n
window.utils = Utils
window.func = Func
window.store = store
window.message = Message
window.webim = WebIM
window.webrtc = WebRTC
window.webboard = WebBoard

window.logReport = LogReport

Vue.prototype.$constant = Constant
Vue.prototype.$message = Message
Vue.prototype.$utils = Utils
Vue.prototype.$func = Func
Vue.prototype.$api = Api
Vue.prototype.$cos = Cos
Vue.prototype.$webim = WebIM
Vue.prototype.$webrtc = WebRTC
Vue.prototype.$webboard = WebBoard
Vue.prototype.$logReport = LogReport

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  template: '<App/>'
})