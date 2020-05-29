// pages/test/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewId: '',
    code: '',
    radio: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeA() {
    this.setData({
      radio: 1
    })
  },
  changeB() {
    this.setData({
      radio: 2
    })
  },
  handleNext() {
    // wx.redirectTo({url: '/pages/index/index?code='+ this.data.code +'&interviewId='+ this.data.interviewId});
    wx.redirectTo({url: `/pages/index/index?code=${this.data.code}&interviewId=${this.data.interviewId}&roleType=${this.data.radio}`});

  },
  blurEventId(event) {
    this.setData({
      interviewId: event.detail.value
    })
  },
  blurEventCode(event){
    this.setData({
      code: event.detail.value
    })
  }
  
})