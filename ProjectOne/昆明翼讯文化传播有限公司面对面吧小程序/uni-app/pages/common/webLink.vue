<template>
	<view class="web-link">
		<web-view :src="webLink"></web-view>
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
			...mapGetters(['webLink'])
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
	@import '../../static/styles/const.less';
	.web-link {
		
	}
</style>