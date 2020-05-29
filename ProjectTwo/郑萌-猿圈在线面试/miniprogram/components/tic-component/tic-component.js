// 常量
const CONSTANT = require('../../constant/Constant');
const webim = require('../webim-component/webim_wx.min');
// webim组件
const webimComponent = require('../webim-component/webim-component');
const MessageListener = require('../event/MessageListener');
const EventListener = require('../event/EventListener');
const BoardListener = require('../event/BoardListener');
const StatusListener = require('../event/StatusListener');

const Constant = {
  TICModule: {
    TICMODULE_IMSDK: 1
  }
}

Component({
  version: '2.0.0_RC3',

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    txBoard: null,
    ticData: {},
    orientation: 'vertical',
    sdkAppId: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    init(sdkAppId, callback) {
      if (sdkAppId) {
        this.data.sdkAppId = sdkAppId;
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
      } else {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: -7,
          desc: 'sdkAppId is illegal'
        });
      }
    },

    // 保留接口
    uninit() {

    },

    /**
     * 登录im
     * @param {*} params tic所需参数
     * @param {*} succ  成功回调
     * @param {*} fail  失败回调
     */
    login(loginConfig, callback) {
      this.setData({
        ticData: loginConfig
      }, () => {
        // 初始化数据
        webimComponent.initData({
          sdkAppID: this.data.sdkAppId,
          userId: loginConfig.userId,
          userSig: loginConfig.userSig
        });

        console.log('tic param:', this.data, loginConfig)
        // 初始化Im事件回调
        // webimComponent.initLoginListeners(this.imLoginListener());

        // 登录IM
        webimComponent.login(function () {
          callback && callback({
            module: Constant.TICModule.TICMODULE_IMSDK,
            code: 0
          })
        }, function (error) {
          callback && callback({
            module: Constant.TICModule.TICMODULE_IMSDK,
            code: error.ErrorCode,
            desc: error.ErrorInfo
          });
        });
      });
    },

    /**
     * 登出
     * @param callback			回调
     */
    logout(callback) {
      webimComponent.logout(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        });
      });
    },

    /**
     * 创建课堂
     * @param classId			课堂ID，由业务生成和维护
     * @param callback			回调
     */
    createClassroom(classId, callback) {
      // WebIM加入聊天房间
      webimComponent.createRoom(this.data.ticData.userId, classId).then(res => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        });
      });
    },

    /**
     * 进入课堂
     * @param {*} roomID 课堂ID
     * @param {*} succ 进入成功的回调
     * @param {*} fail 进入失败的回调
     */
    joinClassroom(classId, boardOption, callback) {
      this.data.classId = classId * 1;
      this.setData({
        ticData: this.data.ticData
      }, () => {
        // 加入群组
        webimComponent.joinGroup(classId + '', () => {
          BoardListener.addBoardEventListener({
            RECEIVE_BOARD_DATA: (msg) => {
              if (this.data.txBoard) {
                msg.elems.forEach((elem) => {
                  this.data.txBoard.addSyncData(JSON.parse(elem.content.data));
                })
              }
            },

            // 接收到文件数据
            RECEIVE_BOARD_FILE_DATA: msg => {

            }
          });

          this.renderBoard(boardOption, function () {
            callback && callback({
              module: Constant.TICModule.TICMODULE_IMSDK,
              code: 0
            });
          })
        }, (error) => {
          callback && callback({
            module: Constant.TICModule.TICMODULE_IMSDK,
            code: error.ErrorCode,
            desc: error.ErrorInfo
          });
        });
      });
    },

    /**
     * 退出课堂
     * @param {*} succ 退出成功
     * @param {*} fail 退出失败
     */
    quitClassroom(callback) {
      webimComponent.quitGroup(this.data.classId, () => {
        // 退出成功
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
      }, (error) => {
        // 群不存在 或者 不在群里了 或者 群id不合法（一般这种情况是课堂销毁了groupId被重置后发生）(都认为成功)
        if (error.ErrorCode === 10010 || error.ErrorCode === 10007 || error.ErrorCode === 10015) {
          callback && callback({
            module: Constant.TICModule.TICMODULE_IMSDK,
            code: 0
          });
        } else {
          // 退出失败
          callback && callback({
            module: Constant.TICModule.TICMODULE_IMSDK,
            code: error.ErrorCode,
            desc: error.ErrorInfo
          });
        }
      });
    },

    /**
     * 销毁课堂
     * @param classId			课堂ID，由业务生成和维护
     * @param callback			回调
     */
    destroyClassroom(classId, callback) {
      webimComponent.destroyGroup(classId, () => {
        // 销毁成功
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
      }, (error) => {
        // 销毁失败
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        });
      });
    },

    /**
     * 初始化白板
     */
    renderBoard(boardOption = {}, callback) {
      var txBoard = this.data.txBoard = this.selectComponent('#tx_board_component');
      boardOption = Object.assign({}, {
        userId: this.data.ticData.userId,
        userSig: this.data.ticData.userSig,
        sdkAppId: this.data.sdkAppId,
        classId: this.data.classId,
        orientation: this.data.orientation
      }, boardOption);
      // 开始白板
      txBoard.render(boardOption, callback);
    },

    /**
     * 发送C2C文本消息
     * @param userId			消息接收者
     * @param text				文本消息内容
     * @param callback			回调
     */
    sendTextMessage(userId, text, callback) {
      webimComponent.sendC2CTextMessage(userId, text, () => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        })
      });
    },

    /**
     * 发送C2C自定义消息
     * @param userId			消息接收者
     * @param data				自定义消息内容
     * @param callback			回调
     */
    sendCustomMessage(userId, data, callback) {
      webimComponent.sendC2CCustomMessage(userId, data, () => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        })
      });
    },

    /**
     * 发送群组文本消息
     * @param {string} msg 
     * @param {function} succ 
     * @param {function} fail
     */
    sendGroupTextMessage(text, callback) {
      webimComponent.sendGroupTextMessage(text, () => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        })
      });
    },

    /**
     * 发送群自定义消息
     * @param data				自定义消息内容
     * @param callback			回调
     */
    sendGroupCustomMessage(data, callback) {
      webimComponent.sendGroupCustomMessage(data, () => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.ErrorCode,
          desc: error.ErrorInfo
        })
      });
    },

    /**
     * 设置白板显示方向
     * @param {*} orientation 
     */
    setOrientation(orientation) {
      this.data.txBoard.setOrientation(orientation);
    },

    /**
     * @desc 获取白板实例
     * @return {Board} board 返回白板实例
     */
    getBoardInstance() {
      return this.data.txBoard.getBoardInstance();
    },

    /**
     * @desc 获取IM实例, 初始化TICKSDK后即可获得IM实例
     * @return {webim} im 返回IM实例
     */
    getImInstance() {
      return webim;
    },

    /**
     * 添加IM消息监听回调
     * @param listener			回调
     */
    addTICMessageListener(listener) {
      MessageListener.addTICMessageListener(listener);
    },

    /**
     * 移除IM消息监听回调
     * @param listener			回调
     */
    removeTICMessageListener(listener) {
      MessageListener.removeTICMessageListener(listener);
    },

    /**
     * 添加事件监听回调
     * @param listener			回调
     */
    addTICEventListener(listener) {
      EventListener.addTICEventListener(listener);
    },

    /**
     * 移除事件监听回调
     * @param listener			回调
     */
    removeTICEventListener(listener) {
      EventListener.removeTICEventListener(listener);
    },

    /**
     * 添加IM状态监听回调
     * @param listener			回调
     */
    addTICStatusListener(listener) {
      StatusListener.addTICStatusListener(listener);
    },

    /**
     * 移除IM状态监听回调
     * @param listener			回调
     */
    removeTICStatusListener(listener) {
      StatusListener.removeTICStatusListener(listener);
    }
  }
})