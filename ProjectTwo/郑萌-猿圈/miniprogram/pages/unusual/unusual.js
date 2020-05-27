const util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewName: '',
    code: '',
    interviewId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInterviewInfo();
  },
  // 获取项目信息
  getInterviewInfo(){
    util.getStorage('interviewInfo').then( data => {
      this.setData({
        interviewName: data.name,
        code: data.code,
        interviewId: data.interviewId
      })
    })
  },
  handleToRoom() {
    wx.getStorage({
      key: 'roleType',
      success: (res) => {
        if (res.data == 1) {
          wx.redirectTo({
            url: '/pages/tic/index/index?interviewId='+this.data.interviewId+'&code='+this.data.code+'&roleType=1'
          });
        } else if (res.data == 2) {
          wx.getStorage({
            key: 'roomId',
            success: (resp) => {
              let roomId = resp.data
              wx.redirectTo({
                url: '/pages/tic/index/index?interviewId='+this.data.interviewId+'&code='+this.data.code+'&roleType=2&roomId='+roomId
              });
            }
          })
          
        }
      }
    })
    
  },

  
})