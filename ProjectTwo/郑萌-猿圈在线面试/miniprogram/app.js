global.Promise = Promise
Promise = require('./lib/es6-promise.min')
require('./lib/object-assign')
require('./lib/array-find-index')
require('./lib/array-find')
require('./utils/wxapi')

App({
    onLaunch: function (options) {
        console.log('App Launch')
        this.getSystemInfo();
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false,
        user: {
        },
        ticUser: {},
        intervals: { pingInterval: null },
        getStatus: null,
        isIpx: false,
        statusBarHeight: 0
    },
    getSystemInfo() {
        wx.getSystemInfo({
            success: res => {
                console.log(res)
                var model = res.model
                if (model.search('iPhone X') != -1){
                    this.globalData.isIpx = true;
                }else{
                    this.globalData.isIpx = false;
                }
                this.globalData.statusBarHeight = res.statusBarHeight;
           }
        })
    }
});