import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
Vue.use(Vuex)

import api from './static/js/api.js'
import store from './static/js/store.js'
import common from './static/js/common.js'
import request from './static/js/request.js'

//插件
import moment from './static/js/plugins/moment.js'

const $store = new Vuex.Store(store);
Vue.prototype.$api = api;
Vue.prototype.$com = common;
Vue.prototype.$req = request;
Vue.prototype.moment = moment;
Vue.prototype.uni = uni;

/*.... 公共组件 ...*/
import userAuth from "@/pages/common/userAuth.vue";
Vue.component('userAuth',userAuth);
import toast from "@/pages/common/toast.vue";
Vue.component('toast',toast);
import popup from "@/components/uni-popup/uni-popup.vue";
Vue.component('popup',popup);
import rate from "@/components/uni-rate/uni-rate.vue";
Vue.component('rate',rate);

Vue.config.productionTip = false


Vue.mixin({
	methods: {
		setData: function(obj, callback) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				})
			});
			callback && callback();
		} 
	}
});

App.mpType = 'app';

const app = new Vue({
    ...App,
	store:$store
});
app.$mount();
