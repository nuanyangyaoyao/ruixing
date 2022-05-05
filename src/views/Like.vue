<template>
	<div class="like">
		<!-- 导航栏 -->
		<van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="$router.back()" fixed></van-nav-bar>
		<div class="like-bg"></div>
		<div class="like-box">
			<van-empty description="暂无收藏，去逛一逛！" v-if="!AllLikeData.length > 0">
				<van-button round type="default" class="bottom-button" @click="$router.push({name:'Home'})">去逛一逛
				</van-button>
			</van-empty>
			<div class="product">
				<!-- 收藏产品 -->
				<div class="pro-item" v-for="(item, index) in AllLikeData" :key="index">
					<div class="pro-img">
						<img class="auto-img" :src="item.smallImg">
					</div>
					<div class="pro-name text-ellipsis">焦糖玛奇朵</div>
					<van-cell title="¥28.00">
						<!-- 使用 right-icon 插槽来自定义右侧图标 -->
						<template #right-icon>
							<van-icon color="#aaabaf" size="24px" name="delete-o" @click="notlike(index, item.pid)" />
						</template>
					</van-cell>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import "../assets/less/like.less"
	export default {
		data() {
			return {
				checked: false,
				value: 0,
				Allchecked: false,
				isEdit: false,
				AllLikeData: [],
				LikeData: [],
				loading: false,
				finished: false,
				// 每次触底懒加载7条数据
				dataCount: 6,
				// 从哪个位置开始截取购物袋数据
				startIndex: 0,
				// 计算总价1
				total: 0,
			};
		},
		created() {
			this.findAllLike();
			// this.notlike();
		},
		methods: {
			findAllLike() {
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
						url: "/findAllLike",
						params: {
							appkey: this.appkey,
							tokenString,
							pid: this.pid,
						},
					}).then((res) => {
						this.$toast.clear();
						if (res.data.code === 700) {
							this.$router.push({
								name: "Login"
							});
						} else if (res.data.code === 2000) {
							res.data.result.map((v) => {
								v.isActive = false;
							});
							this.AllLikeData = res.data.result;

							// // 每次截取7条数据
							// this.LikeData = this.AllLikeData.slice(
							// 	this.startIndex,
							// 	this.startIndex + this.dataCount
							// );
							// // 更新截取位置（8~15）
							// this.startIndex += this.dataCount;
						}
					})
					.catch((err) => {
						// 关闭加载提示
						this.$toast.clear();
					});
			},
			//删除单个
			notlike(i, pid) {
				let tokenString = localStorage.getItem("__tk");
				if (!tokenString) {
					return;
				}
				this.$toast.loading({
					message: "加载中...",
					forbidClick: true,
					duration: 0,
				});
				this.axios({
						method: "POST",
						url: "/notlike",
						data: {
							appkey: this.appkey,
							tokenString,
							pid,
						},
					}).then((res) => {
						this.$toast.clear();
						if (res.data.code === 700) {
							// 验证失败,回去登录
							this.$router.push({
								name: "Login"
							});
						} else if (res.data.code === 900) {
							// 前端的删除
							this.AllLikeData.splice(i, 1);
						}
					}).catch((err) => {
						// 关闭加载提示
						this.$toast.clear();
					});
			},
		},
	}
</script>
