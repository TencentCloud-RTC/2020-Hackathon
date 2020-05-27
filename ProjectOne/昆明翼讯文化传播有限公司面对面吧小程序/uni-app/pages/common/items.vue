<template>
	<view class="items-vue popup-custom">
		<view class="con">
			<view class="items">
				<view class="list" v-for="(item,index) in items">
					<view class="title">
						{{index+1}}、{{item.content}}
					</view>
				</view>
			</view>
			<view class="align-center button-box">
				<button @click="cancel" type="primary" style="margin-top:40upx;" class="button-large">关闭</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				
			}
		},
		components:{
			
		},
		props: ['show','items'],
		computed:{
			...mapGetters(['remote']),
		},
		onLoad() {
			
		},
		onReachBottom() {
			
		},
		methods: {
			cancel(){
				this.$emit('update:show',false);
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';
	
</style>
