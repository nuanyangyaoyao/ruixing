<template>
	<div class="my">
		<div class="mine-bg">
			<img src="../../../QQ图片20210716101839.jpg">
		</div>
		<div class="mine-box">
			<div class="mine-top clearflx">
				<img @click="$router.push({name: 'Login'})" class="fl" :src="myinfo.userImg">
				<div class="fr mine-right">
					<h2 class="mine-name">{{ myinfo.nickName }}</h2>
					<div class="mine-desc">{{myinfo.desc!=='' ? myinfo.desc : '这个人很懒，什么都没有留下'}}</div>
				</div>
			</div>
			<div class="mine-bottom">
				<van-cell center title="个人资料" is-link @click="$router.push({name: 'Mine'})" />
				<van-cell center title="我的订单" is-link @click="$router.push({name: 'Order'})" />
				<van-cell center title="我的收藏" is-link @click="$router.push({name: 'Like'})" />
				<van-cell center title="收货地址" is-link @click="$router.push({name: 'Address'})" />
				<van-cell center title="安全中心" is-link @click="$router.push({name: 'Safety'})" />
			</div>
		</div>
	</div>
</template>

<script>
	import "../assets/less/my.less"
	export default {
		data() {
			return {
				myinfo: []
			}
		},
		created() {
			this.findAccountInfo();
		},
		methods: {
			findAccountInfo () {
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
					}).then((res) => {
						this.$toast.clear();
						if (res.data.code === 700) {
							this.$router.push({
								name: "Login"
							});
						} else if (res.data.code === 'B001') {
							this.myinfo = res.data.result[0];
						}
					}).catch((err) => {
						// 关闭加载提示
						this.$toast.clear();
					});
			}
		}
	}
</script>

<style>
</style>
