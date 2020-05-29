//index.js

/**
 * @file 导航页面
 * @descripion 地图页面
 * @author 谢波涛改进！
 * @copyright 武汉网明公司
 * @createDate 2018-8-9
 * @todo ctrl + f 搜索 @todo;
 * icon图片更换
 * 获取位置信息不准确问题
*/

//获取应用实例
const app = getApp();

var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var plugin = requirePlugin("WechatSI");
const innerAudioContext = wx.createInnerAudioContext();

//获取背景音频播放组件
const backgroundAudioManager = wx.getBackgroundAudioManager();

/**
 * @const {String}
 * @description 蓝牙服务ID
 */
const SERVICE_ID = "0000" + "FFE0" + "-0000-1000-8000-00805F9B34FB";

/**
 * @const {String}
 * @description 蓝牙服务下的特征值ID
 */
const CHAR_ID = "0000" + "FFE1" + "-0000-1000-8000-00805F9B34FB";

/**
 * @const {Number}
 * @description 自动重连的延迟
 */
const RECONNECT_DELAY = 5000;

/**
 * @const {Number} 
 * @description 自动重连的最大次数
 */
const RECONNECT_TIME = 3;

/**
 * @var {Number}
 * @default 0
 * @description 已经自动重连的次数，连接成功后清0
 */
var reconnectTime = 0;

/**
 * @const {Number} 
 * @description 播报距离的时间间隔
 */
// const READING_INTERVAL_THRESHOLD = [1000, 2000, 3000];

/**
 * @const {Array} 
 * @description 震动强度阈值
 */
const VIBRATE_THRESHOLD = [200, 300];

/**
 * @const {Number} ms
 * @description 搜索时间
 */
const SEARCH_DEVICE_DURATION = 15000;

Page({
  data: {
    longitude: "113.324520",
    latitude: "23.099994",

    /**
     * @description 当前位置描述
     */
    cLocDesc: "定位中......",

    /**
     * @description 当前地址
     */
    cAddress: "定位中......",

 
    cCity: "",

    toLongitude: null,
    toLatitude: null,

    isSearching: false,
    suggestionList: null,
    searchDone: false,

    //待移除
    markers: [],
    searchList: [],
    polyline: [],


    compass: false,

    bluetooth: false,
    distance: null,
    isReading: false,

    inputShowed: false,
    inputVal: "",
  },

  /**
   * @method
   * @description 通过wx.getLocation()获取位置;
   * 通过qqmapsdk.reverseGeocoder()逆地址解析；
   * setData 当前位置描述、当前地址、当前城市（用于限制搜索区域）；
   * 语音播报当前位置描述与地址。
   */
  getLoc: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(res);
        that.moveToLocation();
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          get_poi: 1,
          success: function (res) {
            console.log(res);
            that.setData({
              cLocDesc: res.result.formatted_addresses.recommend,
              cAddress: res.result.address,
              cCity: res.result.ad_info.city
            });
            that.textToSpeech(res.result.formatted_addresses.recommend + "," + res.result.address
              + "，目前在" + res.result.address_reference.famous_area.title + "附近" );
            // that.textToSpeech(res.result.formatted_addresses.recommend + "," + res.result.address 
            // + "。距离" + res.result.address_reference.famous_area.title + res.result.address_reference.famous_area._dir_desc + res.result.address_reference.famous_area._distance + "米");
          },
          fail: function (res) {
            console.log("逆地址解析接口调用失败", res);
          },
        });
      },
      fail: function (err) {
        console.log("未能获取权限", err);
      }
    });
  },

  /**
   * @method
   * @description 确认搜索绑定函数
   * @todo 待移除
   */
  bindConfirm: function (event) {
    var that = this;
    var keyword = event.detail.value;
    this.setData({
      polyline: [],
      isSearching: false
    });
    qqmapsdk.search({
      keyword: keyword,
      success: function (res) {
        console.log(res);
        let markers = [];
        for (let i = 0; i < res.data.length; i++) {
          markers.push({
            width: 40,
            height: 40,
           // iconPath: "../image/destination.svg",
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            title: res.data[i].title
          });
        };
        that.setData({
          searchDone: true,
          searchList: res.data,
          markers: markers
        });
      },
      fail: function (res) {
        console.log("搜索接口调用失败", res);
      },
    });
  },

  /**
   * @method
   * @description 搜索框输入绑定函数
   * 调用qqmapsdk.getSuggestion（），setData suggestionList更新输入建议列表
   */
  bindInput: function (event) {
    var that = this;
    var keyword = event.detail.value;
    if (!!!keyword) {
      if (this.data.isSearching) {
        this.setData({ isSearching: false });
      };
      return;
    };
    if (!this.data.isSearching) {
      this.setData({
        isSearching: true
      });
    };
    this.setData({
      inputVal: event.detail.value
    });

    qqmapsdk.getSuggestion({
      keyword: keyword,
      region: !!this.data.cCity ? this.data.cCity : null, //或者''?
      success: function (res) {
        console.log(res);
        that.setData({
          suggestionList: res.data
        });
      },
      fail: function (res) {
        console.log("获取提示接口调用失败", res);
      },
    });
  },

  /**
   * @method
   * @description 搜索框取消按钮绑定函数
   */
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  /**
   * @method
   * @description 搜索框清空按钮绑定函数
   */
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  /**
   * @method
   * @description 搜索框聚焦绑定函数，重新getSuggestion
   */
  bindFocus: function (event) {
    var that = this;
    var keyword = event.detail.value;
    if (!!keyword) {
      if (!this.data.isSearching) {
        this.setData({ isSearching: true });
      };
      qqmapsdk.getSuggestion({
        keyword: keyword,
        region: !!this.data.cCity ? this.data.cCity : null, //或者''?
        success: function (res) {
          // console.log(res);
          that.setData({
            suggestionList: res.data
          });
        },
        fail: function (res) {
          console.log("获取提示接口调用失败", res);
        },
      });
    };
  },

  /**
   * @method
   * @description 搜索框文字点击聚焦绑定函数
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  /**
   * @method
   * @description 搜索框失焦绑定函数，重新getSuggestion
   */
  bindBlur: function (event) {
    // var that = this;
    // var keyword = event.detail.value;
    if (this.data.isSearching) {
      this.setData({ isSearching: false });
    };
  },

  /**
   * @method
   * @description 位置按钮绑定函数
   * 打开原生地图选择位置
   * 设置全局变量destination
   * 跳转至ttmaproute页面
   */
  bindPosition: function () {
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res, "chosenLocation")
        let location = {
          lat: res.latitude,
          lng: res.longitude
        };
        app.globalData.destination = {
          address: res.address,
          location: location
        };
        wx.navigateTo({
          url: './ttmaproute/ttmaproute',
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * @method
   * @description suggestion item点击绑定函数
   * 设置全局变量destination
   * 跳转至ttmaproute页面
   */
  suggestionTap: function (event) {
    // let title = event.currentTarget.dataset.title;
    let address = event.currentTarget.dataset.address;
    let location = event.currentTarget.dataset.location;
    app.globalData.destination = {
      address: address,
      location: location
    };
    wx.navigateTo({
      url: './ttmaproute/ttmaproute',
    });
    // this.setData({
    //   inputValue: title,
    //   inputFocus: true
    // });
  },

  /**
   * @method
   * @description 搜索结果item绑定函数
   * @todo 待移除
   */
  searchItemTap: function (event) {
    var that = this;
    let location = event.currentTarget.dataset.location;
    console.log(location);
    console.log(this.data.latitude);
    console.log(this.data.longitude);
    this.setData({
      searchDone: false
    });
    this.getLoc();
    qqmapsdk.direction({
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      to: {
        latitude: location.lat,
        longitude: location.lng
      },
      mode: "walking",//默认驾车（driving），步行（walking），公交（transit）
      policy: "LEAST_TIME",//REAL_TRAFFIC：[默认]结合路况，最优路线|LEAST_TIME：速度优先|LEAST_FEE：少收费|
      waypoints: "",//途经点39.111,116.112;39.112,116.113
      success: function (res) {
        //返回的内容处理请参考 http://lbs.qq.com/webservice_v1/guide-road.html
        console.log(res);
        let coors = res.result.routes[0].polyline;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        };
        let points = [];     //对象数组
        for (let j = 0; j < 1020; j += 2) {
          points.push({
            latitude: coors[j],
            longitude: coors[j + 1]
          });
        };
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6,
          }]
        });
        console.log(that.data.polyline);
      },
      fail: function (res) {
        console.log("路线规划接口调用失败", res);
      },
    });
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
   * @method
   * @description 指南针按钮绑定函数
   * 调用指南针接口，调用成功时设置指南针方向更新时setData direction
   * 当this.data.direction存在时点击播报方向
   */
  bindCompass: function () {
    var that = this;
    if (!this.data.compass) {
      wx.startCompass({
        success: function (res) {
          console.log("指南针接口调用成功", res)
          that.setData({
            compass: true
          });
          wx.onCompassChange(function (res) {
            console.log(res.direction)
            that.setData({
              direction: res.direction
            });
          });
        },
        fail: function (err) {
          console.log("指南针接口调用失败", err)
        }
      });
    };
    if (!!this.data.direction) {
      console.log(typeof (this.data.direction))
      this.textToSpeech(this.checkDirection(parseFloat((this.data.direction).toFixed(1))));
    };
  },

  /**
   * @method
   * @param {number} i 指南针接口返回数字
   * @return {String}
   * @description 根据指南针接口返回数字返回方向文字描述
   */
  checkDirection: function (i) {
    if (22.5 < i && i < 67.5) {
      return '东北'
    } else if (67.5 < i && i < 112.5) {
      return '正东'
    } else if (112.5 < i && i < 157.5) {
      return '东南'
    } else if (157.5 < i && i < 202.5) {
      return '正南'
    } else if (202.5 < i && i < 247.5) {
      return '西南'
    } else if (247.5 < i && i < 292.5) {
      return '正西'
    } else if (292.5 < i && i < 337.5) {
      return '西北'
    } else {
      return '正北'
    }
  },

  /**
   * @method
   * @description 调用this.mapCtx.moveToLocation()移动地图到所在位置
   */
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  /**
   * @method
   * @description 蓝牙按钮绑定函数
   */
  bindBluetooth: function () {
    var that = this;
    if (!this.data.bluetooth) {
      this.initBluetooth();
    } else {
      that.setData({
        bluetooth: false,
        distance: null,
        isReading: false
      });
      app.globalData.isReading = false;
      wx.closeBluetoothAdapter({ //如果蓝牙适配器初始化失败了还能调用这个接口吗？
        success: function (res) {
          console.log("蓝牙适配器关闭", res);
          app.globalData.bluetooth = false;
        }
      });
    };
  },

  /**
   * @method
   * @description 初始化蓝牙适配器,打开蓝牙搜索
   */
  initBluetooth: function () {
    let that = this;
    wx.showLoading({
      title: '正在开启蓝牙适配器'
    });
    wx.openBluetoothAdapter({
      success: function (res) {
        app.globalData.bluetooth = true;
        wx.getBluetoothAdapterState({
          success: function (res) {
            if (res.available) { //蓝牙设备可用
              console.log("蓝牙适配器初始化，且蓝牙设备开启", res);
              // 是否需要获取已经在系统上连接的蓝牙模块？？？个人感觉没必要。
              that.setData({
                bluetooth: true
              });
            };
            if (!res.discovering) {
              that.discoverBluetooth();
            };
          },
          fail: function (err) {
            console.log("错误码：1002", err); //获取蓝牙适配器状态失败
          }
        });
      },
      fail: function (err) {
        console.log(err);
        if (err.errCode == 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            if (res.available) {
              console.log("初始化后蓝牙开启", res);
              wx.getConnectedBluetoothDevices({
                success: function (res) {
                  console.log(res);
                }
              });
            };
            if (!res.discovering) {
              that.discoverBluetooth();
            };
          });
        } else {
          console.log("错误码：1001", err); // 蓝牙适配器初始化失败
          wx.showToast({
            title: '蓝牙适配器初始化失败',
            icon: 'fail',
            duration: 2000
          });
          setTimeout(function () {
            wx.hideToast();
          }, 2000);
        };
      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },

  /**
   * @method
   * @description 打开蓝牙搜索，并在发现新设备时按名字匹配蓝牙设备
   */
  discoverBluetooth: function () {
    var that = this;
    wx.showLoading({
      title: '开启蓝牙搜索'
    });
    wx.startBluetoothDevicesDiscovery({
      services: [],
      allowDuplicatesKey: false,
      success: function (res) {
        console.log("蓝牙搜索已打开", res);
        that.timeout = setTimeout(function () {
          // 关闭蓝牙适配器
          wx.closeBluetoothAdapter({ //如果蓝牙适配器初始化失败了还能调用这个接口吗？
            success: function (res) {
              console.log("蓝牙适配器关闭", res);
              app.globalData.bluetooth = false;
              that.setData({
                bluetooth: false,
                distance: null,
                isReading: false
              });
            }
          });
          that.textToSpeech("未发现启明瞳助盲硬件设备");
          wx.vibrateLong();
          wx.showToast({
            title: '未发现启明瞳助盲硬件设备',
            icon: 'fail',
            duration: 2000
          });
        }, SEARCH_DEVICE_DURATION);
        wx.onBluetoothDeviceFound(function (devices) {
          console.log(devices);
          that.connectByName("qiming", devices);
        });
      },
      fail: function (err) {
        console.log("错误码：1003", err); //开启蓝牙搜索功能失败
      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },

  /**
   * @method
   * @param {String} deviceName 
   * @param {Array} devices onBluetoothDeviceFound返回的发现的新设备对象
   * @description 检查设备信息,若设备名匹配deviceName则连接
   */
  connectByName: function (deviceName, devices) {
    if (devices.devices[0].name == deviceName) {
      this.connectBluetooth(devices.devices[0].deviceId);
    };
  },

  /**
   * @method
   * @param {String} deviceId 
   * @param {String} deviceName
   * @description 根据deviceId连接蓝牙。
   * 打开蓝牙订阅功能，并监听指定接口。
   * 设置蓝牙连接断开时自动重连（手动没写）。
   * 根据bluetooth_demo中connectBluetooth方法改
   */
  connectBluetooth: function (deviceId, deviceName) {
    var that = this;
    wx.showLoading({
      title: '正在连接'
    });
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log("连接成功", res);

        clearTimeout(that.timeout);
        that.textToSpeech("发现启明瞳设备");
        wx.vibrateLong();
        wx.showToast({
          title: '发现启明瞳设备',
          icon: 'success',
          duration: 2000
        });

        // 关闭蓝牙搜索
        wx.stopBluetoothDevicesDiscovery({
          success: function (res) {
            console.log("蓝牙搜索关闭", res);
          },
          fail: function (err) {
            console.log("错误码：1005", err); //关闭蓝牙搜索失败
          }
        });

        //打开蓝牙订阅功能
        that.notifyCharasteristic(deviceId);

        wx.onBLEConnectionStateChange(function (res) {
          // 该方法回调中可以用于处理连接意外断开等异常情况
          console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
          console.log(that.data.bluetooth);
          if (!app.globalData.bluetooth) {
            return;
          };
          if (!res.connected) {
            // clearInterval(app.globalData.interval);
            that.textToSpeech("断开连接，自动重连中");
            wx.vibrateLong();
            wx.showToast({
              title: '断开连接，自动重连中',
              icon: 'icon',
              duration: 2000
            });
            setTimeout(function () {
              reconnectTime++;
              if (reconnectTime <= RECONNECT_TIME) {
                that.connectBluetooth(res.deviceId);
              } else {
                reconnectTime = 0;
                that.textToSpeech("重连3次失败，请重新扫描");
                wx.vibrateLong();
                wx.showToast({
                  title: '重连3次失败，请重新扫描',
                  icon: 'fail',
                  duration: 2000
                });
              };
            }, RECONNECT_DELAY);
          } else {
            reconnectTime = 0;
            wx.showToast({
              title: '连接成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
      },
      fail: function (err) {
        console.log("错误码：1004", err); //连接蓝牙失败
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * @method
   * @param {String} deviceId 
   * @description 根据deviceId订阅特征值接口。
   */
  notifyCharasteristic: function (deviceId) {
    let that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: deviceId,
      serviceId: SERVICE_ID,
      characteristicId: CHAR_ID,
      success: function (res) {
        console.log('notifyBLECharacteristicValueChange success', res.errMsg);
        that.onCharChange();
      }
    });
  },

  /**
   * @method
   * @param {String} deviceId 
   * @description 监听特征值接口，对变化的特征值作处理。
   */
  onCharChange: function () {
    var that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
      let t = that.ab2hex(res.value);
      let nativeStr = that.UnicodeStrToNative(t);
      console.log(t);
      console.log(nativeStr);
      that.vibrate(nativeStr);
      that.setData({
        distance: nativeStr
      });
      app.globalData.distance = (parseFloat(nativeStr) / 100).toFixed(1);
      that.readDistance();
    });
  },

  /**
   * @method
   * @param {Number} a 
   * @description 根据a值来选择震动强度并震动
   */
  vibrate: function (a) {
    if (typeof (a) != "number") {
      a = parseFloat(a);
    };
    if (a >= VIBRATE_THRESHOLD[0] && a <= VIBRATE_THRESHOLD[1]) {
      wx.vibrateShort();
      setTimeout(function() {
        wx.vibrateShort()
      }, 30);
    } else if (a < VIBRATE_THRESHOLD[0]) {
      wx.vibrateLong();
    };
  },

  /**
   * @method
   * @description 根据this.data.ditance存在与否来决定是否播报
   */
  readDistance: function () {
    var that = this;
    if (this.data.bluetooth && !!this.data.distance) {
      if(!this.data.isReading) {
        this.setData({
          isReading: true
        });
        app.globalData.isReading = true;
      }
      console.log("reading!")
      let text = (parseFloat(that.data.distance) / 100).toFixed(1) + '米';
      that.textToSpeech(text);
      // if(this.data.distance >= 500) {
      //   cInterval = setInterval(function () {
      //     let text = that.data.distance.split('.')[0];
      //     that.textToSpeech(text);
      //     console.log("reading!");
      //   }, READING_INTERVAL_THRESHOLD[3]);
      // } else if (this.data.distance >= 300 && this.data.distance < 500) {
      //   setInterval(function () {
      //     let text = that.data.distance.split('.')[0];
      //     that.textToSpeech(text);
      //     console.log("reading!");
      //   }, READING_INTERVAL_THRESHOLD[3]);
      // } else if (this.data.distance < 300 ) {

      // };
      // app.globalData.interval = setInterval(function () {
      //   if (!that.data.bluetooth) {
      //     console.log("蓝牙关闭，停止播报！");
      //     that.setData({
      //       isReading: false
      //     });
      //     app.globalData.isReading = false;
      //     clearInterval(app.globalData.interval);
      //   } else {
      //     let text = (parseFloat(that.data.distance) / 100).toFixed(1) + '米';
      //     that.textToSpeech(text);
      //     console.log("reading!");
      //   }
      // }, READING_INTERVAL_THRESHOLD[2]);
    };
  },

  /**
   * @method
   * @param {BufferArray} buffer - 蓝牙发送的二进制数据
   * @return {String} 16进制字符串
   * @description ArrayBuffer转16进度字符串
   */
  ab2hex: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    );
    return hexArr.join('');
  },

  /**
   * @method
   * @param {String} UnicodeStr - Unicode码，16进制字符串
   * @return {String} 10进制字符串
   * @description 16进制Unicode字符串转10进制字符串
   */
  UnicodeStrToNative: function (UnicodeStr) {
    let bitsArray = UnicodeStr.split("");
    let UnicodeArray = [];
    let NativeStr = "";
    for (let i = 0; i < bitsArray.length; i += 2) {
      UnicodeArray.push(bitsArray[i] + bitsArray[i + 1]);
    };
    for (let j = 0; j < UnicodeArray.length; j++) {
      NativeStr += String.fromCharCode(parseInt(UnicodeArray[j], 16));
    };
    return NativeStr;
  },

  onLoad: function () {
    this.getLoc();
    console.log(wx.getSystemInfoSync().windowHeight);
    let mapHeight = wx.getSystemInfoSync().windowHeight - 112 - 48 + 'px';
    console.log(mapHeight);
    this.setData({
      mapHeight: mapHeight
    });
    qqmapsdk = new QQMapWX({
     key: 'BVWBZ-UBXC6-JW4SZ-E3G5H-WLYO2-MOFJX'
      //  key: 'UFVBZ-FW5KP-YQMDI-LCE2B-L6FAQ-NBBNN'
    });
  },

  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onUnload: function () {
    //卸载时检查全局变量中的bluetooth和interval状态，若存在则清空，停止蓝牙功能和距离播报功能
    var that = this;
    if (app.globalData.bluetooth) {
      wx.closeBluetoothAdapter({
        success: function (res) {
          console.log("蓝牙适配器关闭", res);
          app.globalData.bluetooth = false;
          that.setData({
            bluetooth: false,
            distance: null,
            isReading: false
          });
          app.globalData.isReading = false;
        },
      })
    };
    // if (!!app.globalData.interval) {
    //   clearInterval(app.globalData.interval);
    //   app.globalData.isReading = false;
    // };

    if(this.data.compass) {
      wx.stopCompass({
        success: function() {
          console.log("关闭指南针接口调用成功")
          that.setData({
            compass: false
          });
        },
        fail: function() {
          console.log("关闭指南针接口调用失败");
        }
      });
    };
  },
})
