const CONSTANT = require('../../../constant/Constant');
let regeneratorRuntime = require("../../../utils/regenerator-runtime/runtime");
const config = require('../../../config');
const req = require('../../../utils/request');
const util = require('../../../utils/util');
const prefix = config.host;
const App = getApp().globalData;

Page({
  // TIC
  txTic: null,
  webrtcroomComponent: null,

  data: {
    identifier: null,
    userSig: null,
    sdkAppId: null,
    roomID: null,
    userName: '',
    isTeacher: false,
    roomType: 1, // 1-1v1 2-nv1

    roleType: 1, // 1-候选人 2-面试官

    // 音视频模板
    template: '',

    smallViewLeft: 'calc(100vw - 26vw - 1vw)',
    smallViewTop: 'calc(1vw)',
    smallViewWidth: '26vw',
    smallViewHeight: '34vw',

    // 是否启用摄像头
    enableCamera: true,

    isShowBoardPanel: false, // 是否显示白板面板
    isShowChatPanel: false, //是否显示聊天室
    isShowRatePanel: false, // 是否显示评价面板
    showWeeList: false,
    rateTemplate: {},
    haveRate: false, // 是否设置了面试评价表
    activeJudge: '', //选择的判定
    comment: '', // 评语
    sign: '', 
    dimensions: [], //评分
    judgeExplain: '',
    commentExplain: '',

    weeList:[], //房间内候选人列表

    currentIntervieweeId: 55036,
    camera: false,
    beauty: 0,
    muted: false,
    muteStatus: {},
    chatMsg: '', // 聊天输入框值
    msgList: [], // IM消息列表
    unreadCount: 0, // 未读消息数

    loadingImg: 'https://main.qcloudimg.com/raw/0c56375ca9e2dfde99930f36f19b137b.gif',
    playerBackgroundImg: '/resources/images/logo.png',

    scrollToView: null, // 聊天面板聊天记录最后滚动的位置
    isErrorModalShow: false, // 房间事件会重复触发，增加错误窗口是否显示的标志
    boardShowFullScreen: false, // 是否全屏显示白板

    timeInterval: null,
    stateList: [],
    costTime: 0,
    navBottom: '0px',
    statusBarHeight: 0,
    reportMsg: {},
    interviewId: '',
    code: '',
    userID: ''
  },

  onReady(options) {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  getRate() {
    util.getStorage('interviewInfo').then(data => {
      if (data.rateTemplate) {
        this.setData({
          haveRate: true
        })
      } else {
        this.setData({
          haveRate: false
        })
      }
    })
  },

  getInterviewInfo() {
    util.getStorage('interviewInfo').then(data => {
      this.getRateInfo(data.rateTemplate);
    })
    
  },
  showFactor(e) {
    let factor = e.currentTarget.dataset.text
    util.showModal({
      title: '考察因素',
      content: factor,
      confirmText: '关闭'
    })
  },
  setJudge(e) {
    this.setData({
      activeJudge: e.currentTarget.dataset.judge,
      commentExplain: ''
    })
  },
  commentChange(e) {
    if (e.detail.value) {
      this.setData({
        commentExplain: ''
      })
    }
    this.setData({
      comment: e.detail.value
    })
  },
  rateScoreChange(e) {
    let name = e.currentTarget.dataset.name
    this.data.rateTemplate.dimensions.forEach(item => {
      if (item.name == name) {
        item.currentScore = e.detail.value
        if (e.detail.value) {
          item.scoreExplain = ''
        }
      }
    })
    let that = this;
    this.setData({
      rateTemplate: that.data.rateTemplate
    })
  },
  save() {
    this.saveRate(0)
  },
  submit() {
    // 验证表单
    if (this.data.rateTemplate.judgeNecessary == 0 && this.data.activeJudge == '') {
      this.setData({
        judgeExplain: '请选择判定结果'
      })
    } 
    if (this.data.rateTemplate.commentNecessary == 0 && this.data.comment == '') {
      this.setData({
        commentExplain: '请输入评语'
      })
    }
    console.log(this.data.rateTemplate.dimensions)
    this.data.rateTemplate.dimensions.forEach(item => {
      if (item.necessary == 0 && (item.currentScore === '' || item.currentScore === undefined)) {
        item.scoreExplain = '请输入该项评分'
      }
    })
    let that = this
    this.setData({
      rateTemplate: that.data.rateTemplate
    })
    let scoreExplain = this.data.rateTemplate.dimensions.filter(res => res.scoreExplain);
    if (!this.data.judgeExplain && !this.data.commentExplain && scoreExplain.length == 0) {
      this.saveRate(1)
    }
  },
  saveRate(status) { // 0-暂存 1-提交
    let url = `${prefix.ApiUrl}/interviewer/rate/interviewee/${this.data.roomID}/${this.data.currentIntervieweeId}/${status}`;
    let dimensions = this.data.rateTemplate.dimensions.map(item => {
      let obj = {};
      obj.score = Number(item.currentScore) || 0;
      obj.name = item.name;
      return obj;
    })
    let data = {
      judgeResult: this.data.activeJudge,
      comment: this.data.comment,
      sign: this.data.sign,
      dimensions
    }
    let params = {
      url,
      data,
      method: 'POST'
    }
    req.request(params).then(res => {
      if (res.flag) {
        this.showToast('评价成功')
        // 关闭评价面板
        this.setData({
          isShowRatePanel: false
        })
        // if (status == 1 && this.data.roomType == 1) {
        //   // 退出面试间
        //   wx.redirectTo({url: '/pages/end/end'})
        // } 
        
      }
    })
  },
  getRateInfo(rateTemplate) {
    let url = `${prefix.ApiUrl}/interviewer/rate/interviewee/info/${this.data.roomID}/${this.data.currentIntervieweeId}`;
    let params = {
      url,
      method: 'GET'
    }
    req.request(params).then(res => {
      if (res.flag) {
        if (res.data) {
          rateTemplate.dimensions.forEach(item => {
            res.data.dimensions.forEach(dimen => {
              if (item.name == dimen.name) {
                item.currentScore = dimen.score
              }
            })
          })
          let that = this
          this.setData({
            activeJudge: res.data.judgeResult,
            comment: res.data.comment,
            sign: res.data.sign ? res.data.sign : that.data.sign,
            rateTemplate
          })
        } else {
          this.setData({
            rateTemplate
          })
        }
      }
    })
  },

  onLoad(options) {
    this.setData({
      statusBarHeight: App.statusBarHeight,
      roleType: Number(options.roleType)
    })
    // console.log(App);
    if(App.isIpx) {
      this.setData({
        navBottom: '68rpx'
      })
    }

    const self = this;

    App.getStatus = (data) => this.recvStatus(data, self);

    const roomId = this.data.roleType == 1 ? App.ticUser.roomId : options.roomID;
    this.getRoomInfo(roomId);

    // this.data.identifier = options.identifier;
    // this.data.userSig = options.userSig;
    // this.data.sdkAppId = options.sdkAppId;
    // this.data.roomID = options.roomID;
    this.setData({
      identifier: options.identifier,
      userSig: options.userSig,
      sdkAppId: options.sdkAppId,
      roomID: options.roomID,
    })
    const userName = this.getPersonById(this.data.identifier).name;
    // this.data.userName = userName;
    this.setData({
      userName
    })
    console.log(this.data.userName)
    // 获取tic组件
    this.txTic = this.selectComponent('#tx_board');
    wx.txTic = this.txTic;

    // 登录
    if(this.data.template) {
      // 获取webrtc组件
      this.webrtcroomComponent = this.selectComponent('#webrtcroom');

      this.init();
    }
  },

  onUnload() {
    console.log('退出面试间')
    // 退出课堂
    this.quitClassroom();
    this.txTic.logout(() => {
      this.showToast('注销成功');
    }, error => {
      this.showErrorToast('注销失败', error);
    });
  },

  init() {
    this.txTic.init(this.data.sdkAppId, res => {
      if (res.code) {
        this.showErrorToast('初始化失败，code:' + res.code + ' msg:' + res.desc);
      } else {
        this.login();
        this.getChatList();
        this.getRate();
      }
    });
    let that = this
    util.getStorage('interviewInfo').then(data => {
      console.log(data)
      that.setData({
        interviewId: data.interviewId,
        code: data.code
      })
    })
  },

  // 登录
  login() {
    this.txTic.login({
      userId: this.data.identifier,
      userSig: this.data.userSig
    }, (res) => {
      if (res.code) {
        this.showErrorToast('登录失败', res);
      } else {
        this.showToast('登录成功');
        // 增加事件监听
        this.addTICMessageListener();
        this.addTICEventListener();
        this.addTICStatusListener();
        if (this.data.isTeacher) {
          // 老师就创建课堂
          this.createClassroom();
        } else { // 如果是学生
          // 有了课堂后就直接加入
          // this.joinClassroom();
          this.createClassroom();
        }
      }
    });
  },

  createClassroom() {
    this.txTic.createClassroom(this.data.roomID, (res) => {
     if(res.code === 0 || res.code === 10021) {
        this.showToast('已进入面试间');
        this.joinClassroom()
      } else {
       this.showErrorToast('进入面试房间失败', res.desc);
      }
    });
  },

  /**
   * 进入课堂
   */
  joinClassroom() {
    this.txTic.joinClassroom(this.data.roomID, {}, (res) => {
      // 加入课堂失败
      if (res.code) {
        this.showErrorToast('进入面试房间失败', res.desc);
      } else { 
        this.data.teduBoard = this.txTic.getBoardInstance();
        this.initBoardEvent();
        this.startRTC();
        this.createTimeInterval();
      }
    });
  },

  // 退出课堂
  quitClassroom() {
    this.txTic.quitClassroom((res) => {
      // 加入课堂失败
      if (res.code) {
        // this.showErrorToast('退出面试间失败', res.desc);
      } else {
        this.showToast('退出面试间成功');
      }
    });
    // 停止音视频
    this.webrtcroomComponent.stop();
  },

  addTICMessageListener() {
    let that = this;
    this.txTic.addTICMessageListener({
      /**
       * 收到C2C文本消息
       * @param fromUserId		发送此消息的用户id
       * @param text				收到消息的内容
       * @param textLen			收到消息的长度
       */
      onTICRecvTextMessage: (fromUserId, text, textLen) => {
        this.updateChatMsg({
          send: this.format(fromUserId),
          content: text,
          read: this.data.isShowChatPanel,
          fromUserId
        });
      },

      /**
       * 收到C2C自定义消息
       * @param fromUserId		发送此消息的用户id
       * @param data				收到消息的内容
       * @param dataLen			收到消息的长度
       */
      onTICRecvCustomMessage: (fromUserId, data, textLen) => {
        
        
        this.recvCustomMsg({
          send: this.format(fromUserId),
          content: data
        });
      },

      /**
       * 收到群文本消息
       * @param fromUserId		发送此消息的用户id
       * @param text				收到消息的内容
       * @param textLen			收到消息的长度
       */
      onTICRecvGroupTextMessage: (fromUserId, text, textLen) => {
        this.updateChatMsg({
          send: this.format(fromUserId),
          content: text,
          read: this.data.isShowChatPanel,
          fromUserId
        });
      },

      /**
       * 收到群自定义消息
       * @param fromUserId		发送此消息的用户id
       * @param data				收到消息的内容
       * @param dataLen			收到消息的长度
       */
      onTICRecvGroupCustomMessage: (fromUserId, data, textLen) => {
       
        this.recvCustomMsg({
          send: this.format(fromUserId),
          content: data
        });
      },

      /**
       * 所有消息
       * @param msg	IM消息体
       * @note 所有收到的消息都会在此回调进行通知，包括前面已经封装的文本和自定义消息（白板信令消息除外）
       */
      onTICRecvMessage(msg) {
        const reportMsg = {
          seq: msg.seq,
          random: msg.random,
          fromAccount: msg.fromAccount,
          toAccount: msg.fromAccount,
          roomId: that.data.roomID,
          elems: msg.elems.map(elem => ({content: elem.content, type: elem.type}))
        };
        console.log(reportMsg)
        that.sendMsgReport(reportMsg, msg.fromAccount);
      }
    });
  },

  sendMsgReport(reportMsg, fromAccount) {
    const token = wx.getStorageSync(config.storage.sessionKey);
    let type = this.data.roleType === 1 ? 'ee' : 'er';
    const data = {
      "token": token,
      "position": `${prefix.visitUrl}/itv/nvn/${type}/${this.data.interviewId}?code=${this.data.code}&checked=1`,
      "action": "onTICRecvMessage",
      "platform": "school-table",
      "target": fromAccount,
      "status_code": "0000",
      "extra_map_string": JSON.stringify(reportMsg)
    }
    console.log(data)
    const url = `${prefix.ReportUrl}/report/common`;
    req.request({
      url,
      method: 'POST',
      data
    }).then(res => {
      if (res.data.flag) {

      }
    })
  },

  sendChat(msg) {
    console.log(this.data.chatMsg)
    const content = {
      "fromUserId": this.data.userID,
      "text": msg,
      "timestamp": new Date().getTime(),
      "read": false
    }
    const type = this.data.roleType === 1 ? 'interviewee' : 'interviewer';
    const url = `${prefix.ApiUrl}/${type}/chat/${this.data.roomID}`;
    
    req.request({
      url,
      method: 'POST',
      data: {content: JSON.stringify(content)}
    }).then(res => {

    })
  },

  addTICEventListener() {
    const self = this;
    this.txTic.addTICEventListener({
      onTICMemberJoin: (members) => {
        this.updateChatMsg({
          send: '群消息提示',
          content: members.map( m => this.format(m)).join(',') + '进入面试间',
          read: this.data.isShowChatPanel,
          fromUserId: 0
        });
      },

      onTICMemberQuit: (members) => {
        this.updateChatMsg({
          send: '群消息提示',
          content: members.map(m => this.format(m)).join(',') + '退出面试间',
          read: this.data.isShowChatPanel,
          fromUserId: 0
        });
      },

      onTICClassroomDestroy: () => {
        if (!this.isTeacher) { // 学生处理
          this.quitClassroom();
          this.showToast(`该面试间已销毁`);
        }
      }
    });
  },

  addTICStatusListener() {
    this.txTic.addTICStatusListener({
      onTICForceOffline: () => {
        // this.showErrorToast('被踢下线');
        console.log('被踢下线')
        wx.redirectTo({url: '/pages/unusual/unusual'});
      }
    });
  },

  // 初始化白板
  initBoardEvent() {
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_INIT, () => {
      console.log('======================:  ', 'TEB_INIT');
    });

    // 撤销状态改变
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
      console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销');
    });

    // 重做状态改变
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
      console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复');
    });

    // 新增白板
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ADDBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_ADDBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 白板错误回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ERROR, (code, msg) => {
      console.log('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
      this.fireBoardEvent(CONSTANT.EVENT.BOARD.TEB_ERROR, {
        code,
        msg
      })
    });

    // 白板警告回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_WARNING, (code, msg) => {
      console.log('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
    });

    // 图片状态加载回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data);
    });

    // 删除白板页回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_DELETEBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_DELETEBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 跳转白板页回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_GOTOBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_GOTOBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 增加H5动画PPT文件回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ADDH5PPTFILE, (fid) => {
      console.log('======================:  ', 'TEB_ADDH5PPTFILE', ' fid:', fid);
    });

    // 增加文件回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ADDFILE, (fid) => {
      console.log('======================:  ', 'TEB_ADDFILE', ' fid:', fid);
    });

    // 删除文件回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_DELETEFILE, (fid) => {
      console.log('======================:  ', 'TEB_DELETEFILE', ' fid:', fid);
    });

    // 文件上传状态
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_FILEUPLOADSTATUS, (status, data) => {
      console.log('======================:  ', 'TEB_FILEUPLOADSTATUS', status, data);
    });

    // 切换文件回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_SWITCHFILE, (fid) => {
      console.log('======================:  ', 'TEB_SWITCHFILE', ' fid:', fid);
    });

    // 上传背景图片的回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
      console.log('======================:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
    });

    // 文件上传进度
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_FILEUPLOADPROGRESS, (data) => {
      console.log('======================:  ', 'TEB_FILEUPLOADPROGRESS:: ', data);
    });

    // H5背景加载状态

    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
    });
  },

  // 开始RTC
  startRTC() {
    console.log('stratRTC')
    let username = this.getPersonById(this.data.identifier).name;
    console.log(username)
    this.setData({
      userID: this.data.identifier,
      userName: username,
      userSig: this.data.userSig,
      sdkAppID: this.data.sdkAppId,
      roomID: this.data.roomID,
      sign: username
    }, () => {
      this.webrtcroomComponent.start();
    });
  },

  updateChatMsg(msg) {
    const newMsgList = this.data.msgList.concat([msg]);
    this.setData({
      msgList: newMsgList,
      unreadCount: newMsgList.filter( msg => !msg.read).length
    }, () => {
      this.setData({
        scrollToView: 'scroll-bottom' // 滚动条置底
      });
    });
  },

  recvCustomMsg(msg) {
    
    console.warn('recv custom msg', msg)
    if(msg.content && msg.content.indexOf('{') === 0) {
      const content = JSON.parse(msg.content);
      if(content) {
        switch (content.type) {
          case 'audio_off': {
            const offId = content.msg.tid;
            if(!this.data.muteStatus[offId]) {
              this.data.muteStatus[offId] = true;
              this.setData({
                muteStatus: this.data.muteStatus
              });
            }
            
            break;
          }
          case 'audio_on': {
            const onId = content.msg.tid;
            if(this.data.muteStatus[onId]) {
              this.data.muteStatus[onId] = false;
              this.setData({
                muteStatus: this.data.muteStatus
              });
            }
            break;
          }
        }
      }
    }
    // if()
  },

  /**
   * 监听webrtc事件
   */
  onRoomEvent(e) {
    var self = this;
    console.log('room event', self, e);
    switch (e.detail.tag) {
      case 'error':
        // 错误提示窗口是否已经显示
        if (this.data.isErrorModalShow) {
          return;
        }

        if (e.detail.code === -10) { // 进房失败，一般为网络切换的过程中
          this.data.isErrorModalShow = true;
          wx.showModal({
            title: '提示',
            content: e.detail.detail,
            confirmText: '重试',
            cancelText: '退出',
            success: function (res) {

            }
          });
        } else {
          var pages = getCurrentPages();
          console.log(pages, pages.length, pages[pages.length - 1].__route__);
          if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/index/index')) {
            this.data.isErrorModalShow = true;
            wx.showModal({
              title: '提示',
              content: e.detail.detail,
              showCancel: false,
              complete: function () {
                self.data.isErrorModalShow = false
                pages = getCurrentPages();
                if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/index/index')) {
                  wx.showToast({
                    title: `code:${e.detail.code} content:${e.detail.detail}`
                  });
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            });
          }
        }
        break;
    }
  },

  // IM输入框的信息
  bindChatMsg: function (e) {
    this.data.chatMsg = e.detail.value;
  },

  // 发送IM消息
  sendComment() {
    var msg = this.data.chatMsg || '';
    if (!msg || !msg.trim()) {
      this.showErrorToast('不能发送空消息');
      return;
    }
    this.txTic.sendGroupTextMessage(msg, () => {
      console.log('消息发送成功');
      // 发送成功
      this.setData({
        chatMsg: ''
      });
    }, (error) => {
      this.showErrorToast('消息发送失败', error);
    });
    this.sendChat(msg);
  },
  // 发送custom消息
  sendCustom(type, msg) {
    // var msg = this.data.chatMsg || '';
    // if (!msg || !msg.trim()) {
    //   this.showErrorToast('不能发送空消息');
    //   return;
    // }
    const msgObj = JSON.stringify({type, msg});
    this.txTic.sendGroupCustomMessage(msgObj, () => {
      console.log('消息发送成功', msgObj);
      // 发送成功
    }, (error) => {
      console.warn('消息发送失败', error);
      // this.showErrorToast('消息发送失败', error);
    });
  },
  /**
   * 显示白板面板
   */
  showBoardPanel() {
    this.setData({
      isShowBoardPanel: true,
      isShowChatPanel: false
    });
  },

  getUserName(userId) {
    return App.room.interviewers.find(er => er.tid === userId).name || userId;
  },

  getUserNameWee(userId) {
    return App.room.interviewees.find(ee => ee.tid === userId).name || userId;
  },
  // 每次进入房间的时候需要调用一下获取该房间历史消息的接口，参数为房间id
  getChatList() {
    let that = this
    req.request({
      url: `${prefix.ApiUrl}/interview/room/chat/${that.data.roomID}`,
      method: 'GET',
      success: res => {
        console.log(res)
        let list = res.data.data;
        let msgList = list.map(val => {
          let obj = {};
          if (val.content) {
            let item = JSON.parse(val.content);
            obj.fromUserId = item.fromUserId;
            obj.content = item.text;
            obj.send = val.roleType === 2 ? that.getUserName(item.fromUserId) : that.getUserNameWee(item.fromUserId);
            obj.read = true;
            return obj;
          }
        })
        that.setData({
          msgList: msgList
        })
      }
    })
  },

  /**send_group_msg
   * 显示聊天面板
   */
  showChatPanel() {

    const newMsgList = this.data.msgList.map( msg => ({...msg, read: true}));
    
    this.setData({
      isShowBoardPanel: false,
      isShowChatPanel: !this.data.isShowChatPanel,
      isShowRatePanel: false,
      msgList: newMsgList,
      unreadCount: 0
    });
  },

  // 显示面试评价表
  showRate() {
    this.setData({
      isShowRatePanel: !this.data.isShowRatePanel,
      isShowChatPanel: false,
      comment: '',
      judgeResult: '',
      rateTemplate: {}
    })
    if (this.data.weeList.length == 1) {
      this.setData({
        showWeeList: false,
        currentIntervieweeId: this.data.weeList[0].intervieweeId
      })
      this.getInterviewInfo();
    } else {
      this.setData({
        showWeeList: true
      })
    }
  },

  showRateDetail(e) {
    let currentIntervieweeId = e.currentTarget.dataset.id;
    this.setData({
      currentIntervieweeId,
      showWeeList: false
    })
    this.getInterviewInfo();
  },

  // 切换白板全屏显示
  togglerBoardFullScreen() {
    var boardShowFullScreen = !this.data.boardShowFullScreen;
    this.setData({
      boardShowFullScreen: boardShowFullScreen
    }, () => {
      if (boardShowFullScreen) { // 全屏显示，则切换到横屏方式
        this.txTic.setOrientation('horizontal');
      } else { // 垂直方向
        this.txTic.setOrientation('vertical');
      }
    });
  },

  /**
   * 显示信息弹窗
   * @param {*} msg 
   * @param {*} error 
   */
  showToast(msg) {
    wx.showToast({
      icon: 'none',
      title: msg
    });
  },

  /**
   * 显示错误信息弹窗
   * @param {*} msg 
   * @param {*} error 
   */
  showErrorToast(msg, error) {
    wx.showToast({
      icon: 'none',
      title: msg
    });
    console.error('Error msg:', error || msg);
  },

  getRoomInfo(roomId){

    var self = this;

    const format = function(data){
      data.interviewees instanceof Array && data.interviewees.forEach(
        ee => ee.tid = 'ee_' + ee.intervieweeId
      );
      data.interviewers instanceof Array && data.interviewers.forEach(
        er => er.tid = 'er_' + er.interviewerId
      );
      return data;
    };

    const type = self.data.roleType == 1 ? 'interviewee' : 'interviewer'
    req.request({

      url: `${prefix.ApiUrl}/${type}/room/info/${App.user.interviewId}/${roomId}`,
      method: 'get',
      success:  res => {
        // console.log(res);
        const {data} = res; 
        if (data && data['flag']) {
          if (this.data.roleType == 2) {
            this.setData({
              weeList: data.data.interviewees
            })
          }

          App.room = format(data['data']);

          let weeTemplate = App.room.interviewers.length > 1 || App.room.interviewees.length > 1 ? 'nv1template' : '1v1bigsmall'
          let werTemplate = App.room.interviewers.length > 1 || App.room.interviewees.length > 1 ? 'nv1templateWer' : '1v1bigsmallWer'
          let template = this.data.roleType == 1 ? weeTemplate : werTemplate;
          let roomType = App.room.interviewers.length > 1 || App.room.interviewees.length > 1 ? 2 : 1
          this.setData({
            template,
            roomType
          },  () => {
            // console.log('roomInfo::', App);
            // 获取webrtc组件
            this.webrtcroomComponent = this.selectComponent('#webrtcroom');
            this.init();
          });
         
        }
      }
    })
  },

  getPersonById(id){
    console.log('get person ,', id, App);
    if(!App || !App || !App.room) {
      return { id, name: id};
    } else {
      const {room} = App;
      return [...room.interviewees, ...room.interviewers]
      .find( item => item.tid === id);
    }
  },

   format(item) {
    item = this.getPersonById(item).name;
    return item;
  },

  // 麦克风
  volumeControl() {
    this.setData({
      muted: !this.data.muted
    }, () => {
      
  });
    this.sendCustom(this.data.muted ? 'audio_off' : 'audio_on', { tid: this.data.identifier, id: this.data.identifier.split('_')[1] });
},
  // 切换镜头
  cameraCtrol() {
    this.setData({
      camera: !this.data.camera
    });
    this.webrtcroomComponent.switchCamera();
  },
  // 美颜
  beautyControl() {
    this.setData({
      beauty: this.data.beauty > 0 ? 0 : 9 
    });

  },
  recvStatus: (res, self) => {
    // var self = this;
    console.log('ping data,', res);
    if(res.status_code === 200) {
        // this.data.costTime =;
        // this.data.stateList = ;
      const {data} = res;

      self.setData({
          costTime: data.state.costTime,
          stateList: data.stateList,
        // timeSpan: spantext,
        });
    }
  }, // 获得ping返回的状态并更新,
  createTimeInterval() {
    var self = this;
    if(self.data.timeInterval) {
      clearInterval(self.data.timeInterval);
    } 
    self.data.timeInterval = setInterval( () => {
        if(self.data.stateList.filter( val => val.state > 0 && val.roleType === 2).length > 0 || self.data.costTime > 0) {
          self.data.costTime += 1000;
          const timeSpan = util.getTimeSpan(self.data.costTime),
            spantext = (Number(timeSpan.days) ? (timeSpan.days + ':') : '') +
              (Number(timeSpan.hours) ? (timeSpan.hours + ':') : '') +
               (timeSpan.minutes + ':') +
                  (timeSpan.seconds );
          // self.data.timeSpan = timeSpan;
          this.setData({
            costTime: self.data.costTime,
            timeSpan: spantext,
          })
        }
    }, 1000);
  },
  goBack() {
    if(this.data.isShowChatPanel) {
      this.setData({
        isShowChatPanel: false
      })
    } else if (this.data.isShowRatePanel) {
      this.setData({
        isShowRatePanel: false
      })
    } else {
      util.getStorage('interviewInfo').then(data => {
        console.log(data)
        let id = data.interviewId;
        let code  = data.code;
        if (this.data.roleType == 1) {
          wx.redirectTo({url: '/pages/confirm/link/index?interviewId='+ id});
          // wx.navigateBack({
          //   delta: 2
          // })
        } else {
          wx.redirectTo({
            url: `/pages/roomList/index?interviewId=${id}&code=${code}`
          })
        }
      })
    }
  }
})