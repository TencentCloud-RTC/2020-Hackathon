const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewName: ''
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
        interviewName: data.name
      })
    })
  },


 
})