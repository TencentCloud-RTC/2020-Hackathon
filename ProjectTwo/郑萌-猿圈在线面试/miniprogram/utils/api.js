/**
 * @desc Api
 * @author sunqi
 * @company 猿圈科技
 * @date 03 Jun 2019
 */

const api = {
  login: {
    'getToken': '/interviewee/login'
  },
  user: {
    'info': '/interview/info/', //项目信息 interview/info/+id
    'giveUp': '/interviewee/confirm/status/-1', //放弃面试
    'confirm': '/interviewee/confirm/status/1', //确认参加
    'updateInfo': '/interviewee/update/info', //修改个人信息
    'changeTime': '/interviewee/apply/change/time',//更改时间
  },
  interivewer: {
    'roomInfo' : '/interviewer/rooms', // 面试官获取面试间列表
  }
  
}

module.exports = api

