/**
 * @desc 微信小程序API Promise封装
 * @author sunqi
 * @company 猿圈科技
 */

'use strict'

var util = require('./util')

/**
 * wx api promise化
 * @param  {} func=util.noop
 */
function promiseify (func = util.noop) {
  return (args = {}) => {
    return new Promise((resolve, reject) => {
      func.call(wx, Object.assign({}, args, {
        success: resolve,
        fail: reject
      }))
    })
  }
}

for (let key in wx) {
  if (Object.prototype.hasOwnProperty.call(wx, key) && typeof wx[key] === 'function' && key.indexOf('Sync') < 0) {
    Object.defineProperty(wx, `_${key}`, {
      configurable: true,
      enumerable: true,
      get () {
        return promiseify(wx[key])
      }
    })
  }
}
