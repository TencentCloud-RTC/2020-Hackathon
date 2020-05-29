// let regeneratorRuntime = require("../../../utils/regenerator-runtime/runtime");
const utils = require('../../../utils/util.js');
const config = require('../../../config');
const prefix = config.host;
const TEST_ACCOUNT = require('../account');

Page({
  data: {
    sdkAppId: 0,
    array: 0,
    roomID: 0,
    index: 0,
    roleType: 1, // 1-候选人 2-面试官
    werRoomId: 0, //面试官进入的roomId
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindRoomID: function (e) { 
    var self = this;
    self.setData({
      roomID: e.detail.value
    });
  },

  onLoad: function (options) {
    let that = this
    let App = getApp().globalData;

    App.user = { ...App.user, ...options};
    
    console.log('tic init', App.user);

    let roleType = Number(options.roleType)
    that.setData({
      roleType
    })
    
    if (options.roomId) {
      that.setData({
        werRoomId: Number(options.roomId)
      })
    }
    


    const enterRoom = (sdkAppId = App.ticUser.sdkAppId, identifier = App.ticUser.tUserId, userSig = App.ticUser.userSig, roomId = App.ticUser.tRoomId) => {
      // setTimeout(() => {
        var url = `/pages/tic/classroom/room?sdkAppId=${sdkAppId}&identifier=${identifier}&userSig=${userSig}&roomID=${roomId}&roleType=${that.data.roleType}`;
        console.log('roomId--------', roomId)
        console.log(url)
        wx.navigateTo({
          url: url
        });

    }; 

    const getTicInfo = (body, info) => {
      return new Promise(resolve => {
        // const data = this.getMockUser(client.userId);
        console.log(App, utils);
        const url = `${prefix.ServerUrl}/interview/userInfo`;
        const body1 = {
          token: info.token,
          id: that.data.roleType == 1 ? info.intervieweeId : info.interviewerId,
          roomId: that.data.roleType == 1 ? info.roomId : that.data.werRoomId,
          interviewId: Number(body.interviewId),
          roleType: that.data.roleType,
          version: 2
        };
        console.log(body1);
        wx.request({
          url, data: body1, method: 'post', success: res => {
            console.log(res);
            const data = res['data'];
            console.log('info::', data);

            // this.ticUserInfo.setInfos(data);

            // const list =

            resolve(data);
            /*
                    this.ticUserInfo.setInfos(data);
    
                    const list = this.getMockUserList();
    
                    this.interviewees = list.filter(({accountType}) => accountType === ClientType.fromStudent).map(({tUserId}) => new OthersInfo(tUserId, String(tUserId)));
    
                    this.interviewers = list.filter(({accountType}) => accountType === ClientType.fromTeacher).map(({tUserId}) => new OthersInfo(tUserId, String(tUserId)));
    
    
                    timer(1000).subscribe(r => resolve(data));*/
          }})
        });
    };

    const startOnline = () => {
      

      const connect = (body, info) => {

        const enter = (resolve, reject) => {
          const enterUrl = `${prefix.ServerUrl}/interview/enter`;

          wx.request({
            url: enterUrl, data: body, method: 'post', success: (r) => resolve(r), fail: (error) => reject(error)
          })
        };

        const online = r1 => new Promise((resolve, reject) => {
          const onlineURL = `${prefix.ServerUrl}/interview/online`;

          wx.request({
            url: onlineURL, data: body, method: 'post', success: (r) => resolve(r1), fail: (error) => reject(error)
          })
        })

       const result = new Promise(enter).then( r => online(r)).then( r => {
         console.log('is online now');
         if (r.data['status_code'] === 200) {
             let { pingInterval } = r.data.data;

             pingInterval *= 1000;
             // report(new ErrorInstance(token, location.href, '进入房间成功', enterUrl, '', r));

             // this.getUserInfo(false, roomId, interviewId, senderId, token);

             if (App.intervals && App.intervals.pingInterval) {
               clearInterval(App.intervals.pingInterval);
               App.intervals.pingInterval = null;
               // this.remoteEvents.remoteHandler.unsubscribe();
             }

             const createInterval = (body, info) => {
               const pingUrl = `${prefix.ServerUrl}/interview/ping`;

               return setInterval(() => {
                 wx.request({
                   url: pingUrl, data: { ...body, videoState: 1 }, method: 'post', success: res => {
                     const data = res.data;
                     if (Number(data['status_code']) !== 200) {
                       if (Number(data['status_code']) === 403) {
                         console.warn('403异地');
                       } else {
                         console.warn('ping返回错误', res);

                       }
                     } else {
                       const data = res['data'];
                       if(App.getStatus instanceof Function) {
                         App.getStatus(data);
                       }
                       const state = data.state;
                       const stateList = data.stateList;
                       // this.refreshRoomInfo(stateList, this.rooms.currentRoom);
                       if (state && Number(state.id) === Number(id)) {
                         if ((Number(state.globalState) === -1 && utils.clientType(info) === 2) ||
                           (Number(state.interviewState) === -1 && utils.clientType(info) === 1)) {
                           alert('与服务器链接断开，请刷新页面重新进入');

                         }
                       }

                      // 超过三小时 关闭面试间
                      const costTime = data.data.state.costTime;
                      if (costTime > 3*60*60000) {
                        wx.redirectTo({url: '/pages/end/end'})
                      }

                     }
                   }
                 });

               }, pingInterval);
             }
             App.intervals = { ...App.intervals, pingInterval: createInterval(body, info) };
             // console.error(error1);
             console.log('enter body::', body);

           }
       })
        


      };




      let info = {};

      wx.getStorage({
        key: that.data.roleType == 1 ? 'intervieweeInfo' : 'interviewerInfo',
        success: (res) => {
            info = res.data;
            console.log('get interviewee info', info);
          App.ticUser = { ...App.ticUser, ...info };
          const body = {
            'token': info.token,
            'id': that.data.roleType == 1 ? info.intervieweeId : info.interviewerId,
            'roomId': that.data.roleType == 1 ? info.roomId : that.data.werRoomId,
            'interviewId': Number(App.user.interviewId),
            'roleType': that.data.roleType,
            'version': 2
          }
          
          getTicInfo(body, info).then(res => {
            console.log('get tic info', res);
            if (res.status_code === 200) {
              App.ticUser = { ...App.ticUser, ...res.data };
              connect(body, info);
              enterRoom();
            } else {
              wx.showModal({
                title: '出错了！',
                content: res.message || `错误码${res.status_code}`,
                showCancel: false,
                confirmText: '我知道了'
              })
            }
          });
        }, fail: (event) => console.error(event)
      })



      // connect();
    };
    console.log('%c %s', 'color: blue', '参数', options, JSON.stringify(App.user));


    startOnline();

    // wx.request({
    //   url: `${prefix.ApiUrl}/interviewee/login`,
    //   data: {
    //     interviewId: App.user.interviewId,
    //     code: App.user.code
    //   },
    //   success: (res) => {
    //     console.log(res);
    //     const { flag, msg, code, data } = res.data;
    //     if(flag) {
    //       // console.log('登录成功', data, App.user);
    //       App.user = {...App.user, ...data};
       
    //       // await getInfoAndEnterRoom();
    //     } else {
    //       wx.showModal({
    //         title: '出错了！',
    //         content: msg || '链接无效，无法进入面试',
    //         showCancel: false,
    //         confirmText: '我知道了'
    //       });
    //     }
    //   }
    // })


  },//onLoad end

  onClick() {
    if (!this.data.roomID || isNaN(this.data.roomID)) {
      wx.showToast({
        icon: 'none',
        title: '房间号只支持32位整型数字'
      })
      return;
    }
   
  }
})