const util = require('../../../utils/util');
const api = require('../../../utils/api');
const req = require('../../../utils/request');
const config = require('../../../config');
const prefix = config.host;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    intervieweeName: '',
    intervieweeId: '',
    companyName: '',
    interviewName: '',
    device: 0, //设备 1 电脑  2 可手机电脑
    code: '',
    interviewId: '',
    disable: false,
    startTime: 0,
    endTime: 0,
    currentTime: 0,
    buttonText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    let interviewId = opt.interviewId;
    this.setData({
      interviewId: interviewId
    })
    util.getStorage('interviewInfo').then(data => {
      this.setData({
        interviewId: data.interviewId,
        code: data.code
      })
    })
    util.getStorage('url').then(url => {
      if(url){
        this.setData({
          url: url
        })
      }
    })
    this.getInterviewInfo();

  },
  // gettime
  getTime() {
    let timer = setInterval(()=> {
      let currentTime = new Date().getTime();
      // startTime - currentTime
      let timeSpan = util.getTimeSpan(this.data.startTime - currentTime);
      this.setData({
        buttonText: timeSpan.days+'天'+timeSpan.hours+'时'+timeSpan.minutes+'分'+timeSpan.seconds+'秒后开始'
      })
      if(currentTime > (this.data.startTime - 10*60*1000)){
        this.setData({
          disable: false
        })
      }
      if(timeSpan.days == '00' && timeSpan.hours == '00' && timeSpan.minutes == '00' && timeSpan.seconds == '00'){
        clearInterval(timer);
        this.setData({
          disable: false,
          buttonText: '进入面试房间'
        })
      }
    },1000);
  },

  // 获取项目信息
  getInterviewInfo(){
    util.getStorage('interviewInfo').then( data => {
      this.setData({
        interviewName: data.name,
        companyName: data.abbreviation,
        device: data.device
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.getStorage('intervieweeInfo').then(data => {
      this.setData({
        intervieweeName: data.name,
        intervieweeId: data.intervieweeId,
      })
      if(data.url){
        this.setData({
          url: data.url
        })
      }
      
      // 倒计时
      let startTime = data.startTime;
      let currentTime = data.currentTime;
      let endTime = data.endTime;
      let weeCount = data.intervieweeCount;
      let werCount = data.interviewerCount;
      this.setData({
        startTime: startTime,
        currentTime: currentTime,
        endTime: endTime
      })
      // 1v1
      if(weeCount === 1 && werCount === 1) {
        this.setData({
          disable: false
        })
        if(startTime > currentTime){
          let timeSpan = util.getTimeSpan(startTime - currentTime);
          this.setData({
            buttonText: timeSpan.days+'天'+timeSpan.hours+'时'+timeSpan.minutes+'分'+timeSpan.seconds+'秒后开始'
          })
          this.getTime();
        }else if(startTime < currentTime ) { //&& currentTime < (startTime + 3*60*60*1000)
          this.setData({
            buttonText: '进入面试房间'
          })
        }else if((startTime + 3*60*60*1000) < currentTime){
          // this.setData({
          //   disable: true,
          //   buttonText: '面试已结束'
          // })
        }
      }else{
        if(startTime > currentTime){ //倒计时
          let timeSpan = util.getTimeSpan(startTime - currentTime);
          this.setData({
            buttonText: timeSpan.days+'天'+timeSpan.hours+'时'+timeSpan.minutes+'分'+timeSpan.seconds+'秒后开始'
          })
          if(currentTime > (startTime - 10*60*1000)){
            this.setData({
              disable: false
            })
          }
          this.getTime();
          if(currentTime > (startTime - 10*60*1000)){
            this.setData({
              disable: false
            })
          }else {
            this.setData({
              disable: true
            })
          }
        }else if(startTime < currentTime && currentTime < (startTime + 3*60*60*1000)) {
          this.setData({
            disable: false,
            buttonText: '进入面试房间'
          })
        }else if((startTime + 3*60*60*1000) < currentTime){
          this.setData({
            disable: true,
            buttonText: '面试已结束'
          })
        }
      }
    })
  },

  copyUrl(e){
    wx.setClipboardData({
      data: this.data.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  handleToRoom() {
    wx.navigateTo({
      url: '/pages/tic/index/index?interviewId='+this.data.interviewId+'&code='+this.data.code+'&roleType=1'
    });
  }
})