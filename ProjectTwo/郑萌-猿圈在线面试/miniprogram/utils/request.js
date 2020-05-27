/**
 * @desc Request
 * @author sunqi
 * @company fivefire
 * @date 
 */

'use strict'

const config = require('../config')
const util = require('./util')

wx.onNetworkStatusChange(resp=> {
    if(!resp.isConnected){
        showError(null, '网络异常，请稍后重试')
    }
 })
/**
 * 显示请求错误
 * @param  {} title=''
 */
function showError (title = '', content = '') {
  util.showModal({
    title: title || '提示',
    content: content || '访问服务器出错',
    showCancel: false
  })
}

/**
 * request wrapper
 * @param  {} params={}  参数同wx.request，只多了一个params.loading参数，默认为true，控制接口请求是否显示loading

 */
const baseLoading = {
  mask: true,
  title: '加载中...'
}
function request (params = {}) {
  let loading = params.loading
  // 如果自传了complete，loading必须强制设置为false，不管params中loading如何
  if (params.complete) {
    loading = false
  } else {
    if (typeof loading === 'boolean') {
      if (loading) {
        loading = baseLoading
      }
    } else {
      loading = Object.assign({}, baseLoading, params.loading)
    }
  }
  if (loading) {
    wx.showLoading(loading)
  }
  let task = null
  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      success (res) {
        // 全局处理请求结果
        if (res.statusCode === 200 || res.statusCode === 201) {
          // 接口内部返回的code处理
          if (['200', 200].includes(res.data.code) || ['200', 200].includes(res.data.status_code)) {
            resolve(res.data)
          } else {
            // 接口处理异常
            showError(null, res.data.msg)
            reject(res)
          }
        } else if (res.statusCode === 401) {
          reject(res)
          // Unauthorized

        } else {
          // 404 50X ...
          reject(res)
          showError()
        }
      },
      fail (err) {
        console.log(err)
        reject(err)
        if (err.errMsg && err.errMsg.indexOf('timeout') > -1) {
          showError(null, '网络异常，请稍后重试')
        } else {
          showError()
        }
      },
      complete () {
        if (loading) {
          wx.hideLoading()
        }
      }
    }, params)
    // 获取本地token，并在每次请求时设置header中的token
    try {
      const token = wx.getStorageSync(config.storage.sessionKey)
      if (token) {
        opts.header.authorization = token
      }
    } catch (e) {
      console.log(e)
    }
    task = wx.request(opts)
  })
}

module.exports = {
  request,
}
