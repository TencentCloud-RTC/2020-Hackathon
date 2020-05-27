//公共数据

const store = {
	state:{
		userInfo: uni.getStorageSync('userInfo'),
		wxInfo: uni.getStorageSync('wxInfo'), //后续需要更新，否则初始数据为空
		popup: {}, //默认值记录在common.js中
		dialog: {}, //默认值记录在common.js中
		remote: '',
		qiniu: '',
		trtcServer: '',
		webLink: null, //跳转到外部链接的url
	},
	mutations:{
		setWxInfo(state,param){
			param = param ? param : {};
			state.wxInfo = param;
			//以已提交的数据为准
			if(param.SchoolId) {
				state.SchoolId = param.SchoolId;
			}
		},
		setSchoolId(state,param){
			state.SchoolId = param;
		},
		setToast(state,param){
			state.popup = param;
		},
		setDialog(state,param){
			state.dialog = param;
		},
		setWebLink(state,param){
			if(param.indexOf('http') > -1){
				state.webLink = param;
				uni.navigateTo({
					url: '/pages/common/webLink'
				})
			}
			else {
				uni.navigateTo({
					url: param
				})
			}
		}
	},
	getters:{
		userInfo: state => state.userInfo,
		wxInfo: state => state.wxInfo,
		SchoolId: state => state.SchoolId,
		remote: state => state.remote,
		userType: state => state.userType,
		popup: state => state.popup,
		dialog: state => state.dialog,
		itemTypes: state => state.itemTypes,
		citys: state => state.citys,
		webLink: state => state.webLink,
		qiniu: state => state.qiniu
	},
	actions:{
		
	}
}


export default store;