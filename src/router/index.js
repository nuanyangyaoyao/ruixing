import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },{
    path: '/forgetpsw',
    name: 'Forgetpsw',
    component: () => import('../views/Forgetpsw.vue')
  },{
	path: '/',
	name: 'Main',
	component: () => import('../views/Main.vue'),
	children: [
		{
		  path: 'home',
		  name: 'Home',
		  component: () => import('../views/Home.vue')
		},{
		  path: 'menu',
		  name: 'Menu',
		  component: () => import('../views/Menu.vue')
		},{
		  path: 'shopbag',
		  name: 'Shopbag',
		  component: () => import('../views/Shopbag.vue')
		},{
		  path: 'my',
		  name: 'My',
		  component: () => import('../views/My.vue')
		}
	]
	},{
		path: '/detail/:pid',
		name: 'Detail',
		component: () => import('../views/Detail.vue')
	},{
		path: '/pay',
		name: 'Pay',
		component: () => import('../views/Pay.vue')
	},{
		path: '/newaddress',
		name: 'Newaddress',
		component: () => import('../views/Newaddress.vue')
	},{
		path: '/address',
		name: 'Address',
		component: () => import('../views/Address.vue')
	},{
		path: '/mine',
		name: 'Mine',
		component: () => import('../views/Mine.vue')
	},{
		path: '/safety',
		name: 'Safety',
		component: () => import('../views/Safety.vue')
	},{
		path: '/like',
		name: 'Like',
		component: () => import('../views/Like.vue')
	},{
		path: '/order',
		name: 'Order',
		component: () => import('../views/Order.vue')
	},{
		path: '*',
		// 路由重定向
		redirect: {
			name: 'Home'
		}
	}
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
