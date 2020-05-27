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
    currentDate: new Date().getTime(),
    minDate: 0,
    maxDate: 0,
    show: false,
    startTime: '',
    endTime: '',
    submitStartTime: '',
    submitEndTime: '',
    type: '',
    beginChangeTime: '',
    endChangeTime: '',
    interviewName: '',
    interviewId: '',
    roomId: '',
    reason: ''
  },
  showDatePicker(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      show: true,
      type: type
    });
  },
  onClose() {
    this.setData({ show: false });
  },
  onInput(event) {
    this.setTime(event);
  },
  onConfirm(event){
    this.setTime(event);
    this.setData({show: false});
  },
  setTime(event){
    let timeStamp = event.detail;
    let date = util.formatTimeWithoutSecond(new Date(timeStamp));
    console.log(date)
    if(this.data.type == '1'){
      this.setData({
        startTime: date,
        submitStartTime: timeStamp
      })
    }else if(this.data.type == '2'){
      this.setData({
        endTime: date,
        submitEndTime: timeStamp
      })
    }
  },
  onBlur(e) {
    console.log(e.detail.value)
    this.setData({
      reason: e.detail.value
    })
  },
  submit(){
    let sTime = new Date(this.data.beginChangeTime).getTime();
    let eTime = new Date(this.data.endChangeTime).getTime();

    // console.log(sTime)

    if(this.data.submitStartTime == ''){
      util.showModal('请选择期望起始日期')
      return;
    }else if(this.data.submitEndTime == ''){
      util.showModal('请选择期望截止日期')
      return;
    }else if(this.data.submitStartTime > this.data.submitEndTime){
      util.showModal('期望起始日期应早于期望截止日期');
      return;
    }
    // else if(this.data.submitStartTime < sTime){
    //   // util.showModal('不可以选择'+this.data.beginChangeTime+'之前的日期');
    //   util.showModal('您只能选择'+ this.data.beginChangeTime + '至' + this.data.endChangeTime + '的日期')
    //   return;
    // }else if(this.data.submitEndTime > eTime){
    //   // util.showModal('不可以选择'+ this.data.endChangeTime +'之后的日期');
    //   util.showModal('您只能选择' + this.data.beginChangeTime + '至' + this.data.endChangeTime + '的日期')
    //   return;
    // }
    let url = prefix.ApiUrl + api.user.changeTime;
    let data = {
      interviewId: this.data.interviewId,
      roomId: this.data.roomId,
      expectStartTime: this.data.submitStartTime,
      expectEndTime: this.data.submitEndTime,
      reason: this.data.reason
    }
    
    let params = {
      url: url,
      data: data,
      method: 'POST'
    }
    req.request(params).then(res=>{
      if(res.flag){
        // 跳转
        wx.redirectTo({url: '/pages/confirm/submit/index?start='+this.data.submitStartTime+'&end='+this.data.submitEndTime});
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    let begin = util.formatDate(new Date(parseInt(opt.beginChangeTime)));
    let end = util.formatDate(new Date(parseInt(opt.endChangeTime)));
    console.log(begin)
    console.log(opt)
    this.setData({
      beginChangeTime: begin,
      endChangeTime: end,
      minDate: opt.beginChangeTime,
      maxDate: opt.endChangeTime,
      interviewName: opt.interviewName,
      interviewId: opt.interviewId,
      roomId: opt.roomId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  handleGoBack(){
    wx.navigateBack();
  }

  
})