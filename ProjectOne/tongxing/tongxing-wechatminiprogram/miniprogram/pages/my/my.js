// pages/my/my.js


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    userInfo: null,
    systemInfo: null,
    icon: "/images/ic_user_unlogin.png",
    tucaoExtraData: {
      id: '35020', //我能帮帮忙:	35122	  启明瞳:	35020	 无障碍科技:	30778	
      /* 来源为吐个槽上申请的产品ID ，查看路径：tucao.qq.com ->产品管理->ID */
    },
    brand: '',
    model: '',
    version: '',
    system: '',

  },

  binderror: function(e) {
    console.log("图片：" + e.detail)
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let val = wx.getStorageSync('loginMsg');
    this.setData({
      userInfo: val,
      logged: true,
      url: 'https://testqmt-1256074910.cos.ap-beijing.myqcloud.com/20180827/oLwAN5AoMjE6j7I8BsjBQRDeMKLA/zjnnjnjn.png',
      icon: "/image/ic_user_unlogin.png"
    })


    try {
      var res = wx.getSystemInfoSync()
    } catch (e) {
      // Do something when catch error
    }
    this.setData({
      icon: "/image/ic_user_unlogin.png",
      brand: res.brand,
      model: res.model,
      model: res.model,
      version: res.version,
      system: res.system,
    });
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
  //跳转到设置界面
  setting: function () {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(option) {
    return {
      title: '启明瞳小程序',
      desc: '启明瞳开启盲人新视界',
      path: 'pages/my/my',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  },
  //吐个槽客服系统接入
  tucao: function() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: '35020', // 来源为吐个槽上申请的产品ID ，查看路径：tucao.qq.com ->产品管理->ID
        customData: {
          clientInfo: "手机品牌" + this.data.brand, //客户端信息
          clientVersion: this.data.version, //客户端版本号
          os: this.data.model, //操作系统
          osVersion: this.data.system, //操作系统版本 
          netType: '', //网络类型
          imei: '', //设备id（iOS 不能直接拿 IMEI，可以 mac 地址之类信息 md5 加密）
          clientInfo: "用户信息：" + "", //自定义字段，长度为 256
        }
      }
    });
  }
})