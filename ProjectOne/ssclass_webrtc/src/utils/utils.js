import {
  emojiMap,
  emojiUrl
} from '@/tencent/webim/emojiMap'

import {
  export_json_to_excel
} from '@/utils/excel/Export2Excel'

class Utils {
  constructor() {}
  /**
   * 获得硬件信息
   */
  getUserAgent() {
    var userAgent = navigator.userAgent;
    return userAgent;
  }

  /**
   * 获得系统版本
   */
  getOsType() {
    var userAgent = navigator.userAgent.toLowerCase();
    var osType = 'Unknown';
    if (userAgent.indexOf("win") > -1) {
      if (userAgent.indexOf("windows nt 5.0") > -1) {
        osType = "Windows 2000";
      } else if (userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("windows nt 5.2") > -1) {
        osType = "Windows XP";
      } else if (userAgent.indexOf("windows nt 6.0") > -1) {
        osType = "Windows Vista";
      } else if (userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1) {
        osType = "Windows 7";
      } else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1) {
        osType = "Windows 8";
      } else if (userAgent.indexOf("windows nt 6.3") > -1) {
        osType = "Windows 8.1";
      } else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows nt 10.0") > -1) {
        osType = "Windows 10";
      } else {
        osType = "Unknown";
      }
    } else if (userAgent.indexOf("iphone") > -1) {
      osType = "iPhone";
    } else if (userAgent.indexOf("ipad") > -1) {
      osType = "iPad";
    } else if (userAgent.indexOf("mac") > -1) {
      osType = "Mac";
    } else if (userAgent.indexOf("linux") > -1) {
      if (userAgent.indexOf("android") > -1) {
        osType = "Android";
      } else {
        osType = "Linux";
      }
    } else {
      osType = "Unknown";
    }

    return osType;
  }

  /**
   * 获得浏览器版本
   */
  getBrowserType() {
    // 注意：indexOf() 区分大小写
    var userAgent = navigator.userAgent;
    if (userAgent.match(/MicroMessenger\/[0-9]/i)) {
      return "Weixin";
    } else if (userAgent.match(/QQ\/[0-9]/i)) {
      return "QQ";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      return 'Opera';
    } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
      return 'IE';
    } else if (userAgent.indexOf("Edge") > -1) {
      return 'Edge';
    } else if (userAgent.indexOf("Firefox") > -1) {
      return 'Firefox';
    } else if (userAgent.indexOf("UCBrowser") > -1) {
      return 'UCBrowser';
    } else if (userAgent.indexOf("baidu") > -1) {
      return 'BaiduBrowser'; // 不知对不对 区分大小写
    } else if (userAgent.indexOf("MQQBrowser") > -1) {
      return 'MQQBrowser';
    } else if (userAgent.indexOf("QQBrowser") > -1) {
      return 'QQBrowser';
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
      return 'Safari';
    } else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
      var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");

      function _mime(option, value) {
        var mimeTypes = navigator.mimeTypes;
        for (var mt in mimeTypes) {
          if (mimeTypes[mt][option] == value) {
            return true;
          }
        }
        return false;
      }

      if (is360) {
        return "360";
      } else if (userAgent.indexOf("QQBrowser") > -1) {
        return 'QQBrowser';
      } else {
        return 'Chrome';
      }
    } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
      return 'IE>=11';
    } else {
      return 'Unkonwn';
    }
  }

  /**
   * 获得浏览器的版本
   */
  getBrowserVersion() {
    var arr = navigator.userAgent.split(' ');

    var browserVersion = '';
    var browserType = this.getBrowserType();

    if (browserType === 'Chrome') {
      for (var i = 0; i < arr.length; i++) {
        if (/chrome/i.test(arr[i]))
          browserVersion = arr[i]
      }

      // 取主版本号
      if (browserVersion) {
        browserVersion = browserVersion.split('/')[1].split('.')[0];
      }
    } else if (browserType === 'Safari') {
      for (var i = 0; i < arr.length; i++) {
        if (/version/i.test(arr[i]))
          browserVersion = arr[i]
      }

      // 全版本号
      if (browserVersion) {
        browserVersion = browserVersion.split('/')[1];
      }
    }

    return browserVersion;
  }

  /**
   * 获得语言类别
   */
  getLanType() {
    var lan = navigator.language || navigator.userLanguage; //常规浏览器语言和IE浏览器
    lan = lan.substr(0, 2); //截取lang前2位字符
    return lan;
  }

  /**
   * 时间差，分钟
   * @param {*} startTime 
   * @param {*} endTime 
   */
  getDuration(startTime, endTime) {
    //为了Safari
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");

    var dStart = new Date(startTime);
    var dEnd = new Date(endTime);

    var tStart = dStart.getTime(),
      tEnd = dEnd.getTime();
    var totalSecond = (tEnd - tStart) / 1000;

    var hour = parseInt(totalSecond / (60 * 60)); //计算整数小时数
    var leftSeconds = totalSecond - hour * 60 * 60; //取得算出小时数后剩余的秒数
    var minute = parseInt(leftSeconds / 60); //计算整数分

    var time = "";
    if (hour > 0) {
      time = hour + window.i18n.t('system.hour');
    }

    if (minute > 0) {
      time += minute + window.i18n.t('system.minute');
    }

    return time;
  }

  /**
   * 时间差，秒，小数点后是毫秒
   * @param {*} startTime 
   * @param {*} endTime 
   */
  timeDiffSeconds(startTime, endTime) {
    if (!startTime || !endTime) {
      return 0;
    }

    var dStart = new Date(startTime);
    var dEnd = new Date(endTime);

    var tStart = dStart.getTime();
    var tEnd = dEnd.getTime();
    var seconds = parseInt((tEnd - tStart) / 1000);

    return seconds;
  }

  /**
   * 格式化时间（秒）
   * @param {*} seconds 
   */
  formatSeconds(seconds) {
    if (seconds < 0) {
      return "00:00:00";
    }

    var time = "";
    var minutes = 0; // 分 
    var hours = 0; // 小时 

    if (seconds >= 60) {
      minutes = parseInt(seconds / 60);
      seconds = parseInt(seconds % 60);

      if (minutes >= 60) {
        hours = parseInt(minutes / 60);
        minutes = parseInt(minutes % 60);
      }
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (hours < 10) {
      hours = "0" + hours;
    }

    time = hours + ":" + minutes + ":" + seconds

    return time;
  }

  /**
   * 获得当前时间
   */
  getNowTime() {
    var now = new Date();

    return this.timestamp2Str(now);
  }

  /**
   * 时间戳转日期
   */
  timestamp2Str(timestamp) {
    var now = new Date(timestamp);

    var month = now.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }

    var date = now.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    var hour = now.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }

    var minute = now.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    var second = now.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }

    return now.getFullYear() + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  }

  /**
   * 获得当前时间，毫秒
   */
  getNowMillisecond() {
    var now = new Date();

    var month = now.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }

    var date = now.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    var hour = now.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }

    var minute = now.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    var second = now.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }

    var millisecond = now.getMilliseconds();
    if (millisecond < 10) {
      millisecond = "00" + second;
    } else if (millisecond < 100) {
      millisecond = "0" + second;
    }

    return now.getFullYear() + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second + '.' + millisecond;
  }

  /**
   * 获得当前时间
   */
  getNowHourMinute() {
    var now = new Date();

    var hour = now.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }

    var minute = now.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    return hour + ":" + minute;
  }

  /**
   * 获得当前时间戳
   */
  getTimestamp() {
    var timestamp = Date.parse(new Date());
    return timestamp / 1000;
  }

  /**
   * 添加秒
   * @param {*} time 
   * @param {*} addSeconds 
   */
  addSeconds(time, addSeconds) {
    var hours = 0; // 小时 
    var minutes = 0; // 分 
    var seconds = 0; //秒
    var totalSeconds = 0;

    var arr = time.split(":");

    //有小时
    if (arr.length == 3) {
      hours = parseInt(arr[0]);
      minutes = parseInt(arr[1]);
      seconds = parseInt(arr[2]);
    } else {
      minutes = parseInt(arr[0]);
      seconds = parseInt(arr[1]);
    }

    //加上秒数
    seconds += addSeconds;

    //总秒数
    totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return formatSeconds(totalSeconds);
  }

  /**
   * 字符串是否为空
   * @param {*} text 
   */
  strIsNull(text) {
    if (text == null) {
      return true
    }

    if (text.length == 0) {
      return true
    }

    return false
  }

  /**
   * 左截取
   * @param {*} text 
   * @param {*} len 
   */
  left(text, len) {
    return text.substring(0, len);
  }

  /**
   * 右截取
   * @param {*} text 
   * @param {*} len 
   */
  right(text, len) {
    return text.substring(text.length - len, text.length);
  }

  /**
   * 分割字符
   * @param {*} split 分隔符
   * @param {*} text 要分割的文本
   * @param {*} index 顺序
   */
  split(separator, text, index) {
    if (separator == null || text == null) {
      return "";
    }

    var arr = text.split(separator);

    if (arr.length <= index) {
      return "";
    }

    return arr[index];
  }

  /**
   * 替换文本
   * @param {*} text 
   */
  replaceHtmlSymbol(text) {
    text = text.replace(/&nbsp;/ig, " ");
    text = text.replace(/&amp;/ig, "&");
    return text;
  }

  /**
   * 数字转Boolean
   * @param {*} value 
   */
  convert2Boolean(value) {
    if (value === 1 || value === true) {
      return true
    } else {
      return false
    }
  }

  /**
   * 判断是否全屏
   * 
   * @param {*}  
   */
  isFullscreen() {
    return document.webkitFullscreenElement || //谷歌 
      document.fullScreenElement || //W3C
      document.msFullscreenElement || //IE
      document.mozFullScreenElement //火狐
    false
  }

  /**
   * 全屏或者退出全屏
   */
  fullscreen(elementID, isFullscreen) {
    /*判断是否全屏*/
    var element = null
    if (elementID) {
      element = document.getElementById(elementID)
    } else {
      element = document.documentElement
    }

    if (isFullscreen) {
      if (document.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    } else {
      if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  }

  /**
   * 处理im
   */
  decodeText(text) {
    let renderDom = []
    // 文本消息
    let temp = text
    let left = -1
    let right = -1
    while (temp !== '') {
      left = temp.indexOf('[')
      right = temp.indexOf(']')
      switch (left) {
        case 0:
          if (right === -1) {
            renderDom.push({
              name: 'text',
              text: temp
            })
            temp = ''
          } else {
            let _emoji = temp.slice(0, right + 1)
            if (emojiMap[_emoji]) {
              renderDom.push({
                name: 'img',
                src: emojiUrl + emojiMap[_emoji]
              })
              temp = temp.substring(right + 1)
            } else {
              renderDom.push({
                name: 'text',
                text: '['
              })
              temp = temp.slice(1)
            }
          }
          break
        case -1:
          renderDom.push({
            name: 'text',
            text: temp
          })
          temp = ''
          break
        default:
          renderDom.push({
            name: 'text',
            text: temp.slice(0, left)
          })
          temp = temp.substring(left)
          break
      }
    }
    return renderDom
  }

  /**
   * 导出 excel
   * @param {*} header 
   * @param {*} fieldsName 
   * @param {*} fileName 
   * @param {*} data 
   */
  exportExcel(header, fieldsName, fileName, data) {
    var tableData = this.formatJson(fieldsName, data)
    export_json_to_excel(
      header,
      tableData,
      fileName
    )
  }

  /**
   *  格式数据
   *  @fieldsName  字段
   *  @tableData  用来格式的表格数据
   */
  formatJson(fieldsName, tableData) {
    return tableData.map(v => {
      return fieldsName.map(j => {
        return v[j]
      })
    })
  }
}

const utils = new Utils()
export default utils