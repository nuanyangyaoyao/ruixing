<template>
	<div class="address">
		<van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="$router.back()" />
		<div class="bg"></div>
		<div class="address-box">
			<van-address-list :list="list" default-tag-text="默认" @add="add" @edit="edit" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		 return {
			  list: [],
			};  
		},
	created() {
		this.findAddress();
	},
	methods: {
		findAddress () {
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
					method: "GET",
					url: "/findAddress",
					params: {
						appkey: this.appkey,
						tokenString
					},
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 20000) {
						res.data.result.map((v) => {
							v.isDefault = Boolean(v.isDefault);
							v.id = v.aid;
							v.address = `${v.province}${v.city}${v.country}${v.addressDetail}`;
						});
						this.list = res.data.result;
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		add () {
			this.$router.push({name: 'Newaddress'});
		},
		edit (item) {
			this.$router.push({name: 'Newaddress', query: {aid: item.aid}})
		}
	}	
};
</script>

<style>
	.address {
		background-color: #ccc;

		.bg {
			height: 100px;
			background-color: #0B34BA;
		}

		.address-box {
			height: 100px;
			background-color: #fff;
			margin: -30px 10px 0px;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
			padding-bottom: 1px;
			.van-address-list {
				padding: 0px;
			}
			.van-tag--danger {
				background-color: #0B34BA;
				border-color: #0B34BA;
			}
			.van-address-list__bottom {
				background: transparent;
			}
			.van-address-item {
				padding: 10px 0px;
				padding: 10px 20px 15px;
				border-radius: 0px;
			}
			.van-address-item: not(:last-child) {
				margin-bottom: 0px;
			}
			.van-address-item:last-child {
				border-bottom: 1px solid #000;
			}
		}
	}
</style>
