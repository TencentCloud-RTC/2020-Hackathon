<template>
	<view class="toast">
		<popup ref="popup" type="center" class="no-shape">
			<text v-if="popup.icon" class="icon iconfont icon-jiazaizhong"></text>
			<text class="text">{{popup.tip}}</text>
		</popup>
		<popup ref="popup2" type="center" id="popup">
			<view class="confirm-dialog">
				<text class="title">{{dialog.title}}</text>
				<text class="text">
					<text>{{dialog.tip}}</text>
				</text>
				<view class="button">
					<button type="default" @click="cancel" class="cancel">{{dialog.cancelText}}</button>
					<button type="primary" @click="sure">{{dialog.sureText}}</button>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default{
		data(){
			return{
			}
		},
		watch:{
			popup:{
				handler(n,o){
					//如果跳转后组件和上一组件都包含popup，则都会被打开。。。
					if(n.open){
						this.$store.state.popups.push(this.$refs.popup.close);
						this.$refs.popup.open();
					}
					else this.$refs.popup.close();
					
					if(n.time) {
						setTimeout(()=>{
							this.$store.state.popups.forEach((v,i) => {
								v();
							})
							this.$store.state.popups = [];
						},n.time)
					}
				},
				deep: true
			},
			dialog:{
				handler(n,o){
					//如果跳转后组件和上一组件都包含popup2，则都会被打开。。。
					if(n.open) {
						this.$store.state.popup2s.push(this.$refs.popup2.close);
						this.$refs.popup2.open();
					}
					else this.$refs.popup2.close();
				},
				deep: true
			}
		},
		computed:{
			...mapGetters(['popup','dialog'])
		},
		methods:{
			cancel(){
				this.$store.state.popup2s.forEach((v,i) => {
					v();
				})
				this.$store.state.popup2s = [];
				this.dialog.cancel();
			},
			sure(){
				this.$store.state.popup2s.forEach((v,i) => {
					v();
				})
				this.$store.state.popup2s = [];
				this.dialog.sure();
			},
		}
	}
</script>

<style lang="less">
	.toast {
		.confirm-dialog {
			width:500upx;
			.text {
				margin-top: 70upx;
				text-align: center;
			}
			.button {
				margin: 80upx 0 0 0;
			}
		}
	}
</style>
