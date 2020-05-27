<script>
	export default {
		onLaunch: function() {
			if (!wx.cloud) {
				console.error('请使用 2.2.3 或以上的基础库以使用云能力');
			} else {
				wx.cloud.init({
					// env 参数说明：
					//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
					//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
					//   如不填则使用默认环境（第一个创建的环境）
					//env: 'trtc-3agw9',
					env: 'bigwoods-2j37t',
					traceUser: true
				})
			}

			const {
				model,
				system,
				statusBarHeight
			} = wx.getSystemInfoSync();
			var headHeight;

			if (/iphone\s{0,}x/i.test(model)) {
				headHeight = 88;
			} else if (system.indexOf('Android') !== -1) {
				headHeight = 68;
			} else {
				headHeight = 64;
			}

			this.globalData.headerHeight = headHeight;
			this.globalData.statusBarHeight = statusBarHeight;
			
			
			this.$api.getUserInfo();
		},
		globalData: {
			headerHeight: 0,
			statusBarHeight: 0
		},
		methods: {}
	};
</script>
<style lang="less">
	/*公共css，单独页面的style写在对应的vue文件里 */
	//@import "./app.css";
	@import './static/styles/iconfont.css';
	@import './static/styles/const.less';
	@import './static/styles/uni.less';

	page {
		height: 100%;
		-webkit-overflow-scrolling: touch;
	}

	.font-s {
		font-size: 24rpx !important;
	}

	.font-m {
		font-size: 29rpx !important;
	}

	.font-b {
		font-size: 34rpx !important;
	}

	.icon-s {
		font-size: 46rpx;
	}

	.icon-s {
		font-size: 40rpx;
	}

	.icon-m {
		font-size: 54rpx;
	}

	.icon-b {
		font-size: 70rpx;
	}

	.w100 {
		width: 100%;
	}
	.whole-page {
		position: fixed;
		top: 0;
		z-index: 999;
		width: 100%;
		left: 0;
		height: 100%;
	}
	.tc {
		text-align: center;
	}

	.no-border {
		border: 0 !important;
	}

	.line-hor {
		margin: -10rpx 8rpx 0 8rpx;
		display: inline-block;
		vertical-align: middle;
	}

	text,
	label,
	input,
	button {
		color: @darkblue;
		font-size: 29rpx;
	}

	button {
		.font-b;
	}

	image {
		.db;
	}
	.show-page {
		transform: translateY(0vh) !important;
		opacity: 1 !important;
	}
	.uni-input-input {
		line-height: 80rpx !important;
	}

	.video-box img {
		opacity: 1 !important;
	}

	checkbox {
		transform: scale(.7);
		transform-origin: 0 0;
		margin-left: 12rpx;
	}

	.dl {
		display: flex;
		flex-wrap: warp;
	}

	.mt {
		margin-top: 20rpx;
	}

	.ml {
		margin-left: 20rpx;
	}

	.mr {
		margin-right: 16rpx;
	}

	.fw {
		font-weight: bold !important;
	}

	.no-fw {
		font-weight: normal !important;
	}
	
	.slide-down {
		transition: all .6s ease-out;
	}

	.uni-page-head,
	uni-page-head {
		display: none;
	}

	.uni-input-input {
		color: #333;
	}

	.minh {
		min-height: calc(~"100vh - 190rpx") !important;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.align-center {
		display: flex;
		align-items: center;
	}

	/*... common css ...*/
	.text-red {
		color: @red  !important;
	}

	.text-dark-red {
		color: @darkred  !important;
	}

	.text-dark {
		color: @darkblue  !important;
	}

	.text-blue {
		color: @blue  !important;
	}

	.text-green {
		color: @green  !important;
	}

	.text-yellow {
		color: @yellow  !important;
	}

	.text-light-gray {
		color: @lightgray  !important;
	}

	.text-gray {
		color: @gray  !important;
	}

	.tag-green {
		color: #fff;
		padding: 7rpx 14rpx 8rpx 14rpx;
		background-color: @green;
		border-radius: 8rpx;
		.font-s;
		vertical-align: text-top;
	}

	.tag-red {
		color: #fff;
		padding: 7rpx 14rpx 8rpx 14rpx;
		background-color: @darkred;
		border-radius: 8rpx;
		.font-s;
		vertical-align: text-top;
	}

	.bg-gray {
		background-color: #f5f5f5;
		min-height: 100%;
	}

	.bg-red {
		color: #fff !important;
		background-color: @red  !important;
	}

	.bg-dark-red {
		color: #fff !important;
		background-color: @darkred  !important;
	}

	.bg-pink {
		color: #fff !important;
		background-color: @pink  !important;
	}

	.bg-blue {
		color: #fff !important;
		background-color: @blue  !important;
	}

	.bg-green {
		color: #fff !important;
		background-color: @green  !important;
	}

	.bg-yellow {
		color: #fff !important;
		background-color: @yellow  !important;
	}

	.bg-gold {
		color: #fff !important;
		background-color: @gold  !important;
	}

	.bg-light-yellow {
		color: #fff !important;
		background-color: @lightyellow  !important;
	}

	.with-nav {
		padding-bottom: 180rpx;
	}

	.db {
		display: block;
	}

	.hidden {
		visibility: hidden;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.two-ellipsis {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.line {
		width: 100%;
		border-top: 2rpx dashed @bordergray;
		margin-bottom: 30rpx;
	}

	.head-title {
		background-color: #fff;

		&>.title {
			padding: 26rpx 30rpx 16rpx 30rpx;
			font-weight: normal;
			background-color: #fff;
			font-weight: bold;
			color: @blue;
			position: relative;

			&>a {
				color: @blue;
			}

			text {
				margin-left: 6rpx;
			}

			&:before {
				position: absolute;
				content: '';
				width: 8rpx;
				height: e("calc(100% - 44rpx)");
				left: 16rpx;
				top: 28rpx;
				background-color: @blue;
			}

			i {
				margin-right: 6rpx;
			}

			&:after {
				content: '更多';
				position: absolute;
				right: 4%;
				top: 38%;
				color: @lightgray;
				.font-s;
				font-weight: normal;
			}
		}
	}
	.input-border {
		width: 70%;
		margin: 30upx auto;
		background-color:#fff;
		height: 72upx;
		line-height: 72upx;
		border-radius: 50upx;
		display: flex;
		padding: 14upx 0;
		text {
			//flex: 1;
			padding: 0 20upx 0 40upx;
		}
		input {
			flex: 1;
			line-height: 80upx;
			height: 80upx;
			.font-m;
		}
		.input-placeholder {
			color:@lightgray;
		}
		.button-text {
			.font-m;
			padding-right: 60upx;
		}
	}
	.good-list {
		background-color: #fff;
		padding-top: 20rpx;

		.list {
			border-top: 1rpx solid #f5f5f5;
			display: flex;
			padding: 20rpx 30rpx 20rpx 30rpx;
			background-color: #fff;

			.left {
				width: 200rpx;
				text-align: right;
				padding-right: 30rpx;

				image {
					width: 200rpx;
					height: 160rpx;
					object-fit: cover;
				}
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					font-weight: bold;
					padding: 0rpx 0 20rpx 0;
					.db;
					.font-b;
				}

				text {
					line-height: 50rpx;
				}
			}
		}

		.list2 {
			border-top: 1rpx solid #f5f5f5;
			padding: 20rpx 30rpx 20rpx 30rpx;

			.title {
				font-weight: bold;
				padding: 0 0 20rpx 0;
				.db;
				.font-b;
			}

			image {
				height: 300rpx;
				margin-bottom: 20rpx;
				width: 100%;
			}
		}

	}

	.tag {
		padding: 2rpx 8rpx 3rpx 8rpx;
		border-radius: 8rpx;
		//border: 1rpx solid @lightgray;
		color: @lightgray;
		.font-m;
	}

	.button-large {
		width: 76%;
		height: 100rpx;
		line-height: 100rpx;
		margin: 30rpx auto;
		border-radius: 50rpx;
		.font-b;
	}

	.button-blue {
		border-radius: 47rpx;
		background-color: @blue  !important;
		border: 0;
		height: 94rpx;
		line-height: 94rpx;
		color: #fff;
		box-shadow: 6rpx 8rpx 8rpx 2rpx #ccc;
		padding: 0 80rpx;
		.font-b;
		width: 500rpx;
		margin-top: 100rpx;

		&:after {
			border: 0;
		}
	}
	
	.button-normal {
		background: linear-gradient(to right,#b58af1,#8072e9);
		width: 70%;
		position: absolute;
		bottom: 0;
		left: 15%;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 50rpx;
		box-shadow: 0 4rpx 12rpx 0rpx #b58af1;
	}
	
	.button-red {
		border-radius: 20rpx;
		background-color: @red  !important;
		border: 0;
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		color: #fff;
		box-shadow: 0 4rpx 5rpx 2rpx @red;
		padding: 0 24rpx;
		.font-m;

		&:after {
			border: 0;
		}

		.icon {
			font-size: 24rpx;
			color: #fff;
			margin-left: 10rpx;
			vertical-align: middle;
		}
	}

	.button-dark {
		border-radius: 16rpx;
		background-color: @darkblue;
		border: 0;
		width: 86%;
		color: #fff;
		font-weight: bold;

		&:after {
			border: 0;
		}
	}

	.button-gray {
		background-color: #d8d8d8 !important;
	}

	.button-white-plain {
		border-color: #fff !important;
		color: #fff !important;
		line-height: 64rpx;
		padding: 0 25rpx;
	}

	.button-dark-plain {
		border-color: @darkblue  !important;
		color: @darkblue  !important;
		line-height: 50rpx;
		padding: 0 20rpx;
		.font-m;
	}

	.button-green-plain {
		border-color: @green  !important;
		color: @green  !important;
		line-height: 50rpx;
		padding: 0 20rpx;
		.font-m;
	}

	.button-red-plain {
		border-color: @red  !important;
		color: @red  !important;
		line-height: 50rpx;
		padding: 0 20rpx;
		.font-m;
	}

	.button-shadow {
		box-shadow: 5rpx 5rpx 8rpx 0 #bbb;
	}

	.arcticle-vue {
		.title {
			padding: 50rpx 20rpx 10rpx 20rpx;
			font-size: 38rpx;
		}

		.content {}

		.parser {
			padding: 30rpx;
		}

		image {
			width: 100%;
			height: 300rpx;
		}
	}

	.search-box {
		left: 0;
		display: flex;
		width: 100%;

		&>view {}

		.search {
			//width: 95% !important;
			display: flex;
			padding: 0 30rpx !important;
			box-sizing: border-box;
			height: 74rpx;
			line-height: 74rpx;
			border-radius: 37rpx;
			align-items: center;
			background-color: #fff !important;
			flex: 1;
			border: 1rpx solid #ddd;
		}

		.icon {
			.icon-m;
			color: @lightgray;
		}

		input {
			flex: 1;
			padding: 0 20rpx;
			height: 80rpx;
		}

		.right {
			padding: 0 0 0 20rpx;

			text {
				color: @lightgray;
				line-height: 74rpx;
				vertical-align: middle;
			}

			text:nth-child(1) {
				margin-right: -6rpx;
			}

			.icon {
				font-size: 50rpx;
			}
		}

		.left {
			padding: 0 20rpx;
			color: @darkblue;
		}
	}

	.nothing {
		.icon {
			font-size: 200rpx;
			margin: 140rpx 0 50rpx 0;
			display: block;
			text-align: center;
			color: @lightgray;
		}

		.text {
			color: @lightgray;
			display: block;
			text-align: center;
		}

		button {
			border-radius: 55rpx;
			color: @darkred;
			width: 70%;
			.font-b;

			&:after {
				border: 0;
			}

			border: 1rpx solid @darkred;
			margin-top: 100rpx;
		}
	}

	.title-panel {
		font-weight: bold;
		display: block;
		padding: 26rpx;
		margin-top: 16rpx;
		background-color: #fff;
		font-size: 32rpx;

		text {
			font-size: 32rpx;
		}
	}

	.video-box {
		position: relative;
		width: 94%;
		margin: 30rpx auto 0 auto;
		border-radius: 10rpx;
		overflow: hidden;
		height: 300rpx;

		image {
			object-fit: cover;
			width: 100%;
		}

		.play {
			position: absolute;
			right: 40rpx;
			bottom: 40rpx;
			color: #fff;
			z-index: 2;
		}

		.time {
			position: absolute;
			bottom: 60rpx;
			left: 40rpx;
			z-index: 2;

			text {
				color: #fff;
			}
		}

		.shape {
			position: absolute;
			border-radius: 4px;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .2);
			z-index: 1;

			.title {
				padding: 7% 40rpx 9% 40rpx;
				color: #fff;
				font-size: 40rpx;
			}

			&>view:nth-child(2) {
				padding: 0 14px;
				color: #fff;
			}
		}
	}

	.nav-bar {
		height: 100rpx;
		position: relative;
		z-index: 4;
		background-color: #fff;

		&>view {
			display: flex;
			align-items: center;
			padding: 20rpx 24rpx;
			background-color: #fff;
			width: 100%;
			position: fixed;
			z-index: 999999;
			box-sizing: border-box;
			top: 0;

			button {
				line-height: 46rpx;
				padding: 0 20rpx 3rpx 20rpx;
				.font-m;
			}

			.title {
				width: 60%;
				text-align: center;
				.font-b;
			}

			.icon-return {
				width: 20%;
				transform: rotateY(180deg);
				text-align: right;
			}
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(360deg);
		}
	}

	/*.... uni-ui style change .....*/
	.no-shape {
		.uni-popup__mask {
			background-color: rgba(0, 0, 0, 0);
		}

		.uni-popup__wrapper {
			.uni-popup__wrapper-box {
				background-color: @darkblue  !important;
				border-radius: 10rpx;
				display: flex;
			}

			text {
				color: #fff;
				.font-m;
			}

			.icon-jiazaizhong {
				animation: rotate 1s infinite linear;
				display: block;
				transform-origin: 50%;
				font-size: 42rpx;
				width: 42rpx;
				height: 42rpx;
				line-height: 42rpx;
				text-align: center;
			}

			.text {
				margin-left: 10rpx;
			}
		}
	}

	html,
	body {
		.font-m;
	}

	page {
		height: 100%;
	}

	.title {
		font-weight: bold;
	}

	radio {
		transform: scale(0.7);
		transform-origin: 0 30%;
	}

	.placeholder {
		color: @lightgray;
	}

	.placeholder-dark {
		color: @darkblue;
	}

	.wuc-tab-box {
		border-top: 1px solid #f5f5f5;
	}

	.input-box {
		margin-bottom: 40rpx;

		.title {}

		.box {
			width: 100%;
			border: 1px solid @lightgray;
			padding: 24rpx;
			height: 80rpx;
			line-height: 80rpx;
			position: relative;
			margin: 20rpx 0 0 0;
			border-radius: 8rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.click-obj {
				position: absolute;
				z-index: 2;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				opacity: 0;
			}
		}

		input {
			flex: 1;
			.font-m;
			height: 80rpx;
		}

		.input-placeholder {
			color: @lightgray;
		}
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		box-sizing: border-box;
		color: @darkblue;
	}

	.grid-list {
		background-color: #fff;
		margin: 20rpx 0;
		padding: 30rpx 0 20rpx 0;

		.icon {
			color: @darkblue;
			.icon-m;
			margin-bottom: 20rpx;
		}

		.text {
			color: @darkblue;
			.font-m;
		}

		.grid-item:nth-child(1) .iconfont {
			background: linear-gradient(to bottom, #8fbceb, #5f78fa);
		}

		.grid-item:nth-child(2) .iconfont {
			background: linear-gradient(to bottom, #faca58, #f77220);
		}

		.grid-item:nth-child(3) .iconfont {
			background: linear-gradient(to bottom, #69c1fe, #199bf9);
		}

		.grid-item:nth-child(4) .iconfont {
			background: linear-gradient(to bottom, #fc9209, #fd3d1e);
		}
	}

	.clumn-list {
		.list {
			width: 100%;
			display: flex;
			background-color: #fff;
			padding: 34rpx 20rpx;
			align-items: center;
			box-sizing: border-box;
			border-top: 1rpx solid #f5f5f5;

			.left-icon {
				width: 14%;
				text-align: center;
				.icon-m;
			}

			.text {
				//width: 74%;
				color: @lightgray;
				.font-m;
				flex: 1;
			}

			.icon-return {
				color: #bbb;
				font-size: 36rpx;
			}

			.num {
				.font-b;
				padding-right: 20rpx;
			}
		}
	}

	.notice {
		padding: 30rpx 40rpx;
		background: #fff;

		&>view {
			padding: 24rpx 34rpx;
			background-color: #ffedd5;
			display: flex;
			border-radius: 45rpx;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			position: relative;
			height: 40rpx;

			&>text {
				color: #fea94e;
				width: 11%;
			}

			view {
				flex: 1;
				transform: translateY(40rpx);

				text {
					color: #967d4a;
					height: 80rpx;
					line-height: 80rpx;
				}
			}

			view.active {
				transition: transform 1s;
				transform: translateY(-40rpx);
			}
		}
	}

	.input-list {
		background: #fff;

		.list {
			display: flex;
			align-items: center;
			width: 90%;
			margin: 0 auto;
			padding: 34rpx 0;
			border-top: 1rpx solid #f5f5f5;
			align-items: center;
			justify-content: space-between;

			+.vertical {
				flex-direction: column;
				align-items: flex-start;

				textarea {
					border: 1rpx solid #f5f5f5;
					width: 100%;
					height: 140rpx;
					border-radius: 12rpx;
					margin-top: 10rpx;
				}
			}

			input,
			textarea {
				flex: 1;
				padding: 0 24rpx;
				box-sizing: border-box;
				//text-align: right;
			}

			textarea {
				height: 120rpx;
				padding: 10rpx 24rpx;
			}

			input {
				text-align: right;
			}

			label {
				height: 1.4rem;
				line-height: 1.4rem;
				min-width: 120rpx;
			}

			picker {
				position: absolute;
				width: 500rpx;
				left: 220rpx;
				height: 34rpx;

				.input-picker {
					height: 34rpx;
					padding-left: 34rpx;
					padding-right: 46rpx;
					text-align: right;
				}
			}
		}

		.title {
			font-weight: bold;
			.font-b;
			padding: 40rpx 20rpx 14rpx 34rpx;
		}
	}

	.confirm-dialog {
		padding: 20rpx 10rpx 10rpx 10rpx;
		border-radius: 10rpx;

		.title {
			text-align: center;
			margin-bottom: 40rpx;
			.fw;
			.font-b;
		}

		text {
			display: block;
		}

		.text {
			text {
				margin-bottom: 20rpx;
				color: @lightgray;
			}
		}

		.button {
			margin: 100rpx 0 16rpx 0;
			display: flex;
			justify-content: space-between;

			button {
				margin: 0 30rpx;
				flex: 1;
			}

			.cancel {
				background-color: #f5f5f5;
				color: @lightgray;
			}
		}
	}
	.popup-custom {
		background: rgba(0,0,0,.2);
		height: 100%;
		.con {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 60vh;
			background-color: #fff;
			padding-top: 50rpx;
			box-sizing: border-box;
		}
		.items {
			height: 45vh;
			overflow-y: auto;
		}
		.list {
			background-color: #f5f5f5;
			border-radius: 12rpx;
			padding: 30rpx 40rpx;
			width: 94%;
			margin: 0 auto 30rpx auto;
			position: relative;
			box-sizing: border-box;
			.title {
				
			}
		}
		.button-box {
			width: 90%;
			position: absolute;
			left: 5%;
			bottom: 0;
			button {
				height: 100rpx;
				line-height: 100rpx;
				border-radius: 50rpx;
			}
			button:nth-child(1) {
				background: #fff;
				color: @gray;
				width: 90%;
				margin-left: 5%;
				border: 1rpx solid #eee;
				&:after {
					border: 0;
				}
			}
		}
	}
</style>

</style>
