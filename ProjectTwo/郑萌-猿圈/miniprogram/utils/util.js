const moment = require('../components/libs/moment');
const config = require('../config');
moment.locale('zh-cn');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatMonthAndDay = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return month+'月'+ day+'日'
}

const formatHourAndMinute = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

const formatTimeWithoutSecond = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-') 
}
const formatDateTxt = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return year+'年'+month+'月'+day+'日'
}

const formatTimeTxt = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return year + '年' + month + '月' + day + '日' + ' ' + [hour, minute].map(formatNumber).join(':')
}

// 计算时间差
const diffTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return '';
  }
  var m1 = moment(startTime);
  var m2 = moment(endTime);
  var duration = moment.duration(moment(m2 - m1));
  var hour = duration.hours() - 8;
  var minute = duration.minutes();
  var second = duration.seconds() || 0;
  var text = '';
  if (hour) {
    text += hour + '时'
  }

  if (minute) {
    text += minute + '分'
  }
  text += second + '秒'
  return text;
}

const getCurrentPageUrl = function () {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

const id = function() {
        return App.user.intervieweeId || App.user.interviewerId;
}

const clientType = function(user = App.user) {
  return user.interviewerId ? 2 : 1;
}
// 
function getTimeSpan(timeSpan) {
  const restTime = timeSpan;
  
  //计算出相差天数
  const days = padZero(Math.max(Math.floor(restTime / (24 * 3600 * 1000)), 0));
  //计算出小时数
  const leave1 = restTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  const hours = padZero(Math.min(23,Math.max(0, Math.floor(leave1 / (3600 * 1000)))));
  // console.log(leav1)
  //计算相差分钟数
  const leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
  const minutes = padZero(Math.min(59, Math.max(0, Math.floor(leave2 / (60 * 1000)))));
  //计算相差秒数
  const leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  const seconds = padZero(Math.min(59,Math.max(0, Math.floor(leave3 / 1000))));
  if(seconds === '59') {
  	console.log(timeSpan, minutes, seconds, leave1, leave2, leave3);
  }
  return {days, hours, minutes, seconds};

}
function padZero(str) {
  //补零
  if(!isNaN(str)) {
    str = String(str);
  }
  return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
}

/**
 * 获取缓存数据
 */
function getStorage(key) {
  return wx._getStorage({
    key: key
  })
    .then(res => res.data)
    .catch(err => {
      return null
    })
}
/**
* 数据缓存
*/
function setStorage(key, value) {
  return wx._setStorage({
    key: key,
    data: value
  }).then(res => true)
    .catch(err => {
      return null
    })
}
/**
* 清除缓存
*/
function removeStorage(key) {
  return wx._removeStorage({
    key: key
  })
    .then(res => res.data)
    .catch(err => {
      return null
    })
}
/**
 * 显示Modal，颜色匹配
 * @param  {String | Object} params={} Modal参数
 */
function showModal(params = {}) {
  if (typeof params === 'string') {
    params = {
      content: params
    }
  }
  return wx._showModal(Object.assign({
    title: '提示',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: config.baseColor,
    success(res){
      if(res.confirm){
        // 用户点击确定
      }else if(res.cancel){
        // 用户点击取消
      }
    }
  }, params))
}



module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatTimeWithoutSecond: formatTimeWithoutSecond,
  formatTimeTxt: formatTimeTxt,
  diffTime: diffTime,
  getCurrentPageUrl: getCurrentPageUrl,
  id: id,
  clientType: clientType,
  formatDateTxt,
  getStorage,
  setStorage,
  removeStorage,
  showModal,
  getTimeSpan,
  formatMonthAndDay,
  formatHourAndMinute
}