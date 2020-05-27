<template>
	<!--miniprogram/pages/room/room.wxml-->
	<!-- 在模版上放置标签 -->
	<view class="page-room" :class="{'page-student':userInfo.groupid==3}">
		<view v-if="clock" class="clock">{{clock}}</view>
		<trtc-room ref="trtc-component" :config="rtcConfig" :parter="parter"> </trtc-room>
		<view class="tip-toast" v-if="showTipToast">
			<view>当前房间为1v1双人通话房间</view>
			<view>不希望其他人打扰</view>
		</view>
		<view class="button-box">
			<button @click="command" type="primary" class="button-large">面试打分</button>
			<!-- <button v-if="!beginTime" @click="getBeginTime" type="primary" class="button-large">开始计时</button>
			<button v-else @click="getBeginTime(2)" type="primary" class="button-large">重新开始</button> -->
		</view>
		<commandPage :parter="parter" :room="rtcConfig" :show.sync="showCommand" class="command-page whole-page" :class="{'show-page':showCommand}"></commandPage>
		<items :show.sync="showItems" :items="item" class="items-page whole-page" :class="{'show-page':showItems}"></items>
	</view>
</template>

<script>
	import {
		genTestUserSig,
		setData
	} from "../../debug/GenerateTestUserSig";
	import trtcRoom from "@/components/trtc-room/trtc-room";
	import commandPage from "@/pages/index/command.vue";
	import items from "@/pages/common/items.vue";
	import {
		mapGetters,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				showCommand: false,
				showItems: false,
				clockTime: null,
				beginTime: null,
				clock: null,
				rtcConfig: {
					template: '1v1' // 必要参数 组件模版，支持的值 1v1 grid custom ，注意：不支持动态修改, iOS 不支持 pusher 动态渲染
				},
				showTipToast: false,
				item: [],
				parter: null
			};
		},

		components: {
			trtcRoom,
			commandPage,
			items
		},
		computed: {
			...mapGetters(['wxInfo', 'userInfo']),
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 * @param {*} options 配置项
		 */
		onLoad: function(options) {
			console.log('room onload', options);
			wx.setKeepScreenOn({
				keepScreenOn: true
			}); // 获取 rtcroom 实例

			this.trtcComponent = this.$refs['trtc-component']; // 监听TRTC Room 关键事件
			console.log('this.trtcComponent', this.trtcComponent.enterRoom)

			this.bindTRTCRoomEvent(); // 将String 类型的 true false 转换成 boolean

			Object.getOwnPropertyNames(options).forEach(key => {
				if (options[key] === 'true') {
					options[key] = true;
				}

				if (options[key] === 'false') {
					options[key] = false;
				}
			});
			this.options = options; // querystring 只支持传递 String 类型, 注意类型转换

			this.enterRoom({
				roomID: Number(options.roomID),
				starttime: options.starttime,
				endtime: options.endtime,
				userID: options.userID,
				userSig: options.userSig,
				sdkAppID: options.sdkAppID,
				template: options.template,
				debugMode: options.debugMode,
				cloudenv: options.cloudenv,
				enableCamera: options.enableCamera,
				enableMic: options.enableMic,
				frontCamera: options.frontCamera,
				localVideo: options.localVideo,
				localAudio: options.localAudio,
				enableEarMonitor: options.enableEarMonitor,
				enableAutoFocus: options.enableAutoFocus,
				localMirror: options.localMirror,
				enableAgc: options.enableAgc,
				enableAns: options.enableAns,
				encsmall: options.encsmall,
				videoHeight: options.videoHeight,
				videoWidth: options.videoWidth,
				scene: options.scene,
				maxBitrate: Number(options.maxBitrate),
				minBitrate: Number(options.minBitrate)
			});
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			console.log('room ready');
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			console.log('room show');
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			console.log('room hide');
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			console.log('room unload');
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		mounted(){
			// this.getBeginTime();
			// setInterval(() => {
			// 	this.getBeginTime();
			// },10000)
		},
		methods: {
			setData,
			command() {
				this.showCommand = true;
			},
			queryParterInfo(id){
				this.$req.queryParterInfo({roomNO: id}).then(ret => {
					this.parter = ret;
				})
			},
			//获取计时时间
			getBeginTime(status){
				this.$req.modifyStartTime({
					roomNO: this.options.roomID,
					status: status == 2 ? status : 1
				}).then(ret => {
					if(ret){
						this.beginTime = ret*1000;
						if(!this.clock){
							if(this.clockTime) clearInterval(this.clockTime);
							this.clockTime = setInterval(() => {
								this.clock = '已进行：' + this.moment(this.moment() - this.moment(this.beginTime)).add(-8, 'hours').format("HH:mm:ss");
							},1000)
						}
					}
					else{
						this.beginTime = null;
						this.clock = null;
					}
				})
			},
			setItems(ret) {
				this.item = ret;
				this.showItems = true;
			},
			enterRoom: function(params) {
				params.template = params.template || '1v1';
				params.roomID = params.roomID || 2333;
				params.userID = params.userID || new Date().getTime().toString(16);
				console.log('* room enterRoom', params);
				// const Signature = genTestUserSig(params.userID);
				// params.sdkAppID = Signature.sdkAppID;
				// params.userSig = Signature.userSig;
				this.template = params.template;
				
				if (params.template === 'grid') {
					this.rtcConfig = {
						sdkAppID: params.sdkAppID,
						starttime: params.starttime,
						endtime: params.endtime,
						// 您的实时音视频服务创建应用后分配的 sdkAppID
						userID: params.userID,
						userSig: params.userSig,
						template: params.template,
						roomID: params.roomID,
						// 1v1 grid custom
						debugMode: params.debugMode,
						// 非必要参数，打开组件的调试模式，开发调试时建议设置为 true
						// cloudenv: params.cloudenv, // 非必要参数
						frontCamera: params.frontCamera,
						enableEarMonitor: params.enableEarMonitor,
						enableAutoFocus: params.enableAutoFocus,
						localMirror: params.localMirror,
						enableAgc: params.enableAgc,
						enableCamera: params.enableCamera,
						enableMic: params.enableMic,
						enableAns: params.enableAns,
						encsmall: params.encsmall ? 1 : 0,
						videoWidth: params.videoWidth,
						videoHeight: params.videoHeight,
						scene: params.scene,
						maxBitrate: params.maxBitrate,
						minBitrate: params.minBitrate,
						beautyLevel: 9, // 默认开启美颜
					};
				} else {
					this.rtcConfig = {
						sdkAppID: params.sdkAppID,
						// 您的实时音视频服务创建应用后分配的 sdkAppID
						userID: params.userID,
						userSig: params.userSig,
						template: params.template,
						// 1v1 grid custom
						debugMode: params.debugMode,
						// 非必要参数，打开组件的调试模式，开发调试时建议设置为 true
						beautyLevel: 9 // 默认开启美颜
						// cloudenv: params.cloudenv, // 非必要参数

					};
				}

				this.setData({
					rtcConfig: this.rtcConfig
				}, () => {
					// 进房前决定是否推送视频或音频 部分机型会出现画面卡死，暂不支持进房前设置，必须放到进房成功事件后设置

					//判断是否为面试者，只有面试者才上传音视频流
					// this.trtcComponent.publishLocalVideo();
					// this.trtcComponent.publishLocalAudio();

					// console.log('rtcConfig', this.data.rtcConfig)
					// if (params.localVideo === true || params.template === '1v1') {
					//   this.trtcComponent.publishLocalVideo()
					// }
					// if (params.localAudio === true || params.template === '1v1') {
					//   this.trtcComponent.publishLocalAudio()
					// }
					// roomID 取值范围 1 ~ 4294967295
					this.trtcComponent.enterRoom({
						roomID: params.roomID
					}).then(() => {
						
						this.queryParterInfo(params.roomID);
						
						if (this.template === 'custom') {
							// 设置推流端视窗的坐标和尺寸
							this.trtcComponent.setViewRect({
								userID: params.userID,
								xAxis: '480rpx',
								yAxis: '160rpx',
								width: '240rpx',
								height: '320rpx'
							});

							//音视频混流

						}
					}).catch(res => {
						console.error('* room joinRoom 进房失败:', res);
					});
				});
			},
			bindTRTCRoomEvent: function() {
				const TRTC_EVENT = this.trtcComponent.EVENT;
				this.timestamp = []; // 初始化事件订阅

				this.trtcComponent.on(TRTC_EVENT.LOCAL_JOIN, event => {
					console.log('* room LOCAL_JOIN', event); // 进房成功，触发该事件后可以对本地视频和音频进行设置
					console.log('this.options.localVideo', this.options.localVideo)
					if (this.options.localVideo === true || this.options.template === '1v1') {
						this.trtcComponent.publishLocalVideo();
					}

					if (this.options.localAudio === true || this.options.template === '1v1') {
						this.trtcComponent.publishLocalAudio();
					}
				});
				this.trtcComponent.on(TRTC_EVENT.LOCAL_LEAVE, event => {
					console.log('* room LOCAL_LEAVE', event);
				});
				this.trtcComponent.on(TRTC_EVENT.ERROR, event => {
					console.log('* room ERROR', event);
				}); // 远端用户进房

				this.trtcComponent.on(TRTC_EVENT.REMOTE_USER_JOIN, event => {
					console.log('* room REMOTE_USER_JOIN ---  room.vue', event, this.trtcComponent.getRemoteUserList(), this.template);
					this.timestamp.push(new Date()); // 1v1视频通话时限制人数为两人的简易逻辑，建议通过后端实现房间人数管理
					// 2人以上同时进行通话请选择网格布局

					if (this.template === '1v1' && this.timestamp.length > 1) {
						const interval = this.timestamp[1] - this.timestamp[0];

						if (interval < 1000) {
							// 房间里已经有两个人
							this.setData({
								showTipToast: true
							}, () => {
								setTimeout(() => {
									this.setData({
										showTipToast: false
									});
									wx.navigateBack({
										delta: 1
									});
								}, 4000);
							});
						}
					}
				}); // 远端用户退出

				this.trtcComponent.on(TRTC_EVENT.REMOTE_USER_LEAVE, event => {
					console.log('* room REMOTE_USER_LEAVE', event, this.trtcComponent.getRemoteUserList());

					if (this.template === '1v1') {
						this.timestamp = [];
					}

					if (this.template === '1v1' && this.remoteUser === event.data.userID) {
						this.remoteUser = null;
					}
				}); // 远端用户推送视频

				this.trtcComponent.on(TRTC_EVENT.REMOTE_VIDEO_ADD, event => {
					console.log('* room REMOTE_VIDEO_ADD', event, this.trtcComponent.getRemoteUserList()); // 订阅视频

					const userList = this.trtcComponent.getRemoteUserList();
					const data = event.data;

					if (this.template === '1v1' && (!this.remoteUser || this.remoteUser === data.userID)) {
						// 1v1 只订阅第一个远端流
						this.remoteUser = data.userID;
						this.trtcComponent.subscribeRemoteVideo({
							userID: data.userID,
							streamType: data.streamType
						});
					} else if (this.template === 'grid') {
						this.trtcComponent.subscribeRemoteVideo({
							userID: data.userID,
							streamType: data.streamType
						});
					}

					if (this.template === 'custom' && data.userID && data.streamType) {
						let index = userList.findIndex(item => {
							return item.userID === data.userID;
						});
						index++;
						const y = 320 * index + 160; // 设置远端视图坐标和尺寸

						this.trtcComponent.setViewRect({
							userID: data.userID,
							streamType: data.streamType,
							xAxis: '480rpx',
							yAxis: y + 'rpx',
							width: '240rpx',
							height: '320rpx'
						});
					}
				}); // 远端用户取消推送视频

				this.trtcComponent.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE, event => {
					console.log('* room REMOTE_VIDEO_REMOVE', event, this.trtcComponent.getRemoteUserList());
				}); // 远端用户推送音频

				this.trtcComponent.on(TRTC_EVENT.REMOTE_AUDIO_ADD, event => {
					console.log('* room REMOTE_AUDIO_ADD', event, this.trtcComponent.getRemoteUserList()); // 订阅音频

					const data = event.data;

					if (this.template === '1v1' && (!this.remoteUser || this.remoteUser === data.userID)) {
						this.remoteUser = data.userID;
						this.trtcComponent.subscribeRemoteAudio({
							userID: data.userID
						});
					} else if (this.template === 'grid' || this.template === 'custom') {
						this.trtcComponent.subscribeRemoteAudio({
							userID: data.userID
						});
					} // 如果不订阅就不会自动播放音频
					// this.trtcComponent.subscribeRemoteAudio({ userID: data.userID })

				}); // 远端用户取消推送音频

				this.trtcComponent.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE, event => {
					console.log('* room REMOTE_AUDIO_REMOVE', event, this.trtcComponent.getRemoteUserList());
				});
			}
		}
	};
</script>
<style lang="less">
	@import "./room.css";

	.page-room {
		.command-page {
			transition: all .6s;
			transform: translateY(100vh);
		}

		.items-page {
			transition: all .5s;
			transform: translateY(100vh);
			opacity: 0;
		}
	}
	.clock {
		width: 250rpx;
		background: linear-gradient(to right,#feaf90,#ff6591);
		color: #fff;
		position: fixed;
		top: 0;
		border-radius: 0 0 10rpx 10rpx;
		left: 50%;
		margin-left: -125rpx;
		//right: 0;
		z-index: 9;
		padding: 4rpx 0; 
		text-align: center;
	}
	.button-box {
		display: flex;
		align-items: center;
		position: absolute;
		bottom: 0;
		width: 90%;
		left: 5%;
		button:nth-child(1){
			background: linear-gradient(to right, #b58af1, #8072e9);
			-webkit-box-shadow: 0 4rpx 12rpx 0rpx #b58af1;
			box-shadow: 0 4rpx 12rpx 0rpx #b58af1;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 50rpx;
			width: 60%;
		}
		button:nth-child(2){
			flex: 1; 
			background: linear-gradient(to right, #b58af1, #8072e9);
			-webkit-box-shadow: 0 4rpx 12rpx 0rpx #b58af1;
			//box-shadow: 0 4rpx 12rpx 0rpx #b58af1;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 50rpx;
			margin-left: 30rpx;
		}
	}

	.page-student {
		.button-box {
			display: none;
		}

		.template-grid {
			max-height: 100vh;
		}

		.pusher-container {
			position: absolute !important;
			top: 0;
			width: 100%;
			height: 40vh !important;
			z-index: 2;
			live-pusher {
				height: 40vh;
			}
		}

		.view-container {
			height: 30vh;
		}

		.student-pos {
			height: 40vh;
		}
	}
</style>
