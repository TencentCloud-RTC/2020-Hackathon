<template>
	<view class="command-vue bg-gray">
		<view class="list">
			<view class="title">
				您对学生{{name ? name : ''}}是否满意？
			</view>
			<view class="tags">
				<view :class="{'active':params.tips=='满意'}" @click="params.tips='满意'">满 意</view>
				<view :class="{'active':params.tips=='不满意'}" @click="params.tips='不满意'">不满意</view>
			</view>
		</view>
		<view class="list">
			<view class="title">
				评价描述
			</view>
			<view class="rate">
				<view>评分</view>
				<!-- <rate value="2"></rate> -->
				<slider :value="params.score" activeColor="#ba92f1" @change="sliderChange" show-value block-size="18"/>
				
			</view>
			<textarea v-model="params.comment" cols="30" rows="4" placeholder="请输入对该学生的评价"></textarea>
		</view>
		<toast></toast>
		<view class="align-center button-box" v-if="ret.status_score">
			<button @click="markScores" type="primary" style="margin-top:40upx;" class="button-large">提交评分</button>
		</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from 'vuex';
	import rangeSlider from "@/components/range-slider/range-slider.vue"
	export default {
		data() {
			return {
				params: {
					comment: '',
					score: 80,
					tips: '满意'
				},
				scoreId: null,
				name: null,
				ret: {}
			}
		},
		components:{
			rangeSlider
		},
		computed:{
			...mapGetters(['remote']),
		},
		onLoad(options) {
			this.scoreId = options.scoreId;
			this.name = options.name;
			if(this.scoreId){
				this.$req.getScoreInfoByScoreId({
					scoreId: this.scoreId
				}).then(ret => {
					this.ret = ret;
					this.params = {
						comment: ret.comment,
						score: ret.current_score,
						tips: ret.tips
					}
				})
			}
		},
		onReachBottom() {
			
		},
		methods: {
			cancel(){
				this.$emit('update:show',false);
			},
			markScores(){
				console.log('this.room',this.room)
				this.$req.markScores({
					scoreId: this.scoreId,
					...this.params
				}).then(ret => {
					this.$com.showToast({tip:'评分已提交'});
					setTimeout(() => {
						this.$com.link('/pages/index/index');
					},1000)
				})
			},
			sliderChange(e){
				console.log(e.detail)
				this.params.score = e.detail.value;
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';
	.command-vue {
		.list {
			background-color: #fff;
			border-radius: 12rpx;
			padding: 40rpx;
			width: 94%;
			margin: 0 auto 30rpx auto;
			position: relative;
			top: 30rpx;
			box-sizing: border-box;
			.title {
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #f5f5f5;
			}
			.tags {
				display: flex;
				align-items: center;
				margin-top: 40rpx;
				justify-content: space-around;
				view {
					width: 40%;
					padding: 20rpx 0;
					border-radius: 12rpx;
					text-align: center;
					background-color: #f5f5f5;
					color: #888;
					&.active {
						background-color: #ba92f1;
						color: #6254cc;
					}
				}
			}
			.rate {
				display: flex;
				align-items: center;
				margin-top: 40rpx;
				&>view:nth-child(1) {
					margin: 0 40rpx;
				}
				.uni-rate__icon {
					margin: 0 16rpx;
				}
			}
			slider {
				flex: 1;
			}
			textarea {
				padding: 20rpx 30rpx;
				border: 1rpx solid #ccc;
				margin-top: 40rpx;
				box-sizing: border-box;
				height: 300rpx;
				width: 100%;
			}
		}
		.button-box {
			width: 90%;
			position: absolute;
			left: 5%;
			bottom: 4vh;
			button {
				height: 100rpx;
				line-height: 100rpx;
				border-radius: 50rpx;
			}
			button:nth-child(1) {
				background: linear-gradient(to right, #b58af1, #8072e9);
				width: 90%;
			}
		}
	}
</style>
