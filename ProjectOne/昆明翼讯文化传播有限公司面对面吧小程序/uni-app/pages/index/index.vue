<template>
	<view class="index-vue with-nav" v-if="userInfo&&userInfo.name">
		<userAuth></userAuth>
		<view class="head">
			<image class="bg" src="/static/images/bg-head.png"></image>
			<view class="align-center msg">
				<image :src="wxInfo.avatarUrl"></image>
				<view>
					<view style="margin-bottom: 16rpx;">
						<text class="title font-b">{{userInfo.name}}</text>
						<!-- <text class="icon iconfont icon-renzheng text-red"></text> -->
					</view>
					<text v-if="phone">{{phone}}</text>
				</view>
			</view>
		</view>
		<view class="notice">
			<view>
				<text class="icon iconfont icon-gonggao icon-s"></text>
				<view :class="{active:showNotice}">
					<text class="db">{{currentNotice}}</text>
					<text class="db">{{nextNotice}}</text>
				</view>
			</view>
		</view>
		<wuc-tab :tab-list="tabList" selectClass="text-red" textFlex="false" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
		<!-- <view class="tabs-2">
			<wuc-tab :tab-list="tabList2" selectClass="text-red" textFlex="false" :tabCur.sync="TabCur2" @change="tabChange2"></wuc-tab>
		</view> -->
		<view class="panel-list" v-if="rooms.length&&!showBox">
			<view v-for="item in rooms" class="list">
				<view class="top c02" @click="enterRoom(item)">
					<view>
						<text class="white-plain">{{item.status_type}}</text>
						<view class="nums">
							<text class="icon iconfont icon-renshu"></text>
							&nbsp;<text>{{item.room_num}}人</text>
						</view>
					</view>
					<view class="title ellipsis">{{item.room_title}}</view>
					<text class="icon iconfont icon-kaishi play"></text>
				</view>
				<view class="bottom" @click="enterRoom(item)">
					<view>
						<text class="text-gray">考点：</text>
						<text class='text-light-gray mr'>{{item.areaname}}</text>
						<text class="ml text-gray"> 候选人：</text>
						<text class='text-light-gray'>{{item.parter_name}}</text>
					</view>
					<view>
						<text class="text-gray">时间：</text>
						<text class='text-light-gray'>{{item.starttime_format}}-{{item.endtime_format}}</text>
					</view>
				</view>
				<!-- <view v-if="item.status==4" class="shape">已结束</view> -->
				<view v-if="item.status==4&&userInfo.groupid==4" class="shape">
					<view class="con">
						<view>
							<view>
								<text class="tip">平均分：</text>
								<text class="score" v-if="item.avg_scores!=0">{{item.avg_scores}}</text>
								<text class="tip" v-else>未打分</text>
							</view>
							<view>
								<text class="tip">您的打分：</text>
								<text class="score" >{{item.current_score ? item.current_score : '--'}}</text>
							</view>
						</view>
						<text v-if="item.current_score" class="make-score" @click="makeScore(item)">查看</text>
						<text v-else class="make-score" @click="makeScore(item)">去打分</text>
					</view>
				</view>
			</view>
			<!-- <uni-load-more :status="status"></uni-load-more> -->
		</view>
		<view v-if="(!rooms.length&&renderRoomDone)||showBox" class="no-result">
			<image src="/static/images/no-result.png"></image>
		</view>
		<tarbar></tarbar>
		<toast></toast>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 4000,
				duration: 500,
				status: 'more',
				currentNotice: '',
				nextNotice: '',
				showNotice: false,
				TabCur: 0,
				TabCur2: 0,
				tabList: [{
					name: '面试'
				}, {
					name: '班会'
				}, {
					name: '培训'
				}],
				tabList2: [{
					name: '待面试'
				}, {
					name: '已结束'
				}],
				rooms: [],
				renderRoomDone: false,
				showBox: false
			}
		},
		components: {
			WucTab,
			uniLoadMore
		},
		computed: {
			...mapGetters(['remote', 'wxInfo', 'userInfo']),
			phone(){
				if(this.userInfo.phone)
					return this.userInfo.phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
				else
					return false;
			}
		},
		onLoad() {
			
			
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '发现一个好玩的面试平台',
		      path: '/pages/index/index'
		    }
		},
		onReachBottom() {

		},
		methods: {
			...mapMutations(['setWebLink']),
			makeScore(item){
				this.$com.link('/pages/index/command2?scoreId='+item.scoreId+'&name='+item.parter_name);
			},
			tabChange(index){
				if(index){
					this.showBox = true;
				}
				else{
					this.showBox = false;
				}
				
			},
			setNotice() {
				this.$req.getRolling().then(ret => {
					let current = -1,
						next = -1;
					let notice = [];
					ret.forEach((v, i) => {
						notice.push(v);
					})
					this.currentNotice = '';
					next++;
					if (next == notice.length) next = 0;
					this.nextNotice = notice[0];
					setTimeout(() => {
						this.showNotice = true;
					}, 100)
					setInterval(() => {
						this.showNotice = false;
						current++;
						if (current == notice.length) current = 0;
						this.currentNotice = notice[current];
						next++;
						if (next == notice.length) next = 0;
						this.nextNotice = notice[next];
						setTimeout(() => {
							this.showNotice = true;
						}, 100)
					}, 6000)
				})
			},
			makeCall() {
				//uni.clearStorageSync();
				
			},
			enterRoom(item) {
				this.$req.queryRoomStatus({
					roomNO: item.room_no
				}).then(ret => {
					if(ret.status == 1){
						this.$com.showToast({
							tip: '面试还未开始'
						})
					}else if(ret.status == 2){
						this.$com.showToast({
							tip: '面试已经结束'
						})
					}else if(ret.status == 4){
						this.inRoom({ ...item,
							//...ret
						})
					}
				})
				
				
			},
			inRoom(item) {
				let params = {
					enableCamera: true,
					enableMic: true,
					roomID: item.room_no,
					template: 'grid',
					//sid: item.roomId ,//后端服务的房间id
					starttime: this.moment(item.starttime * 1000).format('YYYY-MM-DD HH:mm'),
					endtime: this.moment(item.endtime * 1000).format('YYYY-MM-DD HH:mm')
				}

				//先获取userSig 
				this.$req.getUserSig({
					UserId: this.wxInfo.openid + '_groupid' + this.userInfo.groupid
				}).then((ret) => {
					//ret.userID = ret.userID +'&'+this.userInfo.groupid;
					var p = { ...ret,
						...params
					}

					var url = this.$com.setLinkParams('/pages/room/room', p);
					console.log(p);
					console.log(url);
					this.$com.link(url);
				});
			},
			queryRooms() {
				this.$req.queryRooms().then(ret => {
					ret.forEach((v, i) => {
						v.starttime_format = this.moment(v.starttime * 1000).format('YYYY/MM/DD HH:mm');
						v.endtime_format = this.moment(v.endtime * 1000).format('HH:mm');
					})
					this.rooms = ret;
					this.renderRoomDone = true;
				}).catch(err => {
					this.rooms = [];
					this.renderRoomDone = true;
				})
			},
			queryRoomStatus(no) {

			}
		},
		mounted() {
			this.setNotice();
			this.queryRooms();
			console.log(this.wxInfo)
			console.log('this.userInfo',this.userInfo)
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';

	.index-vue {
		.make-score {
			padding: 8rpx 20rpx;
			border-radius: 10rpx;
			color:#fff;
			font-size: 22rpx;
			background: linear-gradient(to right,#feaf90,#ff6591);
		}
		.head {
			height: 300rpx;
			position: relative;

			.bg {
				position: absolute;
				top: 0;
				height: 100%;
				width: 100%;
			}

			.msg {
				padding: 15vw 0 0 8vw;
				position: relative;
				z-index: 1;

				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 30rpx;
				}

				text {
					color: #fff;
				}
			}
		}

		.no-result {
			image {
				width: 56vw;
				height: 56vw;
				margin: 10vw auto;
			}
		}

		.wuc-tab-box {
			height: 100rpx;
			border: 0;
		}

		.wuc-tab {
			position: relative;
			width: 60%;
			height: 100%;

			._div {
				height: 100%;
			}

			._span {
				color: @lightgray;
				font-weight: bold;
			}

			.cur {
				border-bottom: 0;
				position: relative;

				&:after {
					content: '';
					position: absolute;
					bottom: 0;
					width: 46rpx;
					height: 12rpx;
					border-radius: 12rpx;
					background: @blue;
					margin-left: -23rpx;
					left: 50%;
				}

				._span {
					font-size: 36rpx;
					color: @gray;
				}
			}
		}
		.tabs-2 {
			.wuc-tab {
				position: relative;
				width: 40%;
				height: 100%;
				left: 60%;
				._div {
					height: 100%;
				}
			
				._span {
					color: @gray;
					font-weight: normal;
				}
			
				.cur {
					border-bottom: 0;
					position: relative;
			
					&:after {
						content: '';
						position: absolute;
						bottom: 0;
						width: 0;
						height: 0;
					}
			
					._span {
						color: #fff;
					}
				}
			}
		}
		.panel-list {
			width: 92%;
			margin: 44rpx auto 0 auto;

			.list {
				position: relative;
				border-radius: 10rpx;
				overflow: hidden;
				margin-top: 30rpx;
				margin-bottom: 10rpx;
			}

			.shape {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				background: rgba(0, 0, 0, .4);
				color: #fff;
				// letter-spacing: 6rpx;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				&>view {
					background-color:rgba(255,255,255,.9);
					padding: 30rpx 40rpx;
					border-radius: 10rpx;
					width: 46%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					view {
						text-align: left;
					};
				}
				.tip {
					color: #999;
					font-size: 24rpx;
				}

				.score {
					font-size: 28rpx;
					color:#666;
					margin-left: 12rpx;
				}
			}

			.bottom {
				padding: 20rpx 30rpx;
				border: 1rpx solid #eee;
				border-top: 0;
				border-radius: 0 0 10rpx 10rpx;

				&>view:nth-child(1) {
					margin-bottom: 14rpx;
				}
			}

			.top {
				height: 240rpx;
				padding: 30rpx 36rpx;
				box-sizing: border-box;
				position: relative;

				.title {
					font-size: 36rpx;
					margin-top: 26rpx;
					color: #fff;
					font-weight: normal;
					letter-spacing: 1rpx;
				}

				.play {
					color: #fff;
					position: absolute;
					bottom: 26rpx;
					right: 40rpx;
					font-size: 44rpx;
				}

				&>view:nth-child(1) {
					.white-plain {
						padding: 0 20rpx;
						border-radius: 20rpx;
						height: 40rpx;
						line-height: 40rpx;
						border: 1rpx solid #fff;
						color: #fff;
						font-size: 28rpx;
					}

					.nums {
						padding: 12rpx 12rpx 12rpx 24rpx;
						border-radius: 38rpx;
						background: rgba(0, 0, 0, .2);

						text {
							color: #fff;
							margin-right: 20rpx;
						}

						view {
							color: #fff;
						}
					}

					display: flex;
					justify-content: space-between;
				}
			}
		}

		.c01 {
			background: linear-gradient(to right, #885fd3, #cb80b5);
		}

		.c02 {
			background: linear-gradient(to right, #2eaaa8, #87d58d);
		}

		.c03 {
			background: linear-gradient(to right, #ff7983, #ffad8b);
		}

		.c04 {
			background: linear-gradient(to right, #6480ed, #86bff7);
		}
	}
</style>
