<template>
	<div class="newaddress">
		<van-nav-bar :title="!aid ? '新增地址' : '编辑地址'"  left-text="返回" left-arrow @click-left="$router.back()" />
		<div class="address">
			<van-address-edit :area-list="areaList" show-postal show-set-default :area-colums-placeholder="['请选择省份', '请选择市级', '请选择区']" :show-delete="!aid ? false : true" :address-info="editaddressInfo" @delete="deleteaddress" @save="saveInfo"/>
		</div>
	</div>
</template>

<script>
import { areaList } from '@vant/area-data';	
export default {
	data() {
		return {
			areaList,
			// 商品aid
			aid: "",
			// 编辑地址数据
			editaddressInfo: {}
		}
	},
	created() {
		this.aid = this.$route.query.aid;
		if (this.aid) {
			this.findaddress();
		}
	},
	methods: {
		saveInfo (content) {
			let tokenString = localStorage.getItem("__tk");
			if (!tokenString) {
				return;
			}
			// 复制
			let addressInfo = Object.assign({}, content);
			delete addressInfo.country;
			addressInfo.appkey = this.appkey;
			addressInfo.tokenString = tokenString;
			// true === 1		false === 0
			addressInfo.isDefault = Number(addressInfo.isDefault);
			this.$toast.loading({
				message: "加载中...",
				forbidClick: true,
				duration: 0,
			});
			// 判断是否拥有aid
			if (!this.aid) {
				// 新增地址
				this.address(addressInfo, '/addAddress');
			}else {
				// 编辑地址
				delete addressInfo.country;
				// 判断数据有没有发生改变
				let isModify = false;
				for (let key in content) {
					if (content[key] != this.editaddressInfo[key]) {
						isModify = true;
						break;
					}
				}
				// 根据数据是否发生改变,提醒用户或者编辑数据
				if (!isModify) {
					this.address(addressInfo, '/editAddress');
				}else {
					this.$toast('地址信息未修改');
				}
			}
		},
		// 新增地址
		address (addressInfo, url) {
			this.axios({
					method: "POST",
					url,
					data: addressInfo,
				}).then((res) => {
					this.$toast(res.data.msg);
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 9000 || res.data.code === 30000) {
						// 跳转到地址管理
						this.$router.push({name: "Address"});
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 查询地址
		findaddress () {
			let tokenString = localStorage.getItem("__tk");
			if (!tokenString) {
				return;
			}
			this.axios({
					method: "GET",
					url: "/findAddressByAid",
					params: {
						appkey: this.appkey,
						tokenString,
						aid: this.aid
					}
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 40000) {
						res.data.result[0].isDefault = Boolean(res.data.result[0].isDefault);
						this.editaddressInfo = res.data.result[0];
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 删除地址
		deleteaddress (content) {
			let tokenString = localStorage.getItem("__tk");
			if (!tokenString) {
				return;
			}
			this.axios({
					method: "POST",
					url: "/deleteAddress",
					data: {
						appkey: this.appkey,
						tokenString,
						aid: this.aid
					}
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 10000) {
						this.$router.push({name: "Address"})
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		}
	},
};	
</script>

<style lang="less" scoped>
.newaddress {
	height: 100vh;
	background-color: #f3f5f2;
	.address {
		padding: 8px 4px;
		/deep/.van-button--danger {
			background-color: #0B34BA;
			border-color: #0B34BA;
		}
		/deep/.van-switch--on {
			background-color: #0B34BA;
		}
	}
}	
</style>
