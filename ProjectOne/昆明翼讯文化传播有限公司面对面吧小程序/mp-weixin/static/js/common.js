//公共js方法
import store from './store.js';
import request from './request.js'
import api from './api.js'
import Vue from 'vue';
import Vuex from 'vuex';
import moment from './plugins/moment.js'
Vue.use(Vuex);
const $store = new Vuex.Store(store);

export default {
	//如果@click绑定的函数中传入参数item会被解析成this.item(uni-app bug)，而data中又未定义，则为undefined，以下为携带参数的折中方案
	link(url, type) {
		url = url.target ? (url.target.id ? url.target.id : url.currentTarget.id) : url;
		type = type ? type : 'navigateTo';
		uni[type]({
			url
		});
	},
	//校验用户状态，是否登录，否则跳转登陆页
	checkLogin(url) {
		let userInfo = uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : false;
		console.log('userInfo', userInfo)
		if (!userInfo || userInfo.groupid == "1") {
			this.showToast({
				tip: '请登录后查看该功能',
				time: 2000
			});
			setTimeout(() => {
				this.link('/pages/login/login');
			}, 2000)
		} else if (url) {
			this.link(url)
		}
	},
	/*表单校验，当存在value2时，可校验两个值是否相同，如密码二次输入*/
	verify(type, value, value2) {
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
				return level
			case 'passwordSame':
				//校验密码是否相同
				if (!value || !value2) return {
					verify: false,
					tip: '密码不能为空'
				};
				if (value != value2) {
					return {
						verify: false,
						tip: '两次输入的密码不相同'
					};
				}
				return {
					verify: true,
					tip: '校验通过'
				};
		}
	},
	/*提交前校验*/
	/*... 有type时则不需要传入tip ...*/
	postVerify(rule, data) {
		for (var i = 0; i < rule.length; i++) {
			var type = rule[i].type ? rule[i].type : 'normal';
			switch (type) {
				case 'phone':
					var reg = /^1\d{10}$/;
					if (!reg.test(data[rule[i].key]))
						return '请输入正确的手机号码';
				case 'normal':
					if (!data[rule[i].key] || !data[rule[i].key].replace(/(^\s*)|(\s*$)/g, "")) {
						return rule[i].tip
					}
			}
		}
		return false;
	},
	showToast(param) {
		let d = {
			tip: '正在加载',
			icon: false,
			open: true,
			time: 3000
		}
		for (let k in param) d[k] = param[k];
		$store.commit('setToast', d);
	},
	hideToast() {
		$store.commit('setToast', {
			open: false
		});
	},
	showLoading(param) {
		let d = {
			tip: '正在加载',
			icon: true,
			open: true,
			time: 0
		}
		for (let k in param) d[k] = param[k];
		$store.commit('setToast', d);
	},
	hideLoading() {
		$store.commit('setToast', {
			open: false
		});
	},
	showDialog(param) {
		let d = {
			title: '提示',
			open: true,
			cancelText: '取消',
			sureText: '确定',
			tip: 'nothing',
			sure() {

			},
			cancel() {

			}
		}
		for (let k in param) d[k] = param[k];
		$store.commit('setDialog', d);
	},
	hideDialog() {
		$store.commit('setDialog', {
			open: false
		});
	},
	//上传图片
	uploadFile(filePath) {
		return new Promise((resolve, reject) => {
			uni.compressImage({
				src: filePath,
				quality: 70,
				success: res => {
					console.log(res.tempFilePath)
					filePath = res.tempFilePath;
					uni.getFileSystemManager().readFile({
						filePath,
						encoding: 'base64', //编码格式
						success: res => {
							let base64 = "data:image/jpeg;base64," + res.data
							uni.uploadFile({
								url: $store.state.remote + 'do/uploadPic',
								filePath,
								name: 'file',
								formData: {
									imgbase64: base64,
									openid: uni.getStorageSync('wxInfo').openid
								},
								success: (res) => {
									resolve(JSON.parse(res.data).respData);
								}
							});
						}
					})
				}
			})
		})
	},
	updateUserInfo() {
		api.getUserInfo().then(ret => {
			uni.setStorage({
				key: 'userInfo',
				data: ret
			})
			//更新userInfo到vuex
			$store.commit('setUserInfo', ret);
		})
	},
	//获取schoolId
	setSchoolId(option) {

		// #ifdef H5
		option = this.getUrlParams();
		console.log('option', option)
		// #endif

		if ($store.state.wxInfo.SchoolId) {
			$store.commit('setSchoolId', $store.state.wxInfo.SchoolId);
		} else if (option.SchoolId) {
			$store.commit('setSchoolId', parseInt(option.SchoolId));
		}
	},
	getUrlParams(url) {
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
	setLinkParams(link, params) {
		let pre = link + '?';
		for (let k in params) {
			pre += k + '=' + params[k] + '&';
		}
		return pre.substr(0, pre.length - 1);
	},
	getStatus(code) {
		let s = [{
			code: 1,
			status: '排队中'
		}, {
			code: 2,
			status: '排队中'
		}, {
			code: 3,
			status: '面试中'
		}, {
			code: 4,
			status: '结束面试'
		}, {
			code: 5,
			status: '面试失败 '
		}]
	},
	testid(id) {
		// 1 "验证通过!", 0 //校验不通过
		var format =
			/^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
		//号码规则校验
		if (!format.test(id)) {
			return {
				'status': 0,
				'msg': '身份证号码不合规'
			};
		}
		//区位码校验
		//出生年月日校验   前正则限制起始年份为1900;
		var year = id.substr(6, 4), //身份证年
			month = id.substr(10, 2), //身份证月
			date = id.substr(12, 2), //身份证日
			time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
			now_time = Date.parse(new Date()), //当前时间戳
			dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
		if (time > now_time || date > dates) {
			return {
				'status': 0,
				'msg': '出生日期不合规'
			}
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
				'msg': '身份证校验码不合规'
			}
		}
		return {
			'status': 1,
			'msg': '校验通过'
		}
	}
}
