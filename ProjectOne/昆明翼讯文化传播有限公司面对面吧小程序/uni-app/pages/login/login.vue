<template>
	<view class="login-vue container" :class="{'fill-phone':fillPhone}">
		<!-- <userAuth url="/pages/login/login"></userAuth> -->
		<image src="/static/images/logo.png" mode="aspectFit" />
		<view class="w100">
			<view class="input-border" style="margin-bottom: 0;">
				<text class="icon iconfont icon-mine"></text>
				<input type="text" v-model="param.name" placeholder="输入姓名" />
			</view>
			<view class="box">
				<view class="slide-down">
					<view class="input-border">
						<text class="icon iconfont icon-ad80"></text>
						<input v-model="param.IDcode" placeholder="请输入身份证号码" />
					</view>
					<button @tap="getNotice" v-if="!param.phone" type="primary" style="margin-top:40upx;" class="button-large" open-type="getPhoneNumber" @getphonenumber="getphonenumber">登录</button>
					<button v-else type="primary" style="margin-top:40upx;" class="button-large" @click="login">登录</button>
				</view>
			</view>
		</view>
		<view class="circle circle1"></view>
		<view class="circle circle2"></view>
		<view class="circle circle3"></view>
		<view class="desc">“面对面吧”是针对学校内部实名进行面试考试的平台，登录后即可查看待面试的考试信息，并在线进行面试</view>
		<view class="tc">
			<!-- <bwCheckBox class="mt" :list="check" keyword="name" immediate="true"></bwCheckBox>
			已阅读并同意<text class="text-dark-red" @click="$refs.popup2.open()">《用户使用协议》</text> -->
			<text class="bottom-tips">copyright @ 面对面吧</text>
		</view>
		<!-- <popup ref="popup2" type="center">
			<agreement @close="close" @agree="agree"></agreement>
		</popup> -->
		<toast></toast>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	// import agreement from "@/pages/common/agreement.vue"
	import bwCheckBox from '@/components/check-box/check-box.vue'
	export default {
		data(){
			return {
				fillPhone: true,
				checked: false,
				check:[{name:'',color:"#c7181d",checked: false}],
				code:{
					time: 60,
					text: '获取动态码',
					loading: false
				},
				popup:{
					tips: '正在登录',
					icon: true
				},
				param: {
					phone: null,
					name: null,
					IDcode: null
				},
				rule:[{
					key: 'IDcode',
					tip: '请输入身份证号'
				},{
					key: 'name',
					tip: '请输入您的姓名'
				}],
				noticeDown: false,
				phoneDown: false
			}
		},
		computed: {
			...mapGetters (['userInfo','wxInfo']),
			test(){
				return uni.getStorageSync('wxInfo')
			}
		},
		components:{
			//agreement,
			bwCheckBox
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '发现一个好玩的面试平台',
		      path: '/pages/login/login'
		    }
		},
		methods: {
			...mapMutations(['setWxInfo']),
			getNotice(){
				let _this = this;
				uni.requestSubscribeMessage({
				  tmplIds: ['eW5uvsh3EZawKwNaWU3hljOXG7rf2sXDK0vy-T6nGKE'],
				  success (res) {
					  console.log('res',res)
				  },
				  fail(err){
					  console.log('err',err)
				  },
				  complete(){
					  _this.noticeDown = true;
					  console.log(' _this.noticeDown', _this.noticeDown)
					  if(_this.phoneDown){
						  uni.navigateTo({
						  	url: '/pages/index/index'
						  })
					  }
					 
				  }
				})
			},
			getphonenumber(e) {
				var that = this;
				wx.cloud.callFunction({
					name: 'getPhone',
					data: {
						weRunData: wx.cloud.CloudID(e.detail.cloudID),
					}
				}).then(res => {
					console.log(res.result);
					this.param.phone = res.result;
					this.login();
				}).catch(err => {
					console.error(err);
					this.login();
				});
			},
			agree(){
				this.$refs.popup2.close();
				this.check[0].checked = true;
			},
			close(){
				this.$refs.popup2.close();
				this.check[0].checked = false;
			},
			login() {
				// this.fillPhone = true;
				// return;
				// this.$com.link('/pages/index/index');
				//return;
				
				
				
				let warn = this.$com.postVerify(this.rule,this.param);
				if(warn){
					this.$com.showToast({tip: warn})
					return; 
				}
				this.$com.showLoading({tip:'正在登录'});
				this.$req.verifyIdCode(this.param).then(ret=>{
					this.$api.getUserInfo();
					this.$com.showToast({tip:'登录成功'});
					
					
					this.phoneDown = true;
					if(this.noticeDown){
						uni.navigateTo({
							url: '/pages/index/index'
						})
					}
					
					
					//this.$com.updateUserInfo();
					
					// uni.requestSubscribeMessage({
					//   tmplIds: ['eW5uvsh3EZawKwNaWU3hljOXG7rf2sXDK0vy-T6nGKE'],
					//   success (res) {
					// 	  console.log('res',res)
					//   },
					//   fail(err){
					// 	  console.log('err',err)
					//   },
					//   complete(){
					// 	  uni.navigateTo({
					// 	  	url: '/pages/index/index'
					// 	  })
					//   }
					// })
					
					// setTimeout(()=>{
						
					// },2000)
				})
			},
			getUserInfo(e) {
				uni.setStorage({
					key: 'wxInfo',
					data: e.detail.userInfo,
					success: () => {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				})
			},
			getCode(obj) {
				if(!this.$com.verify('phone',this.param.phone)){
					this.$com.showToast({tip:'请输入正确的手机号码'});
					return;
				}
				if(!this.code.loading) {
					this.code.loading = true;
					this.$req.sendRCode(this.param).then(ret => {
						let time = this.code.time;
						this.$com.showToast({tip:'验证码已发送，请注意查收'});
						let clock = setInterval(() => {
							if(!time) {
								this.code.loading = false;
								this.code.text = '获取验证码';
								clearInterval(clock);
								return;
							}
							this.code.text = time + 'S';
							time--;
						}, 1000)
					})
				}
			}
		},
		mounted() {
			// this.$api.getUserInfo().then(ret => {
			// 	console.log(ret)
			// })
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';

	.login-vue {
		background: linear-gradient(to bottom,#ab83f6,#605ee5);
		overflow: hidden;
		width: 100vw;
		height: 100vh;
		position: absolute;
		image {
			width: 28%;
			height: 230upx;
			padding-top: 90upx;
		}

		.button-large {
			background: linear-gradient(to right,#feaf90,#ff6591);
			width: 70%;
			margin-top: 100upx !important;
		}
		.desc {
			width: 90%;
			margin: 0 auto;
			position: absolute;
			bottom: 10vh;
			left: 5%;
			font-size: 24rpx;
			color:#fff;
			padding: 20rpx 20rpx;
			line-height: 42rpx;
			box-sizing: border-box;
			background-color: rgba(255,255,255,.1);
			border-radius: 20rpx;

			// background-color: rgba(255,255,255,.8);
		}
		.bottom-tips {
			position: absolute;
			text-align: center;
			bottom: 3vh;
			display: block;
			width: 100%;
			color: #fff;
			left: 0;
		}
		bw-check-box {
			display: inline-block;
			width: 50upx;
		}
		.circle {
			border-radius: 50%;
			position: absolute;
		}
		.circle1 {
			background-color: #a991f2;
			width: 150upx;
			height: 150upx;
			top: 10%;
			left: -40upx;
		}
		.circle2 {
			background-color: #978af0;
			width: 150upx;
			height: 150upx;
			bottom: 30%;
			right: -40upx;
		}
		.circle3 {
			background-color: #767ae8;
			width: 320upx;
			height: 320upx;
			bottom: -160upx;
			left: -160upx;
		}
		.box {
			overflow: hidden;
		}
		.slide-down {
			position: relative;
			width: 100%;
			transform: translateY(-300rpx);
		}
		.w100 {
			margin-top: 40rpx;
			position: relative;
			transition: all .6s ease-out;
		}
		&.fill-phone {
			.slide-down {
				transform: translateY(0rpx);
			}
			.w100 {
				margin-top: -80rpx;
			}
		}
	}
</style>
