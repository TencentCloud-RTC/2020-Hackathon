const api = require('../../../utils/api');
const req = require('../../../utils/request');
const config = require('../../../config');
const prefix = config.host;
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewName: '',
    // interviewId: '',
    url: '',
    intervieweeName: '',
    companyName: '',
    oldTime: '',
    expectStartTime: '',
    expectEndTime: '',
    makeUp: false //是否已安排补面时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {

    if(opt.start){
      this.setData({
        expectEndTime: util.formatTimeTxt(new Date(parseInt(opt.end))).substr(5,12),
        expectStartTime: util.formatTimeTxt(new Date(parseInt(opt.start))),
        makeUp: false
      })
    }
  
    util.getStorage('intervieweeInfo').then(data => {
      let date = util.formatDateTxt(new Date(data.startTime));
      let sTime = util.formatTime(new Date(data.startTime)).substr(11,5);
      let eTime = util.formatTime(new Date(data.endTime)).substr(11,5);
      let oldTime = date+'('+sTime+'-'+eTime+')'
      this.setData({
        intervieweeName: data.name,
        oldTime: oldTime
      })
      if(data.expectEndTime && data.expectStartTime){
        this.setData({
          expectEndTime: util.formatTimeTxt(new Date(data.expectEndTime)).substr(5,12),
          expectStartTime: util.formatTimeTxt(new Date(data.expectStartTime)),
        })
      }
    })
    util.getStorage('interviewInfo').then(data => {
      // this.setData({
      //   interviewId: data.interviewId
      // })
      this.getInterviewInfo(data.interviewId)
    })
  },
  // 获取项目信息
  getInterviewInfo(interviewId){
    util.getStorage('interviewInfo').then( data => {
      this.setData({
        interviewName: data.name,
        companyName: data.abbreviation,
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  copyUrl(e){
    console.log(e)
    console.log(1)
    wx.setClipboardData({
      data: this.data.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  //   wx.setClipboardData({
  //     data: '这是要复制的文字',
  //     success: function (res) {
  //     wx.showModal({
  //     title: '提示',
  //     content: '复制成功',
  //     showCancel: false
  //     });
  //     }
  //     })
  }
})