(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(n);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|sendNativeEvent|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

// Context例外情况
var CONTEXT_API_RE_EXC = ['createBLEConnection'];

// 同步例外情况
var ASYNC_API = ['createBLEConnection'];

var CALLBACK_API_RE = /^on|^off/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

/* eslint-disable no-extend-native */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    var promise = this.constructor;
    return this.then(
    function (value) {return promise.resolve(callback()).then(function () {return value;});},
    function (reason) {return promise.resolve(callback()).then(function () {
        throw reason;
      });});

  };
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };


var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  interceptors: interceptors });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.windowHeight - safeArea.bottom };

  }
}
var protocols = {
  previewImage: previewImage,
  getSystemInfo: {
    returnValue: addSafeAreaInsets },

  getSystemInfoSync: {
    returnValue: addSafeAreaInsets } };


var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });


var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions.behaviors;
  var vueExtends = vueOptions.extends;
  var vueMixins = vueOptions.mixins;

  var vueProps = vueOptions.props;

  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps.name = {
            type: String,
            default: '' };

          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts.default;
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (hasOwn(event, 'markerId')) {
    event.detail = typeof event.detail === 'object' ? event.detail : {};
    event.detail.markerId = event.markerId;
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn('事件信息不存在');
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn('事件信息不存在');
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = _objectSpread({
    multipleSlots: true,
    addGlobalClass: true },
  vueOptions.options || {});


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin'].options) {
      Object.assign(options, vueOptions['mp-weixin'].options);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 133:
/*!************************************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/controller/user-controller.js ***!
  \************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _event = _interopRequireDefault(__webpack_require__(/*! ../utils/event */ 134));
var _user = _interopRequireDefault(__webpack_require__(/*! ../model/user */ 135));
var _stream = _interopRequireDefault(__webpack_require__(/*! ../model/stream */ 136));
var _constants = __webpack_require__(/*! ../common/constants */ 137);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var TAG_NAME = 'UserController';
/**
                                  * 通讯成员管理
                                  */var

UserController = /*#__PURE__*/function () {
  function UserController(componentContext) {_classCallCheck(this, UserController);
    // userMap 用于存储完整的数据结构
    this.userMap = new Map(); // userList 用于存储简化的用户数据 Object，包括 {userID hasMainAudio hasMainVideo hasAuxAudio hasAuxVideo}

    this.userList = []; // streamList 存储steam 对象列表，用于trtc-room 渲染 player

    this.streamList = [];
    this._emitter = new _event.default();
    this.componentContext = componentContext;
    this.isNewVersion = componentContext.isNewVersion;
  }_createClass(UserController, [{ key: "userEventHandler", value: function userEventHandler(

    event) {
      var code = event.detail.code;
      var data;

      if (event.detail.message && typeof event.detail.message === 'string') {
        try {
          data = JSON.parse(event.detail.message);
        } catch (exception) {
          console.warn(TAG_NAME, 'userEventHandler 数据格式错误', exception);
          return false;
        }
      } else {
        console.warn(TAG_NAME, 'userEventHandler 数据格式错误');
        return false;
      }

      switch (code) {
        case 1020:
          // console.log(TAG_NAME, '远端用户全量列表更新：', code)
          if (!this.isNewVersion) {// TODO 旧版SDK处理逻辑，返回全量的用户列表,需要对userList 进行前后对比，筛选出新增用户，暂不实现
          }

          break;

        case 1031:
          // console.log(TAG_NAME, '远端用户进房通知：', code)
          // 1031 有新用户
          // {
          //   "userlist":[
          //          {
          //              "userid":"webrtc11"
          //          }
          //      ]
          // }
          this.addUser(data);
          break;

        case 1032:
          // console.log(TAG_NAME, '远端用户退房通知：', code)
          // 1032 有用户退出
          this.removeUser(data);
          break;

        case 1033:
          // console.log(TAG_NAME, '远端用户视频状态位变化通知：', code)
          // 1033 用户视频状态变化，新增stream或者更新stream 状态
          // {
          //   "userlist":[
          //          {
          //              "userid":"webrtc11",
          //              "playurl":" room://rtc.tencent.com?userid=xxx&streamtype=main",
          //              "streamtype":"main",
          //              "hasvideo":true
          //          }
          //      ]
          // }
          this.updateUserVideo(data);
          break;

        case 1034:
          // console.log(TAG_NAME, '远端用户音频状态位变化通知：', code)
          // 1034 用户音频状态变化
          // {
          //   "userlist":[
          //          {
          //              "userid":"webrtc11",
          //              "playurl":" room://rtc.tencent.com?userid=xxx&streamtype=main",
          //              "hasaudio":false
          //          }
          //      ]
          // }
          this.updateUserAudio(data);
          break;}

    }
    /**
       * 处理用户进房事件
       * @param {Object} data pusher 下发的数据
       */ }, { key: "addUser", value: function addUser(


    data) {var _this = this;
      // console.log(TAG_NAME, 'addUser', data)
      var incomingUserList = data.userlist;
      var userMap = this.userMap;

      if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
        incomingUserList.forEach(function (item) {
          var userID = item.userid; // 已经在 map 中的用户

          var user = _this.getUser(userID);

          if (!user) {
            // 新增用户
            user = new _user.default({
              userID: userID });

            _this.userList.push({
              userID: userID });

          }

          userMap.set(userID, user);

          _this._emitter.emit(_constants.EVENT.REMOTE_USER_JOIN, {
            userID: userID,
            userList: _this.userList });
          // console.log(TAG_NAME, 'addUser', item, userMap.get(userID), this.userMap)

        });
      }
    }
    /**
       * 处理用户退房事件
       * @param {Object} data pusher 下发的数据 {userlist}
       */ }, { key: "removeUser", value: function removeUser(


    data) {var _this2 = this;
      // console.log(TAG_NAME, 'removeUser', data)
      var incomingUserList = data.userlist;

      if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
        incomingUserList.forEach(function (item) {
          var userID = item.userid;
          var user = _this2.getUser(userID); // 从userList 里删除指定的用户和 stream

          _this2._removeUserAndStream(userID); // 重置


          user.streams['main'] && user.streams['main'].reset();
          user.streams['aux'] && user.streams['aux'].reset(); // 用户退出，释放引用，外部调用该 user 所有stream 的 playerContext.stop() 方法停止播放
          // TODO 触发时机提前了，方便外部用户做出处理，时机仍需进一步验证

          _this2._emitter.emit(_constants.EVENT.REMOTE_USER_LEAVE, {
            userID: userID,
            userList: _this2.userList,
            streamList: _this2.streamList });


          user = undefined;
          _this2.userMap.delete(userID); // console.log(TAG_NAME, 'removeUser', this.userMap)
        });
      }
    }
    /**
       * 处理用户视频通知事件
       * @param {Object} data pusher 下发的数据 {userlist}
       */ }, { key: "updateUserVideo", value: function updateUserVideo(


    data) {var _this3 = this;
      // console.log(TAG_NAME, 'updateUserVideo', data)
      var incomingUserList = data.userlist;

      if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
        incomingUserList.forEach(function (item) {
          // 修改现有用户属性
          var userID = item.userid;
          var streamType = item.streamtype;
          var hasVideo = item.hasvideo;
          var src = item.playurl;
          var user = _this3.getUser(userID); // 如果找到该用户，则更新用户的信息和相关的stream 信息

          if (user) {
            var stream = user.streams[streamType]; // console.log(TAG_NAME, 'updateUserVideo', user, streamType, stream)
            // 更新指定的stream

            if (!stream) {
              user.streams[streamType] = stream = new _stream.default({
                streamType: streamType });
              // 更新streamList

              _this3.streamList.push(stream);
            }

            if (hasVideo && streamType === 'aux') {
              stream.objectFit = 'contain';
            }

            if (!hasVideo && streamType === 'aux') {
              // TODO 如果是辅流可能要移除该 stream
              _this3._removeStream(stream);
            } else {
              stream.userID = userID;
              stream.streamID = userID + '_' + streamType;
              stream.hasVideo = hasVideo;
              stream.src = src;
            } // 更新所属user 的 hasXxx 值


            _this3.userList.find(function (item) {
              if (item.userID === userID) {
                item["has".concat(streamType.replace(/^\S/, function (s) {return s.toUpperCase();}), "Video")] = hasVideo;
                return true;
              }
            });
            var eventName = hasVideo ? _constants.EVENT.REMOTE_VIDEO_ADD : _constants.EVENT.REMOTE_VIDEO_REMOVE;

            _this3._emitter.emit(eventName, {
              stream: stream,
              streamList: _this3.streamList,
              userList: _this3.userList });
            // console.log(TAG_NAME, 'updateUserVideo', user, stream, this.userMap)

          }
        });
      }
    }
    /**
       * 处理用户音频通知事件
       * @param {Object} data pusher 下发的数据 {userlist}
       */ }, { key: "updateUserAudio", value: function updateUserAudio(


    data) {var _this4 = this;
      // console.log(TAG_NAME, 'updateUserAudio', data)
      var incomingUserList = data.userlist;

      if (Array.isArray(incomingUserList) && incomingUserList.length > 0) {
        incomingUserList.forEach(function (item) {
          var userID = item.userid; // 音频只跟着 stream main ，这里只修改 main

          var streamType = 'main';
          var hasAudio = item.hasaudio;
          var src = item.playurl;
          var user = _this4.getUser(userID);

          if (user) {
            var stream = user.streams[streamType];

            if (!stream) {
              user.streams[streamType] = stream = new _stream.default({
                streamType: streamType });
              // 更新streamList

              _this4.streamList.push(stream);
            }

            stream.userID = userID;
            stream.streamID = userID + '_' + streamType;
            stream.hasAudio = hasAudio;
            stream.src = src; // 更新所属 user 的 hasXxx 值

            _this4.userList.find(function (item) {
              if (item.userID === userID) {
                item["has".concat(streamType.replace(/^\S/, function (s) {return s.toUpperCase();}), "Audio")] = hasAudio;
                return true;
              }
            });
            var eventName = hasAudio ? _constants.EVENT.REMOTE_AUDIO_ADD : _constants.EVENT.REMOTE_AUDIO_REMOVE;

            _this4._emitter.emit(eventName, {
              stream: stream,
              streamList: _this4.streamList,
              userList: _this4.userList });
            // console.log(TAG_NAME, 'updateUserAudio', user, stream, this.userMap)

          }
        });
      }
    }
    /**
       *
       * @param {String} userID 用户ID
       * @returns {Object}
       */ }, { key: "getUser", value: function getUser(


    userID) {
      return this.userMap.get(userID);
    } }, { key: "getStream", value: function getStream(_ref)




    {var userID = _ref.userID,streamType = _ref.streamType;
      var user = this.userMap.get(userID);

      if (user) {
        return user.streams[streamType];
      }

      return undefined;
    } }, { key: "getUserList", value: function getUserList()

    {
      return this.userList;
    } }, { key: "getStreamList", value: function getStreamList()

    {
      return this.streamList;
    }
    /**
       * 重置所有user 和 steam
       * @returns {Object}
       */ }, { key: "reset", value: function reset()


    {
      this.streamList.forEach(function (item) {
        item.reset();
      });
      this.streamList = [];
      this.userList = [];
      this.userMap.clear();
      return {
        userList: this.userList,
        streamList: this.streamList };

    } }, { key: "on", value: function on(

    eventCode, handler, context) {
      this._emitter.on(eventCode, handler, context);
    } }, { key: "off", value: function off(

    eventCode, handler) {
      this._emitter.off(eventCode, handler);
    }
    /**
       * 删除用户和所有的 stream
       * @param {String} userID 用户ID
       */ }, { key: "_removeUserAndStream", value: function _removeUserAndStream(


    userID) {
      this.streamList = this.streamList.filter(function (item) {
        return item.userID !== userID && item.userID !== '';
      });
      this.userList = this.userList.filter(function (item) {
        return item.userID !== userID;
      });
    } }, { key: "_removeStream", value: function _removeStream(

    stream) {
      this.streamList = this.streamList.filter(function (item) {
        if (item.userID === stream.userID && item.streamType === stream.streamType) {
          return false;
        }

        return true;
      });
    } }]);return UserController;}();var _default =



UserController;exports.default = _default;

/***/ }),

/***/ 134:
/*!*********************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/utils/event.js ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var Event = /*#__PURE__*/function () {"use strict";function Event() {_classCallCheck(this, Event);}_createClass(Event, [{ key: "on", value: function on(
    event, fn, ctx) {
      if (typeof fn !== 'function') {
        console.error('listener must be a function');
        return;
      }

      this._stores = this._stores || {};
      (this._stores[event] = this._stores[event] || []).push({
        cb: fn,
        ctx: ctx });

    } }, { key: "emit", value: function emit(

    event) {
      this._stores = this._stores || {};
      var store = this._stores[event];
      var args;

      if (store) {
        store = store.slice(0);
        args = [].slice.call(arguments, 1), args[0] = {
          eventCode: event,
          data: args[0] };


        for (var i = 0, len = store.length; i < len; i++) {
          store[i].cb.apply(store[i].ctx, args);
        }
      }
    } }, { key: "off", value: function off(

    event, fn) {
      this._stores = this._stores || {}; // all

      if (!arguments.length) {
        this._stores = {};
        return;
      } // specific event


      var store = this._stores[event];
      if (!store) return; // remove all handlers

      if (arguments.length === 1) {
        delete this._stores[event];
        return;
      } // remove specific handler


      var cb;

      for (var i = 0, len = store.length; i < len; i++) {
        cb = store[i].cb;

        if (cb === fn) {
          store.splice(i, 1);
          break;
        }
      }

      return;
    } }]);return Event;}();



module.exports = Event;

/***/ }),

/***/ 135:
/*!********************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/model/user.js ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var User =
function User(options) {_classCallCheck(this, User);
  Object.assign(this, {
    userID: '',
    // hasMainStream: false, // 触发 1034 且stream type 为 main 即为true
    // hasAuxStream: false, // 触发 1034 且stream type 为 aux 即为true
    // hasSmallStream: false, // 触发 1034 且stream type 为 small 即为true
    streams: {} // main: mainStream
    // aux: auxStream
    // 有0~2个Stream， 进房没有推流，main aux， small 特殊处理，small 和 main 同时只播放一路
    // stream 是用于渲染 live-player 的数据源
  },
  options);
};var _default =



User;exports.default = _default;

/***/ }),

/***/ 136:
/*!**********************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/model/stream.js ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _constants = __webpack_require__(/*! ../common/constants */ 137);function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Stream = /*#__PURE__*/function () {
  function Stream(options) {_classCallCheck(this, Stream);
    Object.assign(this, _constants.DEFAULT_PLAYER_CONFIG, {
      userID: '',
      // 该stream 关联的userID
      streamType: '',
      // stream 类型 [main small] aux
      isVisible: true,
      // 手Q初始化时不能隐藏 puser和player 否则黑屏。iOS 微信初始化时不能隐藏，否则同层渲染失败，player会置顶
      hasVideo: false,
      hasAudio: false,
      playerContext: undefined // playerContext 依赖component context来获取，目前只能在渲染后获取
    },
    options);
  }
  /**
     * 大小流切换
     */_createClass(Stream, [{ key: "switchMainSmallStream", value: function switchMainSmallStream()


    {
      if (this.streamType === 'main' || this.streamType === 'small') {// 大小流切换逻辑
        // 修改 streamType 和 streamURL 并调用 componentContext setData()
      } else {
        console.log('aux 不支持大小流切换');
      }
    } }, { key: "reset", value: function reset()

    {
      if (!this.playerContext) {
        this.playerContext.stop();
        this.playerContext = null;
      }

      Object.assign(this, _constants.DEFAULT_PLAYER_CONFIG, {
        userID: '',
        // 该stream 关联的userID
        streamType: '',
        // stream 类型 [main small] aux
        streamID: '',
        isVisible: true,
        hasVideo: false,
        hasAudio: false,
        playerContext: undefined });

    } }]);return Stream;}();var _default =



Stream;exports.default = _default;

/***/ }),

/***/ 137:
/*!**************************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/common/constants.js ***!
  \**************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.DEFAULT_PLAYER_CONFIG = exports.DEFAULT_PUSHER_CONFIG = exports.EVENT = void 0;var EVENT = {
  LOCAL_JOIN: 'LOCAL_JOIN',
  // 本地进房成功
  LOCAL_LEAVE: 'LOCAL_LEAVE',
  // 本地退房
  REMOTE_USER_JOIN: 'REMOTE_USER_JOIN',
  // 远端用户进房
  REMOTE_USER_LEAVE: 'REMOTE_USER_LEAVE',
  // 远端用户退房
  REMOTE_VIDEO_ADD: 'REMOTE_VIDEO_ADD',
  // 远端视频流添加事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_VIDEO_REMOVE: 'REMOTE_VIDEO_REMOVE',
  // 远端视频流移出事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_AUDIO_ADD: 'REMOTE_AUDIO_ADD',
  // 远端音频流添加事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_AUDIO_REMOVE: 'REMOTE_AUDIO_REMOVE',
  // 远端音频流移除事件，当远端用户取消发布音频流后会收到该通知
  REMOTE_STATE_UPDATE: 'REMOTE_STATE_UPDATE',
  // 远端用户播放状态变更
  LOCAL_NET_STATE_UPDATE: 'LOCAL_NET_STATE_UPDATE',
  // 本地推流网络状态变更
  REMOTE_NET_STATE_UPDATE: 'REMOTE_NET_STATE_UPDATE',
  // 远端用户网络状态变更
  LOCAL_AUDIO_VOLUME_UPDATE: 'LOCAL_AUDIO_VOLUME_UPDATE',
  // 本地音量变更
  REMOTE_AUDIO_VOLUME_UPDATE: 'REMOTE_AUDIO_VOLUME_UPDATE',
  // 远端用户音量变更
  VIDEO_FULLSCREEN_UPDATE: 'VIDEO_FULLSCREEN_UPDATE',
  // 调用 player requestFullScreen 或者 exitFullScreen 后触发
  BGM_PLAY_START: 'BGM_PLAY_START',
  // 调用 LivePusherContext.playBGM(Object object)
  BGM_PLAY_FAIL: 'BGM_PLAY_FAIL',
  //
  BGM_PLAY_PROGRESS: 'BGM_PLAY_PROGRESS',
  // bgm 播放时间戳变更
  BGM_PLAY_COMPLETE: 'BGM_PLAY_COMPLETE',
  // bgm 播放结束 或者 调用 LivePusherContext.stopBGM() ?
  ERROR: 'ERROR' // pusher 出现错误
};exports.EVENT = EVENT;

var DEFAULT_PUSHER_CONFIG = {
  url: '',
  mode: 'RTC',
  // RTC：实时通话（trtc sdk） live：直播模式（liteav sdk）
  autopush: false,
  // 自动推送
  enableCamera: false,
  // 是否开启摄像头
  enableMic: false,
  // 是否开启麦克风
  enableAgc: false,
  // 是否开启音频自动增益
  enableAns: false,
  // 是否开启音频噪声抑制
  enableEarMonitor: false,
  // 是否开启耳返（目前只在iOS平台有效）
  enableAutoFocus: true,
  // 是否自动对焦
  enableZoom: false,
  // 是否支持调整焦距
  minBitrate: 200,
  // 最小码率
  maxBitrate: 1000,
  // 最大码率
  videoWidth: 360,
  // 视频宽（若设置了视频宽高就会忽略aspect）
  videoHeight: 640,
  // 视频高（若设置了视频宽高就会忽略aspect）
  beautyLevel: 0,
  // 美颜，取值范围 0-9 ，0 表示关闭
  whitenessLevel: 0,
  // 美白，取值范围 0-9 ，0 表示关闭
  videoOrientation: 'vertical',
  // vertical horizontal
  videoAspect: '9:16',
  // 宽高比，可选值有 3:4,9:16
  frontCamera: 'front',
  // 前置或后置摄像头，可选值：front，back
  enableRemoteMirror: false,
  // 设置推流画面是否镜像，产生的效果会表现在 live-player
  localMirror: 'auto',
  // auto:前置摄像头镜像，后置摄像头不镜像（系统相机的表现）enable:前置摄像头和后置摄像头都镜像 disable: 前置摄像头和后置摄像头都不镜像
  enableBackgroundMute: false,
  // 进入后台时是否静音
  audioQuality: 'high',
  // 高音质(48KHz)或低音质(16KHz)，可选值：high，low
  audioVolumeType: 'voicecall',
  // 声音类型 可选值： media: 媒体音量，voicecall: 通话音量
  audioReverbType: 0,
  // 音频混响类型 0: 关闭 1: KTV 2: 小房间 3:大会堂 4:低沉 5:洪亮 6:金属声 7:磁性
  waitingImage: '',
  // 当微信切到后台时的垫片图片 trtc暂不支持
  waitingImageHash: '' };exports.DEFAULT_PUSHER_CONFIG = DEFAULT_PUSHER_CONFIG;

var DEFAULT_PLAYER_CONFIG = {
  src: '',
  mode: 'RTC',
  autoplay: true,
  // 7.0.9 必须设置为true，否则 Android 有概率调用play()失败
  muteAudio: true,
  // 默认不拉取音频，需要手动订阅
  muteVideo: true,
  // 默认不拉取视频，需要手动订阅
  orientation: 'vertical',
  // 画面方向 vertical horizontal
  objectFit: 'fillCrop',
  // 填充模式，可选值有 contain，fillCrop
  enableBackgroundMute: false,
  // 进入后台时是否静音（已废弃，默认退台静音）
  minCache: 1,
  // 最小缓冲区，单位s（RTC 模式推荐 0.2s）
  maxCache: 2,
  // 最大缓冲区，单位s（RTC 模式推荐 0.8s）
  soundMode: 'speaker',
  // 声音输出方式 ear speaker
  enableRecvMessage: 'false',
  // 是否接收SEI消息
  autoPauseIfNavigate: true,
  // 当跳转到其它小程序页面时，是否自动暂停本页面的实时音视频播放
  autoPauseIfOpenNative: true // 当跳转到其它微信原生页面时，是否自动暂停本页面的实时音视频播放
};exports.DEFAULT_PLAYER_CONFIG = DEFAULT_PLAYER_CONFIG;

/***/ }),

/***/ 138:
/*!**********************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/model/pusher.js ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _constants = __webpack_require__(/*! ../common/constants */ 137);function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Pusher = /*#__PURE__*/function () {
  function Pusher(options) {_classCallCheck(this, Pusher);
    Object.assign(this, _constants.DEFAULT_PUSHER_CONFIG, {
      isVisible: true // 手Q初始化时不能隐藏 puser和player 否则黑屏
    },
    options);
  }
  /**
     * 通过wx.createLivePusherContext 获取<live-pusher> context
     * @param {Object} context 组件上下文
     * @returns {Object} livepusher context
     */_createClass(Pusher, [{ key: "getPusherContext", value: function getPusherContext(


    context) {
      if (!this.pusherContext) {
        this.pusherContext = wx.createLivePusherContext(context);
      }

      return this.pusherContext;
    } }, { key: "reset", value: function reset()

    {
      console.log('Pusher reset', this.pusherContext);

      if (this.pusherContext) {
        console.log('Pusher pusherContext.stop()');
        this.pusherContext.stop();
        this.pusherContext = null;
      }

      Object.assign(this, _constants.DEFAULT_PUSHER_CONFIG, {
        isVisible: true });

    } }]);return Pusher;}();var _default =



Pusher;exports.default = _default;

/***/ }),

/***/ 139:
/*!***************************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/utils/environment.js ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.LIB_VERSION = exports.APP_VERSION = exports.IS_ANDROID = exports.IS_IOS = exports.IS_WX = exports.IS_QQ = exports.IS_TRTC = void 0;var _compareVersion = _interopRequireDefault(__webpack_require__(/*! ./compare-version */ 140));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var env = wx ? wx : qq;

if (!env) {
  console.error('不支持当前小程序环境');
}

var systemInfo = env.getSystemInfoSync();
console.log('SystemInfo', systemInfo);
var isNewVersion;

if (typeof qq !== 'undefined') {
  isNewVersion = true;
} else if (typeof wx !== 'undefined') {
  if ((0, _compareVersion.default)(systemInfo.version, '7.0.8') >= 0 && (0, _compareVersion.default)(systemInfo.SDKVersion, '2.10.0') >= 0) {
    isNewVersion = true;
  } else {
    isNewVersion = false;
  }
}

var IS_TRTC = isNewVersion;exports.IS_TRTC = IS_TRTC;
var IS_QQ = typeof qq !== 'undefined';exports.IS_QQ = IS_QQ;
var IS_WX = typeof wx !== 'undefined';exports.IS_WX = IS_WX;
var IS_IOS = /iOS/i.test(systemInfo.system);exports.IS_IOS = IS_IOS;
var IS_ANDROID = /Android/i.test(systemInfo.system);exports.IS_ANDROID = IS_ANDROID;
var APP_VERSION = systemInfo.version;exports.APP_VERSION = APP_VERSION;
var LIB_VERSION = function () {
  if (systemInfo.SDKBuild) {
    return systemInfo.SDKVersion + '-' + systemInfo.SDKBuild;
  }

  return systemInfo.SDKVersion;
}();exports.LIB_VERSION = LIB_VERSION;
console.log('APP_VERSION:', APP_VERSION, ' LIB_VERSION:', LIB_VERSION, ' is new version:', IS_TRTC);

/***/ }),

/***/ 140:
/*!*******************************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/trtc-room/utils/compare-version.js ***!
  \*******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = compareVersion;function compareVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  var len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }

  while (v2.length < len) {
    v2.push('0');
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    }

    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

/***/ }),

/***/ 148:
/*!***************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/components/uni-icons/icons.js ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  'contact': "\uE100",
  'person': "\uE101",
  'personadd': "\uE102",
  'contact-filled': "\uE130",
  'person-filled': "\uE131",
  'personadd-filled': "\uE132",
  'phone': "\uE200",
  'email': "\uE201",
  'chatbubble': "\uE202",
  'chatboxes': "\uE203",
  'phone-filled': "\uE230",
  'email-filled': "\uE231",
  'chatbubble-filled': "\uE232",
  'chatboxes-filled': "\uE233",
  'weibo': "\uE260",
  'weixin': "\uE261",
  'pengyouquan': "\uE262",
  'chat': "\uE263",
  'qq': "\uE264",
  'videocam': "\uE300",
  'camera': "\uE301",
  'mic': "\uE302",
  'location': "\uE303",
  'mic-filled': "\uE332",
  'speech': "\uE332",
  'location-filled': "\uE333",
  'micoff': "\uE360",
  'image': "\uE363",
  'map': "\uE364",
  'compose': "\uE400",
  'trash': "\uE401",
  'upload': "\uE402",
  'download': "\uE403",
  'close': "\uE404",
  'redo': "\uE405",
  'undo': "\uE406",
  'refresh': "\uE407",
  'star': "\uE408",
  'plus': "\uE409",
  'minus': "\uE410",
  'circle': "\uE411",
  'checkbox': "\uE411",
  'close-filled': "\uE434",
  'clear': "\uE434",
  'refresh-filled': "\uE437",
  'star-filled': "\uE438",
  'plus-filled': "\uE439",
  'minus-filled': "\uE440",
  'circle-filled': "\uE441",
  'checkbox-filled': "\uE442",
  'closeempty': "\uE460",
  'refreshempty': "\uE461",
  'reload': "\uE462",
  'starhalf': "\uE463",
  'spinner': "\uE464",
  'spinner-cycle': "\uE465",
  'search': "\uE466",
  'plusempty': "\uE468",
  'forward': "\uE470",
  'back': "\uE471",
  'left-nav': "\uE471",
  'checkmarkempty': "\uE472",
  'home': "\uE500",
  'navigate': "\uE501",
  'gear': "\uE502",
  'paperplane': "\uE503",
  'info': "\uE504",
  'help': "\uE505",
  'locked': "\uE506",
  'more': "\uE507",
  'flag': "\uE508",
  'home-filled': "\uE530",
  'gear-filled': "\uE532",
  'info-filled': "\uE534",
  'help-filled': "\uE535",
  'more-filled': "\uE537",
  'settings': "\uE560",
  'list': "\uE562",
  'bars': "\uE563",
  'loop': "\uE565",
  'paperclip': "\uE567",
  'eye': "\uE568",
  'arrowup': "\uE580",
  'arrowdown': "\uE581",
  'arrowleft': "\uE582",
  'arrowright': "\uE583",
  'arrowthinup': "\uE584",
  'arrowthindown': "\uE585",
  'arrowthinleft': "\uE586",
  'arrowthinright': "\uE587",
  'pulldown': "\uE588",
  'closefill': "\uE589",
  'sound': "\uE590",
  'scan': "\uE612" };exports.default = _default;

/***/ }),

/***/ 15:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    if (!options.components) {
      options.components = {}
    }
    var hasOwn = Object.prototype.hasOwnProperty
    for (var name in components) {
      if (hasOwn.call(components, name) && !hasOwn.call(options.components, name)) {
        options.components[name] = components[name]
      }
    }
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 16:
/*!**************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/static/js/api.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! ./request.js */ 17));
var _store = _interopRequireDefault(__webpack_require__(/*! ./store.js */ 18));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} //api

//userInfo: 平台用户数据
//wxInfo: 微信用户数据
var _default =
{
  //获取用户信息
  getUserInfo: function getUserInfo() {
    return new Promise(function (resolve, reject) {
      uni.getStorage({
        key: 'wxInfo',
        success: function success(storage) {
          //获取openid
          console.log(storage);
          _request.default.getUserInfo().then(function (ret) {
            if (!ret) {
              ret = {};
            }
            uni.setStorage({
              key: 'userInfo',
              data: ret,
              success: function success() {
                resolve(ret);
              } });

            _store.default.state.userInfo = ret;
            //没有绑定姓名跳转到登录页
            if (!ret.name) {
              uni.navigateTo({
                url: '/pages/login/login' });

            }
          }).catch(function (err) {
            var user = { name: null, phone: '' };
            uni.setStorage({
              key: 'userInfo',
              data: user,
              success: function success() {
                resolve(user);
              } });

            _store.default.state.userInfo = user;
            uni.navigateTo({
              url: '/pages/login/login' });

          });
        },
        fail: function fail(err) {
          console.log(err);
          uni.login({
            success: function success(res) {
              _request.default.getSessionkey({ code: res.code }).then(function (ret) {
                console.log(ret);
                uni.setStorage({
                  key: 'wxInfo',
                  data: ret,
                  success: function success() {
                    resolve(ret);
                  } });

                console.log(_store.default);
                _store.default.state.wxInfo = ret;
                //后台保存openid，接下来用手机号登录完成绑定

                _request.default.obtainUserInfo({ openid: ret.openid });


                _request.default.getUserInfo({ openid: ret.openid }).then(function (ret) {
                  if (!ret) {
                    ret = {};
                  }
                  uni.setStorage({
                    key: 'userInfo',
                    data: ret,
                    success: function success() {
                      resolve(ret);
                    } });

                  _store.default.state.userInfo = ret;
                  //没有绑定姓名跳转到登录页
                  if (!ret.name) {
                    uni.navigateTo({
                      url: '/pages/login/login' });

                  }
                }).catch(function (err) {
                  var user = { name: null, phone: '' };
                  uni.setStorage({
                    key: 'userInfo',
                    data: user,
                    success: function success() {
                      resolve(user);
                    } });

                  _store.default.state.userInfo = user;
                  uni.navigateTo({
                    url: '/pages/login/login' });

                });


                //跳转到登陆页
                // uni.navigateTo({
                // 	url: '/pages/login/login'
                // })
              });
            } });

        } });

    });
  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 17:
/*!******************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/static/js/request.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _store = _interopRequireDefault(__webpack_require__(/*! ./store.js */ 18));
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 9));



var _common = _interopRequireDefault(__webpack_require__(/*! ./common.js */ 19));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}_vue.default.use(_vuex.default);var $store = new _vuex.default.Store(_store.default);

//const remote = "http://miikats.ngrok2.xiaomiqiu.cn";
//const remote = "http://gh.yunyitx.com";

//接口列表，默认post，如果是get方式，需要添加 method:'get'；
var requests = [
//trtc api	
{ name: 'getUserSig', path: 'sdk/getUserSig', server: 'trtcServer' },

/*.........interview api............*/
//获取用户微信信息
{ name: 'obtainUserInfo', path: 'do/obtainUserInfo' },
//获取用户平台数据
{ name: 'getUserInfo', path: 'do/getUserInfo' },
//获取openid和session_key
{ name: 'getSessionkey', path: 'do/getSessionkey' },
//下发动态码
{ name: 'sendRCode', path: 'do/sendRCode' },
//查询房间列表
{ name: 'queryRooms', path: 'do/queryRooms' },
//绑定用户信息1
{ name: 'verifyRCode', path: 'do/verifyRCode' },
//绑定用户信息2
{ name: 'verifyIdCode', path: 'do/verifyIdCode' },
//查询面试官
{ name: 'queryRoomTearcherList', path: 'do/queryRoomTearcherList' },
//查询面试问题
{ name: 'queryParterExams', path: 'do/queryParterExams' },
//查询当前面试者信息
{ name: 'queryParterInfo', path: 'do/queryParterInfo' },
//打分
{ name: 'markScoresAfterEnd', path: 'do/markScoresAfterEnd' },
//查看房间状态
{ name: 'queryRoomStatus', path: 'do/queryRoomStatus' },
//更改房间状态
{ name: 'modifyRoomId', path: 'do/modifyRoomId' },
//通知sendMiniMsg
{ name: 'sendMiniMsg', path: 'do/sendMiniMsg' },
//获取滚动消息/do/getRolling
{ name: 'getRolling', path: 'do/getRolling' },
//modifyName
{ name: 'modifyName', path: 'do/modifyName' },
//面试官打分
{ name: 'markScores', path: 'do/markScores' },
//根据scoreId获取打分数据
{ name: 'getScoreInfoByScoreId', path: 'do/getScoreInfoByScoreId' },
//发送通知
{ name: 'sendMiniMsg', path: 'do/sendMiniMsg' },
//获取/修改面试开始时间
{ name: 'modifyStartTime', path: 'do/modifyStartTime' }];


var $req = {};

requests.forEach(function (v, i) {
  $req[v.name] = function (param) {

    //默认入参openid
    var defaultP = {
      openid: uni.getStorageSync('wxInfo').openid };

    for (var k in param) {defaultP[k] = param[k];}

    console.log(v.name, defaultP);

    return new Promise(function (resolve, reject) {
      var server = v.server ? $store.state[v.server] : $store.state.remote;
      uni.request({
        url: server + v.path,
        method: v.method ? v.method : 'post',
        data: defaultP,
        dataType: "json",
        contentType: v.contentType ? v.contentType : "application/json;charset-UTF-8",
        success: function success(res) {
          if (res.data.respCode == '-1') {
            if (res.data.msg && res.data.msg != '参数信息不能缺 ') _common.default.showToast({ time: 4000, tip: res.data.msg });
            reject(res.data.msg);
          } else
          {
            if (res.data.respData) resolve(res.data.respData);else
            resolve(res.data.ret);
          }
        },
        fail: function fail(res) {
          reject(res);
        } });

    });
  };
});var _default =
$req;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 18:
/*!****************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/static/js/store.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; //公共数据

var store = {
  state: {
    userInfo: uni.getStorageSync('userInfo'),
    wxInfo: uni.getStorageSync('wxInfo'), //后续需要更新，否则初始数据为空
    popup: {}, //默认值记录在common.js中
    dialog: {}, //默认值记录在common.js中
    remote: '',
    qiniu: '',
    trtcServer: '',
    webLink: null //跳转到外部链接的url
  },
  mutations: {
    setWxInfo: function setWxInfo(state, param) {
      param = param ? param : {};
      state.wxInfo = param;
      //以已提交的数据为准
      if (param.SchoolId) {
        state.SchoolId = param.SchoolId;
      }
    },
    setSchoolId: function setSchoolId(state, param) {
      state.SchoolId = param;
    },
    setToast: function setToast(state, param) {
      state.popup = param;
    },
    setDialog: function setDialog(state, param) {
      state.dialog = param;
    },
    setWebLink: function setWebLink(state, param) {
      if (param.indexOf('http') > -1) {
        state.webLink = param;
        uni.navigateTo({
          url: '/pages/common/webLink' });

      } else
      {
        uni.navigateTo({
          url: param });

      }
    } },

  getters: {
    userInfo: function userInfo(state) {return state.userInfo;},
    wxInfo: function wxInfo(state) {return state.wxInfo;},
    SchoolId: function SchoolId(state) {return state.SchoolId;},
    remote: function remote(state) {return state.remote;},
    userType: function userType(state) {return state.userType;},
    popup: function popup(state) {return state.popup;},
    dialog: function dialog(state) {return state.dialog;},
    itemTypes: function itemTypes(state) {return state.itemTypes;},
    citys: function citys(state) {return state.citys;},
    webLink: function webLink(state) {return state.webLink;},
    qiniu: function qiniu(state) {return state.qiniu;} },

  actions: {} };var _default =





store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 19:
/*!*****************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/static/js/common.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _store = _interopRequireDefault(__webpack_require__(/*! ./store.js */ 18));
var _request = _interopRequireDefault(__webpack_require__(/*! ./request.js */ 17));
var _api = _interopRequireDefault(__webpack_require__(/*! ./api.js */ 16));
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 9));
var _moment = _interopRequireDefault(__webpack_require__(/*! ./plugins/moment.js */ 20));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} //公共js方法
_vue.default.use(_vuex.default);
var $store = new _vuex.default.Store(_store.default);var _default =

{
  //如果@click绑定的函数中传入参数item会被解析成this.item(uni-app bug)，而data中又未定义，则为undefined，以下为携带参数的折中方案
  link: function link(url, type) {
    url = url.target ? url.target.id ? url.target.id : url.currentTarget.id : url;
    type = type ? type : 'navigateTo';
    uni[type]({
      url: url });

  },
  //校验用户状态，是否登录，否则跳转登陆页
  checkLogin: function checkLogin(url) {var _this = this;
    var userInfo = uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : false;
    console.log('userInfo', userInfo);
    if (!userInfo || userInfo.groupid == "1") {
      this.showToast({
        tip: '请登录后查看该功能',
        time: 2000 });

      setTimeout(function () {
        _this.link('/pages/login/login');
      }, 2000);
    } else if (url) {
      this.link(url);
    }
  },
  /*表单校验，当存在value2时，可校验两个值是否相同，如密码二次输入*/
  verify: function verify(type, value, value2) {
    switch (type) {
      case 'phone':
        var reg = /^1\d{10}$/;
        return reg.test(value);
      case 'email':
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        return reg.test(value);
      case 'password':
        //校验密码强度
        var level = 0;
        if (value.match(/[a-z]/g)) level++;
        if (value.match(/[0-9]/g)) level++;
        if (new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(value)) level++;
        if (value.length > 6) level++;
        level = level > 4 ? 4 : level;
        return level;
      case 'passwordSame':
        //校验密码是否相同
        if (!value || !value2) return {
          verify: false,
          tip: '密码不能为空' };

        if (value != value2) {
          return {
            verify: false,
            tip: '两次输入的密码不相同' };

        }
        return {
          verify: true,
          tip: '校验通过' };}


  },
  /*提交前校验*/
  /*... 有type时则不需要传入tip ...*/
  postVerify: function postVerify(rule, data) {
    for (var i = 0; i < rule.length; i++) {
      var type = rule[i].type ? rule[i].type : 'normal';
      switch (type) {
        case 'phone':
          var reg = /^1\d{10}$/;
          if (!reg.test(data[rule[i].key]))
          return '请输入正确的手机号码';
        case 'normal':
          if (!data[rule[i].key] || !data[rule[i].key].replace(/(^\s*)|(\s*$)/g, "")) {
            return rule[i].tip;
          }}

    }
    return false;
  },
  showToast: function showToast(param) {
    var d = {
      tip: '正在加载',
      icon: false,
      open: true,
      time: 3000 };

    for (var k in param) {d[k] = param[k];}
    $store.commit('setToast', d);
  },
  hideToast: function hideToast() {
    $store.commit('setToast', {
      open: false });

  },
  showLoading: function showLoading(param) {
    var d = {
      tip: '正在加载',
      icon: true,
      open: true,
      time: 0 };

    for (var k in param) {d[k] = param[k];}
    $store.commit('setToast', d);
  },
  hideLoading: function hideLoading() {
    $store.commit('setToast', {
      open: false });

  },
  showDialog: function showDialog(param) {
    var d = {
      title: '提示',
      open: true,
      cancelText: '取消',
      sureText: '确定',
      tip: 'nothing',
      sure: function sure() {

      },
      cancel: function cancel() {

      } };

    for (var k in param) {d[k] = param[k];}
    $store.commit('setDialog', d);
  },
  hideDialog: function hideDialog() {
    $store.commit('setDialog', {
      open: false });

  },
  //上传图片
  uploadFile: function uploadFile(filePath) {
    return new Promise(function (resolve, reject) {
      uni.compressImage({
        src: filePath,
        quality: 70,
        success: function success(res) {
          console.log(res.tempFilePath);
          filePath = res.tempFilePath;
          uni.getFileSystemManager().readFile({
            filePath: filePath,
            encoding: 'base64', //编码格式
            success: function success(res) {
              var base64 = "data:image/jpeg;base64," + res.data;
              uni.uploadFile({
                url: $store.state.remote + 'do/uploadPic',
                filePath: filePath,
                name: 'file',
                formData: {
                  imgbase64: base64,
                  openid: uni.getStorageSync('wxInfo').openid },

                success: function success(res) {
                  resolve(JSON.parse(res.data).respData);
                } });

            } });

        } });

    });
  },
  updateUserInfo: function updateUserInfo() {
    _api.default.getUserInfo().then(function (ret) {
      uni.setStorage({
        key: 'userInfo',
        data: ret });

      //更新userInfo到vuex
      $store.commit('setUserInfo', ret);
    });
  },
  //获取schoolId
  setSchoolId: function setSchoolId(option) {






    if ($store.state.wxInfo.SchoolId) {
      $store.commit('setSchoolId', $store.state.wxInfo.SchoolId);
    } else if (option.SchoolId) {
      $store.commit('setSchoolId', parseInt(option.SchoolId));
    }
  },
  getUrlParams: function getUrlParams(url) {
    if (!url) var url = location.href.replace('#/', '');
    var paramObj = {},
    paramArray = [];
    if (url.indexOf("?") < 0) {
      console.log("url no param");
      return false;
    }
    for (var j = 1; j < url.split("?").length; j++) {
      var paramPart = url.split("?")[j];
      var paramName;
      if (paramPart.indexOf("&") < 0) {
        paramName = paramPart.split("=")[0];
        paramArray.push(paramName);
        paramObj[paramName] = paramPart.split("=")[1];
      } else {
        for (var i = 0; i < paramPart.split("&").length; i++) {
          paramName = paramPart.split("&")[i].split("=")[0];
          paramArray.push(paramName);
          paramObj[paramName] = paramPart.split("&")[i].split("=")[1];
        }
      }
    }
    return paramObj;
  },
  //给url添加参数
  setLinkParams: function setLinkParams(link, params) {
    var pre = link + '?';
    for (var k in params) {
      pre += k + '=' + params[k] + '&';
    }
    return pre.substr(0, pre.length - 1);
  },
  getStatus: function getStatus(code) {
    var s = [{
      code: 1,
      status: '排队中' },
    {
      code: 2,
      status: '排队中' },
    {
      code: 3,
      status: '面试中' },
    {
      code: 4,
      status: '结束面试' },
    {
      code: 5,
      status: '面试失败 ' }];

  },
  testid: function testid(id) {
    // 1 "验证通过!", 0 //校验不通过
    var format =
    /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if (!format.test(id)) {
      return {
        'status': 0,
        'msg': '身份证号码不合规' };

    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6, 4), //身份证年
    month = id.substr(10, 2), //身份证月
    date = id.substr(12, 2), //身份证日
    time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
    now_time = Date.parse(new Date()), //当前时间戳
    dates = new Date(year, month, 0).getDate(); //身份证当月天数
    if (time > now_time || date > dates) {
      return {
        'status': 0,
        'msg': '出生日期不合规' };

    }
    //校验码判断
    var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
    var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for (var k = 0; k < 17; k++) {
      sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
      return {
        'status': 0,
        'msg': '身份证校验码不合规' };

    }
    return {
      'status': 1,
      'msg': '校验通过' };

  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2020 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    !vm._$fallback && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    !vm._$fallback && initProvide(vm); // resolve provide after data/props
    !vm._$fallback && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  !vm._$fallback && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 20:
/*!*************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/static/js/plugins/moment.js ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function (a, b) {
   true ? module.exports = b() : undefined;
}(this, function () {
  "use strict";

  function a() {
    return Hc.apply(null, arguments);
  }

  function b(a) {
    Hc = a;
  }

  function c(a) {
    return "[object Array]" === Object.prototype.toString.call(a);
  }

  function d(a) {
    return a instanceof Date || "[object Date]" === Object.prototype.toString.call(a);
  }

  function e(a, b) {
    var c,d = [];
    for (c = 0; c < a.length; ++c) {d.push(b(a[c], c));}
    return d;
  }

  function f(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }

  function g(a, b) {
    for (var c in b) {f(b, c) && (a[c] = b[c]);}
    return f(b, "toString") && (a.toString = b.toString), f(b, "valueOf") && (a.valueOf = b.valueOf), a;
  }

  function h(a, b, c, d) {
    return Ca(a, b, c, d, !0).utc();
  }

  function i() {
    return {
      empty: !1,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: !1,
      invalidMonth: null,
      invalidFormat: !1,
      userInvalidated: !1,
      iso: !1 };

  }

  function j(a) {
    return null == a._pf && (a._pf = i()), a._pf;
  }

  function k(a) {
    if (null == a._isValid) {
      var b = j(a);
      a._isValid = !(isNaN(a._d.getTime()) || !(b.overflow < 0) || b.empty || b.invalidMonth || b.invalidWeekday || b.nullInput || b.invalidFormat || b.userInvalidated), a._strict && (a._isValid = a._isValid && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour);
    }
    return a._isValid;
  }

  function l(a) {
    var b = h(NaN);
    return null != a ? g(j(b), a) : j(b).userInvalidated = !0, b;
  }

  function m(a, b) {
    var c, d, e;
    if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = j(b)), "undefined" != typeof b._locale && (a._locale = b._locale), Jc.length > 0)
    for (c in Jc) {d = Jc[c], e = b[d], "undefined" != typeof e && (a[d] = e);}
    return a;
  }

  function n(b) {
    m(this, b), this._d = new Date(null != b._d ? b._d.getTime() : NaN), Kc === !1 && (Kc = !0, a.updateOffset(this), Kc = !1);
  }

  function o(a) {
    return a instanceof n || null != a && null != a._isAMomentObject;
  }

  function p(a) {
    return 0 > a ? Math.ceil(a) : Math.floor(a);
  }

  function q(a) {
    var b = +a,
    c = 0;
    return 0 !== b && isFinite(b) && (c = p(b)), c;
  }

  function r(a, b, c) {
    var d,e = Math.min(a.length, b.length),
    f = Math.abs(a.length - b.length),
    g = 0;
    for (d = 0; e > d; d++) {(c && a[d] !== b[d] || !c && q(a[d]) !== q(b[d])) && g++;}
    return g + f;
  }

  function s() {}

  function t(a) {
    return a ? a.toLowerCase().replace("_", "-") : a;
  }

  function u(a) {
    for (var b, c, d, e, f = 0; f < a.length;) {
      for (e = t(a[f]).split("-"), b = e.length, c = t(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
        if (d = v(e.slice(0, b).join("-"))) return d;
        if (c && c.length >= b && r(e, c, !0) >= b - 1) break;
        b--;
      }
      f++;
    }
    return null;
  }

  function v(a) {
    var b = null;
    if (!Lc[a] && "undefined" != typeof module && module && module.exports) try {
      b = Ic._abbr, !(function webpackMissingModule() { var e = new Error("Cannot find module 'undefined'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), w(b);
    } catch (c) {}
    return Lc[a];
  }

  function w(a, b) {
    var c;
    return a && (c = "undefined" == typeof b ? y(a) : x(a, b), c && (Ic = c)), Ic._abbr;
  }

  function x(a, b) {
    return null !== b ? (b.abbr = a, Lc[a] = Lc[a] || new s(), Lc[a].set(b), w(a), Lc[a]) : (delete Lc[a], null);
  }

  function y(a) {
    var b;
    if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return Ic;
    if (!c(a)) {
      if (b = v(a)) return b;
      a = [a];
    }
    return u(a);
  }

  function z(a, b) {
    var c = a.toLowerCase();
    Mc[c] = Mc[c + "s"] = Mc[b] = a;
  }

  function A(a) {
    return "string" == typeof a ? Mc[a] || Mc[a.toLowerCase()] : void 0;
  }

  function B(a) {
    var b,c,d = {};
    for (c in a) {f(a, c) && (b = A(c), b && (d[b] = a[c]));}
    return d;
  }

  function C(b, c) {
    return function (d) {
      return null != d ? (E(this, b, d), a.updateOffset(this, c), this) : D(this, b);
    };
  }

  function D(a, b) {
    return a._d["get" + (a._isUTC ? "UTC" : "") + b]();
  }

  function E(a, b, c) {
    return a._d["set" + (a._isUTC ? "UTC" : "") + b](c);
  }

  function F(a, b) {
    var c;
    if ("object" == typeof a)
    for (c in a) {this.set(c, a[c]);} else
    if (a = A(a), "function" == typeof this[a]) return this[a](b);
    return this;
  }

  function G(a, b, c) {
    var d = "" + Math.abs(a),
    e = b - d.length,
    f = a >= 0;
    return (f ? c ? "+" : "" : "-") + Math.pow(10, Math.max(0, e)).toString().substr(1) + d;
  }

  function H(a, b, c, d) {
    var e = d;
    "string" == typeof d && (e = function e() {
      return this[d]();
    }), a && (Qc[a] = e), b && (Qc[b[0]] = function () {
      return G(e.apply(this, arguments), b[1], b[2]);
    }), c && (Qc[c] = function () {
      return this.localeData().ordinal(e.apply(this, arguments), a);
    });
  }

  function I(a) {
    return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "");
  }

  function J(a) {
    var b,c,d = a.match(Nc);
    for (b = 0, c = d.length; c > b; b++) {Qc[d[b]] ? d[b] = Qc[d[b]] : d[b] = I(d[b]);}
    return function (e) {
      var f = "";
      for (b = 0; c > b; b++) {f += d[b] instanceof Function ? d[b].call(e, a) : d[b];}
      return f;
    };
  }

  function K(a, b) {
    return a.isValid() ? (b = L(b, a.localeData()), Pc[b] = Pc[b] || J(b), Pc[b](a)) : a.localeData().invalidDate();
  }

  function L(a, b) {
    function c(a) {
      return b.longDateFormat(a) || a;
    }
    var d = 5;
    for (Oc.lastIndex = 0; d >= 0 && Oc.test(a);) {a = a.replace(Oc, c), Oc.lastIndex = 0, d -= 1;}
    return a;
  }

  function M(a) {
    return "function" == typeof a && "[object Function]" === Object.prototype.toString.call(a);
  }

  function N(a, b, c) {
    dd[a] = M(b) ? b : function (a) {
      return a && c ? c : b;
    };
  }

  function O(a, b) {
    return f(dd, a) ? dd[a](b._strict, b._locale) : new RegExp(P(a));
  }

  function P(a) {
    return a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) {
      return b || c || d || e;
    }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  function Q(a, b) {
    var c,d = b;
    for ("string" == typeof a && (a = [a]), "number" == typeof b && (d = function d(a, c) {
      c[b] = q(a);
    }), c = 0; c < a.length; c++) {ed[a[c]] = d;}
  }

  function R(a, b) {
    Q(a, function (a, c, d, e) {
      d._w = d._w || {}, b(a, d._w, d, e);
    });
  }

  function S(a, b, c) {
    null != b && f(ed, a) && ed[a](b, c._a, c, a);
  }

  function T(a, b) {
    return new Date(Date.UTC(a, b + 1, 0)).getUTCDate();
  }

  function U(a) {
    return this._months[a.month()];
  }

  function V(a) {
    return this._monthsShort[a.month()];
  }

  function W(a, b, c) {
    var d, e, f;
    for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
      if (e = h([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a)) return d;
      if (c && "MMM" === b && this._shortMonthsParse[d].test(a)) return d;
      if (!c && this._monthsParse[d].test(a)) return d;
    }
  }

  function X(a, b) {
    var c;
    return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), T(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a);
  }

  function Y(b) {
    return null != b ? (X(this, b), a.updateOffset(this, !0), this) : D(this, "Month");
  }

  function Z() {
    return T(this.year(), this.month());
  }

  function $(a) {
    var b,c = a._a;
    return c && -2 === j(a).overflow && (b = c[gd] < 0 || c[gd] > 11 ? gd : c[hd] < 1 || c[hd] > T(c[fd], c[gd]) ? hd : c[id] < 0 || c[id] > 24 || 24 === c[id] && (0 !== c[jd] || 0 !== c[kd] || 0 !== c[ld]) ? id : c[jd] < 0 || c[jd] > 59 ? jd : c[kd] < 0 || c[kd] > 59 ? kd : c[ld] < 0 || c[ld] > 999 ? ld : -1, j(a)._overflowDayOfYear && (fd > b || b > hd) && (b = hd), j(a).overflow = b), a;
  }

  function _(b) {
    a.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + b);
  }

  function aa(a, b) {
    var c = !0;
    return g(function () {
      return c && (_(a + "\n" + new Error().stack), c = !1), b.apply(this, arguments);
    }, b);
  }

  function ba(a, b) {
    od[a] || (_(b), od[a] = !0);
  }

  function ca(a) {
    var b,c,d = a._i,
    e = pd.exec(d);
    if (e) {
      for (j(a).iso = !0, b = 0, c = qd.length; c > b; b++) {
        if (qd[b][1].exec(d)) {
          a._f = qd[b][0];
          break;
        }}
      for (b = 0, c = rd.length; c > b; b++) {
        if (rd[b][1].exec(d)) {
          a._f += (e[6] || " ") + rd[b][0];
          break;
        }}
      d.match(ad) && (a._f += "Z"), va(a);
    } else a._isValid = !1;
  }

  function da(b) {
    var c = sd.exec(b._i);
    return null !== c ? void (b._d = new Date(+c[1])) : (ca(b), void (b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b))));
  }

  function ea(a, b, c, d, e, f, g) {
    var h = new Date(a, b, c, d, e, f, g);
    return 1970 > a && h.setFullYear(a), h;
  }

  function fa(a) {
    var b = new Date(Date.UTC.apply(null, arguments));
    return 1970 > a && b.setUTCFullYear(a), b;
  }

  function ga(a) {
    return ha(a) ? 366 : 365;
  }

  function ha(a) {
    return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0;
  }

  function ia() {
    return ha(this.year());
  }

  function ja(a, b, c) {
    var d,e = c - b,
    f = c - a.day();
    return f > e && (f -= 7), e - 7 > f && (f += 7), d = Da(a).add(f, "d"), {
      week: Math.ceil(d.dayOfYear() / 7),
      year: d.year() };

  }

  function ka(a) {
    return ja(a, this._week.dow, this._week.doy).week;
  }

  function la() {
    return this._week.dow;
  }

  function ma() {
    return this._week.doy;
  }

  function na(a) {
    var b = this.localeData().week(this);
    return null == a ? b : this.add(7 * (a - b), "d");
  }

  function oa(a) {
    var b = ja(this, 1, 4).week;
    return null == a ? b : this.add(7 * (a - b), "d");
  }

  function pa(a, b, c, d, e) {
    var f,g = 6 + e - d,
    h = fa(a, 0, 1 + g),
    i = h.getUTCDay();
    return e > i && (i += 7), c = null != c ? 1 * c : e, f = 1 + g + 7 * (b - 1) - i + c, {
      year: f > 0 ? a : a - 1,
      dayOfYear: f > 0 ? f : ga(a - 1) + f };

  }

  function qa(a) {
    var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
    return null == a ? b : this.add(a - b, "d");
  }

  function ra(a, b, c) {
    return null != a ? a : null != b ? b : c;
  }

  function sa(a) {
    var b = new Date();
    return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()];
  }

  function ta(a) {
    var b,c,d,e,f = [];
    if (!a._d) {
      for (d = sa(a), a._w && null == a._a[hd] && null == a._a[gd] && ua(a), a._dayOfYear && (e = ra(a._a[fd], d[fd]), a._dayOfYear > ga(e) && (j(a)._overflowDayOfYear = !0), c = fa(e, 0, a._dayOfYear), a._a[gd] = c.getUTCMonth(), a._a[hd] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b) {a._a[b] = f[b] = d[b];}
      for (; 7 > b; b++) {a._a[b] = f[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];}
      24 === a._a[id] && 0 === a._a[jd] && 0 === a._a[kd] && 0 === a._a[ld] && (a._nextDay = !0, a._a[id] = 0), a._d = (a._useUTC ? fa : ea).apply(null, f), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[id] = 24);
    }
  }

  function ua(a) {
    var b, c, d, e, f, g, h;
    b = a._w, null != b.GG || null != b.W || null != b.E ? (f = 1, g = 4, c = ra(b.GG, a._a[fd], ja(Da(), 1, 4).year), d = ra(b.W, 1), e = ra(b.E, 1)) : (f = a._locale._week.dow, g = a._locale._week.doy, c = ra(b.gg, a._a[fd], ja(Da(), f, g).year), d = ra(b.w, 1), null != b.d ? (e = b.d, f > e && ++d) : e = null != b.e ? b.e + f : f), h = pa(c, d, e, g, f), a._a[fd] = h.year, a._dayOfYear = h.dayOfYear;
  }

  function va(b) {
    if (b._f === a.ISO_8601) return void ca(b);
    b._a = [], j(b).empty = !0;
    var c,d,e,f,g,h = "" + b._i,
    i = h.length,
    k = 0;
    for (e = L(b._f, b._locale).match(Nc) || [], c = 0; c < e.length; c++) {f = e[c], d = (h.match(O(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && j(b).unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), k += d.length), Qc[f] ? (d ? j(b).empty = !1 : j(b).unusedTokens.push(f), S(f, d, b)) : b._strict && !d && j(b).unusedTokens.push(f);}
    j(b).charsLeftOver = i - k, h.length > 0 && j(b).unusedInput.push(h), j(b).bigHour === !0 && b._a[id] <= 12 && b._a[id] > 0 && (j(b).bigHour = void 0), b._a[id] = wa(b._locale, b._a[id], b._meridiem), ta(b), $(b);
  }

  function wa(a, b, c) {
    var d;
    return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b;
  }

  function xa(a) {
    var b, c, d, e, f;
    if (0 === a._f.length) return j(a).invalidFormat = !0, void (a._d = new Date(NaN));
    for (e = 0; e < a._f.length; e++) {f = 0, b = m({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._f = a._f[e], va(b), k(b) && (f += j(b).charsLeftOver, f += 10 * j(b).unusedTokens.length, j(b).score = f, (null == d || d > f) && (d = f, c = b));}
    g(a, c || b);
  }

  function ya(a) {
    if (!a._d) {
      var b = B(a._i);
      a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], ta(a);
    }
  }

  function za(a) {
    var b = new n($(Aa(a)));
    return b._nextDay && (b.add(1, "d"), b._nextDay = void 0), b;
  }

  function Aa(a) {
    var b = a._i,
    e = a._f;
    return a._locale = a._locale || y(a._l), null === b || void 0 === e && "" === b ? l({
      nullInput: !0 }) : (
    "string" == typeof b && (a._i = b = a._locale.preparse(b)), o(b) ? new n($(b)) : (c(e) ? xa(a) : e ? va(a) : d(b) ? a._d = b : Ba(a), a));
  }

  function Ba(b) {
    var f = b._i;
    void 0 === f ? b._d = new Date() : d(f) ? b._d = new Date(+f) : "string" == typeof f ? da(b) : c(f) ? (b._a = e(f.slice(0), function (a) {
      return parseInt(a, 10);
    }), ta(b)) : "object" == typeof f ? ya(b) : "number" == typeof f ? b._d = new Date(f) : a.createFromInputFallback(b);
  }

  function Ca(a, b, c, d, e) {
    var f = {};
    return "boolean" == typeof c && (d = c, c = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = e, f._l = c, f._i = a, f._f = b, f._strict = d, za(f);
  }

  function Da(a, b, c, d) {
    return Ca(a, b, c, d, !1);
  }

  function Ea(a, b) {
    var d, e;
    if (1 === b.length && c(b[0]) && (b = b[0]), !b.length) return Da();
    for (d = b[0], e = 1; e < b.length; ++e) {(!b[e].isValid() || b[e][a](d)) && (d = b[e]);}
    return d;
  }

  function Fa() {
    var a = [].slice.call(arguments, 0);
    return Ea("isBefore", a);
  }

  function Ga() {
    var a = [].slice.call(arguments, 0);
    return Ea("isAfter", a);
  }

  function Ha(a) {
    var b = B(a),
    c = b.year || 0,
    d = b.quarter || 0,
    e = b.month || 0,
    f = b.week || 0,
    g = b.day || 0,
    h = b.hour || 0,
    i = b.minute || 0,
    j = b.second || 0,
    k = b.millisecond || 0;
    this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = y(), this._bubble();
  }

  function Ia(a) {
    return a instanceof Ha;
  }

  function Ja(a, b) {
    H(a, 0, 0, function () {
      var a = this.utcOffset(),
      c = "+";
      return 0 > a && (a = -a, c = "-"), c + G(~~(a / 60), 2) + b + G(~~a % 60, 2);
    });
  }

  function Ka(a) {
    var b = (a || "").match(ad) || [],
    c = b[b.length - 1] || [],
    d = (c + "").match(xd) || ["-", 0, 0],
    e = +(60 * d[1]) + q(d[2]);
    return "+" === d[0] ? e : -e;
  }

  function La(b, c) {
    var e, f;
    return c._isUTC ? (e = c.clone(), f = (o(b) || d(b) ? +b : +Da(b)) - +e, e._d.setTime(+e._d + f), a.updateOffset(e, !1), e) : Da(b).local();
  }

  function Ma(a) {
    return 15 * -Math.round(a._d.getTimezoneOffset() / 15);
  }

  function Na(b, c) {
    var d,e = this._offset || 0;
    return null != b ? ("string" == typeof b && (b = Ka(b)), Math.abs(b) < 16 && (b = 60 * b), !this._isUTC && c && (d = Ma(this)), this._offset = b, this._isUTC = !0, null != d && this.add(d, "m"), e !== b && (!c || this._changeInProgress ? bb(this, Ya(b - e, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, a.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? e : Ma(this);
  }

  function Oa(a, b) {
    return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset();
  }

  function Pa(a) {
    return this.utcOffset(0, a);
  }

  function Qa(a) {
    return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(Ma(this), "m")), this;
  }

  function Ra() {
    return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Ka(this._i)), this;
  }

  function Sa(a) {
    return a = a ? Da(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0;
  }

  function Ta() {
    return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
  }

  function Ua() {
    if ("undefined" != typeof this._isDSTShifted) return this._isDSTShifted;
    var a = {};
    if (m(a, this), a = Aa(a), a._a) {
      var b = a._isUTC ? h(a._a) : Da(a._a);
      this._isDSTShifted = this.isValid() && r(a._a, b.toArray()) > 0;
    } else this._isDSTShifted = !1;
    return this._isDSTShifted;
  }

  function Va() {
    return !this._isUTC;
  }

  function Wa() {
    return this._isUTC;
  }

  function Xa() {
    return this._isUTC && 0 === this._offset;
  }

  function Ya(a, b) {
    var c,d,e,g = a,
    h = null;
    return Ia(a) ? g = {
      ms: a._milliseconds,
      d: a._days,
      M: a._months } :
    "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = yd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
      y: 0,
      d: q(h[hd]) * c,
      h: q(h[id]) * c,
      m: q(h[jd]) * c,
      s: q(h[kd]) * c,
      ms: q(h[ld]) * c }) :
    (h = zd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
      y: Za(h[2], c),
      M: Za(h[3], c),
      d: Za(h[4], c),
      h: Za(h[5], c),
      m: Za(h[6], c),
      s: Za(h[7], c),
      w: Za(h[8], c) }) :
    null == g ? g = {} : "object" == typeof g && ("from" in g || "to" in g) && (e = _a(Da(g.from), Da(g.to)), g = {}, g.ms = e.milliseconds, g.M = e.months), d = new Ha(g), Ia(a) && f(a, "_locale") && (d._locale = a._locale), d;
  }

  function Za(a, b) {
    var c = a && parseFloat(a.replace(",", "."));
    return (isNaN(c) ? 0 : c) * b;
  }

  function $a(a, b) {
    var c = {
      milliseconds: 0,
      months: 0 };

    return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c;
  }

  function _a(a, b) {
    var c;
    return b = La(b, a), a.isBefore(b) ? c = $a(a, b) : (c = $a(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c;
  }

  function ab(a, b) {
    return function (c, d) {
      var e, f;
      return null === d || isNaN(+d) || (ba(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = Ya(c, d), bb(this, e, a), this;
    };
  }

  function bb(b, c, d, e) {
    var f = c._milliseconds,
    g = c._days,
    h = c._months;
    e = null == e ? !0 : e, f && b._d.setTime(+b._d + f * d), g && E(b, "Date", D(b, "Date") + g * d), h && X(b, D(b, "Month") + h * d), e && a.updateOffset(b, g || h);
  }

  function cb(a, b) {
    var c = a || Da(),
    d = La(c, this).startOf("day"),
    e = this.diff(d, "days", !0),
    f = -6 > e ? "sameElse" : -1 > e ? "lastWeek" : 0 > e ? "lastDay" : 1 > e ? "sameDay" : 2 > e ? "nextDay" : 7 > e ? "nextWeek" : "sameElse";
    return this.format(b && b[f] || this.localeData().calendar(f, this, Da(c)));
  }

  function db() {
    return new n(this);
  }

  function eb(a, b) {
    var c;
    return b = A("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Da(a), +this > +a) : (c = o(a) ? +a : +Da(a), c < +this.clone().startOf(b));
  }

  function fb(a, b) {
    var c;
    return b = A("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Da(a), +a > +this) : (c = o(a) ? +a : +Da(a), +this.clone().endOf(b) < c);
  }

  function gb(a, b, c) {
    return this.isAfter(a, c) && this.isBefore(b, c);
  }

  function hb(a, b) {
    var c;
    return b = A(b || "millisecond"), "millisecond" === b ? (a = o(a) ? a : Da(a), +this === +a) : (c = +Da(a), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b));
  }

  function ib(a, b, c) {
    var d,e,f = La(a, this),
    g = 6e4 * (f.utcOffset() - this.utcOffset());
    return b = A(b), "year" === b || "month" === b || "quarter" === b ? (e = jb(this, f), "quarter" === b ? e /= 3 : "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : p(e);
  }

  function jb(a, b) {
    var c,d,e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
    f = a.clone().add(e, "months");
    return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d);
  }

  function kb() {
    return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  }

  function lb() {
    var a = this.clone().utc();
    return 0 < a.year() && a.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : K(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : K(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  }

  function mb(b) {
    var c = K(this, b || a.defaultFormat);
    return this.localeData().postformat(c);
  }

  function nb(a, b) {
    return this.isValid() ? Ya({
      to: this,
      from: a }).
    locale(this.locale()).humanize(!b) : this.localeData().invalidDate();
  }

  function ob(a) {
    return this.from(Da(), a);
  }

  function pb(a, b) {
    return this.isValid() ? Ya({
      from: this,
      to: a }).
    locale(this.locale()).humanize(!b) : this.localeData().invalidDate();
  }

  function qb(a) {
    return this.to(Da(), a);
  }

  function rb(a) {
    var b;
    return void 0 === a ? this._locale._abbr : (b = y(a), null != b && (this._locale = b), this);
  }

  function sb() {
    return this._locale;
  }

  function tb(a) {
    switch (a = A(a)) {
      case "year":
        this.month(0);
      case "quarter":
      case "month":
        this.date(1);
      case "week":
      case "isoWeek":
      case "day":
        this.hours(0);
      case "hour":
        this.minutes(0);
      case "minute":
        this.seconds(0);
      case "second":
        this.milliseconds(0);}

    return "week" === a && this.weekday(0), "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this;
  }

  function ub(a) {
    return a = A(a), void 0 === a || "millisecond" === a ? this : this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms");
  }

  function vb() {
    return +this._d - 6e4 * (this._offset || 0);
  }

  function wb() {
    return Math.floor(+this / 1e3);
  }

  function xb() {
    return this._offset ? new Date(+this) : this._d;
  }

  function yb() {
    var a = this;
    return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()];
  }

  function zb() {
    var a = this;
    return {
      years: a.year(),
      months: a.month(),
      date: a.date(),
      hours: a.hours(),
      minutes: a.minutes(),
      seconds: a.seconds(),
      milliseconds: a.milliseconds() };

  }

  function Ab() {
    return k(this);
  }

  function Bb() {
    return g({}, j(this));
  }

  function Cb() {
    return j(this).overflow;
  }

  function Db(a, b) {
    H(0, [a, a.length], 0, b);
  }

  function Eb(a, b, c) {
    return ja(Da([a, 11, 31 + b - c]), b, c).week;
  }

  function Fb(a) {
    var b = ja(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
    return null == a ? b : this.add(a - b, "y");
  }

  function Gb(a) {
    var b = ja(this, 1, 4).year;
    return null == a ? b : this.add(a - b, "y");
  }

  function Hb() {
    return Eb(this.year(), 1, 4);
  }

  function Ib() {
    var a = this.localeData()._week;
    return Eb(this.year(), a.dow, a.doy);
  }

  function Jb(a) {
    return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3);
  }

  function Kb(a, b) {
    return "string" != typeof a ? a : isNaN(a) ? (a = b.weekdaysParse(a), "number" == typeof a ? a : null) : parseInt(a, 10);
  }

  function Lb(a) {
    return this._weekdays[a.day()];
  }

  function Mb(a) {
    return this._weekdaysShort[a.day()];
  }

  function Nb(a) {
    return this._weekdaysMin[a.day()];
  }

  function Ob(a) {
    var b, c, d;
    for (this._weekdaysParse = this._weekdaysParse || [], b = 0; 7 > b; b++) {
      if (this._weekdaysParse[b] || (c = Da([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a)) return b;}
  }

  function Pb(a) {
    var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    return null != a ? (a = Kb(a, this.localeData()), this.add(a - b, "d")) : b;
  }

  function Qb(a) {
    var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return null == a ? b : this.add(a - b, "d");
  }

  function Rb(a) {
    return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7);
  }

  function Sb(a, b) {
    H(a, 0, 0, function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), b);
    });
  }

  function Tb(a, b) {
    return b._meridiemParse;
  }

  function Ub(a) {
    return "p" === (a + "").toLowerCase().charAt(0);
  }

  function Vb(a, b, c) {
    return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM";
  }

  function Wb(a, b) {
    b[ld] = q(1e3 * ("0." + a));
  }

  function Xb() {
    return this._isUTC ? "UTC" : "";
  }

  function Yb() {
    return this._isUTC ? "Coordinated Universal Time" : "";
  }

  function Zb(a) {
    return Da(1e3 * a);
  }

  function $b() {
    return Da.apply(null, arguments).parseZone();
  }

  function _b(a, b, c) {
    var d = this._calendar[a];
    return "function" == typeof d ? d.call(b, c) : d;
  }

  function ac(a) {
    var b = this._longDateFormat[a],
    c = this._longDateFormat[a.toUpperCase()];
    return b || !c ? b : (this._longDateFormat[a] = c.replace(/MMMM|MM|DD|dddd/g, function (a) {
      return a.slice(1);
    }), this._longDateFormat[a]);
  }

  function bc() {
    return this._invalidDate;
  }

  function cc(a) {
    return this._ordinal.replace("%d", a);
  }

  function dc(a) {
    return a;
  }

  function ec(a, b, c, d) {
    var e = this._relativeTime[c];
    return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a);
  }

  function fc(a, b) {
    var c = this._relativeTime[a > 0 ? "future" : "past"];
    return "function" == typeof c ? c(b) : c.replace(/%s/i, b);
  }

  function gc(a) {
    var b, c;
    for (c in a) {b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b;}
    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source);
  }

  function hc(a, b, c, d) {
    var e = y(),
    f = h().set(d, b);
    return e[c](f, a);
  }

  function ic(a, b, c, d, e) {
    if ("number" == typeof a && (b = a, a = void 0), a = a || "", null != b) return hc(a, b, c, e);
    var f,g = [];
    for (f = 0; d > f; f++) {g[f] = hc(a, f, c, e);}
    return g;
  }

  function jc(a, b) {
    return ic(a, b, "months", 12, "month");
  }

  function kc(a, b) {
    return ic(a, b, "monthsShort", 12, "month");
  }

  function lc(a, b) {
    return ic(a, b, "weekdays", 7, "day");
  }

  function mc(a, b) {
    return ic(a, b, "weekdaysShort", 7, "day");
  }

  function nc(a, b) {
    return ic(a, b, "weekdaysMin", 7, "day");
  }

  function oc() {
    var a = this._data;
    return this._milliseconds = Wd(this._milliseconds), this._days = Wd(this._days), this._months = Wd(this._months), a.milliseconds = Wd(a.milliseconds), a.seconds = Wd(a.seconds), a.minutes = Wd(a.minutes), a.hours = Wd(a.hours), a.months = Wd(a.months), a.years = Wd(a.years), this;
  }

  function pc(a, b, c, d) {
    var e = Ya(b, c);
    return a._milliseconds += d * e._milliseconds, a._days += d * e._days, a._months += d * e._months, a._bubble();
  }

  function qc(a, b) {
    return pc(this, a, b, 1);
  }

  function rc(a, b) {
    return pc(this, a, b, -1);
  }

  function sc(a) {
    return 0 > a ? Math.floor(a) : Math.ceil(a);
  }

  function tc() {
    var a,b,c,d,e,f = this._milliseconds,
    g = this._days,
    h = this._months,
    i = this._data;
    return f >= 0 && g >= 0 && h >= 0 || 0 >= f && 0 >= g && 0 >= h || (f += 864e5 * sc(vc(h) + g), g = 0, h = 0), i.milliseconds = f % 1e3, a = p(f / 1e3), i.seconds = a % 60, b = p(a / 60), i.minutes = b % 60, c = p(b / 60), i.hours = c % 24, g += p(c / 24), e = p(uc(g)), h += e, g -= sc(vc(e)), d = p(h / 12), h %= 12, i.days = g, i.months = h, i.years = d, this;
  }

  function uc(a) {
    return 4800 * a / 146097;
  }

  function vc(a) {
    return 146097 * a / 4800;
  }

  function wc(a) {
    var b,c,d = this._milliseconds;
    if (a = A(a), "month" === a || "year" === a) return b = this._days + d / 864e5, c = this._months + uc(b), "month" === a ? c : c / 12;
    switch (b = this._days + Math.round(vc(this._months)), a) {
      case "week":
        return b / 7 + d / 6048e5;
      case "day":
        return b + d / 864e5;
      case "hour":
        return 24 * b + d / 36e5;
      case "minute":
        return 1440 * b + d / 6e4;
      case "second":
        return 86400 * b + d / 1e3;
      case "millisecond":
        return Math.floor(864e5 * b) + d;
      default:
        throw new Error("Unknown unit " + a);}

  }

  function xc() {
    return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * q(this._months / 12);
  }

  function yc(a) {
    return function () {
      return this.as(a);
    };
  }

  function zc(a) {
    return a = A(a), this[a + "s"]();
  }

  function Ac(a) {
    return function () {
      return this._data[a];
    };
  }

  function Bc() {
    return p(this.days() / 7);
  }

  function Cc(a, b, c, d, e) {
    return e.relativeTime(b || 1, !!c, a, d);
  }

  function Dc(a, b, c) {
    var d = Ya(a).abs(),
    e = ke(d.as("s")),
    f = ke(d.as("m")),
    g = ke(d.as("h")),
    h = ke(d.as("d")),
    i = ke(d.as("M")),
    j = ke(d.as("y")),
    k = e < le.s && ["s", e] || 1 === f && ["m"] || f < le.m && ["mm", f] || 1 === g && ["h"] || g < le.h && ["hh", g] || 1 === h && ["d"] || h < le.d && ["dd", h] || 1 === i && ["M"] || i < le.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
    return k[2] = b, k[3] = +a > 0, k[4] = c, Cc.apply(null, k);
  }

  function Ec(a, b) {
    return void 0 === le[a] ? !1 : void 0 === b ? le[a] : (le[a] = b, !0);
  }

  function Fc(a) {
    var b = this.localeData(),
    c = Dc(this, !a, b);
    return a && (c = b.pastFuture(+this, c)), b.postformat(c);
  }

  function Gc() {
    var a,b,c,d = me(this._milliseconds) / 1e3,
    e = me(this._days),
    f = me(this._months);
    a = p(d / 60), b = p(a / 60), d %= 60, a %= 60, c = p(f / 12), f %= 12;
    var g = c,
    h = f,
    i = e,
    j = b,
    k = a,
    l = d,
    m = this.asSeconds();
    return m ? (0 > m ? "-" : "") + "P" + (g ? g + "Y" : "") + (h ? h + "M" : "") + (i ? i + "D" : "") + (j || k || l ? "T" : "") + (j ? j + "H" : "") + (k ? k + "M" : "") + (l ? l + "S" : "") : "P0D";
  }
  var Hc,Ic,Jc = a.momentProperties = [],
  Kc = !1,
  Lc = {},
  Mc = {},
  Nc = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
  Oc = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
  Pc = {},
  Qc = {},
  Rc = /\d/,
  Sc = /\d\d/,
  Tc = /\d{3}/,
  Uc = /\d{4}/,
  Vc = /[+-]?\d{6}/,
  Wc = /\d\d?/,
  Xc = /\d{1,3}/,
  Yc = /\d{1,4}/,
  Zc = /[+-]?\d{1,6}/,
  $c = /\d+/,
  _c = /[+-]?\d+/,
  ad = /Z|[+-]\d\d:?\d\d/gi,
  bd = /[+-]?\d+(\.\d{1,3})?/,
  cd = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
  dd = {},
  ed = {},
  fd = 0,
  gd = 1,
  hd = 2,
  id = 3,
  jd = 4,
  kd = 5,
  ld = 6;
  H("M", ["MM", 2], "Mo", function () {
    return this.month() + 1;
  }), H("MMM", 0, 0, function (a) {
    return this.localeData().monthsShort(this, a);
  }), H("MMMM", 0, 0, function (a) {
    return this.localeData().months(this, a);
  }), z("month", "M"), N("M", Wc), N("MM", Wc, Sc), N("MMM", cd), N("MMMM", cd), Q(["M", "MM"], function (a, b) {
    b[gd] = q(a) - 1;
  }), Q(["MMM", "MMMM"], function (a, b, c, d) {
    var e = c._locale.monthsParse(a, d, c._strict);
    null != e ? b[gd] = e : j(c).invalidMonth = a;
  });
  var md = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
  nd = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
  od = {};
  a.suppressDeprecationWarnings = !1;
  var pd = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
  qd = [
  ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
  ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
  ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
  ["GGGG-[W]WW", /\d{4}-W\d{2}/],
  ["YYYY-DDD", /\d{4}-\d{3}/]],

  rd = [
  ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/],
  ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
  ["HH:mm", /(T| )\d\d:\d\d/],
  ["HH", /(T| )\d\d/]],

  sd = /^\/?Date\((\-?\d+)/i;
  a.createFromInputFallback = aa("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (a) {
    a._d = new Date(a._i + (a._useUTC ? " UTC" : ""));
  }), H(0, ["YY", 2], 0, function () {
    return this.year() % 100;
  }), H(0, ["YYYY", 4], 0, "year"), H(0, ["YYYYY", 5], 0, "year"), H(0, ["YYYYYY", 6, !0], 0, "year"), z("year", "y"), N("Y", _c), N("YY", Wc, Sc), N("YYYY", Yc, Uc), N("YYYYY", Zc, Vc), N("YYYYYY", Zc, Vc), Q(["YYYYY", "YYYYYY"], fd), Q("YYYY", function (b, c) {
    c[fd] = 2 === b.length ? a.parseTwoDigitYear(b) : q(b);
  }), Q("YY", function (b, c) {
    c[fd] = a.parseTwoDigitYear(b);
  }), a.parseTwoDigitYear = function (a) {
    return q(a) + (q(a) > 68 ? 1900 : 2e3);
  };
  var td = C("FullYear", !1);
  H("w", ["ww", 2], "wo", "week"), H("W", ["WW", 2], "Wo", "isoWeek"), z("week", "w"), z("isoWeek", "W"), N("w", Wc), N("ww", Wc, Sc), N("W", Wc), N("WW", Wc, Sc), R(["w", "ww", "W", "WW"], function (a, b, c, d) {
    b[d.substr(0, 1)] = q(a);
  });
  var ud = {
    dow: 0,
    doy: 6 };

  H("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), z("dayOfYear", "DDD"), N("DDD", Xc), N("DDDD", Tc), Q(["DDD", "DDDD"], function (a, b, c) {
    c._dayOfYear = q(a);
  }), a.ISO_8601 = function () {};
  var vd = aa("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function () {
    var a = Da.apply(null, arguments);
    return this > a ? this : a;
  }),
  wd = aa("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function () {
    var a = Da.apply(null, arguments);
    return a > this ? this : a;
  });
  Ja("Z", ":"), Ja("ZZ", ""), N("Z", ad), N("ZZ", ad), Q(["Z", "ZZ"], function (a, b, c) {
    c._useUTC = !0, c._tzm = Ka(a);
  });
  var xd = /([\+\-]|\d\d)/gi;
  a.updateOffset = function () {};
  var yd = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
  zd = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
  Ya.fn = Ha.prototype;
  var Ad = ab(1, "add"),
  Bd = ab(-1, "subtract");
  a.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
  var Cd = aa("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (a) {
    return void 0 === a ? this.localeData() : this.locale(a);
  });
  H(0, ["gg", 2], 0, function () {
    return this.weekYear() % 100;
  }), H(0, ["GG", 2], 0, function () {
    return this.isoWeekYear() % 100;
  }), Db("gggg", "weekYear"), Db("ggggg", "weekYear"), Db("GGGG", "isoWeekYear"), Db("GGGGG", "isoWeekYear"), z("weekYear", "gg"), z("isoWeekYear", "GG"), N("G", _c), N("g", _c), N("GG", Wc, Sc), N("gg", Wc, Sc), N("GGGG", Yc, Uc), N("gggg", Yc, Uc), N("GGGGG", Zc, Vc), N("ggggg", Zc, Vc), R(["gggg", "ggggg", "GGGG", "GGGGG"], function (a, b, c, d) {
    b[d.substr(0, 2)] = q(a);
  }), R(["gg", "GG"], function (b, c, d, e) {
    c[e] = a.parseTwoDigitYear(b);
  }), H("Q", 0, 0, "quarter"), z("quarter", "Q"), N("Q", Rc), Q("Q", function (a, b) {
    b[gd] = 3 * (q(a) - 1);
  }), H("D", ["DD", 2], "Do", "date"), z("date", "D"), N("D", Wc), N("DD", Wc, Sc), N("Do", function (a, b) {
    return a ? b._ordinalParse : b._ordinalParseLenient;
  }), Q(["D", "DD"], hd), Q("Do", function (a, b) {
    b[hd] = q(a.match(Wc)[0], 10);
  });
  var Dd = C("Date", !0);
  H("d", 0, "do", "day"), H("dd", 0, 0, function (a) {
    return this.localeData().weekdaysMin(this, a);
  }), H("ddd", 0, 0, function (a) {
    return this.localeData().weekdaysShort(this, a);
  }), H("dddd", 0, 0, function (a) {
    return this.localeData().weekdays(this, a);
  }), H("e", 0, 0, "weekday"), H("E", 0, 0, "isoWeekday"), z("day", "d"), z("weekday", "e"), z("isoWeekday", "E"), N("d", Wc), N("e", Wc), N("E", Wc), N("dd", cd), N("ddd", cd), N("dddd", cd), R(["dd", "ddd", "dddd"], function (a, b, c) {
    var d = c._locale.weekdaysParse(a);
    null != d ? b.d = d : j(c).invalidWeekday = a;
  }), R(["d", "e", "E"], function (a, b, c, d) {
    b[d] = q(a);
  });
  var Ed = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
  Fd = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
  Gd = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
  H("H", ["HH", 2], 0, "hour"), H("h", ["hh", 2], 0, function () {
    return this.hours() % 12 || 12;
  }), Sb("a", !0), Sb("A", !1), z("hour", "h"), N("a", Tb), N("A", Tb), N("H", Wc), N("h", Wc), N("HH", Wc, Sc), N("hh", Wc, Sc), Q(["H", "HH"], id), Q(["a", "A"], function (a, b, c) {
    c._isPm = c._locale.isPM(a), c._meridiem = a;
  }), Q(["h", "hh"], function (a, b, c) {
    b[id] = q(a), j(c).bigHour = !0;
  });
  var Hd = /[ap]\.?m?\.?/i,
  Id = C("Hours", !0);
  H("m", ["mm", 2], 0, "minute"), z("minute", "m"), N("m", Wc), N("mm", Wc, Sc), Q(["m", "mm"], jd);
  var Jd = C("Minutes", !1);
  H("s", ["ss", 2], 0, "second"), z("second", "s"), N("s", Wc), N("ss", Wc, Sc), Q(["s", "ss"], kd);
  var Kd = C("Seconds", !1);
  H("S", 0, 0, function () {
    return ~~(this.millisecond() / 100);
  }), H(0, ["SS", 2], 0, function () {
    return ~~(this.millisecond() / 10);
  }), H(0, ["SSS", 3], 0, "millisecond"), H(0, ["SSSS", 4], 0, function () {
    return 10 * this.millisecond();
  }), H(0, ["SSSSS", 5], 0, function () {
    return 100 * this.millisecond();
  }), H(0, ["SSSSSS", 6], 0, function () {
    return 1e3 * this.millisecond();
  }), H(0, ["SSSSSSS", 7], 0, function () {
    return 1e4 * this.millisecond();
  }), H(0, ["SSSSSSSS", 8], 0, function () {
    return 1e5 * this.millisecond();
  }), H(0, ["SSSSSSSSS", 9], 0, function () {
    return 1e6 * this.millisecond();
  }), z("millisecond", "ms"), N("S", Xc, Rc), N("SS", Xc, Sc), N("SSS", Xc, Tc);
  var Ld;
  for (Ld = "SSSS"; Ld.length <= 9; Ld += "S") {N(Ld, $c);}
  for (Ld = "S"; Ld.length <= 9; Ld += "S") {Q(Ld, Wb);}
  var Md = C("Milliseconds", !1);
  H("z", 0, 0, "zoneAbbr"), H("zz", 0, 0, "zoneName");
  var Nd = n.prototype;
  Nd.add = Ad, Nd.calendar = cb, Nd.clone = db, Nd.diff = ib, Nd.endOf = ub, Nd.format = mb, Nd.from = nb, Nd.fromNow = ob, Nd.to = pb, Nd.toNow = qb, Nd.get = F, Nd.invalidAt = Cb, Nd.isAfter = eb, Nd.isBefore = fb, Nd.isBetween = gb, Nd.isSame = hb, Nd.isValid = Ab, Nd.lang = Cd, Nd.locale = rb, Nd.localeData = sb, Nd.max = wd, Nd.min = vd, Nd.parsingFlags = Bb, Nd.set = F, Nd.startOf = tb, Nd.subtract = Bd, Nd.toArray = yb, Nd.toObject = zb, Nd.toDate = xb, Nd.toISOString = lb, Nd.toJSON = lb, Nd.toString = kb, Nd.unix = wb, Nd.valueOf = vb, Nd.year = td, Nd.isLeapYear = ia, Nd.weekYear = Fb, Nd.isoWeekYear = Gb, Nd.quarter = Nd.quarters = Jb, Nd.month = Y, Nd.daysInMonth = Z, Nd.week = Nd.weeks = na, Nd.isoWeek = Nd.isoWeeks = oa, Nd.weeksInYear = Ib, Nd.isoWeeksInYear = Hb, Nd.date = Dd, Nd.day = Nd.days = Pb, Nd.weekday = Qb, Nd.isoWeekday = Rb, Nd.dayOfYear = qa, Nd.hour = Nd.hours = Id, Nd.minute = Nd.minutes = Jd, Nd.second = Nd.seconds = Kd,
  Nd.millisecond = Nd.milliseconds = Md, Nd.utcOffset = Na, Nd.utc = Pa, Nd.local = Qa, Nd.parseZone = Ra, Nd.hasAlignedHourOffset = Sa, Nd.isDST = Ta, Nd.isDSTShifted = Ua, Nd.isLocal = Va, Nd.isUtcOffset = Wa, Nd.isUtc = Xa, Nd.isUTC = Xa, Nd.zoneAbbr = Xb, Nd.zoneName = Yb, Nd.dates = aa("dates accessor is deprecated. Use date instead.", Dd), Nd.months = aa("months accessor is deprecated. Use month instead", Y), Nd.years = aa("years accessor is deprecated. Use year instead", td), Nd.zone = aa("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", Oa);
  var Od = Nd,
  Pd = {
    sameDay: "[Today at] LT",
    nextDay: "[Tomorrow at] LT",
    nextWeek: "dddd [at] LT",
    lastDay: "[Yesterday at] LT",
    lastWeek: "[Last] dddd [at] LT",
    sameElse: "L" },

  Qd = {
    LTS: "h:mm:ss A",
    LT: "h:mm A",
    L: "MM/DD/YYYY",
    LL: "MMMM D, YYYY",
    LLL: "MMMM D, YYYY h:mm A",
    LLLL: "dddd, MMMM D, YYYY h:mm A" },

  Rd = "Invalid date",
  Sd = "%d",
  Td = /\d{1,2}/,
  Ud = {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years" },

  Vd = s.prototype;
  Vd._calendar = Pd, Vd.calendar = _b, Vd._longDateFormat = Qd, Vd.longDateFormat = ac, Vd._invalidDate = Rd, Vd.invalidDate = bc, Vd._ordinal = Sd, Vd.ordinal = cc, Vd._ordinalParse = Td, Vd.preparse = dc, Vd.postformat = dc, Vd._relativeTime = Ud, Vd.relativeTime = ec, Vd.pastFuture = fc, Vd.set = gc, Vd.months = U, Vd._months = md, Vd.monthsShort = V, Vd._monthsShort = nd, Vd.monthsParse = W, Vd.week = ka, Vd._week = ud, Vd.firstDayOfYear = ma, Vd.firstDayOfWeek = la, Vd.weekdays = Lb, Vd._weekdays = Ed, Vd.weekdaysMin = Nb, Vd._weekdaysMin = Gd, Vd.weekdaysShort = Mb, Vd._weekdaysShort = Fd, Vd.weekdaysParse = Ob, Vd.isPM = Ub, Vd._meridiemParse = Hd, Vd.meridiem = Vb, w("en", {
    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function ordinal(a) {
      var b = a % 10,
      c = 1 === q(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
      return a + c;
    } }),
  a.lang = aa("moment.lang is deprecated. Use moment.locale instead.", w), a.langData = aa("moment.langData is deprecated. Use moment.localeData instead.", y);
  var Wd = Math.abs,
  Xd = yc("ms"),
  Yd = yc("s"),
  Zd = yc("m"),
  $d = yc("h"),
  _d = yc("d"),
  ae = yc("w"),
  be = yc("M"),
  ce = yc("y"),
  de = Ac("milliseconds"),
  ee = Ac("seconds"),
  fe = Ac("minutes"),
  ge = Ac("hours"),
  he = Ac("days"),
  ie = Ac("months"),
  je = Ac("years"),
  ke = Math.round,
  le = {
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    M: 11 },

  me = Math.abs,
  ne = Ha.prototype;
  ne.abs = oc, ne.add = qc, ne.subtract = rc, ne.as = wc, ne.asMilliseconds = Xd, ne.asSeconds = Yd, ne.asMinutes = Zd, ne.asHours = $d, ne.asDays = _d, ne.asWeeks = ae, ne.asMonths = be, ne.asYears = ce, ne.valueOf = xc, ne._bubble = tc, ne.get = zc, ne.milliseconds = de, ne.seconds = ee, ne.minutes = fe, ne.hours = ge, ne.days = he, ne.weeks = Bc, ne.months = ie, ne.years = je, ne.humanize = Fc, ne.toISOString = Gc, ne.toString = Gc, ne.toJSON = Gc, ne.locale = rb, ne.localeData = sb, ne.toIsoString = aa("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Gc), ne.lang = Cd, H("X", 0, 0, "unix"), H("x", 0, 0, "valueOf"), N("x", _c), N("X", bd), Q("X", function (a, b, c) {
    c._d = new Date(1e3 * parseFloat(a, 10));
  }), Q("x", function (a, b, c) {
    c._d = new Date(q(a));
  }), a.version = "2.10.6", b(Da), a.fn = Od, a.min = Fa, a.max = Ga, a.utc = h, a.unix = Zb, a.months = jc, a.isDate = d, a.locale = w, a.invalid = l, a.duration = Ya, a.isMoment = o, a.weekdays = lc, a.parseZone = $b, a.localeData = y, a.isDuration = Ia, a.monthsShort = kc, a.weekdaysMin = nc, a.defineLocale = x, a.weekdaysShort = mc, a.normalizeUnits = A, a.relativeTimeThreshold = Ec;
  var oe = a;

  oe.defineLocale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
      LT: 'Ah点mm分',
      LTS: 'Ah点m分s秒',
      L: 'YYYY-MM-DD',
      LL: 'YYYY年MMMD日',
      LLL: 'YYYY年MMMD日Ah点mm分',
      LLLL: 'YYYY年MMMD日ddddAh点mm分',
      l: 'YYYY-MM-DD',
      ll: 'YYYY年MMMD日',
      lll: 'YYYY年MMMD日Ah点mm分',
      llll: 'YYYY年MMMD日ddddAh点mm分' },

    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function meridiemHour(hour, meridiem) {
      if (hour === 12) {
        hour = 0;
      }
      if (meridiem === '凌晨' || meridiem === '早上' ||
      meridiem === '上午') {
        return hour;
      } else if (meridiem === '下午' || meridiem === '晚上') {
        return hour + 12;
      } else {
        // '中午'
        return hour >= 11 ? hour : hour + 12;
      }
    },
    meridiem: function meridiem(hour, minute, isLower) {
      var hm = hour * 100 + minute;
      if (hm < 600) {
        return '凌晨';
      } else if (hm < 900) {
        return '早上';
      } else if (hm < 1130) {
        return '上午';
      } else if (hm < 1230) {
        return '中午';
      } else if (hm < 1800) {
        return '下午';
      } else {
        return '晚上';
      }
    },
    calendar: {
      sameDay: function sameDay() {
        return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
      },
      nextDay: function nextDay() {
        return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
      },
      lastDay: function lastDay() {
        return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
      },
      nextWeek: function nextWeek() {
        var startOfWeek, prefix;
        startOfWeek = moment().startOf('week');
        prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
        return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
      },
      lastWeek: function lastWeek() {
        var startOfWeek, prefix;
        startOfWeek = moment().startOf('week');
        prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
        return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
      },
      sameElse: 'LL' },

    ordinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function ordinal(number, period) {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日';
        case 'M':
          return number + '月';
        case 'w':
        case 'W':
          return number + '周';
        default:
          return number;}

    },
    relativeTime: {
      future: '%s内',
      past: '%s前',
      s: '几秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年' },

    week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4 // The week that contains Jan 4th is the first week of the year.
    } });


  return oe;
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../../../../../software/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/module.js */ 21)(module)))

/***/ }),

/***/ 21:
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/*!********************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/pages.json ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _createSuper(Derived) {return function () {var Super = _getPrototypeOf(Derived),result;if (_isNativeReflectConstruct()) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);var _super = _createSuper(Stat);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _super.call(this);
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-26920200424005","_inBundle":false,"_integrity":"sha512-FT8Z/C5xSmIxooqhV1v69jTkxATPz+FsRQIFOrbdlWekjGkrE73jfrdNMWm7gL5u41ALPJTVArxN1Re9by1bjQ==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-26920200424005.tgz","_shasum":"47f4375095eda3089cf4678b4b96fc656a7ab623","_spec":"@dcloudio/uni-stat@next","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"94494d54ed23e2dcf9ab8e3245b48b770b4e98a9","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-26920200424005"};

/***/ }),

/***/ 68:
/*!**************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/debug/GenerateTestUserSig.js ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _libGenerateTestUsersigEs = _interopRequireDefault(__webpack_require__(/*! ./lib-generate-test-usersig-es.min */ 69));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
/**
                                                                                                                                                                                                                  * 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
                                                                                                                                                                                                                  *
                                                                                                                                                                                                                  * 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav ) 创建应用，即可看到 SDKAppId，
                                                                                                                                                                                                                  * 它是腾讯云用于区分客户的唯一标识。
                                                                                                                                                                                                                  */

var SDKAPPID = 1400341456;
/**
                            * 签名过期时间，建议不要设置的过短
                            * <p>
                            * 时间单位：秒
                            * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
                            */

var EXPIRETIME = 604800;
/**
                          * 计算签名用的加密密钥，获取步骤如下：
                          *
                          * step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav )，如果还没有应用就创建一个，
                          * step2. 单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
                          * step3. 点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
                          *
                          * 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
                          * 文档：https://cloud.tencent.com/document/product/647/17275#Server
                          */

var SECRETKEY = 'b56e9198ab93b97d10bd22d8a2a96f75f008c21a160b582c6fffa8d4a6cc8039';
/*
                                                                                     * Module:   GenerateTestUserSig
                                                                                     *
                                                                                     * Function: 用于生成测试用的 UserSig，UserSig 是腾讯云为其云服务设计的一种安全保护签名。
                                                                                     *           其计算方法是对 SDKAppID、UserID 和 EXPIRETIME 进行加密，加密算法为 HMAC-SHA256。
                                                                                     *
                                                                                     * Attention: 请不要将如下代码发布到您的线上正式版本的 App 中，原因如下：
                                                                                     *
                                                                                     *            本文件中的代码虽然能够正确计算出 UserSig，但仅适合快速调通 SDK 的基本功能，不适合线上产品，
                                                                                     *            这是因为客户端代码中的 SECRETKEY 很容易被反编译逆向破解，尤其是 Web 端的代码被破解的难度几乎为零。
                                                                                     *            一旦您的密钥泄露，攻击者就可以计算出正确的 UserSig 来盗用您的腾讯云流量。
                                                                                     *
                                                                                     *            正确的做法是将 UserSig 的计算代码和加密密钥放在您的业务服务器上，然后由 App 按需向您的服务器获取实时算出的 UserSig。
                                                                                     *            由于破解服务器的成本要高于破解客户端 App，所以服务器计算的方案能够更好地保护您的加密密钥。
                                                                                     *
                                                                                     * Reference：https://cloud.tencent.com/document/product/647/17275#Server
                                                                                     */

function genTestUserSig(userID) {
  var generator = new _libGenerateTestUsersigEs.default(SDKAPPID, SECRETKEY, EXPIRETIME);
  var userSig = generator.genTestUserSig(userID);
  return {
    sdkAppID: SDKAPPID,
    userSig: userSig };

}

function setData(obj, callback) {
  var that = this;
  var keys = [];
  var val, data;
  Object.keys(obj).forEach(function (key) {
    keys = key.split('.');
    val = obj[key];
    data = that.$data;
    keys.forEach(function (key2, index) {
      if (index + 1 == keys.length) {
        that.$set(data, key2, val);
      } else {
        if (!data[key2]) {
          that.$set(data, key2, {});
        }
      }
      data = data[key2];
    });
  });
  setTimeout(function () {
    callback && callback();
  }, 500);

}

module.exports = {
  genTestUserSig: genTestUserSig,
  setData: setData };

/***/ }),

/***/ 69:
/*!***************************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/debug/lib-generate-test-usersig-es.min.js ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*eslint-disable*/
var e = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {},
t = [],
r = [],
n = "undefined" != typeof Uint8Array ? Uint8Array : Array,
i = !1;

function o() {
  i = !0;

  for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = e.length; n < o; ++n) {t[n] = e[n], r[e.charCodeAt(n)] = n;}

  r["-".charCodeAt(0)] = 62, r["_".charCodeAt(0)] = 63;
}

function a(e, r, n) {
  for (var i, o, a = [], s = r; s < n; s += 3) {i = (e[s] << 16) + (e[s + 1] << 8) + e[s + 2], a.push(t[(o = i) >> 18 & 63] + t[o >> 12 & 63] + t[o >> 6 & 63] + t[63 & o]);}

  return a.join("");
}

function s(e) {
  var r;
  i || o();

  for (var n = e.length, s = n % 3, h = "", l = [], f = 0, c = n - s; f < c; f += 16383) {l.push(a(e, f, f + 16383 > c ? c : f + 16383));}

  return 1 === s ? (r = e[n - 1], h += t[r >> 2], h += t[r << 4 & 63], h += "==") : 2 === s && (r = (e[n - 2] << 8) + e[n - 1], h += t[r >> 10], h += t[r >> 4 & 63], h += t[r << 2 & 63], h += "="), l.push(h), l.join("");
}

function h(e, t, r, n, i) {
  var o,
  a,
  s = 8 * i - n - 1,
  h = (1 << s) - 1,
  l = h >> 1,
  f = -7,
  c = r ? i - 1 : 0,
  u = r ? -1 : 1,
  d = e[t + c];

  for (c += u, o = d & (1 << -f) - 1, d >>= -f, f += s; f > 0; o = 256 * o + e[t + c], c += u, f -= 8) {;}

  for (a = o & (1 << -f) - 1, o >>= -f, f += n; f > 0; a = 256 * a + e[t + c], c += u, f -= 8) {;}

  if (0 === o) o = 1 - l;else {
    if (o === h) return a ? NaN : 1 / 0 * (d ? -1 : 1);
    a += Math.pow(2, n), o -= l;
  }
  return (d ? -1 : 1) * a * Math.pow(2, o - n);
}

function l(e, t, r, n, i, o) {
  var a,
  s,
  h,
  l = 8 * o - i - 1,
  f = (1 << l) - 1,
  c = f >> 1,
  u = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
  d = n ? 0 : o - 1,
  p = n ? 1 : -1,
  _ = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;

  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = f) : (a = Math.floor(Math.log(t) / Math.LN2), t * (h = Math.pow(2, -a)) < 1 && (a--, h *= 2), (t += a + c >= 1 ? u / h : u * Math.pow(2, 1 - c)) * h >= 2 && (a++, h /= 2), a + c >= f ? (s = 0, a = f) : a + c >= 1 ? (s = (t * h - 1) * Math.pow(2, i), a += c) : (s = t * Math.pow(2, c - 1) * Math.pow(2, i), a = 0)); i >= 8; e[r + d] = 255 & s, d += p, s /= 256, i -= 8) {;}

  for (a = a << i | s, l += i; l > 0; e[r + d] = 255 & a, d += p, a /= 256, l -= 8) {;}

  e[r + d - p] |= 128 * _;
}

var f = {}.toString,
c = Array.isArray || function (e) {
  return "[object Array]" == f.call(e);
};

function u() {
  return p.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}

function d(e, t) {
  if (u() < t) throw new RangeError("Invalid typed array length");
  return p.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = p.prototype : (null === e && (e = new p(t)), e.length = t), e;
}

function p(e, t, r) {
  if (!(p.TYPED_ARRAY_SUPPORT || this instanceof p)) return new p(e, t, r);

  if ("number" == typeof e) {
    if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
    return v(this, e);
  }

  return _(this, e, t, r);
}

function _(e, t, r, n) {
  if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
  return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, r, n) {
    if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
    if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
    t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n);
    p.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = p.prototype : e = w(e, t);
    return e;
  }(e, t, r, n) : "string" == typeof t ? function (e, t, r) {
    "string" == typeof r && "" !== r || (r = "utf8");
    if (!p.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
    var n = 0 | m(t, r),
    i = (e = d(e, n)).write(t, r);
    i !== n && (e = e.slice(0, i));
    return e;
  }(e, t, r) : function (e, t) {
    if (y(t)) {
      var r = 0 | b(t.length);
      return 0 === (e = d(e, r)).length ? e : (t.copy(e, 0, 0, r), e);
    }

    if (t) {
      if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (n = t.length) != n ? d(e, 0) : w(e, t);
      if ("Buffer" === t.type && c(t.data)) return w(e, t.data);
    }

    var n;
    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
  }(e, t);
}

function g(e) {
  if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
  if (e < 0) throw new RangeError('"size" argument must not be negative');
}

function v(e, t) {
  if (g(t), e = d(e, t < 0 ? 0 : 0 | b(t)), !p.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) {e[r] = 0;}
  return e;
}

function w(e, t) {
  var r = t.length < 0 ? 0 : 0 | b(t.length);
  e = d(e, r);

  for (var n = 0; n < r; n += 1) {e[n] = 255 & t[n];}

  return e;
}

function b(e) {
  if (e >= u()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + u().toString(16) + " bytes");
  return 0 | e;
}

function y(e) {
  return !(null == e || !e._isBuffer);
}

function m(e, t) {
  if (y(e)) return e.length;
  if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
  "string" != typeof e && (e = "" + e);
  var r = e.length;
  if (0 === r) return 0;

  for (var n = !1;;) {switch (t) {
      case "ascii":
      case "latin1":
      case "binary":
        return r;

      case "utf8":
      case "utf-8":
      case void 0:
        return q(e).length;

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return 2 * r;

      case "hex":
        return r >>> 1;

      case "base64":
        return V(e).length;

      default:
        if (n) return q(e).length;
        t = ("" + t).toLowerCase(), n = !0;}}

}

function k(e, t, r) {
  var n = !1;
  if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
  if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
  if ((r >>>= 0) <= (t >>>= 0)) return "";

  for (e || (e = "utf8");;) {switch (e) {
      case "hex":
        return O(this, t, r);

      case "utf8":
      case "utf-8":
        return C(this, t, r);

      case "ascii":
        return I(this, t, r);

      case "latin1":
      case "binary":
        return P(this, t, r);

      case "base64":
        return M(this, t, r);

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return U(this, t, r);

      default:
        if (n) throw new TypeError("Unknown encoding: " + e);
        e = (e + "").toLowerCase(), n = !0;}}

}

function E(e, t, r) {
  var n = e[t];
  e[t] = e[r], e[r] = n;
}

function S(e, t, r, n, i) {
  if (0 === e.length) return -1;

  if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
    if (i) return -1;
    r = e.length - 1;
  } else if (r < 0) {
    if (!i) return -1;
    r = 0;
  }

  if ("string" == typeof t && (t = p.from(t, n)), y(t)) return 0 === t.length ? -1 : x(e, t, r, n, i);
  if ("number" == typeof t) return t &= 255, p.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : x(e, [t], r, n, i);
  throw new TypeError("val must be string, number or Buffer");
}

function x(e, t, r, n, i) {
  var o,
  a = 1,
  s = e.length,
  h = t.length;

  if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
    if (e.length < 2 || t.length < 2) return -1;
    a = 2, s /= 2, h /= 2, r /= 2;
  }

  function l(e, t) {
    return 1 === a ? e[t] : e.readUInt16BE(t * a);
  }

  if (i) {
    var f = -1;

    for (o = r; o < s; o++) {if (l(e, o) === l(t, -1 === f ? 0 : o - f)) {
        if (-1 === f && (f = o), o - f + 1 === h) return f * a;
      } else -1 !== f && (o -= o - f), f = -1;}
  } else for (r + h > s && (r = s - h), o = r; o >= 0; o--) {
    for (var c = !0, u = 0; u < h; u++) {if (l(e, o + u) !== l(t, u)) {
        c = !1;
        break;
      }}

    if (c) return o;
  }

  return -1;
}

function R(e, t, r, n) {
  r = Number(r) || 0;
  var i = e.length - r;
  n ? (n = Number(n)) > i && (n = i) : n = i;
  var o = t.length;
  if (o % 2 != 0) throw new TypeError("Invalid hex string");
  n > o / 2 && (n = o / 2);

  for (var a = 0; a < n; ++a) {
    var s = parseInt(t.substr(2 * a, 2), 16);
    if (isNaN(s)) return a;
    e[r + a] = s;
  }

  return a;
}

function A(e, t, r, n) {
  return G(q(t, e.length - r), e, r, n);
}

function B(e, t, r, n) {
  return G(function (e) {
    for (var t = [], r = 0; r < e.length; ++r) {t.push(255 & e.charCodeAt(r));}

    return t;
  }(t), e, r, n);
}

function z(e, t, r, n) {
  return B(e, t, r, n);
}

function L(e, t, r, n) {
  return G(V(t), e, r, n);
}

function T(e, t, r, n) {
  return G(function (e, t) {
    for (var r, n, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {r = e.charCodeAt(a), n = r >> 8, i = r % 256, o.push(i), o.push(n);}

    return o;
  }(t, e.length - r), e, r, n);
}

function M(e, t, r) {
  return 0 === t && r === e.length ? s(e) : s(e.slice(t, r));
}

function C(e, t, r) {
  r = Math.min(e.length, r);

  for (var n = [], i = t; i < r;) {
    var o,
    a,
    s,
    h,
    l = e[i],
    f = null,
    c = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
    if (i + c <= r) switch (c) {
      case 1:
        l < 128 && (f = l);
        break;

      case 2:
        128 == (192 & (o = e[i + 1])) && (h = (31 & l) << 6 | 63 & o) > 127 && (f = h);
        break;

      case 3:
        o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && (h = (15 & l) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (h < 55296 || h > 57343) && (f = h);
        break;

      case 4:
        o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (h = (15 & l) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && h < 1114112 && (f = h);}

    null === f ? (f = 65533, c = 1) : f > 65535 && (f -= 65536, n.push(f >>> 10 & 1023 | 55296), f = 56320 | 1023 & f), n.push(f), i += c;
  }

  return function (e) {
    var t = e.length;
    if (t <= D) return String.fromCharCode.apply(String, e);
    var r = "",
    n = 0;

    for (; n < t;) {r += String.fromCharCode.apply(String, e.slice(n, n += D));}

    return r;
  }(n);
}

p.TYPED_ARRAY_SUPPORT = void 0 === e.TYPED_ARRAY_SUPPORT || e.TYPED_ARRAY_SUPPORT, p.poolSize = 8192, p._augment = function (e) {
  return e.__proto__ = p.prototype, e;
}, p.from = function (e, t, r) {
  return _(null, e, t, r);
}, p.TYPED_ARRAY_SUPPORT && (p.prototype.__proto__ = Uint8Array.prototype, p.__proto__ = Uint8Array), p.alloc = function (e, t, r) {
  return function (e, t, r, n) {
    return g(t), t <= 0 ? d(e, t) : void 0 !== r ? "string" == typeof n ? d(e, t).fill(r, n) : d(e, t).fill(r) : d(e, t);
  }(null, e, t, r);
}, p.allocUnsafe = function (e) {
  return v(null, e);
}, p.allocUnsafeSlow = function (e) {
  return v(null, e);
}, p.isBuffer = $, p.compare = function (e, t) {
  if (!y(e) || !y(t)) throw new TypeError("Arguments must be Buffers");
  if (e === t) return 0;

  for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i) {if (e[i] !== t[i]) {
      r = e[i], n = t[i];
      break;
    }}

  return r < n ? -1 : n < r ? 1 : 0;
}, p.isEncoding = function (e) {
  switch (String(e).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return !0;

    default:
      return !1;}

}, p.concat = function (e, t) {
  if (!c(e)) throw new TypeError('"list" argument must be an Array of Buffers');
  if (0 === e.length) return p.alloc(0);
  var r;
  if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) {t += e[r].length;}
  var n = p.allocUnsafe(t),
  i = 0;

  for (r = 0; r < e.length; ++r) {
    var o = e[r];
    if (!y(o)) throw new TypeError('"list" argument must be an Array of Buffers');
    o.copy(n, i), i += o.length;
  }

  return n;
}, p.byteLength = m, p.prototype._isBuffer = !0, p.prototype.swap16 = function () {
  var e = this.length;
  if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");

  for (var t = 0; t < e; t += 2) {E(this, t, t + 1);}

  return this;
}, p.prototype.swap32 = function () {
  var e = this.length;
  if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");

  for (var t = 0; t < e; t += 4) {E(this, t, t + 3), E(this, t + 1, t + 2);}

  return this;
}, p.prototype.swap64 = function () {
  var e = this.length;
  if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");

  for (var t = 0; t < e; t += 8) {E(this, t, t + 7), E(this, t + 1, t + 6), E(this, t + 2, t + 5), E(this, t + 3, t + 4);}

  return this;
}, p.prototype.toString = function () {
  var e = 0 | this.length;
  return 0 === e ? "" : 0 === arguments.length ? C(this, 0, e) : k.apply(this, arguments);
}, p.prototype.equals = function (e) {
  if (!y(e)) throw new TypeError("Argument must be a Buffer");
  return this === e || 0 === p.compare(this, e);
}, p.prototype.inspect = function () {
  var e = "";
  return this.length > 0 && (e = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), this.length > 50 && (e += " ... ")), "<Buffer " + e + ">";
}, p.prototype.compare = function (e, t, r, n, i) {
  if (!y(e)) throw new TypeError("Argument must be a Buffer");
  if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
  if (n >= i && t >= r) return 0;
  if (n >= i) return -1;
  if (t >= r) return 1;
  if (this === e) return 0;

  for (var o = (i >>>= 0) - (n >>>= 0), a = (r >>>= 0) - (t >>>= 0), s = Math.min(o, a), h = this.slice(n, i), l = e.slice(t, r), f = 0; f < s; ++f) {if (h[f] !== l[f]) {
      o = h[f], a = l[f];
      break;
    }}

  return o < a ? -1 : a < o ? 1 : 0;
}, p.prototype.includes = function (e, t, r) {
  return -1 !== this.indexOf(e, t, r);
}, p.prototype.indexOf = function (e, t, r) {
  return S(this, e, t, r, !0);
}, p.prototype.lastIndexOf = function (e, t, r) {
  return S(this, e, t, r, !1);
}, p.prototype.write = function (e, t, r, n) {
  if (void 0 === t) n = "utf8", r = this.length, t = 0;else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;else {
    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
  }
  var i = this.length - t;
  if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
  n || (n = "utf8");

  for (var o = !1;;) {switch (n) {
      case "hex":
        return R(this, e, t, r);

      case "utf8":
      case "utf-8":
        return A(this, e, t, r);

      case "ascii":
        return B(this, e, t, r);

      case "latin1":
      case "binary":
        return z(this, e, t, r);

      case "base64":
        return L(this, e, t, r);

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return T(this, e, t, r);

      default:
        if (o) throw new TypeError("Unknown encoding: " + n);
        n = ("" + n).toLowerCase(), o = !0;}}

}, p.prototype.toJSON = function () {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0) };

};
var D = 4096;

function I(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);

  for (var i = t; i < r; ++i) {n += String.fromCharCode(127 & e[i]);}

  return n;
}

function P(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);

  for (var i = t; i < r; ++i) {n += String.fromCharCode(e[i]);}

  return n;
}

function O(e, t, r) {
  var n = e.length;
  (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);

  for (var i = "", o = t; o < r; ++o) {i += X(e[o]);}

  return i;
}

function U(e, t, r) {
  for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) {i += String.fromCharCode(n[o] + 256 * n[o + 1]);}

  return i;
}

function H(e, t, r) {
  if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
  if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
}

function F(e, t, r, n, i, o) {
  if (!y(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
  if (r + n > e.length) throw new RangeError("Index out of range");
}

function N(e, t, r, n) {
  t < 0 && (t = 65535 + t + 1);

  for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i) {e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);}
}

function Z(e, t, r, n) {
  t < 0 && (t = 4294967295 + t + 1);

  for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i) {e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255;}
}

function j(e, t, r, n, i, o) {
  if (r + n > e.length) throw new RangeError("Index out of range");
  if (r < 0) throw new RangeError("Index out of range");
}

function W(e, t, r, n, i) {
  return i || j(e, 0, r, 4), l(e, t, r, n, 23, 4), r + 4;
}

function Y(e, t, r, n, i) {
  return i || j(e, 0, r, 8), l(e, t, r, n, 52, 8), r + 8;
}

p.prototype.slice = function (e, t) {
  var r,
  n = this.length;
  if ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), t < e && (t = e), p.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = p.prototype;else {
    var i = t - e;
    r = new p(i, void 0);

    for (var o = 0; o < i; ++o) {r[o] = this[o + e];}
  }
  return r;
}, p.prototype.readUIntLE = function (e, t, r) {
  e |= 0, t |= 0, r || H(e, t, this.length);

  for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {n += this[e + o] * i;}

  return n;
}, p.prototype.readUIntBE = function (e, t, r) {
  e |= 0, t |= 0, r || H(e, t, this.length);

  for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) {n += this[e + --t] * i;}

  return n;
}, p.prototype.readUInt8 = function (e, t) {
  return t || H(e, 1, this.length), this[e];
}, p.prototype.readUInt16LE = function (e, t) {
  return t || H(e, 2, this.length), this[e] | this[e + 1] << 8;
}, p.prototype.readUInt16BE = function (e, t) {
  return t || H(e, 2, this.length), this[e] << 8 | this[e + 1];
}, p.prototype.readUInt32LE = function (e, t) {
  return t || H(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
}, p.prototype.readUInt32BE = function (e, t) {
  return t || H(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
}, p.prototype.readIntLE = function (e, t, r) {
  e |= 0, t |= 0, r || H(e, t, this.length);

  for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {n += this[e + o] * i;}

  return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;
}, p.prototype.readIntBE = function (e, t, r) {
  e |= 0, t |= 0, r || H(e, t, this.length);

  for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) {o += this[e + --n] * i;}

  return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
}, p.prototype.readInt8 = function (e, t) {
  return t || H(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
}, p.prototype.readInt16LE = function (e, t) {
  t || H(e, 2, this.length);
  var r = this[e] | this[e + 1] << 8;
  return 32768 & r ? 4294901760 | r : r;
}, p.prototype.readInt16BE = function (e, t) {
  t || H(e, 2, this.length);
  var r = this[e + 1] | this[e] << 8;
  return 32768 & r ? 4294901760 | r : r;
}, p.prototype.readInt32LE = function (e, t) {
  return t || H(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
}, p.prototype.readInt32BE = function (e, t) {
  return t || H(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
}, p.prototype.readFloatLE = function (e, t) {
  return t || H(e, 4, this.length), h(this, e, !0, 23, 4);
}, p.prototype.readFloatBE = function (e, t) {
  return t || H(e, 4, this.length), h(this, e, !1, 23, 4);
}, p.prototype.readDoubleLE = function (e, t) {
  return t || H(e, 8, this.length), h(this, e, !0, 52, 8);
}, p.prototype.readDoubleBE = function (e, t) {
  return t || H(e, 8, this.length), h(this, e, !1, 52, 8);
}, p.prototype.writeUIntLE = function (e, t, r, n) {
  (e = +e, t |= 0, r |= 0, n) || F(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
  var i = 1,
  o = 0;

  for (this[t] = 255 & e; ++o < r && (i *= 256);) {this[t + o] = e / i & 255;}

  return t + r;
}, p.prototype.writeUIntBE = function (e, t, r, n) {
  (e = +e, t |= 0, r |= 0, n) || F(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
  var i = r - 1,
  o = 1;

  for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) {this[t + i] = e / o & 255;}

  return t + r;
}, p.prototype.writeUInt8 = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 1, 255, 0), p.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1;
}, p.prototype.writeUInt16LE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 2, 65535, 0), p.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0), t + 2;
}, p.prototype.writeUInt16BE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 2, 65535, 0), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1), t + 2;
}, p.prototype.writeUInt32LE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 4, 4294967295, 0), p.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : Z(this, e, t, !0), t + 4;
}, p.prototype.writeUInt32BE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 4, 4294967295, 0), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : Z(this, e, t, !1), t + 4;
}, p.prototype.writeIntLE = function (e, t, r, n) {
  if (e = +e, t |= 0, !n) {
    var i = Math.pow(2, 8 * r - 1);
    F(this, e, t, r, i - 1, -i);
  }

  var o = 0,
  a = 1,
  s = 0;

  for (this[t] = 255 & e; ++o < r && (a *= 256);) {e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;}

  return t + r;
}, p.prototype.writeIntBE = function (e, t, r, n) {
  if (e = +e, t |= 0, !n) {
    var i = Math.pow(2, 8 * r - 1);
    F(this, e, t, r, i - 1, -i);
  }

  var o = r - 1,
  a = 1,
  s = 0;

  for (this[t + o] = 255 & e; --o >= 0 && (a *= 256);) {e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;}

  return t + r;
}, p.prototype.writeInt8 = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 1, 127, -128), p.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
}, p.prototype.writeInt16LE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 2, 32767, -32768), p.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0), t + 2;
}, p.prototype.writeInt16BE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 2, 32767, -32768), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1), t + 2;
}, p.prototype.writeInt32LE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 4, 2147483647, -2147483648), p.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : Z(this, e, t, !0), t + 4;
}, p.prototype.writeInt32BE = function (e, t, r) {
  return e = +e, t |= 0, r || F(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : Z(this, e, t, !1), t + 4;
}, p.prototype.writeFloatLE = function (e, t, r) {
  return W(this, e, t, !0, r);
}, p.prototype.writeFloatBE = function (e, t, r) {
  return W(this, e, t, !1, r);
}, p.prototype.writeDoubleLE = function (e, t, r) {
  return Y(this, e, t, !0, r);
}, p.prototype.writeDoubleBE = function (e, t, r) {
  return Y(this, e, t, !1, r);
}, p.prototype.copy = function (e, t, r, n) {
  if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
  if (0 === e.length || 0 === this.length) return 0;
  if (t < 0) throw new RangeError("targetStart out of bounds");
  if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
  if (n < 0) throw new RangeError("sourceEnd out of bounds");
  n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
  var i,
  o = n - r;
  if (this === e && r < t && t < n) for (i = o - 1; i >= 0; --i) {e[i + t] = this[i + r];} else if (o < 1e3 || !p.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) {e[i + t] = this[i + r];} else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
  return o;
}, p.prototype.fill = function (e, t, r, n) {
  if ("string" == typeof e) {
    if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length) {
      var i = e.charCodeAt(0);
      i < 256 && (e = i);
    }

    if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
    if ("string" == typeof n && !p.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
  } else "number" == typeof e && (e &= 255);

  if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
  if (r <= t) return this;
  var o;
  if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) {this[o] = e;} else {
    var a = y(e) ? e : q(new p(e, n).toString()),
    s = a.length;

    for (o = 0; o < r - t; ++o) {this[o + t] = a[o % s];}
  }
  return this;
};
var K = /[^+\/0-9A-Za-z-_]/g;

function X(e) {
  return e < 16 ? "0" + e.toString(16) : e.toString(16);
}

function q(e, t) {
  var r;
  t = t || 1 / 0;

  for (var n = e.length, i = null, o = [], a = 0; a < n; ++a) {
    if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
      if (!i) {
        if (r > 56319) {
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }

        if (a + 1 === n) {
          (t -= 3) > -1 && o.push(239, 191, 189);
          continue;
        }

        i = r;
        continue;
      }

      if (r < 56320) {
        (t -= 3) > -1 && o.push(239, 191, 189), i = r;
        continue;
      }

      r = 65536 + (i - 55296 << 10 | r - 56320);
    } else i && (t -= 3) > -1 && o.push(239, 191, 189);

    if (i = null, r < 128) {
      if ((t -= 1) < 0) break;
      o.push(r);
    } else if (r < 2048) {
      if ((t -= 2) < 0) break;
      o.push(r >> 6 | 192, 63 & r | 128);
    } else if (r < 65536) {
      if ((t -= 3) < 0) break;
      o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
    } else {
      if (!(r < 1114112)) throw new Error("Invalid code point");
      if ((t -= 4) < 0) break;
      o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
    }
  }

  return o;
}

function V(e) {
  return function (e) {
    var t, a, s, h, l, f;
    i || o();
    var c = e.length;
    if (c % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    l = "=" === e[c - 2] ? 2 : "=" === e[c - 1] ? 1 : 0, f = new n(3 * c / 4 - l), s = l > 0 ? c - 4 : c;
    var u = 0;

    for (t = 0, a = 0; t < s; t += 4, a += 3) {h = r[e.charCodeAt(t)] << 18 | r[e.charCodeAt(t + 1)] << 12 | r[e.charCodeAt(t + 2)] << 6 | r[e.charCodeAt(t + 3)], f[u++] = h >> 16 & 255, f[u++] = h >> 8 & 255, f[u++] = 255 & h;}

    return 2 === l ? (h = r[e.charCodeAt(t)] << 2 | r[e.charCodeAt(t + 1)] >> 4, f[u++] = 255 & h) : 1 === l && (h = r[e.charCodeAt(t)] << 10 | r[e.charCodeAt(t + 1)] << 4 | r[e.charCodeAt(t + 2)] >> 2, f[u++] = h >> 8 & 255, f[u++] = 255 & h), f;
  }(function (e) {
    if ((e = function (e) {
      return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
    }(e).replace(K, "")).length < 2) return "";

    for (; e.length % 4 != 0;) {e += "=";}

    return e;
  }(e));
}

function G(e, t, r, n) {
  for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) {t[i + r] = e[i];}

  return i;
}

function $(e) {
  return null != e && (!!e._isBuffer || J(e) || function (e) {
    return "function" == typeof e.readFloatLE && "function" == typeof e.slice && J(e.slice(0, 0));
  }(e));
}

function J(e) {
  return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
}

"undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;

function Q(e, t) {
  return e(t = {
    exports: {} },
  t.exports), t.exports;
}

var ee = Q(function (e, t) {
  var r;
  e.exports = (r = r || function (e, t) {
    var r = Object.create || function () {
      function e() {}

      return function (t) {
        var r;
        return e.prototype = t, r = new e(), e.prototype = null, r;
      };
    }(),
    n = {},
    i = n.lib = {},
    o = i.Base = {
      extend: function extend(e) {
        var t = r(this);
        return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function () {
          t.$super.init.apply(this, arguments);
        }), t.init.prototype = t, t.$super = this, t;
      },
      create: function create() {
        var e = this.extend();
        return e.init.apply(e, arguments), e;
      },
      init: function init() {},
      mixIn: function mixIn(e) {
        for (var t in e) {e.hasOwnProperty(t) && (this[t] = e[t]);}

        e.hasOwnProperty("toString") && (this.toString = e.toString);
      },
      clone: function clone() {
        return this.init.prototype.extend(this);
      } },

    a = i.WordArray = o.extend({
      init: function init(e, t) {
        e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length;
      },
      toString: function toString(e) {
        return (e || h).stringify(this);
      },
      concat: function concat(e) {
        var t = this.words,
        r = e.words,
        n = this.sigBytes,
        i = e.sigBytes;
        if (this.clamp(), n % 4) for (var o = 0; o < i; o++) {
          var a = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;
          t[n + o >>> 2] |= a << 24 - (n + o) % 4 * 8;
        } else for (var o = 0; o < i; o += 4) {t[n + o >>> 2] = r[o >>> 2];}
        return this.sigBytes += i, this;
      },
      clamp: function clamp() {
        var t = this.words,
        r = this.sigBytes;
        t[r >>> 2] &= 4294967295 << 32 - r % 4 * 8, t.length = e.ceil(r / 4);
      },
      clone: function clone() {
        var e = o.clone.call(this);
        return e.words = this.words.slice(0), e;
      },
      random: function random(t) {
        for (var r, n = [], i = function i(t) {
          var t = t,
          r = 987654321,
          n = 4294967295;
          return function () {
            var i = ((r = 36969 * (65535 & r) + (r >> 16) & n) << 16) + (t = 18e3 * (65535 & t) + (t >> 16) & n) & n;
            return i /= 4294967296, (i += .5) * (e.random() > .5 ? 1 : -1);
          };
        }, o = 0; o < t; o += 4) {
          var s = i(4294967296 * (r || e.random()));
          r = 987654071 * s(), n.push(4294967296 * s() | 0);
        }

        return new a.init(n, t);
      } }),

    s = n.enc = {},
    h = s.Hex = {
      stringify: function stringify(e) {
        for (var t = e.words, r = e.sigBytes, n = [], i = 0; i < r; i++) {
          var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          n.push((o >>> 4).toString(16)), n.push((15 & o).toString(16));
        }

        return n.join("");
      },
      parse: function parse(e) {
        for (var t = e.length, r = [], n = 0; n < t; n += 2) {r[n >>> 3] |= parseInt(e.substr(n, 2), 16) << 24 - n % 8 * 4;}

        return new a.init(r, t / 2);
      } },

    l = s.Latin1 = {
      stringify: function stringify(e) {
        for (var t = e.words, r = e.sigBytes, n = [], i = 0; i < r; i++) {
          var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          n.push(String.fromCharCode(o));
        }

        return n.join("");
      },
      parse: function parse(e) {
        for (var t = e.length, r = [], n = 0; n < t; n++) {r[n >>> 2] |= (255 & e.charCodeAt(n)) << 24 - n % 4 * 8;}

        return new a.init(r, t);
      } },

    f = s.Utf8 = {
      stringify: function stringify(e) {
        try {
          return decodeURIComponent(escape(l.stringify(e)));
        } catch (e) {
          throw new Error("Malformed UTF-8 data");
        }
      },
      parse: function parse(e) {
        return l.parse(unescape(encodeURIComponent(e)));
      } },

    c = i.BufferedBlockAlgorithm = o.extend({
      reset: function reset() {
        this._data = new a.init(), this._nDataBytes = 0;
      },
      _append: function _append(e) {
        "string" == typeof e && (e = f.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
      },
      _process: function _process(t) {
        var r = this._data,
        n = r.words,
        i = r.sigBytes,
        o = this.blockSize,
        s = 4 * o,
        h = i / s,
        l = (h = t ? e.ceil(h) : e.max((0 | h) - this._minBufferSize, 0)) * o,
        f = e.min(4 * l, i);

        if (l) {
          for (var c = 0; c < l; c += o) {this._doProcessBlock(n, c);}

          var u = n.splice(0, l);
          r.sigBytes -= f;
        }

        return new a.init(u, f);
      },
      clone: function clone() {
        var e = o.clone.call(this);
        return e._data = this._data.clone(), e;
      },
      _minBufferSize: 0 }),

    u = (i.Hasher = c.extend({
      cfg: o.extend(),
      init: function init(e) {
        this.cfg = this.cfg.extend(e), this.reset();
      },
      reset: function reset() {
        c.reset.call(this), this._doReset();
      },
      update: function update(e) {
        return this._append(e), this._process(), this;
      },
      finalize: function finalize(e) {
        e && this._append(e);

        var t = this._doFinalize();

        return t;
      },
      blockSize: 16,
      _createHelper: function _createHelper(e) {
        return function (t, r) {
          return new e.init(r).finalize(t);
        };
      },
      _createHmacHelper: function _createHmacHelper(e) {
        return function (t, r) {
          return new u.HMAC.init(e, r).finalize(t);
        };
      } }),
    n.algo = {});

    return n;
  }(Math), r);
}),
te = (Q(function (e, t) {
  var r, n, i, o, a, s;
  e.exports = (i = (n = r = ee).lib, o = i.Base, a = i.WordArray, (s = n.x64 = {}).Word = o.extend({
    init: function init(e, t) {
      this.high = e, this.low = t;
    } }),
  s.WordArray = o.extend({
    init: function init(e, t) {
      e = this.words = e || [], this.sigBytes = null != t ? t : 8 * e.length;
    },
    toX32: function toX32() {
      for (var e = this.words, t = e.length, r = [], n = 0; n < t; n++) {
        var i = e[n];
        r.push(i.high), r.push(i.low);
      }

      return a.create(r, this.sigBytes);
    },
    clone: function clone() {
      for (var e = o.clone.call(this), t = e.words = this.words.slice(0), r = t.length, n = 0; n < r; n++) {t[n] = t[n].clone();}

      return e;
    } }),
  r);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    if ("function" == typeof ArrayBuffer) {
      var e = r.lib.WordArray,
      t = e.init;
      (e.init = function (e) {
        if (e instanceof ArrayBuffer && (e = new Uint8Array(e)), (e instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) && (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)), e instanceof Uint8Array) {
          for (var r = e.byteLength, n = [], i = 0; i < r; i++) {n[i >>> 2] |= e[i] << 24 - i % 4 * 8;}

          t.call(this, n, r);
        } else t.apply(this, arguments);
      }).prototype = e;
    }
  }(), r.lib.WordArray);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib.WordArray,
    n = e.enc;

    function i(e) {
      return e << 8 & 4278255360 | e >>> 8 & 16711935;
    }

    n.Utf16 = n.Utf16BE = {
      stringify: function stringify(e) {
        for (var t = e.words, r = e.sigBytes, n = [], i = 0; i < r; i += 2) {
          var o = t[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
          n.push(String.fromCharCode(o));
        }

        return n.join("");
      },
      parse: function parse(e) {
        for (var r = e.length, n = [], i = 0; i < r; i++) {n[i >>> 1] |= e.charCodeAt(i) << 16 - i % 2 * 16;}

        return t.create(n, 2 * r);
      } },
    n.Utf16LE = {
      stringify: function stringify(e) {
        for (var t = e.words, r = e.sigBytes, n = [], o = 0; o < r; o += 2) {
          var a = i(t[o >>> 2] >>> 16 - o % 4 * 8 & 65535);
          n.push(String.fromCharCode(a));
        }

        return n.join("");
      },
      parse: function parse(e) {
        for (var r = e.length, n = [], o = 0; o < r; o++) {n[o >>> 1] |= i(e.charCodeAt(o) << 16 - o % 2 * 16);}

        return t.create(n, 2 * r);
      } };

  }(), r.enc.Utf16);
}), Q(function (e, t) {
  var r, n, i;
  e.exports = (i = (n = r = ee).lib.WordArray, n.enc.Base64 = {
    stringify: function stringify(e) {
      var t = e.words,
      r = e.sigBytes,
      n = this._map;
      e.clamp();

      for (var i = [], o = 0; o < r; o += 3) {for (var a = (t[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (t[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | t[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, s = 0; s < 4 && o + .75 * s < r; s++) {i.push(n.charAt(a >>> 6 * (3 - s) & 63));}}

      var h = n.charAt(64);
      if (h) for (; i.length % 4;) {i.push(h);}
      return i.join("");
    },
    parse: function parse(e) {
      var t = e.length,
      r = this._map,
      n = this._reverseMap;

      if (!n) {
        n = this._reverseMap = [];

        for (var o = 0; o < r.length; o++) {n[r.charCodeAt(o)] = o;}
      }

      var a = r.charAt(64);

      if (a) {
        var s = e.indexOf(a);
        -1 !== s && (t = s);
      }

      return function (e, t, r) {
        for (var n = [], o = 0, a = 0; a < t; a++) {if (a % 4) {
            var s = r[e.charCodeAt(a - 1)] << a % 4 * 2,
            h = r[e.charCodeAt(a)] >>> 6 - a % 4 * 2;
            n[o >>> 2] |= (s | h) << 24 - o % 4 * 8, o++;
          }}

        return i.create(n, o);
      }(e, t, n);
    },
    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" },
  r.enc.Base64);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function (e) {
    var t = r,
    n = t.lib,
    i = n.WordArray,
    o = n.Hasher,
    a = t.algo,
    s = [];
    !function () {
      for (var t = 0; t < 64; t++) {s[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;}
    }();
    var h = a.MD5 = o.extend({
      _doReset: function _doReset() {
        this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878]);
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        for (var r = 0; r < 16; r++) {
          var n = t + r,
          i = e[n];
          e[n] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
        }

        var o = this._hash.words,
        a = e[t + 0],
        h = e[t + 1],
        d = e[t + 2],
        p = e[t + 3],
        _ = e[t + 4],
        g = e[t + 5],
        v = e[t + 6],
        w = e[t + 7],
        b = e[t + 8],
        y = e[t + 9],
        m = e[t + 10],
        k = e[t + 11],
        E = e[t + 12],
        S = e[t + 13],
        x = e[t + 14],
        R = e[t + 15],
        A = o[0],
        B = o[1],
        z = o[2],
        L = o[3];
        A = l(A, B, z, L, a, 7, s[0]), L = l(L, A, B, z, h, 12, s[1]), z = l(z, L, A, B, d, 17, s[2]), B = l(B, z, L, A, p, 22, s[3]), A = l(A, B, z, L, _, 7, s[4]), L = l(L, A, B, z, g, 12, s[5]), z = l(z, L, A, B, v, 17, s[6]), B = l(B, z, L, A, w, 22, s[7]), A = l(A, B, z, L, b, 7, s[8]), L = l(L, A, B, z, y, 12, s[9]), z = l(z, L, A, B, m, 17, s[10]), B = l(B, z, L, A, k, 22, s[11]), A = l(A, B, z, L, E, 7, s[12]), L = l(L, A, B, z, S, 12, s[13]), z = l(z, L, A, B, x, 17, s[14]), A = f(A, B = l(B, z, L, A, R, 22, s[15]), z, L, h, 5, s[16]), L = f(L, A, B, z, v, 9, s[17]), z = f(z, L, A, B, k, 14, s[18]), B = f(B, z, L, A, a, 20, s[19]), A = f(A, B, z, L, g, 5, s[20]), L = f(L, A, B, z, m, 9, s[21]), z = f(z, L, A, B, R, 14, s[22]), B = f(B, z, L, A, _, 20, s[23]), A = f(A, B, z, L, y, 5, s[24]), L = f(L, A, B, z, x, 9, s[25]), z = f(z, L, A, B, p, 14, s[26]), B = f(B, z, L, A, b, 20, s[27]), A = f(A, B, z, L, S, 5, s[28]), L = f(L, A, B, z, d, 9, s[29]), z = f(z, L, A, B, w, 14, s[30]), A = c(A, B = f(B, z, L, A, E, 20, s[31]), z, L, g, 4, s[32]), L = c(L, A, B, z, b, 11, s[33]), z = c(z, L, A, B, k, 16, s[34]), B = c(B, z, L, A, x, 23, s[35]), A = c(A, B, z, L, h, 4, s[36]), L = c(L, A, B, z, _, 11, s[37]), z = c(z, L, A, B, w, 16, s[38]), B = c(B, z, L, A, m, 23, s[39]), A = c(A, B, z, L, S, 4, s[40]), L = c(L, A, B, z, a, 11, s[41]), z = c(z, L, A, B, p, 16, s[42]), B = c(B, z, L, A, v, 23, s[43]), A = c(A, B, z, L, y, 4, s[44]), L = c(L, A, B, z, E, 11, s[45]), z = c(z, L, A, B, R, 16, s[46]), A = u(A, B = c(B, z, L, A, d, 23, s[47]), z, L, a, 6, s[48]), L = u(L, A, B, z, w, 10, s[49]), z = u(z, L, A, B, x, 15, s[50]), B = u(B, z, L, A, g, 21, s[51]), A = u(A, B, z, L, E, 6, s[52]), L = u(L, A, B, z, p, 10, s[53]), z = u(z, L, A, B, m, 15, s[54]), B = u(B, z, L, A, h, 21, s[55]), A = u(A, B, z, L, b, 6, s[56]), L = u(L, A, B, z, R, 10, s[57]), z = u(z, L, A, B, v, 15, s[58]), B = u(B, z, L, A, S, 21, s[59]), A = u(A, B, z, L, _, 6, s[60]), L = u(L, A, B, z, k, 10, s[61]), z = u(z, L, A, B, d, 15, s[62]), B = u(B, z, L, A, y, 21, s[63]), o[0] = o[0] + A | 0, o[1] = o[1] + B | 0, o[2] = o[2] + z | 0, o[3] = o[3] + L | 0;
      },
      _doFinalize: function _doFinalize() {
        var t = this._data,
        r = t.words,
        n = 8 * this._nDataBytes,
        i = 8 * t.sigBytes;
        r[i >>> 5] |= 128 << 24 - i % 32;
        var o = e.floor(n / 4294967296),
        a = n;
        r[15 + (i + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), r[14 + (i + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), t.sigBytes = 4 * (r.length + 1), this._process();

        for (var s = this._hash, h = s.words, l = 0; l < 4; l++) {
          var f = h[l];
          h[l] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8);
        }

        return s;
      },
      clone: function clone() {
        var e = o.clone.call(this);
        return e._hash = this._hash.clone(), e;
      } });


    function l(e, t, r, n, i, o, a) {
      var s = e + (t & r | ~t & n) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }

    function f(e, t, r, n, i, o, a) {
      var s = e + (t & n | r & ~n) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }

    function c(e, t, r, n, i, o, a) {
      var s = e + (t ^ r ^ n) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }

    function u(e, t, r, n, i, o, a) {
      var s = e + (r ^ (t | ~n)) + i + a;
      return (s << o | s >>> 32 - o) + t;
    }

    t.MD5 = o._createHelper(h), t.HmacMD5 = o._createHmacHelper(h);
  }(Math), r.MD5);
}), Q(function (e, t) {
  var r, n, i, o, a, s, h, l;
  e.exports = (i = (n = r = ee).lib, o = i.WordArray, a = i.Hasher, s = n.algo, h = [], l = s.SHA1 = a.extend({
    _doReset: function _doReset() {
      this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
    },
    _doProcessBlock: function _doProcessBlock(e, t) {
      for (var r = this._hash.words, n = r[0], i = r[1], o = r[2], a = r[3], s = r[4], l = 0; l < 80; l++) {
        if (l < 16) h[l] = 0 | e[t + l];else {
          var f = h[l - 3] ^ h[l - 8] ^ h[l - 14] ^ h[l - 16];
          h[l] = f << 1 | f >>> 31;
        }
        var c = (n << 5 | n >>> 27) + s + h[l];
        c += l < 20 ? 1518500249 + (i & o | ~i & a) : l < 40 ? 1859775393 + (i ^ o ^ a) : l < 60 ? (i & o | i & a | o & a) - 1894007588 : (i ^ o ^ a) - 899497514, s = a, a = o, o = i << 30 | i >>> 2, i = n, n = c;
      }

      r[0] = r[0] + n | 0, r[1] = r[1] + i | 0, r[2] = r[2] + o | 0, r[3] = r[3] + a | 0, r[4] = r[4] + s | 0;
    },
    _doFinalize: function _doFinalize() {
      var e = this._data,
      t = e.words,
      r = 8 * this._nDataBytes,
      n = 8 * e.sigBytes;
      return t[n >>> 5] |= 128 << 24 - n % 32, t[14 + (n + 64 >>> 9 << 4)] = Math.floor(r / 4294967296), t[15 + (n + 64 >>> 9 << 4)] = r, e.sigBytes = 4 * t.length, this._process(), this._hash;
    },
    clone: function clone() {
      var e = a.clone.call(this);
      return e._hash = this._hash.clone(), e;
    } }),
  n.SHA1 = a._createHelper(l), n.HmacSHA1 = a._createHmacHelper(l), r.SHA1);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function (e) {
    var t = r,
    n = t.lib,
    i = n.WordArray,
    o = n.Hasher,
    a = t.algo,
    s = [],
    h = [];
    !function () {
      function t(t) {
        for (var r = e.sqrt(t), n = 2; n <= r; n++) {if (!(t % n)) return !1;}

        return !0;
      }

      function r(e) {
        return 4294967296 * (e - (0 | e)) | 0;
      }

      for (var n = 2, i = 0; i < 64;) {t(n) && (i < 8 && (s[i] = r(e.pow(n, .5))), h[i] = r(e.pow(n, 1 / 3)), i++), n++;}
    }();
    var l = [],
    f = a.SHA256 = o.extend({
      _doReset: function _doReset() {
        this._hash = new i.init(s.slice(0));
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        for (var r = this._hash.words, n = r[0], i = r[1], o = r[2], a = r[3], s = r[4], f = r[5], c = r[6], u = r[7], d = 0; d < 64; d++) {
          if (d < 16) l[d] = 0 | e[t + d];else {
            var p = l[d - 15],
            _ = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3,
            g = l[d - 2],
            v = (g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10;

            l[d] = _ + l[d - 7] + v + l[d - 16];
          }
          var w = n & i ^ n & o ^ i & o,
          b = (n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 | n >>> 22),
          y = u + ((s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25)) + (s & f ^ ~s & c) + h[d] + l[d];
          u = c, c = f, f = s, s = a + y | 0, a = o, o = i, i = n, n = y + (b + w) | 0;
        }

        r[0] = r[0] + n | 0, r[1] = r[1] + i | 0, r[2] = r[2] + o | 0, r[3] = r[3] + a | 0, r[4] = r[4] + s | 0, r[5] = r[5] + f | 0, r[6] = r[6] + c | 0, r[7] = r[7] + u | 0;
      },
      _doFinalize: function _doFinalize() {
        var t = this._data,
        r = t.words,
        n = 8 * this._nDataBytes,
        i = 8 * t.sigBytes;
        return r[i >>> 5] |= 128 << 24 - i % 32, r[14 + (i + 64 >>> 9 << 4)] = e.floor(n / 4294967296), r[15 + (i + 64 >>> 9 << 4)] = n, t.sigBytes = 4 * r.length, this._process(), this._hash;
      },
      clone: function clone() {
        var e = o.clone.call(this);
        return e._hash = this._hash.clone(), e;
      } });

    t.SHA256 = o._createHelper(f), t.HmacSHA256 = o._createHmacHelper(f);
  }(Math), r.SHA256);
}), Q(function (e, t) {
  var r, n, i, o, a, s;
  e.exports = (i = (n = r = ee).lib.WordArray, o = n.algo, a = o.SHA256, s = o.SHA224 = a.extend({
    _doReset: function _doReset() {
      this._hash = new i.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
    },
    _doFinalize: function _doFinalize() {
      var e = a._doFinalize.call(this);

      return e.sigBytes -= 4, e;
    } }),
  n.SHA224 = a._createHelper(s), n.HmacSHA224 = a._createHmacHelper(s), r.SHA224);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib.Hasher,
    n = e.x64,
    i = n.Word,
    o = n.WordArray,
    a = e.algo;

    function s() {
      return i.create.apply(i, arguments);
    }

    var h = [s(1116352408, 3609767458), s(1899447441, 602891725), s(3049323471, 3964484399), s(3921009573, 2173295548), s(961987163, 4081628472), s(1508970993, 3053834265), s(2453635748, 2937671579), s(2870763221, 3664609560), s(3624381080, 2734883394), s(310598401, 1164996542), s(607225278, 1323610764), s(1426881987, 3590304994), s(1925078388, 4068182383), s(2162078206, 991336113), s(2614888103, 633803317), s(3248222580, 3479774868), s(3835390401, 2666613458), s(4022224774, 944711139), s(264347078, 2341262773), s(604807628, 2007800933), s(770255983, 1495990901), s(1249150122, 1856431235), s(1555081692, 3175218132), s(1996064986, 2198950837), s(2554220882, 3999719339), s(2821834349, 766784016), s(2952996808, 2566594879), s(3210313671, 3203337956), s(3336571891, 1034457026), s(3584528711, 2466948901), s(113926993, 3758326383), s(338241895, 168717936), s(666307205, 1188179964), s(773529912, 1546045734), s(1294757372, 1522805485), s(1396182291, 2643833823), s(1695183700, 2343527390), s(1986661051, 1014477480), s(2177026350, 1206759142), s(2456956037, 344077627), s(2730485921, 1290863460), s(2820302411, 3158454273), s(3259730800, 3505952657), s(3345764771, 106217008), s(3516065817, 3606008344), s(3600352804, 1432725776), s(4094571909, 1467031594), s(275423344, 851169720), s(430227734, 3100823752), s(506948616, 1363258195), s(659060556, 3750685593), s(883997877, 3785050280), s(958139571, 3318307427), s(1322822218, 3812723403), s(1537002063, 2003034995), s(1747873779, 3602036899), s(1955562222, 1575990012), s(2024104815, 1125592928), s(2227730452, 2716904306), s(2361852424, 442776044), s(2428436474, 593698344), s(2756734187, 3733110249), s(3204031479, 2999351573), s(3329325298, 3815920427), s(3391569614, 3928383900), s(3515267271, 566280711), s(3940187606, 3454069534), s(4118630271, 4000239992), s(116418474, 1914138554), s(174292421, 2731055270), s(289380356, 3203993006), s(460393269, 320620315), s(685471733, 587496836), s(852142971, 1086792851), s(1017036298, 365543100), s(1126000580, 2618297676), s(1288033470, 3409855158), s(1501505948, 4234509866), s(1607167915, 987167468), s(1816402316, 1246189591)],
    l = [];
    !function () {
      for (var e = 0; e < 80; e++) {l[e] = s();}
    }();
    var f = a.SHA512 = t.extend({
      _doReset: function _doReset() {
        this._hash = new o.init([new i.init(1779033703, 4089235720), new i.init(3144134277, 2227873595), new i.init(1013904242, 4271175723), new i.init(2773480762, 1595750129), new i.init(1359893119, 2917565137), new i.init(2600822924, 725511199), new i.init(528734635, 4215389547), new i.init(1541459225, 327033209)]);
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        for (var r = this._hash.words, n = r[0], i = r[1], o = r[2], a = r[3], s = r[4], f = r[5], c = r[6], u = r[7], d = n.high, p = n.low, _ = i.high, g = i.low, v = o.high, w = o.low, b = a.high, y = a.low, m = s.high, k = s.low, E = f.high, S = f.low, x = c.high, R = c.low, A = u.high, B = u.low, z = d, L = p, T = _, M = g, C = v, D = w, I = b, P = y, O = m, U = k, H = E, F = S, N = x, Z = R, j = A, W = B, Y = 0; Y < 80; Y++) {
          var K = l[Y];
          if (Y < 16) var X = K.high = 0 | e[t + 2 * Y],
          q = K.low = 0 | e[t + 2 * Y + 1];else {
            var V = l[Y - 15],
            G = V.high,
            $ = V.low,
            J = (G >>> 1 | $ << 31) ^ (G >>> 8 | $ << 24) ^ G >>> 7,
            Q = ($ >>> 1 | G << 31) ^ ($ >>> 8 | G << 24) ^ ($ >>> 7 | G << 25),
            ee = l[Y - 2],
            te = ee.high,
            re = ee.low,
            ne = (te >>> 19 | re << 13) ^ (te << 3 | re >>> 29) ^ te >>> 6,
            ie = (re >>> 19 | te << 13) ^ (re << 3 | te >>> 29) ^ (re >>> 6 | te << 26),
            oe = l[Y - 7],
            ae = oe.high,
            se = oe.low,
            he = l[Y - 16],
            le = he.high,
            fe = he.low;
            X = (X = (X = J + ae + ((q = Q + se) >>> 0 < Q >>> 0 ? 1 : 0)) + ne + ((q += ie) >>> 0 < ie >>> 0 ? 1 : 0)) + le + ((q += fe) >>> 0 < fe >>> 0 ? 1 : 0), K.high = X, K.low = q;
          }

          var ce,
          ue = O & H ^ ~O & N,
          de = U & F ^ ~U & Z,
          pe = z & T ^ z & C ^ T & C,
          _e = L & M ^ L & D ^ M & D,
          ge = (z >>> 28 | L << 4) ^ (z << 30 | L >>> 2) ^ (z << 25 | L >>> 7),
          ve = (L >>> 28 | z << 4) ^ (L << 30 | z >>> 2) ^ (L << 25 | z >>> 7),
          we = (O >>> 14 | U << 18) ^ (O >>> 18 | U << 14) ^ (O << 23 | U >>> 9),
          be = (U >>> 14 | O << 18) ^ (U >>> 18 | O << 14) ^ (U << 23 | O >>> 9),
          ye = h[Y],
          me = ye.high,
          ke = ye.low,
          Ee = j + we + ((ce = W + be) >>> 0 < W >>> 0 ? 1 : 0),
          Se = ve + _e;

          j = N, W = Z, N = H, Z = F, H = O, F = U, O = I + (Ee = (Ee = (Ee = Ee + ue + ((ce += de) >>> 0 < de >>> 0 ? 1 : 0)) + me + ((ce += ke) >>> 0 < ke >>> 0 ? 1 : 0)) + X + ((ce += q) >>> 0 < q >>> 0 ? 1 : 0)) + ((U = P + ce | 0) >>> 0 < P >>> 0 ? 1 : 0) | 0, I = C, P = D, C = T, D = M, T = z, M = L, z = Ee + (ge + pe + (Se >>> 0 < ve >>> 0 ? 1 : 0)) + ((L = ce + Se | 0) >>> 0 < ce >>> 0 ? 1 : 0) | 0;
        }

        p = n.low = p + L, n.high = d + z + (p >>> 0 < L >>> 0 ? 1 : 0), g = i.low = g + M, i.high = _ + T + (g >>> 0 < M >>> 0 ? 1 : 0), w = o.low = w + D, o.high = v + C + (w >>> 0 < D >>> 0 ? 1 : 0), y = a.low = y + P, a.high = b + I + (y >>> 0 < P >>> 0 ? 1 : 0), k = s.low = k + U, s.high = m + O + (k >>> 0 < U >>> 0 ? 1 : 0), S = f.low = S + F, f.high = E + H + (S >>> 0 < F >>> 0 ? 1 : 0), R = c.low = R + Z, c.high = x + N + (R >>> 0 < Z >>> 0 ? 1 : 0), B = u.low = B + W, u.high = A + j + (B >>> 0 < W >>> 0 ? 1 : 0);
      },
      _doFinalize: function _doFinalize() {
        var e = this._data,
        t = e.words,
        r = 8 * this._nDataBytes,
        n = 8 * e.sigBytes;
        return t[n >>> 5] |= 128 << 24 - n % 32, t[30 + (n + 128 >>> 10 << 5)] = Math.floor(r / 4294967296), t[31 + (n + 128 >>> 10 << 5)] = r, e.sigBytes = 4 * t.length, this._process(), this._hash.toX32();
      },
      clone: function clone() {
        var e = t.clone.call(this);
        return e._hash = this._hash.clone(), e;
      },
      blockSize: 32 });

    e.SHA512 = t._createHelper(f), e.HmacSHA512 = t._createHmacHelper(f);
  }(), r.SHA512);
}), Q(function (e, t) {
  var r, n, i, o, a, s, h, l;
  e.exports = (i = (n = r = ee).x64, o = i.Word, a = i.WordArray, s = n.algo, h = s.SHA512, l = s.SHA384 = h.extend({
    _doReset: function _doReset() {
      this._hash = new a.init([new o.init(3418070365, 3238371032), new o.init(1654270250, 914150663), new o.init(2438529370, 812702999), new o.init(355462360, 4144912697), new o.init(1731405415, 4290775857), new o.init(2394180231, 1750603025), new o.init(3675008525, 1694076839), new o.init(1203062813, 3204075428)]);
    },
    _doFinalize: function _doFinalize() {
      var e = h._doFinalize.call(this);

      return e.sigBytes -= 16, e;
    } }),
  n.SHA384 = h._createHelper(l), n.HmacSHA384 = h._createHmacHelper(l), r.SHA384);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function (e) {
    var t = r,
    n = t.lib,
    i = n.WordArray,
    o = n.Hasher,
    a = t.x64.Word,
    s = t.algo,
    h = [],
    l = [],
    f = [];
    !function () {
      for (var e = 1, t = 0, r = 0; r < 24; r++) {
        h[e + 5 * t] = (r + 1) * (r + 2) / 2 % 64;
        var n = (2 * e + 3 * t) % 5;
        e = t % 5, t = n;
      }

      for (e = 0; e < 5; e++) {for (t = 0; t < 5; t++) {l[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;}}

      for (var i = 1, o = 0; o < 24; o++) {
        for (var s = 0, c = 0, u = 0; u < 7; u++) {
          if (1 & i) {
            var d = (1 << u) - 1;
            d < 32 ? c ^= 1 << d : s ^= 1 << d - 32;
          }

          128 & i ? i = i << 1 ^ 113 : i <<= 1;
        }

        f[o] = a.create(s, c);
      }
    }();
    var c = [];
    !function () {
      for (var e = 0; e < 25; e++) {c[e] = a.create();}
    }();
    var u = s.SHA3 = o.extend({
      cfg: o.cfg.extend({
        outputLength: 512 }),

      _doReset: function _doReset() {
        for (var e = this._state = [], t = 0; t < 25; t++) {e[t] = new a.init();}

        this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        for (var r = this._state, n = this.blockSize / 2, i = 0; i < n; i++) {
          var o = e[t + 2 * i],
          a = e[t + 2 * i + 1];
          o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), a = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), (B = r[i]).high ^= a, B.low ^= o;
        }

        for (var s = 0; s < 24; s++) {
          for (var u = 0; u < 5; u++) {
            for (var d = 0, p = 0, _ = 0; _ < 5; _++) {d ^= (B = r[u + 5 * _]).high, p ^= B.low;}

            var g = c[u];
            g.high = d, g.low = p;
          }

          for (u = 0; u < 5; u++) {
            var v = c[(u + 4) % 5],
            w = c[(u + 1) % 5],
            b = w.high,
            y = w.low;

            for (d = v.high ^ (b << 1 | y >>> 31), p = v.low ^ (y << 1 | b >>> 31), _ = 0; _ < 5; _++) {(B = r[u + 5 * _]).high ^= d, B.low ^= p;}
          }

          for (var m = 1; m < 25; m++) {
            var k = (B = r[m]).high,
            E = B.low,
            S = h[m];
            S < 32 ? (d = k << S | E >>> 32 - S, p = E << S | k >>> 32 - S) : (d = E << S - 32 | k >>> 64 - S, p = k << S - 32 | E >>> 64 - S);
            var x = c[l[m]];
            x.high = d, x.low = p;
          }

          var R = c[0],
          A = r[0];

          for (R.high = A.high, R.low = A.low, u = 0; u < 5; u++) {for (_ = 0; _ < 5; _++) {
              var B = r[m = u + 5 * _],
              z = c[m],
              L = c[(u + 1) % 5 + 5 * _],
              T = c[(u + 2) % 5 + 5 * _];
              B.high = z.high ^ ~L.high & T.high, B.low = z.low ^ ~L.low & T.low;
            }}

          B = r[0];
          var M = f[s];
          B.high ^= M.high, B.low ^= M.low;
        }
      },
      _doFinalize: function _doFinalize() {
        var t = this._data,
        r = t.words,
        n = (this._nDataBytes, 8 * t.sigBytes),
        o = 32 * this.blockSize;
        r[n >>> 5] |= 1 << 24 - n % 32, r[(e.ceil((n + 1) / o) * o >>> 5) - 1] |= 128, t.sigBytes = 4 * r.length, this._process();

        for (var a = this._state, s = this.cfg.outputLength / 8, h = s / 8, l = [], f = 0; f < h; f++) {
          var c = a[f],
          u = c.high,
          d = c.low;
          u = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8), d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8), l.push(d), l.push(u);
        }

        return new i.init(l, s);
      },
      clone: function clone() {
        for (var e = o.clone.call(this), t = e._state = this._state.slice(0), r = 0; r < 25; r++) {t[r] = t[r].clone();}

        return e;
      } });

    t.SHA3 = o._createHelper(u), t.HmacSHA3 = o._createHmacHelper(u);
  }(Math), r.SHA3);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function (e) {
    var t = r,
    n = t.lib,
    i = n.WordArray,
    o = n.Hasher,
    a = t.algo,
    s = i.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
    h = i.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
    l = i.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
    f = i.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
    c = i.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
    u = i.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
    d = a.RIPEMD160 = o.extend({
      _doReset: function _doReset() {
        this._hash = i.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        for (var r = 0; r < 16; r++) {
          var n = t + r,
          i = e[n];
          e[n] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
        }

        var o,
        a,
        d,
        y,
        m,
        k,
        E,
        S,
        x,
        R,
        A,
        B = this._hash.words,
        z = c.words,
        L = u.words,
        T = s.words,
        M = h.words,
        C = l.words,
        D = f.words;

        for (k = o = B[0], E = a = B[1], S = d = B[2], x = y = B[3], R = m = B[4], r = 0; r < 80; r += 1) {A = o + e[t + T[r]] | 0, A += r < 16 ? p(a, d, y) + z[0] : r < 32 ? _(a, d, y) + z[1] : r < 48 ? g(a, d, y) + z[2] : r < 64 ? v(a, d, y) + z[3] : w(a, d, y) + z[4], A = (A = b(A |= 0, C[r])) + m | 0, o = m, m = y, y = b(d, 10), d = a, a = A, A = k + e[t + M[r]] | 0, A += r < 16 ? w(E, S, x) + L[0] : r < 32 ? v(E, S, x) + L[1] : r < 48 ? g(E, S, x) + L[2] : r < 64 ? _(E, S, x) + L[3] : p(E, S, x) + L[4], A = (A = b(A |= 0, D[r])) + R | 0, k = R, R = x, x = b(S, 10), S = E, E = A;}

        A = B[1] + d + x | 0, B[1] = B[2] + y + R | 0, B[2] = B[3] + m + k | 0, B[3] = B[4] + o + E | 0, B[4] = B[0] + a + S | 0, B[0] = A;
      },
      _doFinalize: function _doFinalize() {
        var e = this._data,
        t = e.words,
        r = 8 * this._nDataBytes,
        n = 8 * e.sigBytes;
        t[n >>> 5] |= 128 << 24 - n % 32, t[14 + (n + 64 >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8), e.sigBytes = 4 * (t.length + 1), this._process();

        for (var i = this._hash, o = i.words, a = 0; a < 5; a++) {
          var s = o[a];
          o[a] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
        }

        return i;
      },
      clone: function clone() {
        var e = o.clone.call(this);
        return e._hash = this._hash.clone(), e;
      } });


    function p(e, t, r) {
      return e ^ t ^ r;
    }

    function _(e, t, r) {
      return e & t | ~e & r;
    }

    function g(e, t, r) {
      return (e | ~t) ^ r;
    }

    function v(e, t, r) {
      return e & r | t & ~r;
    }

    function w(e, t, r) {
      return e ^ (t | ~r);
    }

    function b(e, t) {
      return e << t | e >>> 32 - t;
    }

    t.RIPEMD160 = o._createHelper(d), t.HmacRIPEMD160 = o._createHmacHelper(d);
  }(), r.RIPEMD160);
}), Q(function (e, t) {
  var r, n, i, o, a, s;
  e.exports = (n = (r = ee).lib, i = n.Base, o = r.enc, a = o.Utf8, s = r.algo, void (s.HMAC = i.extend({
    init: function init(e, t) {
      e = this._hasher = new e.init(), "string" == typeof t && (t = a.parse(t));
      var r = e.blockSize,
      n = 4 * r;
      t.sigBytes > n && (t = e.finalize(t)), t.clamp();

      for (var i = this._oKey = t.clone(), o = this._iKey = t.clone(), s = i.words, h = o.words, l = 0; l < r; l++) {s[l] ^= 1549556828, h[l] ^= 909522486;}

      i.sigBytes = o.sigBytes = n, this.reset();
    },
    reset: function reset() {
      var e = this._hasher;
      e.reset(), e.update(this._iKey);
    },
    update: function update(e) {
      return this._hasher.update(e), this;
    },
    finalize: function finalize(e) {
      var t = this._hasher,
      r = t.finalize(e);
      t.reset();
      var n = t.finalize(this._oKey.clone().concat(r));
      return n;
    } })));

}), Q(function (e, t) {
  var r, n, i, o, a, s, h, l, f;
  e.exports = (i = (n = r = ee).lib, o = i.Base, a = i.WordArray, s = n.algo, h = s.SHA1, l = s.HMAC, f = s.PBKDF2 = o.extend({
    cfg: o.extend({
      keySize: 4,
      hasher: h,
      iterations: 1 }),

    init: function init(e) {
      this.cfg = this.cfg.extend(e);
    },
    compute: function compute(e, t) {
      for (var r = this.cfg, n = l.create(r.hasher, e), i = a.create(), o = a.create([1]), s = i.words, h = o.words, f = r.keySize, c = r.iterations; s.length < f;) {
        var u = n.update(t).finalize(o);
        n.reset();

        for (var d = u.words, p = d.length, _ = u, g = 1; g < c; g++) {
          _ = n.finalize(_), n.reset();

          for (var v = _.words, w = 0; w < p; w++) {d[w] ^= v[w];}
        }

        i.concat(u), h[0]++;
      }

      return i.sigBytes = 4 * f, i;
    } }),
  n.PBKDF2 = function (e, t, r) {
    return f.create(r).compute(e, t);
  }, r.PBKDF2);
}), Q(function (e, t) {
  var r, n, i, o, a, s, h, l;
  e.exports = (i = (n = r = ee).lib, o = i.Base, a = i.WordArray, s = n.algo, h = s.MD5, l = s.EvpKDF = o.extend({
    cfg: o.extend({
      keySize: 4,
      hasher: h,
      iterations: 1 }),

    init: function init(e) {
      this.cfg = this.cfg.extend(e);
    },
    compute: function compute(e, t) {
      for (var r = this.cfg, n = r.hasher.create(), i = a.create(), o = i.words, s = r.keySize, h = r.iterations; o.length < s;) {
        l && n.update(l);
        var l = n.update(e).finalize(t);
        n.reset();

        for (var f = 1; f < h; f++) {l = n.finalize(l), n.reset();}

        i.concat(l);
      }

      return i.sigBytes = 4 * s, i;
    } }),
  n.EvpKDF = function (e, t, r) {
    return l.create(r).compute(e, t);
  }, r.EvpKDF);
}), Q(function (e, t) {
  var r, n, i, o, a, s, h, l, f, c, u, d, p, _, g, v, w, b, y, m, k, E, S, x;

  e.exports = void ((r = ee).lib.Cipher || (i = r, o = i.lib, a = o.Base, s = o.WordArray, h = o.BufferedBlockAlgorithm, l = i.enc, l.Utf8, f = l.Base64, c = i.algo, u = c.EvpKDF, d = o.Cipher = h.extend({
    cfg: a.extend(),
    createEncryptor: function createEncryptor(e, t) {
      return this.create(this._ENC_XFORM_MODE, e, t);
    },
    createDecryptor: function createDecryptor(e, t) {
      return this.create(this._DEC_XFORM_MODE, e, t);
    },
    init: function init(e, t, r) {
      this.cfg = this.cfg.extend(r), this._xformMode = e, this._key = t, this.reset();
    },
    reset: function reset() {
      h.reset.call(this), this._doReset();
    },
    process: function process(e) {
      return this._append(e), this._process();
    },
    finalize: function finalize(e) {
      e && this._append(e);

      var t = this._doFinalize();

      return t;
    },
    keySize: 4,
    ivSize: 4,
    _ENC_XFORM_MODE: 1,
    _DEC_XFORM_MODE: 2,
    _createHelper: function () {
      function e(e) {
        return "string" == typeof e ? x : k;
      }

      return function (t) {
        return {
          encrypt: function encrypt(r, n, i) {
            return e(n).encrypt(t, r, n, i);
          },
          decrypt: function decrypt(r, n, i) {
            return e(n).decrypt(t, r, n, i);
          } };

      };
    }() }),
  o.StreamCipher = d.extend({
    _doFinalize: function _doFinalize() {
      var e = this._process(!0);

      return e;
    },
    blockSize: 1 }),
  p = i.mode = {}, _ = o.BlockCipherMode = a.extend({
    createEncryptor: function createEncryptor(e, t) {
      return this.Encryptor.create(e, t);
    },
    createDecryptor: function createDecryptor(e, t) {
      return this.Decryptor.create(e, t);
    },
    init: function init(e, t) {
      this._cipher = e, this._iv = t;
    } }),
  g = p.CBC = function () {
    var e = _.extend();

    function t(e, t, r) {
      var i = this._iv;

      if (i) {
        var o = i;
        this._iv = n;
      } else var o = this._prevBlock;

      for (var a = 0; a < r; a++) {e[t + a] ^= o[a];}
    }

    return e.Encryptor = e.extend({
      processBlock: function processBlock(e, r) {
        var n = this._cipher,
        i = n.blockSize;
        t.call(this, e, r, i), n.encryptBlock(e, r), this._prevBlock = e.slice(r, r + i);
      } }),
    e.Decryptor = e.extend({
      processBlock: function processBlock(e, r) {
        var n = this._cipher,
        i = n.blockSize,
        o = e.slice(r, r + i);
        n.decryptBlock(e, r), t.call(this, e, r, i), this._prevBlock = o;
      } }),
    e;
  }(), v = i.pad = {}, w = v.Pkcs7 = {
    pad: function pad(e, t) {
      for (var r = 4 * t, n = r - e.sigBytes % r, i = n << 24 | n << 16 | n << 8 | n, o = [], a = 0; a < n; a += 4) {o.push(i);}

      var h = s.create(o, n);
      e.concat(h);
    },
    unpad: function unpad(e) {
      var t = 255 & e.words[e.sigBytes - 1 >>> 2];
      e.sigBytes -= t;
    } },
  o.BlockCipher = d.extend({
    cfg: d.cfg.extend({
      mode: g,
      padding: w }),

    reset: function reset() {
      d.reset.call(this);
      var e = this.cfg,
      t = e.iv,
      r = e.mode;
      if (this._xformMode == this._ENC_XFORM_MODE) var n = r.createEncryptor;else {
        var n = r.createDecryptor;
        this._minBufferSize = 1;
      }
      this._mode && this._mode.__creator == n ? this._mode.init(this, t && t.words) : (this._mode = n.call(r, this, t && t.words), this._mode.__creator = n);
    },
    _doProcessBlock: function _doProcessBlock(e, t) {
      this._mode.processBlock(e, t);
    },
    _doFinalize: function _doFinalize() {
      var e = this.cfg.padding;

      if (this._xformMode == this._ENC_XFORM_MODE) {
        e.pad(this._data, this.blockSize);

        var t = this._process(!0);
      } else {
        var t = this._process(!0);

        e.unpad(t);
      }

      return t;
    },
    blockSize: 4 }),
  b = o.CipherParams = a.extend({
    init: function init(e) {
      this.mixIn(e);
    },
    toString: function toString(e) {
      return (e || this.formatter).stringify(this);
    } }),
  y = i.format = {}, m = y.OpenSSL = {
    stringify: function stringify(e) {
      var t = e.ciphertext,
      r = e.salt;
      if (r) var n = s.create([1398893684, 1701076831]).concat(r).concat(t);else var n = t;
      return n.toString(f);
    },
    parse: function parse(e) {
      var t = f.parse(e),
      r = t.words;

      if (1398893684 == r[0] && 1701076831 == r[1]) {
        var n = s.create(r.slice(2, 4));
        r.splice(0, 4), t.sigBytes -= 16;
      }

      return b.create({
        ciphertext: t,
        salt: n });

    } },
  k = o.SerializableCipher = a.extend({
    cfg: a.extend({
      format: m }),

    encrypt: function encrypt(e, t, r, n) {
      n = this.cfg.extend(n);
      var i = e.createEncryptor(r, n),
      o = i.finalize(t),
      a = i.cfg;
      return b.create({
        ciphertext: o,
        key: r,
        iv: a.iv,
        algorithm: e,
        mode: a.mode,
        padding: a.padding,
        blockSize: e.blockSize,
        formatter: n.format });

    },
    decrypt: function decrypt(e, t, r, n) {
      n = this.cfg.extend(n), t = this._parse(t, n.format);
      var i = e.createDecryptor(r, n).finalize(t.ciphertext);
      return i;
    },
    _parse: function _parse(e, t) {
      return "string" == typeof e ? t.parse(e, this) : e;
    } }),
  E = i.kdf = {}, S = E.OpenSSL = {
    execute: function execute(e, t, r, n) {
      n || (n = s.random(8));
      var i = u.create({
        keySize: t + r }).
      compute(e, n),
      o = s.create(i.words.slice(t), 4 * r);
      return i.sigBytes = 4 * t, b.create({
        key: i,
        iv: o,
        salt: n });

    } },
  x = o.PasswordBasedCipher = k.extend({
    cfg: k.cfg.extend({
      kdf: S }),

    encrypt: function encrypt(e, t, r, n) {
      var i = (n = this.cfg.extend(n)).kdf.execute(r, e.keySize, e.ivSize);
      n.iv = i.iv;
      var o = k.encrypt.call(this, e, t, i.key, n);
      return o.mixIn(i), o;
    },
    decrypt: function decrypt(e, t, r, n) {
      n = this.cfg.extend(n), t = this._parse(t, n.format);
      var i = n.kdf.execute(r, e.keySize, e.ivSize, t.salt);
      n.iv = i.iv;
      var o = k.decrypt.call(this, e, t, i.key, n);
      return o;
    } })));

}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).mode.CFB = function () {
    var e = r.lib.BlockCipherMode.extend();

    function t(e, t, r, n) {
      var i = this._iv;

      if (i) {
        var o = i.slice(0);
        this._iv = void 0;
      } else o = this._prevBlock;

      n.encryptBlock(o, 0);

      for (var a = 0; a < r; a++) {e[t + a] ^= o[a];}
    }

    return e.Encryptor = e.extend({
      processBlock: function processBlock(e, r) {
        var n = this._cipher,
        i = n.blockSize;
        t.call(this, e, r, i, n), this._prevBlock = e.slice(r, r + i);
      } }),
    e.Decryptor = e.extend({
      processBlock: function processBlock(e, r) {
        var n = this._cipher,
        i = n.blockSize,
        o = e.slice(r, r + i);
        t.call(this, e, r, i, n), this._prevBlock = o;
      } }),
    e;
  }(), r.mode.CFB);
}), Q(function (e, t) {
  var r, n, i;
  e.exports = ((r = ee).mode.CTR = (n = r.lib.BlockCipherMode.extend(), i = n.Encryptor = n.extend({
    processBlock: function processBlock(e, t) {
      var r = this._cipher,
      n = r.blockSize,
      i = this._iv,
      o = this._counter;
      i && (o = this._counter = i.slice(0), this._iv = void 0);
      var a = o.slice(0);
      r.encryptBlock(a, 0), o[n - 1] = o[n - 1] + 1 | 0;

      for (var s = 0; s < n; s++) {e[t + s] ^= a[s];}
    } }),
  n.Decryptor = i, n), r.mode.CTR);
}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).mode.CTRGladman = function () {
    var e = r.lib.BlockCipherMode.extend();

    function t(e) {
      if (255 == (e >> 24 & 255)) {
        var t = e >> 16 & 255,
        r = e >> 8 & 255,
        n = 255 & e;
        255 === t ? (t = 0, 255 === r ? (r = 0, 255 === n ? n = 0 : ++n) : ++r) : ++t, e = 0, e += t << 16, e += r << 8, e += n;
      } else e += 1 << 24;

      return e;
    }

    var n = e.Encryptor = e.extend({
      processBlock: function processBlock(e, r) {
        var n = this._cipher,
        i = n.blockSize,
        o = this._iv,
        a = this._counter;
        o && (a = this._counter = o.slice(0), this._iv = void 0), function (e) {
          0 === (e[0] = t(e[0])) && (e[1] = t(e[1]));
        }(a);
        var s = a.slice(0);
        n.encryptBlock(s, 0);

        for (var h = 0; h < i; h++) {e[r + h] ^= s[h];}
      } });

    return e.Decryptor = n, e;
  }(), r.mode.CTRGladman);
}), Q(function (e, t) {
  var r, n, i;
  e.exports = ((r = ee).mode.OFB = (n = r.lib.BlockCipherMode.extend(), i = n.Encryptor = n.extend({
    processBlock: function processBlock(e, t) {
      var r = this._cipher,
      n = r.blockSize,
      i = this._iv,
      o = this._keystream;
      i && (o = this._keystream = i.slice(0), this._iv = void 0), r.encryptBlock(o, 0);

      for (var a = 0; a < n; a++) {e[t + a] ^= o[a];}
    } }),
  n.Decryptor = i, n), r.mode.OFB);
}), Q(function (e, t) {
  var r, n;
  e.exports = ((r = ee).mode.ECB = ((n = r.lib.BlockCipherMode.extend()).Encryptor = n.extend({
    processBlock: function processBlock(e, t) {
      this._cipher.encryptBlock(e, t);
    } }),
  n.Decryptor = n.extend({
    processBlock: function processBlock(e, t) {
      this._cipher.decryptBlock(e, t);
    } }),
  n), r.mode.ECB);
}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).pad.AnsiX923 = {
    pad: function pad(e, t) {
      var r = e.sigBytes,
      n = 4 * t,
      i = n - r % n,
      o = r + i - 1;
      e.clamp(), e.words[o >>> 2] |= i << 24 - o % 4 * 8, e.sigBytes += i;
    },
    unpad: function unpad(e) {
      var t = 255 & e.words[e.sigBytes - 1 >>> 2];
      e.sigBytes -= t;
    } },
  r.pad.Ansix923);
}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).pad.Iso10126 = {
    pad: function pad(e, t) {
      var n = 4 * t,
      i = n - e.sigBytes % n;
      e.concat(r.lib.WordArray.random(i - 1)).concat(r.lib.WordArray.create([i << 24], 1));
    },
    unpad: function unpad(e) {
      var t = 255 & e.words[e.sigBytes - 1 >>> 2];
      e.sigBytes -= t;
    } },
  r.pad.Iso10126);
}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).pad.Iso97971 = {
    pad: function pad(e, t) {
      e.concat(r.lib.WordArray.create([2147483648], 1)), r.pad.ZeroPadding.pad(e, t);
    },
    unpad: function unpad(e) {
      r.pad.ZeroPadding.unpad(e), e.sigBytes--;
    } },
  r.pad.Iso97971);
}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).pad.ZeroPadding = {
    pad: function pad(e, t) {
      var r = 4 * t;
      e.clamp(), e.sigBytes += r - (e.sigBytes % r || r);
    },
    unpad: function unpad(e) {
      for (var t = e.words, r = e.sigBytes - 1; !(t[r >>> 2] >>> 24 - r % 4 * 8 & 255);) {r--;}

      e.sigBytes = r + 1;
    } },
  r.pad.ZeroPadding);
}), Q(function (e, t) {
  var r;
  e.exports = ((r = ee).pad.NoPadding = {
    pad: function pad() {},
    unpad: function unpad() {} },
  r.pad.NoPadding);
}), Q(function (e, t) {
  var r, n, i, o;
  e.exports = (i = (n = r = ee).lib.CipherParams, o = n.enc.Hex, n.format.Hex = {
    stringify: function stringify(e) {
      return e.ciphertext.toString(o);
    },
    parse: function parse(e) {
      var t = o.parse(e);
      return i.create({
        ciphertext: t });

    } },
  r.format.Hex);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib.BlockCipher,
    n = e.algo,
    i = [],
    o = [],
    a = [],
    s = [],
    h = [],
    l = [],
    f = [],
    c = [],
    u = [],
    d = [];
    !function () {
      for (var e = [], t = 0; t < 256; t++) {e[t] = t < 128 ? t << 1 : t << 1 ^ 283;}

      var r = 0,
      n = 0;

      for (t = 0; t < 256; t++) {
        var p = n ^ n << 1 ^ n << 2 ^ n << 3 ^ n << 4;
        p = p >>> 8 ^ 255 & p ^ 99, i[r] = p, o[p] = r;
        var _ = e[r],
        g = e[_],
        v = e[g],
        w = 257 * e[p] ^ 16843008 * p;
        a[r] = w << 24 | w >>> 8, s[r] = w << 16 | w >>> 16, h[r] = w << 8 | w >>> 24, l[r] = w, w = 16843009 * v ^ 65537 * g ^ 257 * _ ^ 16843008 * r, f[p] = w << 24 | w >>> 8, c[p] = w << 16 | w >>> 16, u[p] = w << 8 | w >>> 24, d[p] = w, r ? (r = _ ^ e[e[e[v ^ _]]], n ^= e[e[n]]) : r = n = 1;
      }
    }();

    var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
    _ = n.AES = t.extend({
      _doReset: function _doReset() {
        if (!this._nRounds || this._keyPriorReset !== this._key) {
          for (var e = this._keyPriorReset = this._key, t = e.words, r = e.sigBytes / 4, n = 4 * ((this._nRounds = r + 6) + 1), o = this._keySchedule = [], a = 0; a < n; a++) {if (a < r) o[a] = t[a];else {
              var s = o[a - 1];
              a % r ? r > 6 && a % r == 4 && (s = i[s >>> 24] << 24 | i[s >>> 16 & 255] << 16 | i[s >>> 8 & 255] << 8 | i[255 & s]) : (s = i[(s = s << 8 | s >>> 24) >>> 24] << 24 | i[s >>> 16 & 255] << 16 | i[s >>> 8 & 255] << 8 | i[255 & s], s ^= p[a / r | 0] << 24), o[a] = o[a - r] ^ s;
            }}

          for (var h = this._invKeySchedule = [], l = 0; l < n; l++) {a = n - l, s = l % 4 ? o[a] : o[a - 4], h[l] = l < 4 || a <= 4 ? s : f[i[s >>> 24]] ^ c[i[s >>> 16 & 255]] ^ u[i[s >>> 8 & 255]] ^ d[i[255 & s]];}
        }
      },
      encryptBlock: function encryptBlock(e, t) {
        this._doCryptBlock(e, t, this._keySchedule, a, s, h, l, i);
      },
      decryptBlock: function decryptBlock(e, t) {
        var r = e[t + 1];
        e[t + 1] = e[t + 3], e[t + 3] = r, this._doCryptBlock(e, t, this._invKeySchedule, f, c, u, d, o), r = e[t + 1], e[t + 1] = e[t + 3], e[t + 3] = r;
      },
      _doCryptBlock: function _doCryptBlock(e, t, r, n, i, o, a, s) {
        for (var h = this._nRounds, l = e[t] ^ r[0], f = e[t + 1] ^ r[1], c = e[t + 2] ^ r[2], u = e[t + 3] ^ r[3], d = 4, p = 1; p < h; p++) {
          var _ = n[l >>> 24] ^ i[f >>> 16 & 255] ^ o[c >>> 8 & 255] ^ a[255 & u] ^ r[d++],
          g = n[f >>> 24] ^ i[c >>> 16 & 255] ^ o[u >>> 8 & 255] ^ a[255 & l] ^ r[d++],
          v = n[c >>> 24] ^ i[u >>> 16 & 255] ^ o[l >>> 8 & 255] ^ a[255 & f] ^ r[d++],
          w = n[u >>> 24] ^ i[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ a[255 & c] ^ r[d++];

          l = _, f = g, c = v, u = w;
        }

        _ = (s[l >>> 24] << 24 | s[f >>> 16 & 255] << 16 | s[c >>> 8 & 255] << 8 | s[255 & u]) ^ r[d++], g = (s[f >>> 24] << 24 | s[c >>> 16 & 255] << 16 | s[u >>> 8 & 255] << 8 | s[255 & l]) ^ r[d++], v = (s[c >>> 24] << 24 | s[u >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & f]) ^ r[d++], w = (s[u >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[f >>> 8 & 255] << 8 | s[255 & c]) ^ r[d++], e[t] = _, e[t + 1] = g, e[t + 2] = v, e[t + 3] = w;
      },
      keySize: 8 });


    e.AES = t._createHelper(_);
  }(), r.AES);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib,
    n = t.WordArray,
    i = t.BlockCipher,
    o = e.algo,
    a = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
    s = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
    h = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
    l = [{
      0: 8421888,
      268435456: 32768,
      536870912: 8421378,
      805306368: 2,
      1073741824: 512,
      1342177280: 8421890,
      1610612736: 8389122,
      1879048192: 8388608,
      2147483648: 514,
      2415919104: 8389120,
      2684354560: 33280,
      2952790016: 8421376,
      3221225472: 32770,
      3489660928: 8388610,
      3758096384: 0,
      4026531840: 33282,
      134217728: 0,
      402653184: 8421890,
      671088640: 33282,
      939524096: 32768,
      1207959552: 8421888,
      1476395008: 512,
      1744830464: 8421378,
      2013265920: 2,
      2281701376: 8389120,
      2550136832: 33280,
      2818572288: 8421376,
      3087007744: 8389122,
      3355443200: 8388610,
      3623878656: 32770,
      3892314112: 514,
      4160749568: 8388608,
      1: 32768,
      268435457: 2,
      536870913: 8421888,
      805306369: 8388608,
      1073741825: 8421378,
      1342177281: 33280,
      1610612737: 512,
      1879048193: 8389122,
      2147483649: 8421890,
      2415919105: 8421376,
      2684354561: 8388610,
      2952790017: 33282,
      3221225473: 514,
      3489660929: 8389120,
      3758096385: 32770,
      4026531841: 0,
      134217729: 8421890,
      402653185: 8421376,
      671088641: 8388608,
      939524097: 512,
      1207959553: 32768,
      1476395009: 8388610,
      1744830465: 2,
      2013265921: 33282,
      2281701377: 32770,
      2550136833: 8389122,
      2818572289: 514,
      3087007745: 8421888,
      3355443201: 8389120,
      3623878657: 0,
      3892314113: 33280,
      4160749569: 8421378 },
    {
      0: 1074282512,
      16777216: 16384,
      33554432: 524288,
      50331648: 1074266128,
      67108864: 1073741840,
      83886080: 1074282496,
      100663296: 1073758208,
      117440512: 16,
      134217728: 540672,
      150994944: 1073758224,
      167772160: 1073741824,
      184549376: 540688,
      201326592: 524304,
      218103808: 0,
      234881024: 16400,
      251658240: 1074266112,
      8388608: 1073758208,
      25165824: 540688,
      41943040: 16,
      58720256: 1073758224,
      75497472: 1074282512,
      92274688: 1073741824,
      109051904: 524288,
      125829120: 1074266128,
      142606336: 524304,
      159383552: 0,
      176160768: 16384,
      192937984: 1074266112,
      209715200: 1073741840,
      226492416: 540672,
      243269632: 1074282496,
      260046848: 16400,
      268435456: 0,
      285212672: 1074266128,
      301989888: 1073758224,
      318767104: 1074282496,
      335544320: 1074266112,
      352321536: 16,
      369098752: 540688,
      385875968: 16384,
      402653184: 16400,
      419430400: 524288,
      436207616: 524304,
      452984832: 1073741840,
      469762048: 540672,
      486539264: 1073758208,
      503316480: 1073741824,
      520093696: 1074282512,
      276824064: 540688,
      293601280: 524288,
      310378496: 1074266112,
      327155712: 16384,
      343932928: 1073758208,
      360710144: 1074282512,
      377487360: 16,
      394264576: 1073741824,
      411041792: 1074282496,
      427819008: 1073741840,
      444596224: 1073758224,
      461373440: 524304,
      478150656: 0,
      494927872: 16400,
      511705088: 1074266128,
      528482304: 540672 },
    {
      0: 260,
      1048576: 0,
      2097152: 67109120,
      3145728: 65796,
      4194304: 65540,
      5242880: 67108868,
      6291456: 67174660,
      7340032: 67174400,
      8388608: 67108864,
      9437184: 67174656,
      10485760: 65792,
      11534336: 67174404,
      12582912: 67109124,
      13631488: 65536,
      14680064: 4,
      15728640: 256,
      524288: 67174656,
      1572864: 67174404,
      2621440: 0,
      3670016: 67109120,
      4718592: 67108868,
      5767168: 65536,
      6815744: 65540,
      7864320: 260,
      8912896: 4,
      9961472: 256,
      11010048: 67174400,
      12058624: 65796,
      13107200: 65792,
      14155776: 67109124,
      15204352: 67174660,
      16252928: 67108864,
      16777216: 67174656,
      17825792: 65540,
      18874368: 65536,
      19922944: 67109120,
      20971520: 256,
      22020096: 67174660,
      23068672: 67108868,
      24117248: 0,
      25165824: 67109124,
      26214400: 67108864,
      27262976: 4,
      28311552: 65792,
      29360128: 67174400,
      30408704: 260,
      31457280: 65796,
      32505856: 67174404,
      17301504: 67108864,
      18350080: 260,
      19398656: 67174656,
      20447232: 0,
      21495808: 65540,
      22544384: 67109120,
      23592960: 256,
      24641536: 67174404,
      25690112: 65536,
      26738688: 67174660,
      27787264: 65796,
      28835840: 67108868,
      29884416: 67109124,
      30932992: 67174400,
      31981568: 4,
      33030144: 65792 },
    {
      0: 2151682048,
      65536: 2147487808,
      131072: 4198464,
      196608: 2151677952,
      262144: 0,
      327680: 4198400,
      393216: 2147483712,
      458752: 4194368,
      524288: 2147483648,
      589824: 4194304,
      655360: 64,
      720896: 2147487744,
      786432: 2151678016,
      851968: 4160,
      917504: 4096,
      983040: 2151682112,
      32768: 2147487808,
      98304: 64,
      163840: 2151678016,
      229376: 2147487744,
      294912: 4198400,
      360448: 2151682112,
      425984: 0,
      491520: 2151677952,
      557056: 4096,
      622592: 2151682048,
      688128: 4194304,
      753664: 4160,
      819200: 2147483648,
      884736: 4194368,
      950272: 4198464,
      1015808: 2147483712,
      1048576: 4194368,
      1114112: 4198400,
      1179648: 2147483712,
      1245184: 0,
      1310720: 4160,
      1376256: 2151678016,
      1441792: 2151682048,
      1507328: 2147487808,
      1572864: 2151682112,
      1638400: 2147483648,
      1703936: 2151677952,
      1769472: 4198464,
      1835008: 2147487744,
      1900544: 4194304,
      1966080: 64,
      2031616: 4096,
      1081344: 2151677952,
      1146880: 2151682112,
      1212416: 0,
      1277952: 4198400,
      1343488: 4194368,
      1409024: 2147483648,
      1474560: 2147487808,
      1540096: 64,
      1605632: 2147483712,
      1671168: 4096,
      1736704: 2147487744,
      1802240: 2151678016,
      1867776: 4160,
      1933312: 2151682048,
      1998848: 4194304,
      2064384: 4198464 },
    {
      0: 128,
      4096: 17039360,
      8192: 262144,
      12288: 536870912,
      16384: 537133184,
      20480: 16777344,
      24576: 553648256,
      28672: 262272,
      32768: 16777216,
      36864: 537133056,
      40960: 536871040,
      45056: 553910400,
      49152: 553910272,
      53248: 0,
      57344: 17039488,
      61440: 553648128,
      2048: 17039488,
      6144: 553648256,
      10240: 128,
      14336: 17039360,
      18432: 262144,
      22528: 537133184,
      26624: 553910272,
      30720: 536870912,
      34816: 537133056,
      38912: 0,
      43008: 553910400,
      47104: 16777344,
      51200: 536871040,
      55296: 553648128,
      59392: 16777216,
      63488: 262272,
      65536: 262144,
      69632: 128,
      73728: 536870912,
      77824: 553648256,
      81920: 16777344,
      86016: 553910272,
      90112: 537133184,
      94208: 16777216,
      98304: 553910400,
      102400: 553648128,
      106496: 17039360,
      110592: 537133056,
      114688: 262272,
      118784: 536871040,
      122880: 0,
      126976: 17039488,
      67584: 553648256,
      71680: 16777216,
      75776: 17039360,
      79872: 537133184,
      83968: 536870912,
      88064: 17039488,
      92160: 128,
      96256: 553910272,
      100352: 262272,
      104448: 553910400,
      108544: 0,
      112640: 553648128,
      116736: 16777344,
      120832: 262144,
      124928: 537133056,
      129024: 536871040 },
    {
      0: 268435464,
      256: 8192,
      512: 270532608,
      768: 270540808,
      1024: 268443648,
      1280: 2097152,
      1536: 2097160,
      1792: 268435456,
      2048: 0,
      2304: 268443656,
      2560: 2105344,
      2816: 8,
      3072: 270532616,
      3328: 2105352,
      3584: 8200,
      3840: 270540800,
      128: 270532608,
      384: 270540808,
      640: 8,
      896: 2097152,
      1152: 2105352,
      1408: 268435464,
      1664: 268443648,
      1920: 8200,
      2176: 2097160,
      2432: 8192,
      2688: 268443656,
      2944: 270532616,
      3200: 0,
      3456: 270540800,
      3712: 2105344,
      3968: 268435456,
      4096: 268443648,
      4352: 270532616,
      4608: 270540808,
      4864: 8200,
      5120: 2097152,
      5376: 268435456,
      5632: 268435464,
      5888: 2105344,
      6144: 2105352,
      6400: 0,
      6656: 8,
      6912: 270532608,
      7168: 8192,
      7424: 268443656,
      7680: 270540800,
      7936: 2097160,
      4224: 8,
      4480: 2105344,
      4736: 2097152,
      4992: 268435464,
      5248: 268443648,
      5504: 8200,
      5760: 270540808,
      6016: 270532608,
      6272: 270540800,
      6528: 270532616,
      6784: 8192,
      7040: 2105352,
      7296: 2097160,
      7552: 0,
      7808: 268435456,
      8064: 268443656 },
    {
      0: 1048576,
      16: 33555457,
      32: 1024,
      48: 1049601,
      64: 34604033,
      80: 0,
      96: 1,
      112: 34603009,
      128: 33555456,
      144: 1048577,
      160: 33554433,
      176: 34604032,
      192: 34603008,
      208: 1025,
      224: 1049600,
      240: 33554432,
      8: 34603009,
      24: 0,
      40: 33555457,
      56: 34604032,
      72: 1048576,
      88: 33554433,
      104: 33554432,
      120: 1025,
      136: 1049601,
      152: 33555456,
      168: 34603008,
      184: 1048577,
      200: 1024,
      216: 34604033,
      232: 1,
      248: 1049600,
      256: 33554432,
      272: 1048576,
      288: 33555457,
      304: 34603009,
      320: 1048577,
      336: 33555456,
      352: 34604032,
      368: 1049601,
      384: 1025,
      400: 34604033,
      416: 1049600,
      432: 1,
      448: 0,
      464: 34603008,
      480: 33554433,
      496: 1024,
      264: 1049600,
      280: 33555457,
      296: 34603009,
      312: 1,
      328: 33554432,
      344: 1048576,
      360: 1025,
      376: 34604032,
      392: 33554433,
      408: 34603008,
      424: 0,
      440: 34604033,
      456: 1049601,
      472: 1024,
      488: 33555456,
      504: 1048577 },
    {
      0: 134219808,
      1: 131072,
      2: 134217728,
      3: 32,
      4: 131104,
      5: 134350880,
      6: 134350848,
      7: 2048,
      8: 134348800,
      9: 134219776,
      10: 133120,
      11: 134348832,
      12: 2080,
      13: 0,
      14: 134217760,
      15: 133152,
      2147483648: 2048,
      2147483649: 134350880,
      2147483650: 134219808,
      2147483651: 134217728,
      2147483652: 134348800,
      2147483653: 133120,
      2147483654: 133152,
      2147483655: 32,
      2147483656: 134217760,
      2147483657: 2080,
      2147483658: 131104,
      2147483659: 134350848,
      2147483660: 0,
      2147483661: 134348832,
      2147483662: 134219776,
      2147483663: 131072,
      16: 133152,
      17: 134350848,
      18: 32,
      19: 2048,
      20: 134219776,
      21: 134217760,
      22: 134348832,
      23: 131072,
      24: 0,
      25: 131104,
      26: 134348800,
      27: 134219808,
      28: 134350880,
      29: 133120,
      30: 2080,
      31: 134217728,
      2147483664: 131072,
      2147483665: 2048,
      2147483666: 134348832,
      2147483667: 133152,
      2147483668: 32,
      2147483669: 134348800,
      2147483670: 134217728,
      2147483671: 134219808,
      2147483672: 134350880,
      2147483673: 134217760,
      2147483674: 134219776,
      2147483675: 0,
      2147483676: 133120,
      2147483677: 2080,
      2147483678: 131104,
      2147483679: 134350848 }],

    f = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
    c = o.DES = i.extend({
      _doReset: function _doReset() {
        for (var e = this._key.words, t = [], r = 0; r < 56; r++) {
          var n = a[r] - 1;
          t[r] = e[n >>> 5] >>> 31 - n % 32 & 1;
        }

        for (var i = this._subKeys = [], o = 0; o < 16; o++) {
          var l = i[o] = [],
          f = h[o];

          for (r = 0; r < 24; r++) {l[r / 6 | 0] |= t[(s[r] - 1 + f) % 28] << 31 - r % 6, l[4 + (r / 6 | 0)] |= t[28 + (s[r + 24] - 1 + f) % 28] << 31 - r % 6;}

          for (l[0] = l[0] << 1 | l[0] >>> 31, r = 1; r < 7; r++) {l[r] = l[r] >>> 4 * (r - 1) + 3;}

          l[7] = l[7] << 5 | l[7] >>> 27;
        }

        var c = this._invSubKeys = [];

        for (r = 0; r < 16; r++) {c[r] = i[15 - r];}
      },
      encryptBlock: function encryptBlock(e, t) {
        this._doCryptBlock(e, t, this._subKeys);
      },
      decryptBlock: function decryptBlock(e, t) {
        this._doCryptBlock(e, t, this._invSubKeys);
      },
      _doCryptBlock: function _doCryptBlock(e, t, r) {
        this._lBlock = e[t], this._rBlock = e[t + 1], u.call(this, 4, 252645135), u.call(this, 16, 65535), d.call(this, 2, 858993459), d.call(this, 8, 16711935), u.call(this, 1, 1431655765);

        for (var n = 0; n < 16; n++) {
          for (var i = r[n], o = this._lBlock, a = this._rBlock, s = 0, h = 0; h < 8; h++) {s |= l[h][((a ^ i[h]) & f[h]) >>> 0];}

          this._lBlock = a, this._rBlock = o ^ s;
        }

        var c = this._lBlock;
        this._lBlock = this._rBlock, this._rBlock = c, u.call(this, 1, 1431655765), d.call(this, 8, 16711935), d.call(this, 2, 858993459), u.call(this, 16, 65535), u.call(this, 4, 252645135), e[t] = this._lBlock, e[t + 1] = this._rBlock;
      },
      keySize: 2,
      ivSize: 2,
      blockSize: 2 });


    function u(e, t) {
      var r = (this._lBlock >>> e ^ this._rBlock) & t;
      this._rBlock ^= r, this._lBlock ^= r << e;
    }

    function d(e, t) {
      var r = (this._rBlock >>> e ^ this._lBlock) & t;
      this._lBlock ^= r, this._rBlock ^= r << e;
    }

    e.DES = i._createHelper(c);
    var p = o.TripleDES = i.extend({
      _doReset: function _doReset() {
        var e = this._key.words;
        this._des1 = c.createEncryptor(n.create(e.slice(0, 2))), this._des2 = c.createEncryptor(n.create(e.slice(2, 4))), this._des3 = c.createEncryptor(n.create(e.slice(4, 6)));
      },
      encryptBlock: function encryptBlock(e, t) {
        this._des1.encryptBlock(e, t), this._des2.decryptBlock(e, t), this._des3.encryptBlock(e, t);
      },
      decryptBlock: function decryptBlock(e, t) {
        this._des3.decryptBlock(e, t), this._des2.encryptBlock(e, t), this._des1.decryptBlock(e, t);
      },
      keySize: 6,
      ivSize: 2,
      blockSize: 2 });

    e.TripleDES = i._createHelper(p);
  }(), r.TripleDES);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib.StreamCipher,
    n = e.algo,
    i = n.RC4 = t.extend({
      _doReset: function _doReset() {
        for (var e = this._key, t = e.words, r = e.sigBytes, n = this._S = [], i = 0; i < 256; i++) {n[i] = i;}

        i = 0;

        for (var o = 0; i < 256; i++) {
          var a = i % r,
          s = t[a >>> 2] >>> 24 - a % 4 * 8 & 255;
          o = (o + n[i] + s) % 256;
          var h = n[i];
          n[i] = n[o], n[o] = h;
        }

        this._i = this._j = 0;
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        e[t] ^= o.call(this);
      },
      keySize: 8,
      ivSize: 0 });


    function o() {
      for (var e = this._S, t = this._i, r = this._j, n = 0, i = 0; i < 4; i++) {
        r = (r + e[t = (t + 1) % 256]) % 256;
        var o = e[t];
        e[t] = e[r], e[r] = o, n |= e[(e[t] + e[r]) % 256] << 24 - 8 * i;
      }

      return this._i = t, this._j = r, n;
    }

    e.RC4 = t._createHelper(i);
    var a = n.RC4Drop = i.extend({
      cfg: i.cfg.extend({
        drop: 192 }),

      _doReset: function _doReset() {
        i._doReset.call(this);

        for (var e = this.cfg.drop; e > 0; e--) {o.call(this);}
      } });

    e.RC4Drop = t._createHelper(a);
  }(), r.RC4);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib.StreamCipher,
    n = e.algo,
    i = [],
    o = [],
    a = [],
    s = n.Rabbit = t.extend({
      _doReset: function _doReset() {
        for (var e = this._key.words, t = this.cfg.iv, r = 0; r < 4; r++) {e[r] = 16711935 & (e[r] << 8 | e[r] >>> 24) | 4278255360 & (e[r] << 24 | e[r] >>> 8);}

        var n = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],
        i = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];

        for (this._b = 0, r = 0; r < 4; r++) {h.call(this);}

        for (r = 0; r < 8; r++) {i[r] ^= n[r + 4 & 7];}

        if (t) {
          var o = t.words,
          a = o[0],
          s = o[1],
          l = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
          f = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
          c = l >>> 16 | 4294901760 & f,
          u = f << 16 | 65535 & l;

          for (i[0] ^= l, i[1] ^= c, i[2] ^= f, i[3] ^= u, i[4] ^= l, i[5] ^= c, i[6] ^= f, i[7] ^= u, r = 0; r < 4; r++) {h.call(this);}
        }
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        var r = this._X;
        h.call(this), i[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16, i[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16, i[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16, i[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;

        for (var n = 0; n < 4; n++) {i[n] = 16711935 & (i[n] << 8 | i[n] >>> 24) | 4278255360 & (i[n] << 24 | i[n] >>> 8), e[t + n] ^= i[n];}
      },
      blockSize: 4,
      ivSize: 2 });


    function h() {
      for (var e = this._X, t = this._C, r = 0; r < 8; r++) {o[r] = t[r];}

      for (t[0] = t[0] + 1295307597 + this._b | 0, t[1] = t[1] + 3545052371 + (t[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0, t[2] = t[2] + 886263092 + (t[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0, t[3] = t[3] + 1295307597 + (t[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0, t[4] = t[4] + 3545052371 + (t[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0, t[5] = t[5] + 886263092 + (t[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0, t[6] = t[6] + 1295307597 + (t[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0, t[7] = t[7] + 3545052371 + (t[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0, this._b = t[7] >>> 0 < o[7] >>> 0 ? 1 : 0, r = 0; r < 8; r++) {
        var n = e[r] + t[r],
        i = 65535 & n,
        s = n >>> 16,
        h = ((i * i >>> 17) + i * s >>> 15) + s * s,
        l = ((4294901760 & n) * n | 0) + ((65535 & n) * n | 0);
        a[r] = h ^ l;
      }

      e[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, e[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, e[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, e[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, e[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, e[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, e[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, e[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;
    }

    e.Rabbit = t._createHelper(s);
  }(), r.Rabbit);
}), Q(function (e, t) {
  var r;
  e.exports = (r = ee, function () {
    var e = r,
    t = e.lib.StreamCipher,
    n = e.algo,
    i = [],
    o = [],
    a = [],
    s = n.RabbitLegacy = t.extend({
      _doReset: function _doReset() {
        var e = this._key.words,
        t = this.cfg.iv,
        r = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],
        n = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];
        this._b = 0;

        for (var i = 0; i < 4; i++) {h.call(this);}

        for (i = 0; i < 8; i++) {n[i] ^= r[i + 4 & 7];}

        if (t) {
          var o = t.words,
          a = o[0],
          s = o[1],
          l = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
          f = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
          c = l >>> 16 | 4294901760 & f,
          u = f << 16 | 65535 & l;

          for (n[0] ^= l, n[1] ^= c, n[2] ^= f, n[3] ^= u, n[4] ^= l, n[5] ^= c, n[6] ^= f, n[7] ^= u, i = 0; i < 4; i++) {h.call(this);}
        }
      },
      _doProcessBlock: function _doProcessBlock(e, t) {
        var r = this._X;
        h.call(this), i[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16, i[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16, i[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16, i[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;

        for (var n = 0; n < 4; n++) {i[n] = 16711935 & (i[n] << 8 | i[n] >>> 24) | 4278255360 & (i[n] << 24 | i[n] >>> 8), e[t + n] ^= i[n];}
      },
      blockSize: 4,
      ivSize: 2 });


    function h() {
      for (var e = this._X, t = this._C, r = 0; r < 8; r++) {o[r] = t[r];}

      for (t[0] = t[0] + 1295307597 + this._b | 0, t[1] = t[1] + 3545052371 + (t[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0, t[2] = t[2] + 886263092 + (t[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0, t[3] = t[3] + 1295307597 + (t[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0, t[4] = t[4] + 3545052371 + (t[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0, t[5] = t[5] + 886263092 + (t[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0, t[6] = t[6] + 1295307597 + (t[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0, t[7] = t[7] + 3545052371 + (t[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0, this._b = t[7] >>> 0 < o[7] >>> 0 ? 1 : 0, r = 0; r < 8; r++) {
        var n = e[r] + t[r],
        i = 65535 & n,
        s = n >>> 16,
        h = ((i * i >>> 17) + i * s >>> 15) + s * s,
        l = ((4294901760 & n) * n | 0) + ((65535 & n) * n | 0);
        a[r] = h ^ l;
      }

      e[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, e[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, e[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, e[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, e[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, e[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, e[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, e[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;
    }

    e.RabbitLegacy = t._createHelper(s);
  }(), r.RabbitLegacy);
}), Q(function (e, t) {
  e.exports = ee;
}));

function re() {
  throw new Error("setTimeout has not been defined");
}

function ne() {
  throw new Error("clearTimeout has not been defined");
}

var ie = re,
oe = ne;

function ae(e) {
  if (ie === setTimeout) return setTimeout(e, 0);
  if ((ie === re || !ie) && setTimeout) return ie = setTimeout, setTimeout(e, 0);

  try {
    return ie(e, 0);
  } catch (t) {
    try {
      return ie.call(null, e, 0);
    } catch (t) {
      return ie.call(this, e, 0);
    }
  }
}

"function" == typeof e.setTimeout && (ie = setTimeout), "function" == typeof e.clearTimeout && (oe = clearTimeout);
var se,
he = [],
le = !1,
fe = -1;

function ce() {
  le && se && (le = !1, se.length ? he = se.concat(he) : fe = -1, he.length && ue());
}

function ue() {
  if (!le) {
    var e = ae(ce);
    le = !0;

    for (var t = he.length; t;) {
      for (se = he, he = []; ++fe < t;) {se && se[fe].run();}

      fe = -1, t = he.length;
    }

    se = null, le = !1, function (e) {
      if (oe === clearTimeout) return clearTimeout(e);
      if ((oe === ne || !oe) && clearTimeout) return oe = clearTimeout, clearTimeout(e);

      try {
        oe(e);
      } catch (t) {
        try {
          return oe.call(null, e);
        } catch (t) {
          return oe.call(this, e);
        }
      }
    }(e);
  }
}

function de(e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) {t[r - 1] = arguments[r];}
  he.push(new pe(e, t)), 1 !== he.length || le || ae(ue);
}

function pe(e, t) {
  this.fun = e, this.array = t;
}

pe.prototype.run = function () {
  this.fun.apply(null, this.array);
};

var _e = e.performance || {};

_e.now || _e.mozNow || _e.msNow || _e.oNow || _e.webkitNow;

function ge() {}

function ve() {
  ve.init.call(this);
}

function we(e) {
  return void 0 === e._maxListeners ? ve.defaultMaxListeners : e._maxListeners;
}

function be(e, t, r) {
  if (t) e.call(r);else for (var n = e.length, i = Ae(e, n), o = 0; o < n; ++o) {i[o].call(r);}
}

function ye(e, t, r, n) {
  if (t) e.call(r, n);else for (var i = e.length, o = Ae(e, i), a = 0; a < i; ++a) {o[a].call(r, n);}
}

function me(e, t, r, n, i) {
  if (t) e.call(r, n, i);else for (var o = e.length, a = Ae(e, o), s = 0; s < o; ++s) {a[s].call(r, n, i);}
}

function ke(e, t, r, n, i, o) {
  if (t) e.call(r, n, i, o);else for (var a = e.length, s = Ae(e, a), h = 0; h < a; ++h) {s[h].call(r, n, i, o);}
}

function Ee(e, t, r, n) {
  if (t) e.apply(r, n);else for (var i = e.length, o = Ae(e, i), a = 0; a < i; ++a) {o[a].apply(r, n);}
}

function Se(e, t, r, n) {
  var i, o, a, s;
  if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');

  if ((o = e._events) ? (o.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), o = e._events), a = o[t]) : (o = e._events = new ge(), e._eventsCount = 0), a) {
    if ("function" == typeof a ? a = o[t] = n ? [r, a] : [a, r] : n ? a.unshift(r) : a.push(r), !a.warned && (i = we(e)) && i > 0 && a.length > i) {
      a.warned = !0;
      var h = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + t + " listeners added. Use emitter.setMaxListeners() to increase limit");
      h.name = "MaxListenersExceededWarning", h.emitter = e, h.type = t, h.count = a.length, s = h, "function" == typeof console.warn ? console.warn(s) : console.log(s);
    }
  } else a = o[t] = r, ++e._eventsCount;

  return e;
}

function xe(e, t, r) {
  var n = !1;

  function i() {
    e.removeListener(t, i), n || (n = !0, r.apply(e, arguments));
  }

  return i.listener = r, i;
}

function Re(e) {
  var t = this._events;

  if (t) {
    var r = t[e];
    if ("function" == typeof r) return 1;
    if (r) return r.length;
  }

  return 0;
}

function Ae(e, t) {
  for (var r = new Array(t); t--;) {r[t] = e[t];}

  return r;
}

ge.prototype = Object.create(null), ve.EventEmitter = ve, ve.usingDomains = !1, ve.prototype.domain = void 0, ve.prototype._events = void 0, ve.prototype._maxListeners = void 0, ve.defaultMaxListeners = 10, ve.init = function () {
  this.domain = null, ve.usingDomains && (void 0).active && (void 0).Domain, this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = new ge(), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
}, ve.prototype.setMaxListeners = function (e) {
  if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
  return this._maxListeners = e, this;
}, ve.prototype.getMaxListeners = function () {
  return we(this);
}, ve.prototype.emit = function (e) {
  var t,
  r,
  n,
  i,
  o,
  a,
  s,
  h = "error" === e;
  if (a = this._events) h = h && null == a.error;else if (!h) return !1;

  if (s = this.domain, h) {
    if (t = arguments[1], !s) {
      if (t instanceof Error) throw t;
      var l = new Error('Uncaught, unspecified "error" event. (' + t + ")");
      throw l.context = t, l;
    }

    return t || (t = new Error('Uncaught, unspecified "error" event')), t.domainEmitter = this, t.domain = s, t.domainThrown = !1, s.emit("error", t), !1;
  }

  if (!(r = a[e])) return !1;
  var f = "function" == typeof r;

  switch (n = arguments.length) {
    case 1:
      be(r, f, this);
      break;

    case 2:
      ye(r, f, this, arguments[1]);
      break;

    case 3:
      me(r, f, this, arguments[1], arguments[2]);
      break;

    case 4:
      ke(r, f, this, arguments[1], arguments[2], arguments[3]);
      break;

    default:
      for (i = new Array(n - 1), o = 1; o < n; o++) {i[o - 1] = arguments[o];}

      Ee(r, f, this, i);}


  return !0;
}, ve.prototype.addListener = function (e, t) {
  return Se(this, e, t, !1);
}, ve.prototype.on = ve.prototype.addListener, ve.prototype.prependListener = function (e, t) {
  return Se(this, e, t, !0);
}, ve.prototype.once = function (e, t) {
  if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
  return this.on(e, xe(this, e, t)), this;
}, ve.prototype.prependOnceListener = function (e, t) {
  if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
  return this.prependListener(e, xe(this, e, t)), this;
}, ve.prototype.removeListener = function (e, t) {
  var r, n, i, o, a;
  if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
  if (!(n = this._events)) return this;
  if (!(r = n[e])) return this;
  if (r === t || r.listener && r.listener === t) 0 == --this._eventsCount ? this._events = new ge() : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));else if ("function" != typeof r) {
    for (i = -1, o = r.length; o-- > 0;) {if (r[o] === t || r[o].listener && r[o].listener === t) {
        a = r[o].listener, i = o;
        break;
      }}

    if (i < 0) return this;

    if (1 === r.length) {
      if (r[0] = void 0, 0 == --this._eventsCount) return this._events = new ge(), this;
      delete n[e];
    } else !function (e, t) {
      for (var r = t, n = r + 1, i = e.length; n < i; r += 1, n += 1) {e[r] = e[n];}

      e.pop();
    }(r, i);

    n.removeListener && this.emit("removeListener", e, a || t);
  }
  return this;
}, ve.prototype.removeAllListeners = function (e) {
  var t, r;
  if (!(r = this._events)) return this;
  if (!r.removeListener) return 0 === arguments.length ? (this._events = new ge(), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = new ge() : delete r[e]), this;

  if (0 === arguments.length) {
    for (var n, i = Object.keys(r), o = 0; o < i.length; ++o) {"removeListener" !== (n = i[o]) && this.removeAllListeners(n);}

    return this.removeAllListeners("removeListener"), this._events = new ge(), this._eventsCount = 0, this;
  }

  if ("function" == typeof (t = r[e])) this.removeListener(e, t);else if (t) do {
    this.removeListener(e, t[t.length - 1]);
  } while (t[0]);
  return this;
}, ve.prototype.listeners = function (e) {
  var t,
  r = this._events;
  return r && (t = r[e]) ? "function" == typeof t ? [t.listener || t] : function (e) {
    for (var t = new Array(e.length), r = 0; r < t.length; ++r) {t[r] = e[r].listener || e[r];}

    return t;
  }(t) : [];
}, ve.listenerCount = function (e, t) {
  return "function" == typeof e.listenerCount ? e.listenerCount(t) : Re.call(e, t);
}, ve.prototype.listenerCount = Re, ve.prototype.eventNames = function () {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
var Be = "function" == typeof Object.create ? function (e, t) {
  e.super_ = t, e.prototype = Object.create(t.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0 } });


} : function (e, t) {
  e.super_ = t;

  var r = function r() {};

  r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
},
ze = /%[sdj%]/g;

function Le(e) {
  if (!Ze(e)) {
    for (var t = [], r = 0; r < arguments.length; r++) {t.push(De(arguments[r]));}

    return t.join(" ");
  }

  r = 1;

  for (var n = arguments, i = n.length, o = String(e).replace(ze, function (e) {
    if ("%%" === e) return "%";
    if (r >= i) return e;

    switch (e) {
      case "%s":
        return String(n[r++]);

      case "%d":
        return Number(n[r++]);

      case "%j":
        try {
          return JSON.stringify(n[r++]);
        } catch (e) {
          return "[Circular]";
        }

      default:
        return e;}

  }), a = n[r]; r < i; a = n[++r]) {Ne(a) || !Ye(a) ? o += " " + a : o += " " + De(a);}

  return o;
}

function Te(t, r) {
  if (je(e.process)) return function () {
    return Te(t, r).apply(this, arguments);
  };
  var n = !1;
  return function () {
    return n || (console.error(r), n = !0), t.apply(this, arguments);
  };
}

var Me,
Ce = {};

function De(e, t) {
  var r = {
    seen: [],
    stylize: Pe };

  return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), Fe(t) ? r.showHidden = t : t && function (e, t) {
    if (!t || !Ye(t)) return e;
    var r = Object.keys(t),
    n = r.length;

    for (; n--;) {e[r[n]] = t[r[n]];}
  }(r, t), je(r.showHidden) && (r.showHidden = !1), je(r.depth) && (r.depth = 2), je(r.colors) && (r.colors = !1), je(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = Ie), Oe(r, e, r.depth);
}

function Ie(e, t) {
  var r = De.styles[t];
  return r ? "[" + De.colors[r][0] + "m" + e + "[" + De.colors[r][1] + "m" : e;
}

function Pe(e, t) {
  return e;
}

function Oe(e, t, r) {
  if (e.customInspect && t && qe(t.inspect) && t.inspect !== De && (!t.constructor || t.constructor.prototype !== t)) {
    var n = t.inspect(r, e);
    return Ze(n) || (n = Oe(e, n, r)), n;
  }

  var i = function (e, t) {
    if (je(t)) return e.stylize("undefined", "undefined");

    if (Ze(t)) {
      var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
      return e.stylize(r, "string");
    }

    if (n = t, "number" == typeof n) return e.stylize("" + t, "number");
    var n;
    if (Fe(t)) return e.stylize("" + t, "boolean");
    if (Ne(t)) return e.stylize("null", "null");
  }(e, t);

  if (i) return i;

  var o = Object.keys(t),
  a = function (e) {
    var t = {};
    return e.forEach(function (e, r) {
      t[e] = !0;
    }), t;
  }(o);

  if (e.showHidden && (o = Object.getOwnPropertyNames(t)), Xe(t) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0)) return Ue(t);

  if (0 === o.length) {
    if (qe(t)) {
      var s = t.name ? ": " + t.name : "";
      return e.stylize("[Function" + s + "]", "special");
    }

    if (We(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
    if (Ke(t)) return e.stylize(Date.prototype.toString.call(t), "date");
    if (Xe(t)) return Ue(t);
  }

  var h,
  l,
  f = "",
  c = !1,
  u = ["{", "}"];
  (h = t, Array.isArray(h) && (c = !0, u = ["[", "]"]), qe(t)) && (f = " [Function" + (t.name ? ": " + t.name : "") + "]");
  return We(t) && (f = " " + RegExp.prototype.toString.call(t)), Ke(t) && (f = " " + Date.prototype.toUTCString.call(t)), Xe(t) && (f = " " + Ue(t)), 0 !== o.length || c && 0 != t.length ? r < 0 ? We(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), l = c ? function (e, t, r, n, i) {
    for (var o = [], a = 0, s = t.length; a < s; ++a) {Ge(t, String(a)) ? o.push(He(e, t, r, n, String(a), !0)) : o.push("");}

    return i.forEach(function (i) {
      i.match(/^\d+$/) || o.push(He(e, t, r, n, i, !0));
    }), o;
  }(e, t, r, a, o) : o.map(function (n) {
    return He(e, t, r, a, n, c);
  }), e.seen.pop(), function (e, t, r) {
    if (e.reduce(function (e, t) {
      return t.indexOf("\n"), e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;
    }, 0) > 60) return r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1];
    return r[0] + t + " " + e.join(", ") + " " + r[1];
  }(l, f, u)) : u[0] + f + u[1];
}

function Ue(e) {
  return "[" + Error.prototype.toString.call(e) + "]";
}

function He(e, t, r, n, i, o) {
  var a, s, h;

  if ((h = Object.getOwnPropertyDescriptor(t, i) || {
    value: t[i] }).
  get ? s = h.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : h.set && (s = e.stylize("[Setter]", "special")), Ge(n, i) || (a = "[" + i + "]"), s || (e.seen.indexOf(h.value) < 0 ? (s = Ne(r) ? Oe(e, h.value, null) : Oe(e, h.value, r - 1)).indexOf("\n") > -1 && (s = o ? s.split("\n").map(function (e) {
    return "  " + e;
  }).join("\n").substr(2) : "\n" + s.split("\n").map(function (e) {
    return "   " + e;
  }).join("\n")) : s = e.stylize("[Circular]", "special")), je(a)) {
    if (o && i.match(/^\d+$/)) return s;
    (a = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = e.stylize(a, "string"));
  }

  return a + ": " + s;
}

function Fe(e) {
  return "boolean" == typeof e;
}

function Ne(e) {
  return null === e;
}

function Ze(e) {
  return "string" == typeof e;
}

function je(e) {
  return void 0 === e;
}

function We(e) {
  return Ye(e) && "[object RegExp]" === Ve(e);
}

function Ye(e) {
  return "object" == typeof e && null !== e;
}

function Ke(e) {
  return Ye(e) && "[object Date]" === Ve(e);
}

function Xe(e) {
  return Ye(e) && ("[object Error]" === Ve(e) || e instanceof Error);
}

function qe(e) {
  return "function" == typeof e;
}

function Ve(e) {
  return Object.prototype.toString.call(e);
}

function Ge(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}

function $e() {
  this.head = null, this.tail = null, this.length = 0;
}

De.colors = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  white: [37, 39],
  grey: [90, 39],
  black: [30, 39],
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39] },
De.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red" },
$e.prototype.push = function (e) {
  var t = {
    data: e,
    next: null };

  this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
}, $e.prototype.unshift = function (e) {
  var t = {
    data: e,
    next: this.head };

  0 === this.length && (this.tail = t), this.head = t, ++this.length;
}, $e.prototype.shift = function () {
  if (0 !== this.length) {
    var e = this.head.data;
    return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
  }
}, $e.prototype.clear = function () {
  this.head = this.tail = null, this.length = 0;
}, $e.prototype.join = function (e) {
  if (0 === this.length) return "";

  for (var t = this.head, r = "" + t.data; t = t.next;) {r += e + t.data;}

  return r;
}, $e.prototype.concat = function (e) {
  if (0 === this.length) return p.alloc(0);
  if (1 === this.length) return this.head.data;

  for (var t = p.allocUnsafe(e >>> 0), r = this.head, n = 0; r;) {r.data.copy(t, n), n += r.data.length, r = r.next;}

  return t;
};

var Je = p.isEncoding || function (e) {
  switch (e && e.toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
    case "raw":
      return !0;

    default:
      return !1;}

};

function Qe(e) {
  switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), function (e) {
    if (e && !Je(e)) throw new Error("Unknown encoding: " + e);
  }(e), this.encoding) {
    case "utf8":
      this.surrogateSize = 3;
      break;

    case "ucs2":
    case "utf16le":
      this.surrogateSize = 2, this.detectIncompleteChar = tt;
      break;

    case "base64":
      this.surrogateSize = 3, this.detectIncompleteChar = rt;
      break;

    default:
      return void (this.write = et);}


  this.charBuffer = new p(6), this.charReceived = 0, this.charLength = 0;
}

function et(e) {
  return e.toString(this.encoding);
}

function tt(e) {
  this.charReceived = e.length % 2, this.charLength = this.charReceived ? 2 : 0;
}

function rt(e) {
  this.charReceived = e.length % 3, this.charLength = this.charReceived ? 3 : 0;
}

Qe.prototype.write = function (e) {
  for (var t = ""; this.charLength;) {
    var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
    if (e.copy(this.charBuffer, this.charReceived, 0, r), this.charReceived += r, this.charReceived < this.charLength) return "";

    if (e = e.slice(r, e.length), !((i = (t = this.charBuffer.slice(0, this.charLength).toString(this.encoding)).charCodeAt(t.length - 1)) >= 55296 && i <= 56319)) {
      if (this.charReceived = this.charLength = 0, 0 === e.length) return t;
      break;
    }

    this.charLength += this.surrogateSize, t = "";
  }

  this.detectIncompleteChar(e);
  var n = e.length;
  this.charLength && (e.copy(this.charBuffer, 0, e.length - this.charReceived, n), n -= this.charReceived);
  var i;
  n = (t += e.toString(this.encoding, 0, n)).length - 1;

  if ((i = t.charCodeAt(n)) >= 55296 && i <= 56319) {
    var o = this.surrogateSize;
    return this.charLength += o, this.charReceived += o, this.charBuffer.copy(this.charBuffer, o, 0, o), e.copy(this.charBuffer, 0, 0, o), t.substring(0, n);
  }

  return t;
}, Qe.prototype.detectIncompleteChar = function (e) {
  for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
    var r = e[e.length - t];

    if (1 == t && r >> 5 == 6) {
      this.charLength = 2;
      break;
    }

    if (t <= 2 && r >> 4 == 14) {
      this.charLength = 3;
      break;
    }

    if (t <= 3 && r >> 3 == 30) {
      this.charLength = 4;
      break;
    }
  }

  this.charReceived = t;
}, Qe.prototype.end = function (e) {
  var t = "";

  if (e && e.length && (t = this.write(e)), this.charReceived) {
    var r = this.charReceived,
    n = this.charBuffer,
    i = this.encoding;
    t += n.slice(0, r).toString(i);
  }

  return t;
}, ot.ReadableState = it;

var nt = function (e) {
  je(Me) && (Me = ""), e = e.toUpperCase(), Ce[e] || (new RegExp("\\b" + e + "\\b", "i").test(Me) ? Ce[e] = function () {
    var t = Le.apply(null, arguments);
    console.error("%s %d: %s", e, 0, t);
  } : Ce[e] = function () {});
  return Ce[e];
}("stream");

function it(e, t) {
  e = e || {}, this.objectMode = !!e.objectMode, t instanceof Ct && (this.objectMode = this.objectMode || !!e.readableObjectMode);
  var r = e.highWaterMark,
  n = this.objectMode ? 16 : 16384;
  this.highWaterMark = r || 0 === r ? r : n, this.highWaterMark = ~~this.highWaterMark, this.buffer = new $e(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (this.decoder = new Qe(e.encoding), this.encoding = e.encoding);
}

function ot(e) {
  if (!(this instanceof ot)) return new ot(e);
  this._readableState = new it(e, this), this.readable = !0, e && "function" == typeof e.read && (this._read = e.read), ve.call(this);
}

function at(e, t, r, n, i) {
  var o = function (e, t) {
    var r = null;
    $(t) || "string" == typeof t || null == t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
    return r;
  }(t, r);

  if (o) e.emit("error", o);else if (null === r) t.reading = !1, function (e, t) {
    if (t.ended) return;

    if (t.decoder) {
      var r = t.decoder.end();
      r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
    }

    t.ended = !0, lt(e);
  }(e, t);else if (t.objectMode || r && r.length > 0) {
    if (t.ended && !i) {
      var a = new Error("stream.push() after EOF");
      e.emit("error", a);
    } else if (t.endEmitted && i) {
      var s = new Error("stream.unshift() after end event");
      e.emit("error", s);
    } else {
      var h;
      !t.decoder || i || n || (r = t.decoder.write(r), h = !t.objectMode && 0 === r.length), i || (t.reading = !1), h || (t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && lt(e))), function (e, t) {
        t.readingMore || (t.readingMore = !0, de(ct, e, t));
      }(e, t);
    }
  } else i || (t.reading = !1);
  return function (e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
  }(t);
}

Be(ot, ve), ot.prototype.push = function (e, t) {
  var r = this._readableState;
  return r.objectMode || "string" != typeof e || (t = t || r.defaultEncoding) !== r.encoding && (e = p.from(e, t), t = ""), at(this, r, e, t, !1);
}, ot.prototype.unshift = function (e) {
  return at(this, this._readableState, e, "", !0);
}, ot.prototype.isPaused = function () {
  return !1 === this._readableState.flowing;
}, ot.prototype.setEncoding = function (e) {
  return this._readableState.decoder = new Qe(e), this._readableState.encoding = e, this;
};
var st = 8388608;

function ht(e, t) {
  return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
    return e >= st ? e = st : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
}

function lt(e) {
  var t = e._readableState;
  t.needReadable = !1, t.emittedReadable || (nt("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? de(ft, e) : ft(e));
}

function ft(e) {
  nt("emit readable"), e.emit("readable"), pt(e);
}

function ct(e, t) {
  for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (nt("maybeReadMore read 0"), e.read(0), r !== t.length);) {r = t.length;}

  t.readingMore = !1;
}

function ut(e) {
  nt("readable nexttick read 0"), e.read(0);
}

function dt(e, t) {
  t.reading || (nt("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), pt(e), t.flowing && !t.reading && e.read(0);
}

function pt(e) {
  var t = e._readableState;

  for (nt("flow", t.flowing); t.flowing && null !== e.read();) {;}
}

function _t(e, t) {
  return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function (e, t, r) {
    var n;
    e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function (e, t) {
      var r = t.head,
      n = 1,
      i = r.data;
      e -= i.length;

      for (; r = r.next;) {
        var o = r.data,
        a = e > o.length ? o.length : e;

        if (a === o.length ? i += o : i += o.slice(0, e), 0 === (e -= a)) {
          a === o.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));
          break;
        }

        ++n;
      }

      return t.length -= n, i;
    }(e, t) : function (e, t) {
      var r = p.allocUnsafe(e),
      n = t.head,
      i = 1;
      n.data.copy(r), e -= n.data.length;

      for (; n = n.next;) {
        var o = n.data,
        a = e > o.length ? o.length : e;

        if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
          a === o.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = o.slice(a));
          break;
        }

        ++i;
      }

      return t.length -= i, r;
    }(e, t);
    return n;
  }(e, t.buffer, t.decoder), r);
  var r;
}

function gt(e) {
  var t = e._readableState;
  if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
  t.endEmitted || (t.ended = !0, de(vt, t, e));
}

function vt(e, t) {
  e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
}

function wt(e, t) {
  for (var r = 0, n = e.length; r < n; r++) {if (e[r] === t) return r;}

  return -1;
}

function bt() {}

function yt(e, t, r) {
  this.chunk = e, this.encoding = t, this.callback = r, this.next = null;
}

function mt(e, t) {
  Object.defineProperty(this, "buffer", {
    get: Te(function () {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.") }),
  e = e || {}, this.objectMode = !!e.objectMode, t instanceof Ct && (this.objectMode = this.objectMode || !!e.writableObjectMode);
  var r = e.highWaterMark,
  n = this.objectMode ? 16 : 16384;
  this.highWaterMark = r || 0 === r ? r : n, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
  var i = !1 === e.decodeStrings;
  this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
    !function (e, t) {
      var r = e._writableState,
      n = r.sync,
      i = r.writecb;
      if (function (e) {
        e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
      }(r), t) !function (e, t, r, n, i) {
        --t.pendingcb, r ? de(i, n) : i(n);
        e._writableState.errorEmitted = !0, e.emit("error", n);
      }(e, r, n, t, i);else {
        var o = Rt(r);
        o || r.corked || r.bufferProcessing || !r.bufferedRequest || xt(e, r), n ? de(St, e, r, o, i) : St(e, r, o, i);
      }
    }(t, e);
  }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new zt(this);
}

function kt(e) {
  if (!(this instanceof kt || this instanceof Ct)) return new kt(e);
  this._writableState = new mt(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev)), ve.call(this);
}

function Et(e, t, r, n, i, o, a) {
  t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
}

function St(e, t, r, n) {
  r || function (e, t) {
    0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }(e, t), t.pendingcb--, n(), Bt(e, t);
}

function xt(e, t) {
  t.bufferProcessing = !0;
  var r = t.bufferedRequest;

  if (e._writev && r && r.next) {
    var n = t.bufferedRequestCount,
    i = new Array(n),
    o = t.corkedRequestsFree;
    o.entry = r;

    for (var a = 0; r;) {i[a] = r, r = r.next, a += 1;}

    Et(e, t, !0, t.length, i, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new zt(t);
  } else {
    for (; r;) {
      var s = r.chunk,
      h = r.encoding,
      l = r.callback;
      if (Et(e, t, !1, t.objectMode ? 1 : s.length, s, h, l), r = r.next, t.writing) break;
    }

    null === r && (t.lastBufferedRequest = null);
  }

  t.bufferedRequestCount = 0, t.bufferedRequest = r, t.bufferProcessing = !1;
}

function Rt(e) {
  return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
}

function At(e, t) {
  t.prefinished || (t.prefinished = !0, e.emit("prefinish"));
}

function Bt(e, t) {
  var r = Rt(t);
  return r && (0 === t.pendingcb ? (At(e, t), t.finished = !0, e.emit("finish")) : At(e, t)), r;
}

function zt(e) {
  var t = this;
  this.next = null, this.entry = null, this.finish = function (r) {
    var n = t.entry;

    for (t.entry = null; n;) {
      var i = n.callback;
      e.pendingcb--, i(r), n = n.next;
    }

    e.corkedRequestsFree ? e.corkedRequestsFree.next = t : e.corkedRequestsFree = t;
  };
}

ot.prototype.read = function (e) {
  nt("read", e), e = parseInt(e, 10);
  var t = this._readableState,
  r = e;
  if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return nt("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? gt(this) : lt(this), null;
  if (0 === (e = ht(e, t)) && t.ended) return 0 === t.length && gt(this), null;
  var n,
  i = t.needReadable;
  return nt("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && nt("length less than watermark", i = !0), t.ended || t.reading ? nt("reading or ended", i = !1) : i && (nt("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = ht(r, t))), null === (n = e > 0 ? _t(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && gt(this)), null !== n && this.emit("data", n), n;
}, ot.prototype._read = function (e) {
  this.emit("error", new Error("not implemented"));
}, ot.prototype.pipe = function (e, t) {
  var r = this,
  n = this._readableState;

  switch (n.pipesCount) {
    case 0:
      n.pipes = e;
      break;

    case 1:
      n.pipes = [n.pipes, e];
      break;

    default:
      n.pipes.push(e);}


  n.pipesCount += 1, nt("pipe count=%d opts=%j", n.pipesCount, t);
  var i = !t || !1 !== t.end ? a : l;

  function o(e) {
    nt("onunpipe"), e === r && l();
  }

  function a() {
    nt("onend"), e.end();
  }

  n.endEmitted ? de(i) : r.once("end", i), e.on("unpipe", o);

  var s = function (e) {
    return function () {
      var t = e._readableState;
      nt("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && e.listeners("data").length && (t.flowing = !0, pt(e));
    };
  }(r);

  e.on("drain", s);
  var h = !1;

  function l() {
    nt("cleanup"), e.removeListener("close", d), e.removeListener("finish", p), e.removeListener("drain", s), e.removeListener("error", u), e.removeListener("unpipe", o), r.removeListener("end", a), r.removeListener("end", l), r.removeListener("data", c), h = !0, !n.awaitDrain || e._writableState && !e._writableState.needDrain || s();
  }

  var f = !1;

  function c(t) {
    nt("ondata"), f = !1, !1 !== e.write(t) || f || ((1 === n.pipesCount && n.pipes === e || n.pipesCount > 1 && -1 !== wt(n.pipes, e)) && !h && (nt("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, f = !0), r.pause());
  }

  function u(t) {
    var r;
    nt("onerror", t), _(), e.removeListener("error", u), 0 === (r = "error", e.listeners(r).length) && e.emit("error", t);
  }

  function d() {
    e.removeListener("finish", p), _();
  }

  function p() {
    nt("onfinish"), e.removeListener("close", d), _();
  }

  function _() {
    nt("unpipe"), r.unpipe(e);
  }

  return r.on("data", c), function (e, t, r) {
    if ("function" == typeof e.prependListener) return e.prependListener(t, r);
    e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);
  }(e, "error", u), e.once("close", d), e.once("finish", p), e.emit("pipe", r), n.flowing || (nt("pipe resume"), r.resume()), e;
}, ot.prototype.unpipe = function (e) {
  var t = this._readableState;
  if (0 === t.pipesCount) return this;
  if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);

  if (!e) {
    var r = t.pipes,
    n = t.pipesCount;
    t.pipes = null, t.pipesCount = 0, t.flowing = !1;

    for (var i = 0; i < n; i++) {r[i].emit("unpipe", this);}

    return this;
  }

  var o = wt(t.pipes, e);
  return -1 === o ? this : (t.pipes.splice(o, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this);
}, ot.prototype.on = function (e, t) {
  var r = ve.prototype.on.call(this, e, t);
  if ("data" === e) !1 !== this._readableState.flowing && this.resume();else if ("readable" === e) {
    var n = this._readableState;
    n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && lt(this) : de(ut, this));
  }
  return r;
}, ot.prototype.addListener = ot.prototype.on, ot.prototype.resume = function () {
  var e = this._readableState;
  return e.flowing || (nt("resume"), e.flowing = !0, function (e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, de(dt, e, t));
  }(this, e)), this;
}, ot.prototype.pause = function () {
  return nt("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (nt("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
}, ot.prototype.wrap = function (e) {
  var t = this._readableState,
  r = !1,
  n = this;

  for (var i in e.on("end", function () {
    if (nt("wrapped end"), t.decoder && !t.ended) {
      var e = t.decoder.end();
      e && e.length && n.push(e);
    }

    n.push(null);
  }), e.on("data", function (i) {
    (nt("wrapped data"), t.decoder && (i = t.decoder.write(i)), t.objectMode && null == i) || (t.objectMode || i && i.length) && (n.push(i) || (r = !0, e.pause()));
  }), e) {void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
      return function () {
        return e[t].apply(e, arguments);
      };
    }(i));}

  return function (e, t) {
    for (var r = 0, n = e.length; r < n; r++) {t(e[r], r);}
  }(["error", "close", "destroy", "pause", "resume"], function (t) {
    e.on(t, n.emit.bind(n, t));
  }), n._read = function (t) {
    nt("wrapped _read", t), r && (r = !1, e.resume());
  }, n;
}, ot._fromList = _t, kt.WritableState = mt, Be(kt, ve), mt.prototype.getBuffer = function () {
  for (var e = this.bufferedRequest, t = []; e;) {t.push(e), e = e.next;}

  return t;
}, kt.prototype.pipe = function () {
  this.emit("error", new Error("Cannot pipe, not readable"));
}, kt.prototype.write = function (e, t, r) {
  var n = this._writableState,
  i = !1;
  return "function" == typeof t && (r = t, t = null), p.isBuffer(e) ? t = "buffer" : t || (t = n.defaultEncoding), "function" != typeof r && (r = bt), n.ended ? function (e, t) {
    var r = new Error("write after end");
    e.emit("error", r), de(t, r);
  }(this, r) : function (e, t, r, n) {
    var i = !0,
    o = !1;
    return null === r ? o = new TypeError("May not write null values to stream") : p.isBuffer(r) || "string" == typeof r || void 0 === r || t.objectMode || (o = new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), de(n, o), i = !1), i;
  }(this, n, e, r) && (n.pendingcb++, i = function (e, t, r, n, i) {
    r = function (e, t, r) {
      return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = p.from(t, r)), t;
    }(t, r, n), p.isBuffer(r) && (n = "buffer");
    var o = t.objectMode ? 1 : r.length;
    t.length += o;
    var a = t.length < t.highWaterMark;
    a || (t.needDrain = !0);

    if (t.writing || t.corked) {
      var s = t.lastBufferedRequest;
      t.lastBufferedRequest = new yt(r, n, i), s ? s.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
    } else Et(e, t, !1, o, r, n, i);

    return a;
  }(this, n, e, t, r)), i;
}, kt.prototype.cork = function () {
  this._writableState.corked++;
}, kt.prototype.uncork = function () {
  var e = this._writableState;
  e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || xt(this, e));
}, kt.prototype.setDefaultEncoding = function (e) {
  if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
  return this._writableState.defaultEncoding = e, this;
}, kt.prototype._write = function (e, t, r) {
  r(new Error("not implemented"));
}, kt.prototype._writev = null, kt.prototype.end = function (e, t, r) {
  var n = this._writableState;
  "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || function (e, t, r) {
    t.ending = !0, Bt(e, t), r && (t.finished ? de(r) : e.once("finish", r));
    t.ended = !0, e.writable = !1;
  }(this, n, r);
}, Be(Ct, ot);

for (var Lt = Object.keys(kt.prototype), Tt = 0; Tt < Lt.length; Tt++) {
  var Mt = Lt[Tt];
  Ct.prototype[Mt] || (Ct.prototype[Mt] = kt.prototype[Mt]);
}

function Ct(e) {
  if (!(this instanceof Ct)) return new Ct(e);
  ot.call(this, e), kt.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", Dt);
}

function Dt() {
  this.allowHalfOpen || this._writableState.ended || de(It, this);
}

function It(e) {
  e.end();
}

function Pt(e) {
  this.afterTransform = function (t, r) {
    return function (e, t, r) {
      var n = e._transformState;
      n.transforming = !1;
      var i = n.writecb;
      if (!i) return e.emit("error", new Error("no writecb in Transform class"));
      n.writechunk = null, n.writecb = null, null != r && e.push(r);
      i(t);
      var o = e._readableState;
      o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark);
    }(e, t, r);
  }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
}

function Ot(e) {
  if (!(this instanceof Ot)) return new Ot(e);
  Ct.call(this, e), this._transformState = new Pt(this);
  var t = this;
  this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.once("prefinish", function () {
    "function" == typeof this._flush ? this._flush(function (e) {
      Ut(t, e);
    }) : Ut(t);
  });
}

function Ut(e, t) {
  if (t) return e.emit("error", t);
  var r = e._writableState,
  n = e._transformState;
  if (r.length) throw new Error("Calling transform done when ws.length != 0");
  if (n.transforming) throw new Error("Calling transform done when still transforming");
  return e.push(null);
}

function Ht(e) {
  if (!(this instanceof Ht)) return new Ht(e);
  Ot.call(this, e);
}

function Ft() {
  ve.call(this);
}

Be(Ot, Ct), Ot.prototype.push = function (e, t) {
  return this._transformState.needTransform = !1, Ct.prototype.push.call(this, e, t);
}, Ot.prototype._transform = function (e, t, r) {
  throw new Error("Not implemented");
}, Ot.prototype._write = function (e, t, r) {
  var n = this._transformState;

  if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
    var i = this._readableState;
    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
  }
}, Ot.prototype._read = function (e) {
  var t = this._transformState;
  null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
}, Be(Ht, Ot), Ht.prototype._transform = function (e, t, r) {
  r(null, e);
}, Be(Ft, ve), Ft.Readable = ot, Ft.Writable = kt, Ft.Duplex = Ct, Ft.Transform = Ot, Ft.PassThrough = Ht, Ft.Stream = Ft, Ft.prototype.pipe = function (e, t) {
  var r = this;

  function n(t) {
    e.writable && !1 === e.write(t) && r.pause && r.pause();
  }

  function i() {
    r.readable && r.resume && r.resume();
  }

  r.on("data", n), e.on("drain", i), e._isStdio || t && !1 === t.end || (r.on("end", a), r.on("close", s));
  var o = !1;

  function a() {
    o || (o = !0, e.end());
  }

  function s() {
    o || (o = !0, "function" == typeof e.destroy && e.destroy());
  }

  function h(e) {
    if (l(), 0 === ve.listenerCount(this, "error")) throw e;
  }

  function l() {
    r.removeListener("data", n), e.removeListener("drain", i), r.removeListener("end", a), r.removeListener("close", s), r.removeListener("error", h), e.removeListener("error", h), r.removeListener("end", l), r.removeListener("close", l), e.removeListener("close", l);
  }

  return r.on("error", h), e.on("error", h), r.on("end", l), r.on("close", l), e.on("close", l), e.emit("pipe", r), e;
};
var Nt = {
  2: "need dictionary",
  1: "stream end",
  0: "",
  "-1": "file error",
  "-2": "stream error",
  "-3": "data error",
  "-4": "insufficient memory",
  "-5": "buffer error",
  "-6": "incompatible version" };


function Zt() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}

function jt(e, t, r, n, i) {
  if (t.subarray && e.subarray) e.set(t.subarray(r, r + n), i);else for (var o = 0; o < n; o++) {e[i + o] = t[r + o];}
}

var Wt = Uint8Array,
Yt = Uint16Array,
Kt = Int32Array,
Xt = 4,
qt = 0,
Vt = 1,
Gt = 2;

function $t(e) {
  for (var t = e.length; --t >= 0;) {e[t] = 0;}
}

var Jt = 0,
Qt = 1,
er = 2,
tr = 29,
rr = 256,
nr = rr + 1 + tr,
ir = 30,
or = 19,
ar = 2 * nr + 1,
sr = 15,
hr = 16,
lr = 7,
fr = 256,
cr = 16,
ur = 17,
dr = 18,
pr = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
_r = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
gr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
vr = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
wr = new Array(2 * (nr + 2));
$t(wr);
var br = new Array(2 * ir);
$t(br);
var yr = new Array(512);
$t(yr);
var mr = new Array(256);
$t(mr);
var kr = new Array(tr);
$t(kr);
var Er,
Sr,
xr,
Rr = new Array(ir);

function Ar(e, t, r, n, i) {
  this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = i, this.has_stree = e && e.length;
}

function Br(e, t) {
  this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
}

function zr(e) {
  return e < 256 ? yr[e] : yr[256 + (e >>> 7)];
}

function Lr(e, t) {
  e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;
}

function Tr(e, t, r) {
  e.bi_valid > hr - r ? (e.bi_buf |= t << e.bi_valid & 65535, Lr(e, e.bi_buf), e.bi_buf = t >> hr - e.bi_valid, e.bi_valid += r - hr) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r);
}

function Mr(e, t, r) {
  Tr(e, r[2 * t], r[2 * t + 1]);
}

function Cr(e, t) {
  var r = 0;

  do {
    r |= 1 & e, e >>>= 1, r <<= 1;
  } while (--t > 0);

  return r >>> 1;
}

function Dr(e, t, r) {
  var n,
  i,
  o = new Array(sr + 1),
  a = 0;

  for (n = 1; n <= sr; n++) {o[n] = a = a + r[n - 1] << 1;}

  for (i = 0; i <= t; i++) {
    var s = e[2 * i + 1];
    0 !== s && (e[2 * i] = Cr(o[s]++, s));
  }
}

function Ir(e) {
  var t;

  for (t = 0; t < nr; t++) {e.dyn_ltree[2 * t] = 0;}

  for (t = 0; t < ir; t++) {e.dyn_dtree[2 * t] = 0;}

  for (t = 0; t < or; t++) {e.bl_tree[2 * t] = 0;}

  e.dyn_ltree[2 * fr] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
}

function Pr(e) {
  e.bi_valid > 8 ? Lr(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}

function Or(e, t, r, n) {
  var i = 2 * t,
  o = 2 * r;
  return e[i] < e[o] || e[i] === e[o] && n[t] <= n[r];
}

function Ur(e, t, r) {
  for (var n = e.heap[r], i = r << 1; i <= e.heap_len && (i < e.heap_len && Or(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !Or(t, n, e.heap[i], e.depth));) {e.heap[r] = e.heap[i], r = i, i <<= 1;}

  e.heap[r] = n;
}

function Hr(e, t, r) {
  var n,
  i,
  o,
  a,
  s = 0;
  if (0 !== e.last_lit) do {
    n = e.pending_buf[e.d_buf + 2 * s] << 8 | e.pending_buf[e.d_buf + 2 * s + 1], i = e.pending_buf[e.l_buf + s], s++, 0 === n ? Mr(e, i, t) : (Mr(e, (o = mr[i]) + rr + 1, t), 0 !== (a = pr[o]) && Tr(e, i -= kr[o], a), Mr(e, o = zr(--n), r), 0 !== (a = _r[o]) && Tr(e, n -= Rr[o], a));
  } while (s < e.last_lit);
  Mr(e, fr, t);
}

function Fr(e, t) {
  var r,
  n,
  i,
  o = t.dyn_tree,
  a = t.stat_desc.static_tree,
  s = t.stat_desc.has_stree,
  h = t.stat_desc.elems,
  l = -1;

  for (e.heap_len = 0, e.heap_max = ar, r = 0; r < h; r++) {0 !== o[2 * r] ? (e.heap[++e.heap_len] = l = r, e.depth[r] = 0) : o[2 * r + 1] = 0;}

  for (; e.heap_len < 2;) {o[2 * (i = e.heap[++e.heap_len] = l < 2 ? ++l : 0)] = 1, e.depth[i] = 0, e.opt_len--, s && (e.static_len -= a[2 * i + 1]);}

  for (t.max_code = l, r = e.heap_len >> 1; r >= 1; r--) {Ur(e, o, r);}

  i = h;

  do {
    r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], Ur(e, o, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, o[2 * i] = o[2 * r] + o[2 * n], e.depth[i] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, o[2 * r + 1] = o[2 * n + 1] = i, e.heap[1] = i++, Ur(e, o, 1);
  } while (e.heap_len >= 2);

  e.heap[--e.heap_max] = e.heap[1], function (e, t) {
    var r,
    n,
    i,
    o,
    a,
    s,
    h = t.dyn_tree,
    l = t.max_code,
    f = t.stat_desc.static_tree,
    c = t.stat_desc.has_stree,
    u = t.stat_desc.extra_bits,
    d = t.stat_desc.extra_base,
    p = t.stat_desc.max_length,
    _ = 0;

    for (o = 0; o <= sr; o++) {e.bl_count[o] = 0;}

    for (h[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < ar; r++) {(o = h[2 * h[2 * (n = e.heap[r]) + 1] + 1] + 1) > p && (o = p, _++), h[2 * n + 1] = o, n > l || (e.bl_count[o]++, a = 0, n >= d && (a = u[n - d]), s = h[2 * n], e.opt_len += s * (o + a), c && (e.static_len += s * (f[2 * n + 1] + a)));}

    if (0 !== _) {
      do {
        for (o = p - 1; 0 === e.bl_count[o];) {o--;}

        e.bl_count[o]--, e.bl_count[o + 1] += 2, e.bl_count[p]--, _ -= 2;
      } while (_ > 0);

      for (o = p; 0 !== o; o--) {for (n = e.bl_count[o]; 0 !== n;) {(i = e.heap[--r]) > l || (h[2 * i + 1] !== o && (e.opt_len += (o - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = o), n--);}}
    }
  }(e, t), Dr(o, l, e.bl_count);
}

function Nr(e, t, r) {
  var n,
  i,
  o = -1,
  a = t[1],
  s = 0,
  h = 7,
  l = 4;

  for (0 === a && (h = 138, l = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++) {i = a, a = t[2 * (n + 1) + 1], ++s < h && i === a || (s < l ? e.bl_tree[2 * i] += s : 0 !== i ? (i !== o && e.bl_tree[2 * i]++, e.bl_tree[2 * cr]++) : s <= 10 ? e.bl_tree[2 * ur]++ : e.bl_tree[2 * dr]++, s = 0, o = i, 0 === a ? (h = 138, l = 3) : i === a ? (h = 6, l = 3) : (h = 7, l = 4));}
}

function Zr(e, t, r) {
  var n,
  i,
  o = -1,
  a = t[1],
  s = 0,
  h = 7,
  l = 4;

  for (0 === a && (h = 138, l = 3), n = 0; n <= r; n++) {if (i = a, a = t[2 * (n + 1) + 1], !(++s < h && i === a)) {
      if (s < l) do {
        Mr(e, i, e.bl_tree);
      } while (0 != --s);else 0 !== i ? (i !== o && (Mr(e, i, e.bl_tree), s--), Mr(e, cr, e.bl_tree), Tr(e, s - 3, 2)) : s <= 10 ? (Mr(e, ur, e.bl_tree), Tr(e, s - 3, 3)) : (Mr(e, dr, e.bl_tree), Tr(e, s - 11, 7));
      s = 0, o = i, 0 === a ? (h = 138, l = 3) : i === a ? (h = 6, l = 3) : (h = 7, l = 4);
    }}
}

$t(Rr);
var jr = !1;

function Wr(e) {
  jr || (!function () {
    var e,
    t,
    r,
    n,
    i,
    o = new Array(sr + 1);

    for (r = 0, n = 0; n < tr - 1; n++) {for (kr[n] = r, e = 0; e < 1 << pr[n]; e++) {mr[r++] = n;}}

    for (mr[r - 1] = n, i = 0, n = 0; n < 16; n++) {for (Rr[n] = i, e = 0; e < 1 << _r[n]; e++) {yr[i++] = n;}}

    for (i >>= 7; n < ir; n++) {for (Rr[n] = i << 7, e = 0; e < 1 << _r[n] - 7; e++) {yr[256 + i++] = n;}}

    for (t = 0; t <= sr; t++) {o[t] = 0;}

    for (e = 0; e <= 143;) {wr[2 * e + 1] = 8, e++, o[8]++;}

    for (; e <= 255;) {wr[2 * e + 1] = 9, e++, o[9]++;}

    for (; e <= 279;) {wr[2 * e + 1] = 7, e++, o[7]++;}

    for (; e <= 287;) {wr[2 * e + 1] = 8, e++, o[8]++;}

    for (Dr(wr, nr + 1, o), e = 0; e < ir; e++) {br[2 * e + 1] = 5, br[2 * e] = Cr(e, 5);}

    Er = new Ar(wr, pr, rr + 1, nr, sr), Sr = new Ar(br, _r, 0, ir, sr), xr = new Ar(new Array(0), gr, 0, or, lr);
  }(), jr = !0), e.l_desc = new Br(e.dyn_ltree, Er), e.d_desc = new Br(e.dyn_dtree, Sr), e.bl_desc = new Br(e.bl_tree, xr), e.bi_buf = 0, e.bi_valid = 0, Ir(e);
}

function Yr(e, t, r, n) {
  Tr(e, (Jt << 1) + (n ? 1 : 0), 3), function (e, t, r, n) {
    Pr(e), n && (Lr(e, r), Lr(e, ~r)), jt(e.pending_buf, e.window, t, r, e.pending), e.pending += r;
  }(e, t, r, !0);
}

function Kr(e) {
  Tr(e, Qt << 1, 3), Mr(e, fr, wr), function (e) {
    16 === e.bi_valid ? (Lr(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
  }(e);
}

function Xr(e, t, r, n) {
  var i,
  o,
  a = 0;
  e.level > 0 ? (e.strm.data_type === Gt && (e.strm.data_type = function (e) {
    var t,
    r = 4093624447;

    for (t = 0; t <= 31; t++, r >>>= 1) {if (1 & r && 0 !== e.dyn_ltree[2 * t]) return qt;}

    if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return Vt;

    for (t = 32; t < rr; t++) {if (0 !== e.dyn_ltree[2 * t]) return Vt;}

    return qt;
  }(e)), Fr(e, e.l_desc), Fr(e, e.d_desc), a = function (e) {
    var t;

    for (Nr(e, e.dyn_ltree, e.l_desc.max_code), Nr(e, e.dyn_dtree, e.d_desc.max_code), Fr(e, e.bl_desc), t = or - 1; t >= 3 && 0 === e.bl_tree[2 * vr[t] + 1]; t--) {;}

    return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
  }(e), i = e.opt_len + 3 + 7 >>> 3, (o = e.static_len + 3 + 7 >>> 3) <= i && (i = o)) : i = o = r + 5, r + 4 <= i && -1 !== t ? Yr(e, t, r, n) : e.strategy === Xt || o === i ? (Tr(e, (Qt << 1) + (n ? 1 : 0), 3), Hr(e, wr, br)) : (Tr(e, (er << 1) + (n ? 1 : 0), 3), function (e, t, r, n) {
    var i;

    for (Tr(e, t - 257, 5), Tr(e, r - 1, 5), Tr(e, n - 4, 4), i = 0; i < n; i++) {Tr(e, e.bl_tree[2 * vr[i] + 1], 3);}

    Zr(e, e.dyn_ltree, t - 1), Zr(e, e.dyn_dtree, r - 1);
  }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1), Hr(e, e.dyn_ltree, e.dyn_dtree)), Ir(e), n && Pr(e);
}

function qr(e, t, r) {
  return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (mr[r] + rr + 1)]++, e.dyn_dtree[2 * zr(t)]++), e.last_lit === e.lit_bufsize - 1;
}

function Vr(e, t, r, n) {
  for (var i = 65535 & e | 0, o = e >>> 16 & 65535 | 0, a = 0; 0 !== r;) {
    r -= a = r > 2e3 ? 2e3 : r;

    do {
      o = o + (i = i + t[n++] | 0) | 0;
    } while (--a);

    i %= 65521, o %= 65521;
  }

  return i | o << 16 | 0;
}

var Gr = function () {
  for (var e, t = [], r = 0; r < 256; r++) {
    e = r;

    for (var n = 0; n < 8; n++) {e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;}

    t[r] = e;
  }

  return t;
}();

function $r(e, t, r, n) {
  var i = Gr,
  o = n + r;
  e ^= -1;

  for (var a = n; a < o; a++) {e = e >>> 8 ^ i[255 & (e ^ t[a])];}

  return -1 ^ e;
}

var Jr,
Qr = 0,
en = 1,
tn = 3,
rn = 4,
nn = 5,
on = 0,
an = 1,
sn = -2,
hn = -3,
ln = -5,
fn = -1,
cn = 1,
un = 2,
dn = 3,
pn = 4,
_n = 2,
gn = 8,
vn = 9,
wn = 286,
bn = 30,
yn = 19,
mn = 2 * wn + 1,
kn = 15,
En = 3,
Sn = 258,
xn = Sn + En + 1,
Rn = 32,
An = 42,
Bn = 69,
zn = 73,
Ln = 91,
Tn = 103,
Mn = 113,
Cn = 666,
Dn = 1,
In = 2,
Pn = 3,
On = 4,
Un = 3;

function Hn(e, t) {
  return e.msg = Nt[t], t;
}

function Fn(e) {
  return (e << 1) - (e > 4 ? 9 : 0);
}

function Nn(e) {
  for (var t = e.length; --t >= 0;) {e[t] = 0;}
}

function Zn(e) {
  var t = e.state,
  r = t.pending;
  r > e.avail_out && (r = e.avail_out), 0 !== r && (jt(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0));
}

function jn(e, t) {
  Xr(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, Zn(e.strm);
}

function Wn(e, t) {
  e.pending_buf[e.pending++] = t;
}

function Yn(e, t) {
  e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;
}

function Kn(e, t) {
  var r,
  n,
  i = e.max_chain_length,
  o = e.strstart,
  a = e.prev_length,
  s = e.nice_match,
  h = e.strstart > e.w_size - xn ? e.strstart - (e.w_size - xn) : 0,
  l = e.window,
  f = e.w_mask,
  c = e.prev,
  u = e.strstart + Sn,
  d = l[o + a - 1],
  p = l[o + a];
  e.prev_length >= e.good_match && (i >>= 2), s > e.lookahead && (s = e.lookahead);

  do {
    if (l[(r = t) + a] === p && l[r + a - 1] === d && l[r] === l[o] && l[++r] === l[o + 1]) {
      o += 2, r++;

      do {} while (l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && o < u);

      if (n = Sn - (u - o), o = u - Sn, n > a) {
        if (e.match_start = t, a = n, n >= s) break;
        d = l[o + a - 1], p = l[o + a];
      }
    }
  } while ((t = c[t & f]) > h && 0 != --i);

  return a <= e.lookahead ? a : e.lookahead;
}

function Xn(e) {
  var t,
  r,
  n,
  i,
  o,
  a,
  s,
  h,
  l,
  f,
  c = e.w_size;

  do {
    if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= c + (c - xn)) {
      jt(e.window, e.window, c, c, 0), e.match_start -= c, e.strstart -= c, e.block_start -= c, t = r = e.hash_size;

      do {
        n = e.head[--t], e.head[t] = n >= c ? n - c : 0;
      } while (--r);

      t = r = c;

      do {
        n = e.prev[--t], e.prev[t] = n >= c ? n - c : 0;
      } while (--r);

      i += c;
    }

    if (0 === e.strm.avail_in) break;
    if (a = e.strm, s = e.window, h = e.strstart + e.lookahead, l = i, f = void 0, (f = a.avail_in) > l && (f = l), r = 0 === f ? 0 : (a.avail_in -= f, jt(s, a.input, a.next_in, f, h), 1 === a.state.wrap ? a.adler = Vr(a.adler, s, f, h) : 2 === a.state.wrap && (a.adler = $r(a.adler, s, f, h)), a.next_in += f, a.total_in += f, f), e.lookahead += r, e.lookahead + e.insert >= En) for (o = e.strstart - e.insert, e.ins_h = e.window[o], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + En - 1]) & e.hash_mask, e.prev[o & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = o, o++, e.insert--, !(e.lookahead + e.insert < En));) {;}
  } while (e.lookahead < xn && 0 !== e.strm.avail_in);
}

function qn(e, t) {
  for (var r, n;;) {
    if (e.lookahead < xn) {
      if (Xn(e), e.lookahead < xn && t === Qr) return Dn;
      if (0 === e.lookahead) break;
    }

    if (r = 0, e.lookahead >= En && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - xn && (e.match_length = Kn(e, r)), e.match_length >= En) {
      if (n = qr(e, e.strstart - e.match_start, e.match_length - En), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= En) {
        e.match_length--;

        do {
          e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
        } while (0 != --e.match_length);

        e.strstart++;
      } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
    } else n = qr(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
    if (n && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;
  }

  return e.insert = e.strstart < En - 1 ? e.strstart : En - 1, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;
}

function Vn(e, t) {
  for (var r, n, i;;) {
    if (e.lookahead < xn) {
      if (Xn(e), e.lookahead < xn && t === Qr) return Dn;
      if (0 === e.lookahead) break;
    }

    if (r = 0, e.lookahead >= En && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = En - 1, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - xn && (e.match_length = Kn(e, r), e.match_length <= 5 && (e.strategy === cn || e.match_length === En && e.strstart - e.match_start > 4096) && (e.match_length = En - 1)), e.prev_length >= En && e.match_length <= e.prev_length) {
      i = e.strstart + e.lookahead - En, n = qr(e, e.strstart - 1 - e.prev_match, e.prev_length - En), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;

      do {
        ++e.strstart <= i && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
      } while (0 != --e.prev_length);

      if (e.match_available = 0, e.match_length = En - 1, e.strstart++, n && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;
    } else if (e.match_available) {
      if ((n = qr(e, 0, e.window[e.strstart - 1])) && jn(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return Dn;
    } else e.match_available = 1, e.strstart++, e.lookahead--;
  }

  return e.match_available && (n = qr(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < En - 1 ? e.strstart : En - 1, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;
}

function Gn(e, t, r, n, i) {
  this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = i;
}

function $n() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = gn, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Yt(2 * mn), this.dyn_dtree = new Yt(2 * (2 * bn + 1)), this.bl_tree = new Yt(2 * (2 * yn + 1)), Nn(this.dyn_ltree), Nn(this.dyn_dtree), Nn(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Yt(kn + 1), this.heap = new Yt(2 * wn + 1), Nn(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Yt(2 * wn + 1), Nn(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}

function Jn(e) {
  var t,
  r = function (e) {
    var t;
    return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = _n, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? An : Mn, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = Qr, Wr(t), on) : Hn(e, sn);
  }(e);

  return r === on && ((t = e.state).window_size = 2 * t.w_size, Nn(t.head), t.max_lazy_match = Jr[t.level].max_lazy, t.good_match = Jr[t.level].good_length, t.nice_match = Jr[t.level].nice_length, t.max_chain_length = Jr[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = En - 1, t.match_available = 0, t.ins_h = 0), r;
}

function Qn(e, t) {
  var r, n, i, o;
  if (!e || !e.state || t > nn || t < 0) return e ? Hn(e, sn) : sn;
  if (n = e.state, !e.output || !e.input && 0 !== e.avail_in || n.status === Cn && t !== rn) return Hn(e, 0 === e.avail_out ? ln : sn);
  if (n.strm = e, r = n.last_flush, n.last_flush = t, n.status === An) if (2 === n.wrap) e.adler = 0, Wn(n, 31), Wn(n, 139), Wn(n, 8), n.gzhead ? (Wn(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), Wn(n, 255 & n.gzhead.time), Wn(n, n.gzhead.time >> 8 & 255), Wn(n, n.gzhead.time >> 16 & 255), Wn(n, n.gzhead.time >> 24 & 255), Wn(n, 9 === n.level ? 2 : n.strategy >= un || n.level < 2 ? 4 : 0), Wn(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (Wn(n, 255 & n.gzhead.extra.length), Wn(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = $r(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = Bn) : (Wn(n, 0), Wn(n, 0), Wn(n, 0), Wn(n, 0), Wn(n, 0), Wn(n, 9 === n.level ? 2 : n.strategy >= un || n.level < 2 ? 4 : 0), Wn(n, Un), n.status = Mn);else {
    var a = gn + (n.w_bits - 8 << 4) << 8;
    a |= (n.strategy >= un || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6, 0 !== n.strstart && (a |= Rn), a += 31 - a % 31, n.status = Mn, Yn(n, a), 0 !== n.strstart && (Yn(n, e.adler >>> 16), Yn(n, 65535 & e.adler)), e.adler = 1;
  }
  if (n.status === Bn) if (n.gzhead.extra) {
    for (i = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), Zn(e), i = n.pending, n.pending !== n.pending_buf_size));) {Wn(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++;}

    n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = zn);
  } else n.status = zn;
  if (n.status === zn) if (n.gzhead.name) {
    i = n.pending;

    do {
      if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), Zn(e), i = n.pending, n.pending === n.pending_buf_size)) {
        o = 1;
        break;
      }

      o = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, Wn(n, o);
    } while (0 !== o);

    n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), 0 === o && (n.gzindex = 0, n.status = Ln);
  } else n.status = Ln;
  if (n.status === Ln) if (n.gzhead.comment) {
    i = n.pending;

    do {
      if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), Zn(e), i = n.pending, n.pending === n.pending_buf_size)) {
        o = 1;
        break;
      }

      o = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, Wn(n, o);
    } while (0 !== o);

    n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), 0 === o && (n.status = Tn);
  } else n.status = Tn;

  if (n.status === Tn && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && Zn(e), n.pending + 2 <= n.pending_buf_size && (Wn(n, 255 & e.adler), Wn(n, e.adler >> 8 & 255), e.adler = 0, n.status = Mn)) : n.status = Mn), 0 !== n.pending) {
    if (Zn(e), 0 === e.avail_out) return n.last_flush = -1, on;
  } else if (0 === e.avail_in && Fn(t) <= Fn(r) && t !== rn) return Hn(e, ln);

  if (n.status === Cn && 0 !== e.avail_in) return Hn(e, ln);

  if (0 !== e.avail_in || 0 !== n.lookahead || t !== Qr && n.status !== Cn) {
    var s = n.strategy === un ? function (e, t) {
      for (var r;;) {
        if (0 === e.lookahead && (Xn(e), 0 === e.lookahead)) {
          if (t === Qr) return Dn;
          break;
        }

        if (e.match_length = 0, r = qr(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;
      }

      return e.insert = 0, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;
    }(n, t) : n.strategy === dn ? function (e, t) {
      for (var r, n, i, o, a = e.window;;) {
        if (e.lookahead <= Sn) {
          if (Xn(e), e.lookahead <= Sn && t === Qr) return Dn;
          if (0 === e.lookahead) break;
        }

        if (e.match_length = 0, e.lookahead >= En && e.strstart > 0 && (n = a[i = e.strstart - 1]) === a[++i] && n === a[++i] && n === a[++i]) {
          o = e.strstart + Sn;

          do {} while (n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && i < o);

          e.match_length = Sn - (o - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
        }

        if (e.match_length >= En ? (r = qr(e, 1, e.match_length - En), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = qr(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;
      }

      return e.insert = 0, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;
    }(n, t) : Jr[n.level].func(n, t);
    if (s !== Pn && s !== On || (n.status = Cn), s === Dn || s === Pn) return 0 === e.avail_out && (n.last_flush = -1), on;
    if (s === In && (t === en ? Kr(n) : t !== nn && (Yr(n, 0, 0, !1), t === tn && (Nn(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), Zn(e), 0 === e.avail_out)) return n.last_flush = -1, on;
  }

  return t !== rn ? on : n.wrap <= 0 ? an : (2 === n.wrap ? (Wn(n, 255 & e.adler), Wn(n, e.adler >> 8 & 255), Wn(n, e.adler >> 16 & 255), Wn(n, e.adler >> 24 & 255), Wn(n, 255 & e.total_in), Wn(n, e.total_in >> 8 & 255), Wn(n, e.total_in >> 16 & 255), Wn(n, e.total_in >> 24 & 255)) : (Yn(n, e.adler >>> 16), Yn(n, 65535 & e.adler)), Zn(e), n.wrap > 0 && (n.wrap = -n.wrap), 0 !== n.pending ? on : an);
}

Jr = [new Gn(0, 0, 0, 0, function (e, t) {
  var r = 65535;

  for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);;) {
    if (e.lookahead <= 1) {
      if (Xn(e), 0 === e.lookahead && t === Qr) return Dn;
      if (0 === e.lookahead) break;
    }

    e.strstart += e.lookahead, e.lookahead = 0;
    var n = e.block_start + r;
    if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, jn(e, !1), 0 === e.strm.avail_out)) return Dn;
    if (e.strstart - e.block_start >= e.w_size - xn && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;
  }

  return e.insert = 0, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : (e.strstart > e.block_start && (jn(e, !1), e.strm.avail_out), Dn);
}), new Gn(4, 4, 8, 4, qn), new Gn(4, 5, 16, 8, qn), new Gn(4, 6, 32, 32, qn), new Gn(4, 4, 16, 16, Vn), new Gn(8, 16, 32, 32, Vn), new Gn(8, 16, 128, 128, Vn), new Gn(8, 32, 128, 256, Vn), new Gn(32, 128, 258, 1024, Vn), new Gn(32, 258, 258, 4096, Vn)];
var ei = 30,
ti = 12;

function ri(e, t) {
  var r, n, i, o, a, s, h, l, f, c, u, d, p, _, g, v, w, b, y, m, k, E, S, x, R;

  r = e.state, n = e.next_in, x = e.input, i = n + (e.avail_in - 5), o = e.next_out, R = e.output, a = o - (t - e.avail_out), s = o + (e.avail_out - 257), h = r.dmax, l = r.wsize, f = r.whave, c = r.wnext, u = r.window, d = r.hold, p = r.bits, _ = r.lencode, g = r.distcode, v = (1 << r.lenbits) - 1, w = (1 << r.distbits) - 1;

  e: do {
    p < 15 && (d += x[n++] << p, p += 8, d += x[n++] << p, p += 8), b = _[d & v];

    t: for (;;) {
      if (d >>>= y = b >>> 24, p -= y, 0 === (y = b >>> 16 & 255)) R[o++] = 65535 & b;else {
        if (!(16 & y)) {
          if (0 == (64 & y)) {
            b = _[(65535 & b) + (d & (1 << y) - 1)];
            continue t;
          }

          if (32 & y) {
            r.mode = ti;
            break e;
          }

          e.msg = "invalid literal/length code", r.mode = ei;
          break e;
        }

        m = 65535 & b, (y &= 15) && (p < y && (d += x[n++] << p, p += 8), m += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += x[n++] << p, p += 8, d += x[n++] << p, p += 8), b = g[d & w];

        r: for (;;) {
          if (d >>>= y = b >>> 24, p -= y, !(16 & (y = b >>> 16 & 255))) {
            if (0 == (64 & y)) {
              b = g[(65535 & b) + (d & (1 << y) - 1)];
              continue r;
            }

            e.msg = "invalid distance code", r.mode = ei;
            break e;
          }

          if (k = 65535 & b, p < (y &= 15) && (d += x[n++] << p, (p += 8) < y && (d += x[n++] << p, p += 8)), (k += d & (1 << y) - 1) > h) {
            e.msg = "invalid distance too far back", r.mode = ei;
            break e;
          }

          if (d >>>= y, p -= y, k > (y = o - a)) {
            if ((y = k - y) > f && r.sane) {
              e.msg = "invalid distance too far back", r.mode = ei;
              break e;
            }

            if (E = 0, S = u, 0 === c) {
              if (E += l - y, y < m) {
                m -= y;

                do {
                  R[o++] = u[E++];
                } while (--y);

                E = o - k, S = R;
              }
            } else if (c < y) {
              if (E += l + c - y, (y -= c) < m) {
                m -= y;

                do {
                  R[o++] = u[E++];
                } while (--y);

                if (E = 0, c < m) {
                  m -= y = c;

                  do {
                    R[o++] = u[E++];
                  } while (--y);

                  E = o - k, S = R;
                }
              }
            } else if (E += c - y, y < m) {
              m -= y;

              do {
                R[o++] = u[E++];
              } while (--y);

              E = o - k, S = R;
            }

            for (; m > 2;) {R[o++] = S[E++], R[o++] = S[E++], R[o++] = S[E++], m -= 3;}

            m && (R[o++] = S[E++], m > 1 && (R[o++] = S[E++]));
          } else {
            E = o - k;

            do {
              R[o++] = R[E++], R[o++] = R[E++], R[o++] = R[E++], m -= 3;
            } while (m > 2);

            m && (R[o++] = R[E++], m > 1 && (R[o++] = R[E++]));
          }

          break;
        }
      }
      break;
    }
  } while (n < i && o < s);

  n -= m = p >> 3, d &= (1 << (p -= m << 3)) - 1, e.next_in = n, e.next_out = o, e.avail_in = n < i ? i - n + 5 : 5 - (n - i), e.avail_out = o < s ? s - o + 257 : 257 - (o - s), r.hold = d, r.bits = p;
}

var ni = 15,
ii = 852,
oi = 592,
ai = 0,
si = 1,
hi = 2,
li = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
fi = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
ci = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
ui = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];

function di(e, t, r, n, i, o, a, s) {
  var h,
  l,
  f,
  c,
  u,
  d,
  p,
  _,
  g,
  v = s.bits,
  w = 0,
  b = 0,
  y = 0,
  m = 0,
  k = 0,
  E = 0,
  S = 0,
  x = 0,
  R = 0,
  A = 0,
  B = null,
  z = 0,
  L = new Yt(ni + 1),
  T = new Yt(ni + 1),
  M = null,
  C = 0;

  for (w = 0; w <= ni; w++) {L[w] = 0;}

  for (b = 0; b < n; b++) {L[t[r + b]]++;}

  for (k = v, m = ni; m >= 1 && 0 === L[m]; m--) {;}

  if (k > m && (k = m), 0 === m) return i[o++] = 20971520, i[o++] = 20971520, s.bits = 1, 0;

  for (y = 1; y < m && 0 === L[y]; y++) {;}

  for (k < y && (k = y), x = 1, w = 1; w <= ni; w++) {if (x <<= 1, (x -= L[w]) < 0) return -1;}

  if (x > 0 && (e === ai || 1 !== m)) return -1;

  for (T[1] = 0, w = 1; w < ni; w++) {T[w + 1] = T[w] + L[w];}

  for (b = 0; b < n; b++) {0 !== t[r + b] && (a[T[t[r + b]]++] = b);}

  if (e === ai ? (B = M = a, d = 19) : e === si ? (B = li, z -= 257, M = fi, C -= 257, d = 256) : (B = ci, M = ui, d = -1), A = 0, b = 0, w = y, u = o, E = k, S = 0, f = -1, c = (R = 1 << k) - 1, e === si && R > ii || e === hi && R > oi) return 1;

  for (;;) {
    p = w - S, a[b] < d ? (_ = 0, g = a[b]) : a[b] > d ? (_ = M[C + a[b]], g = B[z + a[b]]) : (_ = 96, g = 0), h = 1 << w - S, y = l = 1 << E;

    do {
      i[u + (A >> S) + (l -= h)] = p << 24 | _ << 16 | g | 0;
    } while (0 !== l);

    for (h = 1 << w - 1; A & h;) {h >>= 1;}

    if (0 !== h ? (A &= h - 1, A += h) : A = 0, b++, 0 == --L[w]) {
      if (w === m) break;
      w = t[r + a[b]];
    }

    if (w > k && (A & c) !== f) {
      for (0 === S && (S = k), u += y, x = 1 << (E = w - S); E + S < m && !((x -= L[E + S]) <= 0);) {E++, x <<= 1;}

      if (R += 1 << E, e === si && R > ii || e === hi && R > oi) return 1;
      i[f = A & c] = k << 24 | E << 16 | u - o | 0;
    }
  }

  return 0 !== A && (i[u + A] = w - S << 24 | 64 << 16 | 0), s.bits = k, 0;
}

var pi = 0,
_i = 1,
gi = 2,
vi = 4,
wi = 5,
bi = 6,
yi = 0,
mi = 1,
ki = 2,
Ei = -2,
Si = -3,
xi = -4,
Ri = -5,
Ai = 8,
Bi = 1,
zi = 2,
Li = 3,
Ti = 4,
Mi = 5,
Ci = 6,
Di = 7,
Ii = 8,
Pi = 9,
Oi = 10,
Ui = 11,
Hi = 12,
Fi = 13,
Ni = 14,
Zi = 15,
ji = 16,
Wi = 17,
Yi = 18,
Ki = 19,
Xi = 20,
qi = 21,
Vi = 22,
Gi = 23,
$i = 24,
Ji = 25,
Qi = 26,
eo = 27,
to = 28,
ro = 29,
no = 30,
io = 31,
oo = 32,
ao = 852,
so = 592;

function ho(e) {
  return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
}

function lo() {
  this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Yt(320), this.work = new Yt(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}

function fo(e) {
  var t;
  return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, function (e) {
    var t;
    return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = Bi, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Kt(ao), t.distcode = t.distdyn = new Kt(so), t.sane = 1, t.back = -1, yi) : Ei;
  }(e)) : Ei;
}

function co(e, t) {
  var r, n;
  return e ? (n = new lo(), e.state = n, n.window = null, (r = function (e, t) {
    var r, n;
    return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? Ei : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, fo(e))) : Ei;
  }(e, t)) !== yi && (e.state = null), r) : Ei;
}

var uo,
po,
_o = !0;

function go(e) {
  if (_o) {
    var t;

    for (uo = new Kt(512), po = new Kt(32), t = 0; t < 144;) {e.lens[t++] = 8;}

    for (; t < 256;) {e.lens[t++] = 9;}

    for (; t < 280;) {e.lens[t++] = 7;}

    for (; t < 288;) {e.lens[t++] = 8;}

    for (di(_i, e.lens, 0, 288, uo, 0, e.work, {
      bits: 9 }),
    t = 0; t < 32;) {e.lens[t++] = 5;}

    di(gi, e.lens, 0, 32, po, 0, e.work, {
      bits: 5 }),
    _o = !1;
  }

  e.lencode = uo, e.lenbits = 9, e.distcode = po, e.distbits = 5;
}

function vo(e, t) {
  var r,
  n,
  i,
  o,
  a,
  s,
  h,
  l,
  f,
  c,
  u,
  d,
  p,
  _,
  g,
  v,
  w,
  b,
  y,
  m,
  k,
  E,
  S,
  x,
  R = 0,
  A = new Wt(4),
  B = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return Ei;
  (r = e.state).mode === Hi && (r.mode = Fi), a = e.next_out, i = e.output, h = e.avail_out, o = e.next_in, n = e.input, s = e.avail_in, l = r.hold, f = r.bits, c = s, u = h, E = yi;

  e: for (;;) {switch (r.mode) {
      case Bi:
        if (0 === r.wrap) {
          r.mode = Fi;
          break;
        }

        for (; f < 16;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        if (2 & r.wrap && 35615 === l) {
          r.check = 0, A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0), l = 0, f = 0, r.mode = zi;
          break;
        }

        if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & l) << 8) + (l >> 8)) % 31) {
          e.msg = "incorrect header check", r.mode = no;
          break;
        }

        if ((15 & l) !== Ai) {
          e.msg = "unknown compression method", r.mode = no;
          break;
        }

        if (f -= 4, k = 8 + (15 & (l >>>= 4)), 0 === r.wbits) r.wbits = k;else if (k > r.wbits) {
          e.msg = "invalid window size", r.mode = no;
          break;
        }
        r.dmax = 1 << k, e.adler = r.check = 1, r.mode = 512 & l ? Oi : Hi, l = 0, f = 0;
        break;

      case zi:
        for (; f < 16;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        if (r.flags = l, (255 & r.flags) !== Ai) {
          e.msg = "unknown compression method", r.mode = no;
          break;
        }

        if (57344 & r.flags) {
          e.msg = "unknown header flags set", r.mode = no;
          break;
        }

        r.head && (r.head.text = l >> 8 & 1), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0)), l = 0, f = 0, r.mode = Li;

      case Li:
        for (; f < 32;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        r.head && (r.head.time = l), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, A[2] = l >>> 16 & 255, A[3] = l >>> 24 & 255, r.check = $r(r.check, A, 4, 0)), l = 0, f = 0, r.mode = Ti;

      case Ti:
        for (; f < 16;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        r.head && (r.head.xflags = 255 & l, r.head.os = l >> 8), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0)), l = 0, f = 0, r.mode = Mi;

      case Mi:
        if (1024 & r.flags) {
          for (; f < 16;) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          r.length = l, r.head && (r.head.extra_len = l), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0)), l = 0, f = 0;
        } else r.head && (r.head.extra = null);

        r.mode = Ci;

      case Ci:
        if (1024 & r.flags && ((d = r.length) > s && (d = s), d && (r.head && (k = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), jt(r.head.extra, n, o, d, k)), 512 & r.flags && (r.check = $r(r.check, n, d, o)), s -= d, o += d, r.length -= d), r.length)) break e;
        r.length = 0, r.mode = Di;

      case Di:
        if (2048 & r.flags) {
          if (0 === s) break e;
          d = 0;

          do {
            k = n[o + d++], r.head && k && r.length < 65536 && (r.head.name += String.fromCharCode(k));
          } while (k && d < s);

          if (512 & r.flags && (r.check = $r(r.check, n, d, o)), s -= d, o += d, k) break e;
        } else r.head && (r.head.name = null);

        r.length = 0, r.mode = Ii;

      case Ii:
        if (4096 & r.flags) {
          if (0 === s) break e;
          d = 0;

          do {
            k = n[o + d++], r.head && k && r.length < 65536 && (r.head.comment += String.fromCharCode(k));
          } while (k && d < s);

          if (512 & r.flags && (r.check = $r(r.check, n, d, o)), s -= d, o += d, k) break e;
        } else r.head && (r.head.comment = null);

        r.mode = Pi;

      case Pi:
        if (512 & r.flags) {
          for (; f < 16;) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          if (l !== (65535 & r.check)) {
            e.msg = "header crc mismatch", r.mode = no;
            break;
          }

          l = 0, f = 0;
        }

        r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = Hi;
        break;

      case Oi:
        for (; f < 32;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        e.adler = r.check = ho(l), l = 0, f = 0, r.mode = Ui;

      case Ui:
        if (0 === r.havedict) return e.next_out = a, e.avail_out = h, e.next_in = o, e.avail_in = s, r.hold = l, r.bits = f, ki;
        e.adler = r.check = 1, r.mode = Hi;

      case Hi:
        if (t === wi || t === bi) break e;

      case Fi:
        if (r.last) {
          l >>>= 7 & f, f -= 7 & f, r.mode = eo;
          break;
        }

        for (; f < 3;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        switch (r.last = 1 & l, f -= 1, 3 & (l >>>= 1)) {
          case 0:
            r.mode = Ni;
            break;

          case 1:
            if (go(r), r.mode = Xi, t === bi) {
              l >>>= 2, f -= 2;
              break e;
            }

            break;

          case 2:
            r.mode = Wi;
            break;

          case 3:
            e.msg = "invalid block type", r.mode = no;}


        l >>>= 2, f -= 2;
        break;

      case Ni:
        for (l >>>= 7 & f, f -= 7 & f; f < 32;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        if ((65535 & l) != (l >>> 16 ^ 65535)) {
          e.msg = "invalid stored block lengths", r.mode = no;
          break;
        }

        if (r.length = 65535 & l, l = 0, f = 0, r.mode = Zi, t === bi) break e;

      case Zi:
        r.mode = ji;

      case ji:
        if (d = r.length) {
          if (d > s && (d = s), d > h && (d = h), 0 === d) break e;
          jt(i, n, o, d, a), s -= d, o += d, h -= d, a += d, r.length -= d;
          break;
        }

        r.mode = Hi;
        break;

      case Wi:
        for (; f < 14;) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        if (r.nlen = 257 + (31 & l), l >>>= 5, f -= 5, r.ndist = 1 + (31 & l), l >>>= 5, f -= 5, r.ncode = 4 + (15 & l), l >>>= 4, f -= 4, r.nlen > 286 || r.ndist > 30) {
          e.msg = "too many length or distance symbols", r.mode = no;
          break;
        }

        r.have = 0, r.mode = Yi;

      case Yi:
        for (; r.have < r.ncode;) {
          for (; f < 3;) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          r.lens[B[r.have++]] = 7 & l, l >>>= 3, f -= 3;
        }

        for (; r.have < 19;) {r.lens[B[r.have++]] = 0;}

        if (r.lencode = r.lendyn, r.lenbits = 7, S = {
          bits: r.lenbits },
        E = di(pi, r.lens, 0, 19, r.lencode, 0, r.work, S), r.lenbits = S.bits, E) {
          e.msg = "invalid code lengths set", r.mode = no;
          break;
        }

        r.have = 0, r.mode = Ki;

      case Ki:
        for (; r.have < r.nlen + r.ndist;) {
          for (; v = (R = r.lencode[l & (1 << r.lenbits) - 1]) >>> 16 & 255, w = 65535 & R, !((g = R >>> 24) <= f);) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          if (w < 16) l >>>= g, f -= g, r.lens[r.have++] = w;else {
            if (16 === w) {
              for (x = g + 2; f < x;) {
                if (0 === s) break e;
                s--, l += n[o++] << f, f += 8;
              }

              if (l >>>= g, f -= g, 0 === r.have) {
                e.msg = "invalid bit length repeat", r.mode = no;
                break;
              }

              k = r.lens[r.have - 1], d = 3 + (3 & l), l >>>= 2, f -= 2;
            } else if (17 === w) {
              for (x = g + 3; f < x;) {
                if (0 === s) break e;
                s--, l += n[o++] << f, f += 8;
              }

              f -= g, k = 0, d = 3 + (7 & (l >>>= g)), l >>>= 3, f -= 3;
            } else {
              for (x = g + 7; f < x;) {
                if (0 === s) break e;
                s--, l += n[o++] << f, f += 8;
              }

              f -= g, k = 0, d = 11 + (127 & (l >>>= g)), l >>>= 7, f -= 7;
            }

            if (r.have + d > r.nlen + r.ndist) {
              e.msg = "invalid bit length repeat", r.mode = no;
              break;
            }

            for (; d--;) {r.lens[r.have++] = k;}
          }
        }

        if (r.mode === no) break;

        if (0 === r.lens[256]) {
          e.msg = "invalid code -- missing end-of-block", r.mode = no;
          break;
        }

        if (r.lenbits = 9, S = {
          bits: r.lenbits },
        E = di(_i, r.lens, 0, r.nlen, r.lencode, 0, r.work, S), r.lenbits = S.bits, E) {
          e.msg = "invalid literal/lengths set", r.mode = no;
          break;
        }

        if (r.distbits = 6, r.distcode = r.distdyn, S = {
          bits: r.distbits },
        E = di(gi, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S), r.distbits = S.bits, E) {
          e.msg = "invalid distances set", r.mode = no;
          break;
        }

        if (r.mode = Xi, t === bi) break e;

      case Xi:
        r.mode = qi;

      case qi:
        if (s >= 6 && h >= 258) {
          e.next_out = a, e.avail_out = h, e.next_in = o, e.avail_in = s, r.hold = l, r.bits = f, ri(e, u), a = e.next_out, i = e.output, h = e.avail_out, o = e.next_in, n = e.input, s = e.avail_in, l = r.hold, f = r.bits, r.mode === Hi && (r.back = -1);
          break;
        }

        for (r.back = 0; v = (R = r.lencode[l & (1 << r.lenbits) - 1]) >>> 16 & 255, w = 65535 & R, !((g = R >>> 24) <= f);) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        if (v && 0 == (240 & v)) {
          for (b = g, y = v, m = w; v = (R = r.lencode[m + ((l & (1 << b + y) - 1) >> b)]) >>> 16 & 255, w = 65535 & R, !(b + (g = R >>> 24) <= f);) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          l >>>= b, f -= b, r.back += b;
        }

        if (l >>>= g, f -= g, r.back += g, r.length = w, 0 === v) {
          r.mode = Qi;
          break;
        }

        if (32 & v) {
          r.back = -1, r.mode = Hi;
          break;
        }

        if (64 & v) {
          e.msg = "invalid literal/length code", r.mode = no;
          break;
        }

        r.extra = 15 & v, r.mode = Vi;

      case Vi:
        if (r.extra) {
          for (x = r.extra; f < x;) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          r.length += l & (1 << r.extra) - 1, l >>>= r.extra, f -= r.extra, r.back += r.extra;
        }

        r.was = r.length, r.mode = Gi;

      case Gi:
        for (; v = (R = r.distcode[l & (1 << r.distbits) - 1]) >>> 16 & 255, w = 65535 & R, !((g = R >>> 24) <= f);) {
          if (0 === s) break e;
          s--, l += n[o++] << f, f += 8;
        }

        if (0 == (240 & v)) {
          for (b = g, y = v, m = w; v = (R = r.distcode[m + ((l & (1 << b + y) - 1) >> b)]) >>> 16 & 255, w = 65535 & R, !(b + (g = R >>> 24) <= f);) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          l >>>= b, f -= b, r.back += b;
        }

        if (l >>>= g, f -= g, r.back += g, 64 & v) {
          e.msg = "invalid distance code", r.mode = no;
          break;
        }

        r.offset = w, r.extra = 15 & v, r.mode = $i;

      case $i:
        if (r.extra) {
          for (x = r.extra; f < x;) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          r.offset += l & (1 << r.extra) - 1, l >>>= r.extra, f -= r.extra, r.back += r.extra;
        }

        if (r.offset > r.dmax) {
          e.msg = "invalid distance too far back", r.mode = no;
          break;
        }

        r.mode = Ji;

      case Ji:
        if (0 === h) break e;

        if (d = u - h, r.offset > d) {
          if ((d = r.offset - d) > r.whave && r.sane) {
            e.msg = "invalid distance too far back", r.mode = no;
            break;
          }

          d > r.wnext ? (d -= r.wnext, p = r.wsize - d) : p = r.wnext - d, d > r.length && (d = r.length), _ = r.window;
        } else _ = i, p = a - r.offset, d = r.length;

        d > h && (d = h), h -= d, r.length -= d;

        do {
          i[a++] = _[p++];
        } while (--d);

        0 === r.length && (r.mode = qi);
        break;

      case Qi:
        if (0 === h) break e;
        i[a++] = r.length, h--, r.mode = qi;
        break;

      case eo:
        if (r.wrap) {
          for (; f < 32;) {
            if (0 === s) break e;
            s--, l |= n[o++] << f, f += 8;
          }

          if (u -= h, e.total_out += u, r.total += u, u && (e.adler = r.check = r.flags ? $r(r.check, i, u, a - u) : Vr(r.check, i, u, a - u)), u = h, (r.flags ? l : ho(l)) !== r.check) {
            e.msg = "incorrect data check", r.mode = no;
            break;
          }

          l = 0, f = 0;
        }

        r.mode = to;

      case to:
        if (r.wrap && r.flags) {
          for (; f < 32;) {
            if (0 === s) break e;
            s--, l += n[o++] << f, f += 8;
          }

          if (l !== (4294967295 & r.total)) {
            e.msg = "incorrect length check", r.mode = no;
            break;
          }

          l = 0, f = 0;
        }

        r.mode = ro;

      case ro:
        E = mi;
        break e;

      case no:
        E = Si;
        break e;

      case io:
        return xi;

      case oo:
      default:
        return Ei;}}


  return e.next_out = a, e.avail_out = h, e.next_in = o, e.avail_in = s, r.hold = l, r.bits = f, (r.wsize || u !== e.avail_out && r.mode < no && (r.mode < eo || t !== vi)) && function (e, t, r, n) {
    var i,
    o = e.state;
    null === o.window && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new Wt(o.wsize)), n >= o.wsize ? (jt(o.window, t, r - o.wsize, o.wsize, 0), o.wnext = 0, o.whave = o.wsize) : ((i = o.wsize - o.wnext) > n && (i = n), jt(o.window, t, r - n, i, o.wnext), (n -= i) ? (jt(o.window, t, r - n, n, 0), o.wnext = n, o.whave = o.wsize) : (o.wnext += i, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += i)));
  }(e, e.output, e.next_out, u - e.avail_out), c -= e.avail_in, u -= e.avail_out, e.total_in += c, e.total_out += u, r.total += u, r.wrap && u && (e.adler = r.check = r.flags ? $r(r.check, i, u, e.next_out - u) : Vr(r.check, i, u, e.next_out - u)), e.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === Hi ? 128 : 0) + (r.mode === Xi || r.mode === Zi ? 256 : 0), (0 === c && 0 === u || t === vi) && E === yi && (E = Ri), E;
}

var wo,
bo = 1,
yo = 7;

function mo(e) {
  if (e < bo || e > yo) throw new TypeError("Bad argument");
  this.mode = e, this.init_done = !1, this.write_in_progress = !1, this.pending_close = !1, this.windowBits = 0, this.level = 0, this.memLevel = 0, this.strategy = 0, this.dictionary = null;
}

function ko(e, t) {
  for (var r = 0; r < e.length; r++) {this[t + r] = e[r];}
}

mo.prototype.init = function (e, t, r, n, i) {
  var o;

  switch (this.windowBits = e, this.level = t, this.memLevel = r, this.strategy = n, 3 !== this.mode && 4 !== this.mode || (this.windowBits += 16), this.mode === yo && (this.windowBits += 32), 5 !== this.mode && 6 !== this.mode || (this.windowBits = -this.windowBits), this.strm = new Zt(), this.mode) {
    case bo:
    case 3:
    case 5:
      o = function (e, t, r, n, i, o) {
        if (!e) return sn;
        var a = 1;
        if (t === fn && (t = 6), n < 0 ? (a = 0, n = -n) : n > 15 && (a = 2, n -= 16), i < 1 || i > vn || r !== gn || n < 8 || n > 15 || t < 0 || t > 9 || o < 0 || o > pn) return Hn(e, sn);
        8 === n && (n = 9);
        var s = new $n();
        return e.state = s, s.strm = e, s.wrap = a, s.gzhead = null, s.w_bits = n, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = i + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + En - 1) / En), s.window = new Wt(2 * s.w_size), s.head = new Yt(s.hash_size), s.prev = new Yt(s.w_size), s.lit_bufsize = 1 << i + 6, s.pending_buf_size = 4 * s.lit_bufsize, s.pending_buf = new Wt(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = t, s.strategy = o, s.method = r, Jn(e);
      }(this.strm, this.level, 8, this.windowBits, this.memLevel, this.strategy);

      break;

    case 2:
    case 4:
    case 6:
    case yo:
      o = co(this.strm, this.windowBits);
      break;

    default:
      throw new Error("Unknown mode " + this.mode);}


  0 === o ? (this.write_in_progress = !1, this.init_done = !0) : this._error(o);
}, mo.prototype.params = function () {
  throw new Error("deflateParams Not supported");
}, mo.prototype._writeCheck = function () {
  if (!this.init_done) throw new Error("write before init");
  if (0 === this.mode) throw new Error("already finalized");
  if (this.write_in_progress) throw new Error("write already in progress");
  if (this.pending_close) throw new Error("close is pending");
}, mo.prototype.write = function (e, t, r, n, i, o, a) {
  this._writeCheck(), this.write_in_progress = !0;
  var s = this;
  return de(function () {
    s.write_in_progress = !1;

    var h = s._write(e, t, r, n, i, o, a);

    s.callback(h[0], h[1]), s.pending_close && s.close();
  }), this;
}, mo.prototype.writeSync = function (e, t, r, n, i, o, a) {
  return this._writeCheck(), this._write(e, t, r, n, i, o, a);
}, mo.prototype._write = function (e, t, r, n, i, o, a) {
  if (this.write_in_progress = !0, 0 !== e && 1 !== e && 2 !== e && 3 !== e && 4 !== e && 5 !== e) throw new Error("Invalid flush value");
  null == t && (t = new p(0), n = 0, r = 0), i._set ? i.set = i._set : i.set = ko;
  var s,
  h = this.strm;

  switch (h.avail_in = n, h.input = t, h.next_in = r, h.avail_out = a, h.output = i, h.next_out = o, this.mode) {
    case bo:
    case 3:
    case 5:
      s = Qn(h, e);
      break;

    case yo:
    case 2:
    case 4:
    case 6:
      s = vo(h, e);
      break;

    default:
      throw new Error("Unknown mode " + this.mode);}


  return 1 !== s && 0 !== s && this._error(s), this.write_in_progress = !1, [h.avail_in, h.avail_out];
}, mo.prototype.close = function () {
  this.write_in_progress ? this.pending_close = !0 : (this.pending_close = !1, this.mode === bo || 3 === this.mode || 5 === this.mode ? function (e) {
    var t;
    e && e.state && ((t = e.state.status) !== An && t !== Bn && t !== zn && t !== Ln && t !== Tn && t !== Mn && t !== Cn ? Hn(e, sn) : (e.state = null, t === Mn && Hn(e, hn)));
  }(this.strm) : function (e) {
    if (!e || !e.state) return Ei;
    var t = e.state;
    t.window && (t.window = null), e.state = null;
  }(this.strm), this.mode = 0);
}, mo.prototype.reset = function () {
  switch (this.mode) {
    case bo:
    case 5:
      wo = Jn(this.strm);
      break;

    case 2:
    case 6:
      wo = fo(this.strm);}


  0 !== wo && this._error(wo);
}, mo.prototype._error = function (e) {
  this.onerror(Nt[e] + ": " + this.strm.msg, e), this.write_in_progress = !1, this.pending_close && this.close();
};
var Eo = Object.freeze({
  NONE: 0,
  DEFLATE: bo,
  INFLATE: 2,
  GZIP: 3,
  GUNZIP: 4,
  DEFLATERAW: 5,
  INFLATERAW: 6,
  UNZIP: yo,
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_BUF_ERROR: -5,
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  Z_BINARY: 0,
  Z_TEXT: 1,
  Z_UNKNOWN: 2,
  Z_DEFLATED: 8,
  Zlib: mo });

var So = {};
Object.keys(Eo).forEach(function (e) {
  So[e] = Eo[e];
}), So.Z_MIN_WINDOWBITS = 8, So.Z_MAX_WINDOWBITS = 15, So.Z_DEFAULT_WINDOWBITS = 15, So.Z_MIN_CHUNK = 64, So.Z_MAX_CHUNK = 1 / 0, So.Z_DEFAULT_CHUNK = 16384, So.Z_MIN_MEMLEVEL = 1, So.Z_MAX_MEMLEVEL = 9, So.Z_DEFAULT_MEMLEVEL = 8, So.Z_MIN_LEVEL = -1, So.Z_MAX_LEVEL = 9, So.Z_DEFAULT_LEVEL = So.Z_DEFAULT_COMPRESSION;
var xo = {
  Z_OK: So.Z_OK,
  Z_STREAM_END: So.Z_STREAM_END,
  Z_NEED_DICT: So.Z_NEED_DICT,
  Z_ERRNO: So.Z_ERRNO,
  Z_STREAM_ERROR: So.Z_STREAM_ERROR,
  Z_DATA_ERROR: So.Z_DATA_ERROR,
  Z_MEM_ERROR: So.Z_MEM_ERROR,
  Z_BUF_ERROR: So.Z_BUF_ERROR,
  Z_VERSION_ERROR: So.Z_VERSION_ERROR };


function Ro(e, t, r) {
  var n = [],
  i = 0;

  function o() {
    for (var t; null !== (t = e.read());) {n.push(t), i += t.length;}

    e.once("readable", o);
  }

  function a() {
    var t = p.concat(n, i);
    n = [], r(null, t), e.close();
  }

  e.on("error", function (t) {
    e.removeListener("end", a), e.removeListener("readable", o), r(t);
  }), e.on("end", a), e.end(t), o();
}

function Ao(e, t) {
  if ("string" == typeof t && (t = new p(t)), !$(t)) throw new TypeError("Not a string or buffer");
  var r = So.Z_FINISH;
  return e._processChunk(t, r);
}

function Bo(e) {
  if (!(this instanceof Bo)) return new Bo(e);
  Io.call(this, e, So.DEFLATE);
}

function zo(e) {
  if (!(this instanceof zo)) return new zo(e);
  Io.call(this, e, So.INFLATE);
}

function Lo(e) {
  if (!(this instanceof Lo)) return new Lo(e);
  Io.call(this, e, So.GZIP);
}

function To(e) {
  if (!(this instanceof To)) return new To(e);
  Io.call(this, e, So.GUNZIP);
}

function Mo(e) {
  if (!(this instanceof Mo)) return new Mo(e);
  Io.call(this, e, So.DEFLATERAW);
}

function Co(e) {
  if (!(this instanceof Co)) return new Co(e);
  Io.call(this, e, So.INFLATERAW);
}

function Do(e) {
  if (!(this instanceof Do)) return new Do(e);
  Io.call(this, e, So.UNZIP);
}

function Io(e, t) {
  if (this._opts = e = e || {}, this._chunkSize = e.chunkSize || So.Z_DEFAULT_CHUNK, Ot.call(this, e), e.flush && e.flush !== So.Z_NO_FLUSH && e.flush !== So.Z_PARTIAL_FLUSH && e.flush !== So.Z_SYNC_FLUSH && e.flush !== So.Z_FULL_FLUSH && e.flush !== So.Z_FINISH && e.flush !== So.Z_BLOCK) throw new Error("Invalid flush flag: " + e.flush);
  if (this._flushFlag = e.flush || So.Z_NO_FLUSH, e.chunkSize && (e.chunkSize < So.Z_MIN_CHUNK || e.chunkSize > So.Z_MAX_CHUNK)) throw new Error("Invalid chunk size: " + e.chunkSize);
  if (e.windowBits && (e.windowBits < So.Z_MIN_WINDOWBITS || e.windowBits > So.Z_MAX_WINDOWBITS)) throw new Error("Invalid windowBits: " + e.windowBits);
  if (e.level && (e.level < So.Z_MIN_LEVEL || e.level > So.Z_MAX_LEVEL)) throw new Error("Invalid compression level: " + e.level);
  if (e.memLevel && (e.memLevel < So.Z_MIN_MEMLEVEL || e.memLevel > So.Z_MAX_MEMLEVEL)) throw new Error("Invalid memLevel: " + e.memLevel);
  if (e.strategy && e.strategy != So.Z_FILTERED && e.strategy != So.Z_HUFFMAN_ONLY && e.strategy != So.Z_RLE && e.strategy != So.Z_FIXED && e.strategy != So.Z_DEFAULT_STRATEGY) throw new Error("Invalid strategy: " + e.strategy);
  if (e.dictionary && !$(e.dictionary)) throw new Error("Invalid dictionary: it should be a Buffer instance");
  this._binding = new So.Zlib(t);
  var r = this;
  this._hadError = !1, this._binding.onerror = function (e, t) {
    r._binding = null, r._hadError = !0;
    var n = new Error(e);
    n.errno = t, n.code = So.codes[t], r.emit("error", n);
  };
  var n = So.Z_DEFAULT_COMPRESSION;
  "number" == typeof e.level && (n = e.level);
  var i = So.Z_DEFAULT_STRATEGY;
  "number" == typeof e.strategy && (i = e.strategy), this._binding.init(e.windowBits || So.Z_DEFAULT_WINDOWBITS, n, e.memLevel || So.Z_DEFAULT_MEMLEVEL, i, e.dictionary), this._buffer = new p(this._chunkSize), this._offset = 0, this._closed = !1, this._level = n, this._strategy = i, this.once("end", this.close);
}

Object.keys(xo).forEach(function (e) {
  xo[xo[e]] = e;
}), Be(Io, Ot), Io.prototype.params = function (e, t, r) {
  if (e < So.Z_MIN_LEVEL || e > So.Z_MAX_LEVEL) throw new RangeError("Invalid compression level: " + e);
  if (t != So.Z_FILTERED && t != So.Z_HUFFMAN_ONLY && t != So.Z_RLE && t != So.Z_FIXED && t != So.Z_DEFAULT_STRATEGY) throw new TypeError("Invalid strategy: " + t);

  if (this._level !== e || this._strategy !== t) {
    var n = this;
    this.flush(So.Z_SYNC_FLUSH, function () {
      n._binding.params(e, t), n._hadError || (n._level = e, n._strategy = t, r && r());
    });
  } else de(r);
}, Io.prototype.reset = function () {
  return this._binding.reset();
}, Io.prototype._flush = function (e) {
  this._transform(new p(0), "", e);
}, Io.prototype.flush = function (e, t) {
  var r = this._writableState;
  if (("function" == typeof e || void 0 === e && !t) && (t = e, e = So.Z_FULL_FLUSH), r.ended) t && de(t);else if (r.ending) t && this.once("end", t);else if (r.needDrain) {
    var n = this;
    this.once("drain", function () {
      n.flush(t);
    });
  } else this._flushFlag = e, this.write(new p(0), "", t);
}, Io.prototype.close = function (e) {
  if (e && de(e), !this._closed) {
    this._closed = !0, this._binding.close();
    var t = this;
    de(function () {
      t.emit("close");
    });
  }
}, Io.prototype._transform = function (e, t, r) {
  var n,
  i = this._writableState,
  o = (i.ending || i.ended) && (!e || i.length === e.length);
  if (null === !e && !$(e)) return r(new Error("invalid input"));
  o ? n = So.Z_FINISH : (n = this._flushFlag, e.length >= i.length && (this._flushFlag = this._opts.flush || So.Z_NO_FLUSH)), this._processChunk(e, n, r);
}, Io.prototype._processChunk = function (e, t, r) {
  var n = e && e.length,
  i = this._chunkSize - this._offset,
  o = 0,
  a = this,
  s = "function" == typeof r;

  if (!s) {
    var h,
    l = [],
    f = 0;
    this.on("error", function (e) {
      h = e;
    });

    do {
      var c = this._binding.writeSync(t, e, o, n, this._buffer, this._offset, i);
    } while (!this._hadError && _(c[0], c[1]));

    if (this._hadError) throw h;
    var u = p.concat(l, f);
    return this.close(), u;
  }

  var d = this._binding.write(t, e, o, n, this._buffer, this._offset, i);

  function _(h, c) {
    if (!a._hadError) {
      var u = i - c;

      if (function (e, t) {
        if (!e) throw new Error(t);
      }(u >= 0, "have should not go down"), u > 0) {
        var d = a._buffer.slice(a._offset, a._offset + u);

        a._offset += u, s ? a.push(d) : (l.push(d), f += d.length);
      }

      if ((0 === c || a._offset >= a._chunkSize) && (i = a._chunkSize, a._offset = 0, a._buffer = new p(a._chunkSize)), 0 === c) {
        if (o += n - h, n = h, !s) return !0;

        var g = a._binding.write(t, e, o, n, a._buffer, a._offset, a._chunkSize);

        return g.callback = _, void (g.buffer = e);
      }

      if (!s) return !1;
      r();
    }
  }

  d.buffer = e, d.callback = _;
}, Be(Bo, Io), Be(zo, Io), Be(Lo, Io), Be(To, Io), Be(Mo, Io), Be(Co, Io), Be(Do, Io);
var Po = {
  codes: xo,
  createDeflate: function createDeflate(e) {
    return new Bo(e);
  },
  createInflate: function createInflate(e) {
    return new zo(e);
  },
  createDeflateRaw: function createDeflateRaw(e) {
    return new Mo(e);
  },
  createInflateRaw: function createInflateRaw(e) {
    return new Co(e);
  },
  createGzip: function createGzip(e) {
    return new Lo(e);
  },
  createGunzip: function createGunzip(e) {
    return new To(e);
  },
  createUnzip: function createUnzip(e) {
    return new Do(e);
  },
  deflate: function deflate(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new Bo(t), e, r);
  },
  deflateSync: function deflateSync(e, t) {
    return Ao(new Bo(t), e);
  },
  gzip: function gzip(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new Lo(t), e, r);
  },
  gzipSync: function gzipSync(e, t) {
    return Ao(new Lo(t), e);
  },
  deflateRaw: function deflateRaw(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new Mo(t), e, r);
  },
  deflateRawSync: function deflateRawSync(e, t) {
    return Ao(new Mo(t), e);
  },
  unzip: function unzip(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new Do(t), e, r);
  },
  unzipSync: function unzipSync(e, t) {
    return Ao(new Do(t), e);
  },
  inflate: function inflate(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new zo(t), e, r);
  },
  inflateSync: function inflateSync(e, t) {
    return Ao(new zo(t), e);
  },
  gunzip: function gunzip(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new To(t), e, r);
  },
  gunzipSync: function gunzipSync(e, t) {
    return Ao(new To(t), e);
  },
  inflateRaw: function inflateRaw(e, t, r) {
    return "function" == typeof t && (r = t, t = {}), Ro(new Co(t), e, r);
  },
  inflateRawSync: function inflateRawSync(e, t) {
    return Ao(new Co(t), e);
  },
  Deflate: Bo,
  Inflate: zo,
  Gzip: Lo,
  Gunzip: To,
  DeflateRaw: Mo,
  InflateRaw: Co,
  Unzip: Do,
  Zlib: Io };var _default = /*#__PURE__*/function () {


  function _default(e, t, r) {_classCallCheck(this, _default);
    this.SDKAPPID = e, this.EXPIRETIME = r, this.PRIVATEKEY = t;
  }_createClass(_default, [{ key: "genTestUserSig", value: function genTestUserSig(

    e) {
      return this._isNumber(this.SDKAPPID) ? this._isString(this.PRIVATEKEY) ? this._isString(e) ? this._isNumber(this.EXPIRETIME) ? (console.log("sdkAppID=" + this.SDKAPPID + " key=" + this.PRIVATEKEY + " userID=" + e + " expire=" + this.EXPIRETIME), this.genSigWithUserbuf(e, this.EXPIRETIME, null)) : (console.error("expireTime must be a number"), "") : (console.error("userID must be a string"), "") : (console.error("privateKey must be a string"), "") : (console.error("sdkAppID must be a number"), "");
    } }, { key: "newBuffer", value: function newBuffer(

    e, t) {
      return p.from ? p.from(e, t) : new p(e, t);
    } }, { key: "unescape", value: function unescape(

    e) {
      return e.replace(/_/g, "=").replace(/\-/g, "/").replace(/\*/g, "+");
    } }, { key: "escape", value: function escape(

    e) {
      return e.replace(/\+/g, "*").replace(/\//g, "-").replace(/=/g, "_");
    } }, { key: "encode", value: function encode(

    e) {
      return this.escape(this.newBuffer(e).toString("base64"));
    } }, { key: "decode", value: function decode(

    e) {
      return this.newBuffer(this.unescape(e), "base64");
    } }, { key: "base64encode", value: function base64encode(

    e) {
      return this.newBuffer(e).toString("base64");
    } }, { key: "base64decode", value: function base64decode(

    e) {
      return this.newBuffer(e, "base64").toString();
    } }, { key: "_hmacsha256", value: function _hmacsha256(

    e, t, r, n) {
      var i = "TLS.identifier:" + e + "\n";
      i += "TLS.sdkappid:" + this.SDKAPPID + "\n", i += "TLS.time:" + t + "\n", i += "TLS.expire:" + r + "\n", null != n && (i += "TLS.userbuf:" + n + "\n");
      var o = te.HmacSHA256(i, this.PRIVATEKEY);
      return te.enc.Base64.stringify(o);
    } }, { key: "_utc", value: function _utc()

    {
      return Math.round(Date.now() / 1e3);
    } }, { key: "_isNumber", value: function _isNumber(

    e) {
      return null !== e && ("number" == typeof e && !isNaN(e - 0) || "object" == typeof e && e.constructor === Number);
    } }, { key: "_isString", value: function _isString(

    e) {
      return "string" == typeof e;
    } }, { key: "genSigWithUserbuf", value: function genSigWithUserbuf(

    e, t, r) {
      var n = this._utc(),
      i = {
        "TLS.ver": "2.0",
        "TLS.identifier": e,
        "TLS.sdkappid": this.SDKAPPID,
        "TLS.time": n,
        "TLS.expire": t },

      o = "";

      if (null != r) {
        var _a = this.base64encode(r);
        i["TLS.userbuf"] = _a, o = this._hmacsha256(e, n, t, _a);
      } else o = this._hmacsha256(e, n, t, null);

      i["TLS.sig"] = o;
      var a = JSON.stringify(i),
      s = Po.deflateSync(this.newBuffer(a)).toString("base64"),
      h = this.escape(s);
      return console.log("ret=" + h), h;
    } }, { key: "validate", value: function validate(

    e) {
      var t = this.decode(e),
      r = Po.inflateSync(t);
      console.log("validate ret=" + r);
    } }]);return _default;}();exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../../../software/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 7:
/*!*************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/pages.json?{"type":"style"} ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "面对面吧" }, "pages/login/login": { "navigationBarTitleText": "登录" }, "pages/index/command": { "navigationBarTitleText": "评分" }, "pages/index/command2": { "navigationBarTitleText": "评分" }, "pages/common/items": { "navigationBarTitleText": "评分" }, "pages/room/room": { "navigationBarTitleText": "面试" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "面对面吧", "navigationBarBackgroundColor": "#fff", "backgroundColor": "#fff" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!************************************************************************************************************************!*\
  !*** D:/job/bigwoods/KunLin/trtc-school/program/school-face-to-face/school-face-to-face-mp/pages.json?{"type":"stat"} ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__3F97B92" };exports.default = _default;

/***/ }),

/***/ 9:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map