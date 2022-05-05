<template>
	<div class="main">
		<!-- 二级路由展示区域 -->
		<router-view></router-view>
		<!-- 底部tabbar标签栏 -->
		<van-tabbar v-model="tabbarActive" active-color="#0b34ba">
			<van-tabbar-item v-for="(item,index) in tabbarData" :key="index" :icon="item.icon" :to="item.path">
				<span>{{ item.title }}</span>
				<template #icon="props">
					<img :src="props.active ? item.active : item.inactive" />
				</template>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tabbarActive: 0,
			tabbarData: [
				{
					title: "首页",
					path: '/home',
					icon: "home-o",
					active: require("../assets/images/home_active.png"),
					inactive: require("../assets/images/home.png")
				},{
					title: "菜单",
					icon: "search",
					path: '/menu',
					active: require("../assets/images/menu_active.png"),
					inactive: require("../assets/images/menu.png")
				},{
					title: "购物袋",
					path: '/shopbag',
					icon: "friends-o",
					active: require("../assets/images/shopbag_active.png"),
					inactive: require("../assets/images/shopbag.png")
				},{
					title: "我的",
					path: '/my',
					icon: "setting-o",
					active: require("../assets/images/my_active.png"),
					inactive: require("../assets/images/my.png")
				},
			],
		};
	}
}	
</script>

<style>
</style>
