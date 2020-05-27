import Vue from 'vue'
import axios from 'axios'

Vue.prototype.axios = axios // axios 为自定义的，Vue.prototype 为注册全局方法 其他任何组件都可以使用

axios.defaults.timeout = 30000 // 请求超时时间
axios.defaults.withCredentials = false
axios.defaults.headers.post['Content-Type'] = 'application/json'
// 请求拦截
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.error(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      this.$message.notify('请求失败', response.data.message)
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  error => {
    console.log(error)
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作
        // case 401:
        case 404:
          break
        case 400:
          break
        default:
          break
      }
      this.$message.notify('请求失败', response.data.message || '网络出错，请检查网络连接')
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params = '') {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8;'
      }
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
      console.error(url)
      // window.message.notify(new Vue(), 'error', window.i18n.t('system.netError'))
    })
  })
}