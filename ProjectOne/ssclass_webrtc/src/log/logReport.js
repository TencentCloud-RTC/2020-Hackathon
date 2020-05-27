class LogReport {
  constructor() {
    // 主信息
    this.reportParam = {
      userID: '', // 用户ID
      userName: '', // 用户名
      userType: '', // 用户类型
      roomID: '', // 房间号
      roomName: '', // 房间名
      liveID: '', // 房间号
      osType: '' // 操作系统类型
    }

    // SDK 信息
    this.sdkAppInfo = {
      sdkAppID: '',
      imSdkVersion: '2.6.5',
      trtcSdkVersion: '4.3.14',
      boardSdkAppID: '',
      boardSdkVersion: '2.4.6',
    }

    // 硬件信息
    this.deviceInfo = {
      osType: '',
      browserType: '',
      browserVersion: '',
      userAgent: navigator.userAgent
    }

    // 报表信息
    this.reportData = {
      errorCode: '', // 错误码
      errorDesc: '', // 错误信息
      data: '', // 事件数据
      ext: '', // 扩展字段
    }
  }

  /**
   * 初始化
   */
  init() {
    // 获取主体信息
    this.reportParam = Object.assign({}, window.store.getters.reportParam)
    // 初始 SDK 信息
    this.sdkAppInfo = window.store.getters.sdkAppInfo
    // 获得 硬件信息
    this.deviceInfo.osType = window.utils.getOsType()
    this.deviceInfo.browserType = window.utils.getBrowserType()
    this.deviceInfo.browserVersion = window.utils.getBrowserVersion()
  }

  /**
   * 上报日志
   */
  report(eventName, data) {
    var extendData = Object.assign({}, this.deviceInfo, data)
    var extendJson = JSON.stringify(extendData)
    var sdkAppInfo = JSON.stringify(this.sdkAppInfo)
    var timeCost = data.timeCost
    var oprateTime = window.utils.getNowMillisecond()

    // 获得房间信息
    window.api.addLiveLog({
      userID: this.reportParam.userID,
      operateTime: oprateTime,
      userName: this.reportParam.userName,
      roomID: this.reportParam.roomID,
      roomName: this.reportParam.roomName,
      liveID: this.reportParam.liveID,
      userType: this.reportParam.userType,
      osType: this.reportParam.osType,
      event: eventName,
      errorCode: data.errorCode,
      timeCost: timeCost,
      ip: ipAddress,
      sdkAppInfo: sdkAppInfo,
      extendJson: extendJson
    }).then(res => {
      if (res.code === 0) {
        // console.error(this.reportParam)
      }
    })
  }
}

const logReport = new LogReport()
export default logReport