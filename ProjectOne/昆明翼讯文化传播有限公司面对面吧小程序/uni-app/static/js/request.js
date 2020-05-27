import store from './store.js';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const $store = new Vuex.Store(store);

import $com from './common.js'

//const remote = "http://miikats.ngrok2.xiaomiqiu.cn";
//const remote = "http://gh.yunyitx.com";

//接口列表，默认post，如果是get方式，需要添加 method:'get'；
const requests = [
	//trtc api	
	{name:'getUserSig',path:'sdk/getUserSig',server:'trtcServer'},
	
	/*.........interview api............*/
	//获取用户微信信息
	{name:'obtainUserInfo',path: 'do/obtainUserInfo'},
	//获取用户平台数据
	{name:'getUserInfo',path: 'do/getUserInfo'},
	//获取openid和session_key
	{name:'getSessionkey',path: 'do/getSessionkey'},
	//下发动态码
	{name:'sendRCode',path: 'do/sendRCode'},
	//查询房间列表
	{name:'queryRooms',path: 'do/queryRooms'},
	//绑定用户信息1
	{name:'verifyRCode',path: 'do/verifyRCode'},
	//绑定用户信息2
	{name:'verifyIdCode',path: 'do/verifyIdCode'},
	//查询面试官
	{name: 'queryRoomTearcherList',path: 'do/queryRoomTearcherList'},
	//查询面试问题
	{name: 'queryParterExams',path: 'do/queryParterExams'},
	//查询当前面试者信息
	{name: 'queryParterInfo',path: 'do/queryParterInfo'},
	//打分
	{name: 'markScoresAfterEnd',path: 'do/markScoresAfterEnd'},
	//查看房间状态
	{name: 'queryRoomStatus',path: 'do/queryRoomStatus'},
	//更改房间状态
	{name: 'modifyRoomId',path: 'do/modifyRoomId'},
	//通知sendMiniMsg
	{name: 'sendMiniMsg',path: 'do/sendMiniMsg'},
	//获取滚动消息/do/getRolling
	{name: 'getRolling',path: 'do/getRolling'},
	//modifyName
	{name: 'modifyName',path: 'do/modifyName'},
	//面试官打分
	{name: 'markScores',path: 'do/markScores'},
	//根据scoreId获取打分数据
	{name: 'getScoreInfoByScoreId',path: 'do/getScoreInfoByScoreId'},
	//发送通知
	{name: 'sendMiniMsg',path: 'do/sendMiniMsg'},
	//获取/修改面试开始时间
	{name: 'modifyStartTime',path: 'do/modifyStartTime'},
]

const $req = {};

requests.forEach((v,i) => {
	$req[v.name] = (param) => {
		
		//默认入参openid
		let defaultP = {
			openid: uni.getStorageSync('wxInfo').openid
		}
		for(let k in param) defaultP[k] = param[k];
		
		console.log(v.name,defaultP)
		
		return new Promise((resolve,reject) => {
			let server = v.server ? $store.state[v.server] : $store.state.remote;
			uni.request({
				url: server + v.path,
				method: v.method ? v.method : 'post',
				data: defaultP,
				dataType: "json",
				contentType: v.contentType ? v.contentType : "application/json;charset-UTF-8",
				success: (res) => {
					if(res.data.respCode == '-1'){
						if(res.data.msg && res.data.msg!='参数信息不能缺 ') $com.showToast({time:4000,tip:res.data.msg})
						reject(res.data.msg)
					}
					else{
						if(res.data.respData)resolve(res.data.respData)
						else resolve(res.data.ret)
					}
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	}
})
export default $req;