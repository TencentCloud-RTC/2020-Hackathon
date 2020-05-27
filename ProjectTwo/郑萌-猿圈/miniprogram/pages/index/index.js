const util = require('../../utils/util');
const config = require('../../config');
const prefix = config.host;
const api = require('../../utils/api');
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: null, // 确认状态 null-全部 -1拒绝 0-未确认 1同意 2-申请调时 500-没参数
    tips: '',
    interviewId: '',
    code: '',
    roleType: '', //1-候选人 2-面试官
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let code = options.code;
    let interviewId = options.interviewId;
    let roleType = options.roleType;
    this.setData({
      interviewId,
      code,
      roleType
    })
    // 将登录用户类型存入storage，以后页面的登录类型从storage获取
    wx.setStorage({
      key: 'roleType',
      data: roleType
    })
    this.getInterviewInfo();
    this.getToken();
  },
  /**
   * 登录获取token
   */
  getToken(){
    wx.showLoading({
      title: '加载中...',
    })
    const that = this;
    const url = this.data.roleType == '2' ? `${prefix.ApiUrl}/interviewer/login` : `${prefix.ApiUrl}/interviewee/login`;
    wx.request({
      url: url, 
      data: {
          code: this.data.code,
          interviewId: this.data.interviewId
      },
      method: 'get',
      header: {
          'content-type': 'application/json' 
      },
      success (res) {
        wx.hideLoading();
        if(res.data.flag){
            wx.setStorage({
                key: 'token',
                data: res.data.data.token
            })
            
            let start = res.data.data.startTime;
            let current = new Date().getTime();
            if( (start + 3*60*60000) < current && (res.data.data.interviewerCount !== 1 || res.data.data.intervieweeCount !== 1)) { //面试结束, 多人面试
              wx.redirectTo({url: '/pages/end/end'})
            } else { 
              if (that.data.roleType == '2') { //面试官
                wx.setStorage({
                    key: 'interviewerInfo',
                    data: res.data.data
                })
                // 面试官 跳转到面试间列表
                wx.redirectTo({
                  url: `/pages/roomList/index?interviewId=${that.data.interviewId}&code=${that.data.code}`
                })
              } else if (that.data.roleType == '1'){
                wx.setStorage({
                    key: 'intervieweeInfo',
                    data: res.data.data
                })
                let status = res.data.data.status;
                that.setData({
                  status: status
                })
                if(status == -1 || status == 0){
                  wx.redirectTo({url: '/pages/confirm/index/index?status='+status+'&interviewId='+ that.data.interviewId});
                }else if(status == 1){
                  wx.redirectTo({url: '/pages/confirm/link/index?interviewId='+ that.data.interviewId});
                }else if(status == 2){
                  wx.redirectTo({url: '/pages/confirm/submit/index'})
                }
              }  
            }
        }else{
          if (res.data.code == 2010) { // 超时
            that.setData({
              tips: '本场面试已超时关闭'
            })
          } else if (res.data.code == 11030) {
            that.setData({
              tips: res.data.msg
            })
          }
          that.setData({
            status: 500
          })
          
        }
      }
    })
  },
  // 获取项目信息
  getInterviewInfo(){
    let url = prefix.ApiUrl + api.user.info + this.data.interviewId;
    let params = {url: url}
    req.request(params).then(res => {
      if(res.flag){
        let info = res.data;
        info.code = this.data.code;
        util.setStorage('interviewInfo', info);
      }
    })
  },
  
})