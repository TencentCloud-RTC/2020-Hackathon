// pages/roomList/index.js
const util = require('../../utils/util');
const api = require('../../utils/api');
const req = require('../../utils/request');
const config = require('../../config');
const prefix = config.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewId: 0,
    code: '',
    roomList:[],
    days: [], // 有面试的日期
    date: '',
    current: new Date().getTime(),
    currentTime: new Date().getTime(),
    showCale: false,
    // 日历配置参数
    calendarConfig: {
      multi: true, // 是否开启多选,
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      chooseAreaMode: false, // 开启日期范围选择模式，该模式下只可选择时间段
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: true, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      preventSwipe: true, // 是否禁用日历滑动切换月份
      disablePastDay: false, // 是否禁选当天之前的日期
      disableLaterDay: false, // 是否禁选当天之后的日期
      firstDayOfWeek: '', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: false, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: false // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      interviewId: options.interviewId,
      code: options.code
    })
    this.getRoomInfo();

  },
  /**
   * 日期点击事件
   */

  onTapDay(e) {
    // console.log('onTapDay', e.detail); // => { year: 2019, month: 12, day: 3, ...}
    // 1、将年月日转换为时间戳
    let timeStr = e.detail.year + '/' + e.detail.month + '/' + e.detail.day,
        timeStamp = new Date(timeStr).getTime();
    this.setData({
      current: timeStamp
    })
    // 2、getRoomInfo
    this.getRoomInfo()

  },
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    // console.log('afterCalendarRender', e);
    let that = this
    this.calendar.setTodoLabels({
      // 待办点标记设置
      pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
      dotColor: '#1890ff', // 待办点标记颜色
      circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
      // days: [
      //   {
      //     year: 2020,
      //     month: 3,
      //     day: 6,
      //     todoText: '待办'
      //   },
      //   {
      //     year: 2020,
      //     month: 3,
      //     day: 15
      //   }
      // ]
      days: that.data.days
    });
  },

  getRoomInfo() {
    let url = prefix.ApiUrl + api.interivewer.roomInfo + '/' + this.data.interviewId;
    let data = {
      time: this.data.current
    }
    this.setData({
      date: util.formatMonthAndDay(new Date(this.data.current))
    })
    let params = {
      url,
      data,
      method: 'GET'
    }
    req.request(params).then(res => {
      if (res.flag) {
        let rooms = res.data.rooms;
        rooms.forEach(item => {
          item.date = util.formatMonthAndDay(new Date(item.startTime))
          item.start = util.formatHourAndMinute(new Date(item.startTime))
          item.end = util.formatHourAndMinute(new Date(item.endTime))
          item.during = Math.ceil(((item.endTime - item.startTime) / (1000*60*60)) * 10) / 10
          item.rateNum = item.interviewees.filter(wee => wee.rate).length
          item.confirmNum = item.interviewees.filter(wee => wee.confirmStatus == 1).length
        })
        let days = res.data.scheduleDay.map(date => {
          let d = new Date(date)
          let obj = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
          }
          return obj
        }) 
        this.setData({
          roomList: rooms,
          showCale: false,
          days: days
        })
      }
    })
  },

  openCale() {
    this.setData({
      showCale: true
    })
  },
  handleToRoom(e) {
    let roomId = e.currentTarget.dataset.id
    wx.setStorage({
      key: 'roomId',
      data: roomId
    })
    // 进入面试房间
    wx.navigateTo({
      url: '/pages/tic/index/index?interviewId='+this.data.interviewId+'&code='+this.data.code+'&roomId='+roomId+'&roleType=2'
    });
  }
  

})