// pages/text/text.js

var plugin = requirePlugin("WechatSI");
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    fontSize: '60px',
  },

  bindWordTap: function(event) {
    let fontSize = event.currentTarget.dataset.fontsize + 'px';
    this.setData({
      fontSize: fontSize
    });
  },

  bindSoundTap: function() {
    let text = this.data.text;
    this.textToSpeech(text);
  },

  bindCopyTap: function() {
    var that = this;
    var text = this.data.text;
    wx.setClipboardData({
      data: text
    });
    this.textToSpeech("已复制");
  },

  /**
   * @method
   * @param {String} words
   * @description 字符串转语音并自动播报
   */
  textToSpeech: function (words) {
    var that = this;
    plugin.textToSpeech({
      lang: 'zh_CN',
      tts: true,
      content: words,
      success: function (res) {
        // console.log("音频播放" + res.filename)
        innerAudioContext.autoplay = true
        innerAudioContext.src = res.filename
        innerAudioContext.onPlay(() => {
          // console.log('开始播放')
        })
      },
      fail: function (res) {
        that.textToSpeech('语音转换失败');
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      text: options.text
    });
    let fontSize = wx.getStorageSync('fontSize');
    if(!!fontSize) {
      this.setData({
        fontSize: fontSize
      });
    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key: 'fontSize',
      data: this.data.fontSize,
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key: 'fontSize',
      data: this.data.fontSize,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '文字放大',
      desc: this.data.text,
      path: 'pages/text/text?text=' + this.data.text
    };
  }
})