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
    title: '确认是否参加本场考试',
    interviewName: '',
    startHH: '',
    startMM: '',
    endHH: '',
    endMM: '',
    date: '',
    intervieweeName: '',
    intervieweeId: '',
    email: '',
    userId: '',
    companyName: '',
    status: 0, //0确认面试时间   1 放弃面试显示
    disabled: true,
    border: '', 
    allowChangeTime: true,
    beginChangeTime: '',
    endChangeTime: '',
    roomId: '',
    interviewId: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    let interviewId = opt.interviewId;
    let status = opt.status;
    this.setData({
      status: status
    })
    if(status == -1){
      this.setData({
        title: ''
      })
    }
    util.getStorage('intervieweeInfo').then(data => {
      let startTime = util.formatTime(new Date(data.startTime));
      let endTime = util.formatTime(new Date(data.endTime));
      let sh = startTime.substr(11,2);
      let sm = startTime.substr(14,2);
      let eh =endTime.substr(11,2);
      let em =endTime.substr(14,2);
      let date = util.formatDateTxt(new Date(data.startTime));
      this.setData({
        intervieweeName: data.name,
        intervieweeId: data.intervieweeId,
        email: data.email || '',
        date: date,
        startHH: sh,
        startMM: sm,
        endHH: eh,
        endMM: em,
        allowChangeTime: data.allowChangeTime,
        beginChangeTime: data.beginChangTime,
        endChangeTime: data.endChangeTime,
        roomId: data.roomId
      })
      this.getInterviewInfo(interviewId)
    })
  },
  // 获取项目信息
  getInterviewInfo(){
    util.getStorage('interviewInfo').then( data => {
      this.setData({
        interviewName: data.name,
        companyName: data.abbreviation,
        interviewId: data.interviewId
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  handleGiveUp(){
    let url = prefix.ApiUrl + api.user.giveUp;
    let data = {
      intervieweeId: this.data.intervieweeId
    }
    let params = {
      data: data,
      url: url,
      method: 'PUT'
    }
    req.request(params).then(res => {
      if(res.flag){
        this.setData({
          status: -1,
          title: ''
        })
      }
    })
  },
  handleChangeTime(){
    if(this.data.allowChangeTime){
      wx.navigateTo({
        url: '/pages/confirm/changeTime/index?interviewName='+this.data.interviewName
            +'&roomId='+this.data.roomId
            +'&interviewId='+this.data.interviewId
            +'&beginChangeTime='+this.data.beginChangeTime
            +'&endChangeTime='+this.data.endChangeTime
      });
    }else {
      util.showModal('本场面试不允许更换时间')
    }

  },
  handleConfirm(){
    util.removeStorage('url')
    let url = prefix.ApiUrl + api.user.confirm;
    let data = {
      intervieweeId: this.data.intervieweeId,
    }
    let params = {
      data: data,
      url: url,
      method: 'PUT'
    }
    req.request(params).then(res => {
      if(res.flag){
        let url = res.msg;
        util.setStorage('url',url).then(res => {
          wx.redirectTo({url: '/pages/confirm/link/index?interviewId='+this.data.interviewId})
        });
      }
    })
  },
  edit(){
    this.setData({
      disabled: false,
      border: 'border-bottom'
    })
  },
  nameChange(e){
    this.setData({
      intervieweeName: e.detail.value
    })
  },
  emailChange(e){
    this.setData({
      email: e.detail.value
    })
  },
  saveEdit(){
    let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    if(this.data.intervieweeName == ''){
      util.showModal({title:'请输入姓名'});
      return 
    }else if(this.data.email == ''){
      util.showModal('请输入邮箱');
      return
    }else if(!reg.test(this.data.email )){
      util.showModal({title:'邮箱格式不正确'});
      return
    }
    let data = {
      name: this.data.intervieweeName,
      email: this.data.email
    }
    let url = prefix.ApiUrl + api.user.updateInfo
    let params = {
      data: data,
      url: url,
      method: 'PUT'
    }
    req.request(params).then(res => {
      if(res.flag){
        wx.showToast({title:'修改成功'});
        this.setData({
          disabled: true,
          border: ''
        })
      }
    })

  }
})