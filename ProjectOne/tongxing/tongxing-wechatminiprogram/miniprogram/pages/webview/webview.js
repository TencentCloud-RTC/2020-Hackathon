//var urlHead = 'https://mp.weixin.qq.com/s/';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    title: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      url:  options.url,
      title: options.title,
    })
    console.log("optionsulr::::::" + options.url)
    console.log("options.title::::::" + options.title)
    wx.setNavigationBarTitle({
      title: options.title + '无障碍科技整理"',
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    console.log(options.webViewUrl)
    return {
      title: '助盲资讯',
      desc: '网明无障碍科技推荐' + this.data.title,
      path: '/pages/webview/webview?url='+this.data.url+'&title='+this.data.title

    }
  }
})