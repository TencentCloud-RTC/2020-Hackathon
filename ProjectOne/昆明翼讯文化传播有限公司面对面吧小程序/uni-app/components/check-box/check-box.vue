<template>
	<view class="check-box">
		<view class="check-box-list" v-for="(item,index) in render" @click="checkClick(item,index)">
			<text class="icon iconfont icon-dui check-box-label" :class="{active:item.checked}"></text>
			<text class="check-box-text">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				render: [],
				active: ''
			}
		},
		props:['list','keyword','disabled','type'],
		watch: {
			list: {
				handler(n,o){
					this.render = [];
					if(this.keyword){
						n.forEach((v,i) => {
							this.render.push({...v,name:v[this.keyword]});
						})
					}
					else{
						n.forEach((v,i) => {
							this.render.push({name: v})
						})
					}
				},
				immediate: true,
				deep: true
			},
			render: {
				handler(n,o){
					let r = [],active = '';
					n.forEach((v,i) => {
						if(v.checked) r.push(v.name);
					})
					this.$emit('change',r,this.active);
				},
				deep: true
			}
		},
		methods:{
			checkClick(item,index) {
				if(this.disabled) return;
				item.checked = item.checked ? false : true;
				this.active = item.name;
				
				//如果是单选，将其他都置为false
				if(this.type == 'radio'){
					this.render.forEach((v,i) => {
						if(v.name != item.name) v.checked = false;
					})
				}
				
				this.$emit("update:list",this.render)
			}
		}
	}
</script>

<style lang="less">
	.check-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		.check-box-list {
			width: 25%;
			margin-bottom: 30upx;
			display: flex;
			.check-box-label {
				width: 39upx;
				height: 39upx;
				text-align: center;
				line-height: 38upx;
				box-sizing: border-box;
				display: inline-block;
				border-radius: 50%;
				font-size: 20upx;
				margin-right: 12upx;
				border: 1upx solid #ddd;
				color:#fff;
				flex: 0 0 39rpx;
			}
			.check-box-label.active {
				background-color: #2eaafa;
				color:#fff;
			}
			.check-box-text {
				font-size: 29upx;
			}
		}
		.check-box-list {
			width: 94% !important;
			margin-left: 3%;
			margin-bottom: 0;
			padding: 20rpx 20rpx;
			border: 1rpx solid #f5f5f5;
			border-top: 0;
			box-sizing: border-box;
			&:nth-child(1) {
				border-top: 1rpx solid #f5f5f5;
				//box-radius: 4px 4px 0 0;
			}
			&:nth-last-child(1) {
				//box-radius: 0 0 4px 4px;
			}
		}
	}
</style>
