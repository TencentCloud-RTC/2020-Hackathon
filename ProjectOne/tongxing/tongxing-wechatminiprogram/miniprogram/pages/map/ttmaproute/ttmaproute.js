/**
 * @file 导航页面
 * @descripion 导航与更新启明瞳距离
 * @author 谢波涛改进！
 * @copyright 武汉网明公司
 * @createDate 2018-8-9
 * @todo ctrl + f 搜索 @todo
*/

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    routeInfo: null,
    isReading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从全局变量读取路径信息
    //建议设置初始位置！！！否则会报错和不准确
    var that = this;
    let routeInfo = {
      mode: "walk", 
      endLat: app.globalData.destination.location.lat,
      endLng: app.globalData.destination.location.lng,
      endName: app.globalData.destination.address
    };
    this.setData({
      routeInfo: routeInfo,
      isReading: app.globalData.isReading,
      distance: ''
    });

    //若全局变量isReading为真，则用计时器设置更新距离
    if (app.globalData.isReading) {
      this.interval = setInterval(function () {
        that.setData({
          distance: app.globalData.distance
        });
      }, 1000);     //应该用常量
    };
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
    //清除更新距离计时器
    clearInterval(this.interval);
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
  onShareAppMessage: function() {

  }
})