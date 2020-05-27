//api
import request from './request.js'
import store from './store.js'

//userInfo: 平台用户数据
//wxInfo: 微信用户数据

export default {
	//获取用户信息
	getUserInfo() {
		return new Promise((resolve, reject) => {	
			uni.getStorage({
				key: 'wxInfo',
				success: storage => {
					//获取openid
					console.log(storage)
					request.getUserInfo().then(ret =>{
						if(!ret) {
							ret = {}
						}
						uni.setStorage({
							key: 'userInfo',
							data: ret,
							success() {
								resolve(ret);
							}
						})
						store.state.userInfo = ret;
						//没有绑定姓名跳转到登录页
						if(!ret.name){
						 uni.navigateTo({
						 	url: '/pages/login/login'
						 })
						}
					}).catch(err => {
						let user = {name: null,phone:''};
						uni.setStorage({
							key: 'userInfo',
							data: user,
							success() {
								resolve(user);
							}
						})
						store.state.userInfo = user;
						uni.navigateTo({
							url: '/pages/login/login'
						})
					})
				},
				fail(err){
					console.log(err);
					uni.login({
						success: res => {
							request.getSessionkey({code: res.code}).then(ret => {
								console.log(ret)
								uni.setStorage({
									key: 'wxInfo',
									data: ret,
									success() {
										resolve(ret);
									}
								})
								console.log(store)
								store.state.wxInfo = ret;
								//后台保存openid，接下来用手机号登录完成绑定
								
								request.obtainUserInfo({openid: ret.openid});
								
								
								request.getUserInfo({openid: ret.openid}).then(ret =>{
									if(!ret) {
										ret = {}
									}
									uni.setStorage({
										key: 'userInfo',
										data: ret,
										success() {
											resolve(ret);
										}
									})
									store.state.userInfo = ret;
									//没有绑定姓名跳转到登录页
									if(!ret.name){
										uni.navigateTo({
											url: '/pages/login/login'
										})
									}
								}).catch(err => {
									let user = {name: null,phone:''};
									uni.setStorage({
										key: 'userInfo',
										data: user,
										success() {
											resolve(user);
										}
									})
									store.state.userInfo = user;
									uni.navigateTo({
										url: '/pages/login/login'
									})
								})
								
								
								//跳转到登陆页
								// uni.navigateTo({
								// 	url: '/pages/login/login'
								// })
							})
						}
					})
				}
			})
		})
	}
}
