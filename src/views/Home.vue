<template>
	<div class="home">
		<!-- 导航栏 -->
		<van-nav-bar left-text="返回" right-text="按钮" left-arrow fixed>
			<template #left>
				<div class="nav-left">
					<div class="time">晚上好</div>
					<div class="userName" @click="$router.push({name:'Login'})">,{{loginShow ? islogin : nologin}}</div>
				</div>
			</template>
			<template #right>
				<van-search placeholder="请输入商品名称" />
			</template>
		</van-nav-bar>
		<!-- 轮播图 -->
		<div class="home-content">
			<div class="banner-container">
				<van-swipe @change="onChange">
					<van-swipe-item v-for="(item,index) in bannerData" :key="index" @click="goDateil(item.pid) ">
						<img class="auto-img" :src="item.bannerImg" :alt="item.name" />
						<div class="item-title">{{item.name}}</div>
					</van-swipe-item>
					<template #indicator>
						<span></span>
					</template>
				</van-swipe>
			</div>
			<!-- 商品区域 -->
			<div class="products-box ">
				<div class="clearflx">
					<div class="pro-title">热门推荐</div>
				</div>
				<!-- 商品内容 -->
				<div class="products">
					<div class="pro-item" v-for="(item,index) in ProductsData" :key="index" @click="goDateil(item.pid)">
						<div class="pro-img">
							<img class="auto-img" :src="item.smallImg" />
						</div>
						<div class="pro-name">{{ item.name }}</div>
						<div class="pro-enname text-ellipsis">{{ item.enname }}</div>
						<div class="pro-price">￥{{ item.price }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import "../assets/less/home.less"
	export default {
		data() {
			return {
				myinfo: [],
				bannerData: [],
				ProductsData: [],
				islogin: '',
				nologin: '请先登录',
				loginShow: false,
			}
		},
		methods: {
			onChange(index) {
				this.$toast('当前 Swipe 索引：' + index);
			},
			// 轮播图接口
			getBannerData() {
				this.axios({
						method: "GET",
						url: "/banner",
						params: {
							appkey: this.appkey
						}
					}).then(res => {
						this.bannerData = res.data.result;
					}).catch(err => { 
						
					});
			},
			// 热门推荐接口
			getTypeProductsData() {
				this.axios({
						method: "GET",
						url: "/typeProducts",
						params: {
							appkey: this.appkey,
							key: 'isHot',
							value: 1
						}
					})
					.then(res => {
						this.ProductsData = res.data.result;
					})
					.catch(err => {
						
					});
			},
			goDateil(pid) {
				this.$router.push({
					name: "Detail",
					params: {
						pid
					}
				})
			},

			findAccountInfo() {
				// 获取token,确保用户已经登录，才可以收藏
				let tokenString = localStorage.getItem("__tk");
				// 未登录
				if (!tokenString) {
					return;
				}
				// 发起收藏请求
				this.$toast.loading({
					message: "加载中...",
					forbidClick: true,
					duration: 0,
				});
				this.axios({
						method: "GET",
						url: "/findAccountInfo",
						params: {
							appkey: this.appkey,
							tokenString,
						},
					})
					.then((res) => {
						this.$toast.clear();
						if (res.data.code === 700) {
							this.loginShow = false;
							this.nologin = '请先登录';
							// 	this.$router.push({name: "Login"});
						} else if (res.data.code === 'B001') {
							this.myinfo = res.data.result[0];
							this.loginShow = !this.loginShow;
							this.islogin = this.myinfo.nickName;
						}
					})
					.catch((err) => {
						// 关闭加载提示
						this.$toast.clear();
					});
			},
		},
		created() {
			this.getBannerData();
			this.getTypeProductsData();
			this.findAccountInfo();
		}
	};
</script>

<style>
</style>
