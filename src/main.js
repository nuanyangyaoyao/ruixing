import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入rem适配文件
import 'lib-flexible/flexible'
// 引入axios vue-axios文件
import axios from 'axios'
import VueAxios from 'vue-axios'
// 引入组件
import {
	Button, NavBar, Form, Field, Popup, Toast, Tabbar, TabbarItem, Search, Swipe, SwipeItem, Stepper, GoodsAction, GoodsActionIcon, GoodsActionButton, Empty, SwipeCell, Checkbox, CheckboxGroup, SubmitBar, List, AddressEdit, AddressList, Icon, Dialog, Cell, CellGroup, Image as VanImage
} from 'vant';

Vue.config.productionTip = false;

//配置请求基础路径(设置axios默认路径)
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
// 设置Vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

// axios拦截器
axios.interceptors.request.use(config => {
	// 处理post参数,进行参数序列化
	if(config.method === 'post') {
		let paramsString = "";
		for (let key in config.data) {
			paramsString += `${key}=${config.data[key]}&`;
		}
		config.data = paramsString.slice(0, -1);
	}
	// 必须返回config, 结束拦截,放行
	return config;
})

//全局过滤器
Vue.filter('decimal', (v,n = 2) => {
	// 默认取小数点后两位
	return v.toFixed(n)
})

//组件全局注册 
Vue.use(VueAxios, axios)
	.use(Button).use(NavBar).use(Form).use(Search).use(Swipe).use(Empty).use(CheckboxGroup).use(SubmitBar).use(Icon).use(Cell)
	.use(SwipeItem).use(TabbarItem).use(Stepper).use(GoodsAction).use(GoodsActionButton).use(Checkbox).use(AddressList).use(CellGroup)
	.use(Field).use(Popup).use(Toast).use(Tabbar).use(GoodsActionIcon).use(SwipeCell).use(List).use(AddressEdit).use(Dialog).use(VanImage)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
