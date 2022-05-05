<template>
	<div class="mine">
		<!-- 导航栏 -->
		<van-nav-bar title="个人资料" left-text="返回" left-arrow @click-left="$router.back()" fixed></van-nav-bar>
		<div class="mine_bg"></div>
		<div class="mine_box">
			<van-cell title="头像">
				<!-- 使用 right-icon 插槽来自定义右侧图标 -->
				<template #right-icon>
					<van-image round width="40px" height="40px" :src="myinfo.userImg" />
				</template>
			</van-cell>
			<van-cell title="用户id" :value="myinfo.userId" />
			<van-cell title="手机号" :value="myinfo.phone" />
			<van-cell title="昵称" :value="myinfo.nickName" />
			<van-cell center title="简介" :label="myinfo.desc!=='' ? myinfo.desc : '这个人很懒，什么都没有留下' " />
		</div>
	</div>
</template>

<script>
import "../assets/less/mine.less"
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
			}).then((res) => {
				this.$toast.clear();
				if (res.data.code === 700) {
					this.$router.push({ name: "Login" });
				} else if (res.data.code === 'B001') {
					this.myinfo = res.data.result[0];
				}
			}).catch((err) => {
				// 关闭加载提示
				this.$toast.clear();
			});
		},
	},
}
</script>

<style>
</style>
