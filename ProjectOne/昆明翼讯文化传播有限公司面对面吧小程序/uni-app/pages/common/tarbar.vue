<template>
	<view class="tar-bar">
		<view :class="{active:active==1}">
			<navigator url="/pages/media/media" open-type="redirect">
				<text class="db icon iconfont icon-jiaocheng"></text>
				<text class="font-s">宣传</text>
			</navigator>
		</view>
		<view :class="{active:active==2}" @click.native="$com.link('/pages/personal/personal')">
			<text class="db icon iconfont icon-gerenzhongxin1"></text>
			<text class="font-s">我的</text>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	export default {
		data(){
			return {
				
			}
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		props:{
			active:{
				type:Number,
				default: 1
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';
	.tar-bar {
		display: flex;
		position: fixed;
		z-index: 2;
		width: 100%;
		bottom:0;
		background-color:#fff;
		padding: 20upx 0 14upx 0;
		align-content: center;
		justify-content: center;
		border-top: 1px solid #f5f5f5;
		&>view {
			flex: 1;
			text-align: center;
			.icon {
				margin-bottom: 6upx;
				font-size: 48upx;
			}
		}
		.active {
			text {
				color:@blue;
			}
		}
	}
</style>
