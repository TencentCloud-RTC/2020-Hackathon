<template>
	<view class="user-auth popup-custom" v-if="!test" :class="{'show-page':show}">
		<view class="con">
			<!-- getuserinfo? withCredentials="true"? 真无语，有时候有弹框，有时候又不出现。。只在第一次授权有弹框？-->
			<button open-type="getUserInfo" type="primary" @getuserinfo="getuserinfo">授权登录</button>
			<text class="mt">面对面吧需要获取您的微信信息</text>
		</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				show: false
			}
		},
		props:{
			url:{
				type:String,
				default: '/pages/index/index'
			}
		},
		watch:{
			// wxInfo:{
			// 	handle(n,o) {
			// 		console.log(n)
			// 		if(!n.avatarUrl) setTimeout(()=> {
			// 			this.show = true;
			// 		},400)
			// 	},
			// 	deep: true
			// }
		},
		computed:{
			...mapGetters(['wxInfo']),
			test(){
				if(!this.wxInfo.avatarUrl) setTimeout(()=> {
					this.show = true;
				},400)
				return this.wxInfo.avatarUrl;
			}
		},
		methods: {
			...mapMutations(['setWxInfo','setUserInfo']),
			getuserinfo(e) {
				
				//融合微信信息和openid
				let wx = {...uni.getStorageSync('wxInfo'),...e.detail.userInfo,}
				
				uni.setStorage({
					key: 'wxInfo',
					data: wx,
					success: () => {
						console.log(wx)
						this.setWxInfo(wx);
						// this.$com.showToast({tip:'授权成功'});
						this.$req.modifyName({
							avatarUrl: wx.avatarUrl,
							nickName: wx.nickName
						})
						this.$parent.queryRooms();
						// this.$api.getUserInfo().then(ret=> {
						// 	console.log('ret',ret);
						// 	this.setUserInfo(ret);
						// 	setTimeout(()=>{
						// 		uni.redirectTo({
						// 			url: this.url
						// 		})
						// 	}, 3000);
						// })
					}
				})
			}
		},
		mounted(){
			
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';
	.user-auth {
		position:fixed;
		top:0;
		width:100%;
		z-index: 9;
		height:100%;
		// display: flex;
		left:0;
		// align-items: center;
		// justify-content: center;
		// background: rgba(0,0,0,.3);
		transition: all .5s;
		transform: translateY(100vh);
		opacity: 0;
		
		&>view {
			height: 180upx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color:#fff;
			flex-direction: column;
			width: 56%;
			padding: 30upx;
			//border-radius: 12upx;
			button {
				width: 60%;
				background: linear-gradient(to right, #b58af1, #8072e9);
			}
			text {
				margin-top: 20upx;
				color:#999;
			}
		}
		.con {
			height: 30vh;
		}
	}
</style>
