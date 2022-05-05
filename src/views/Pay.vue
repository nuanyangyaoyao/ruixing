<template>
	<div class="pay">
		<!-- 导航栏 -->
		<van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="$router.back()" fixed />
		<div class="info-box1">
			<!-- 收货地址 -->
			<div class="select-address-box">
				<div class="select" @click="addressShow = !addressShow">
					<span>选择收货地址</span>
					<van-icon name="arrow" />
				</div>
				<!-- 收货信息 -->
				<div class="address-info">
					<div class="info1">
						<div class="info-name">{{ currentAddress.name }}</div>
						<div class="info-phone">{{ currentAddress.tel }}</div>
					</div>
					<div class="info2">
						{{ currentAddress.address }}
					</div>
				</div>
			</div>
			<!-- 订单信息 -->
			<div class="pay-info-box">
				<div class="pay-title">订单信息</div>
				<div class="pay-info">
					<div class="pro-item" v-for="(item, index) in payInfo" :key="index">
						<!-- disabled为true禁用滑动 -->
						<div class="item-box">
							<div class="item-right">
								<div class="right-content">
									<div class="right-img">
										<img class="auto-img" :src="item.large_img" alt="" >
									</div>
									<div class="right-info">
										<div class="info-box">
											<div class="info-text">
												<div class="info-name">{{ item.name }}</div>
												<div class="info-rule">{{ item.rule }}</div>
											</div>
											<div class="info-enname">{{ item.enname }}</div>
											<div class="price-box clearflx">
												<div class="price fl">￥{{ item.price }}</div>
												<div class="fr"><span>x</span>{{ item.count }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="circle">
					<div class="circle-fl"></div>
					<div class="circle-fr"></div>
				</div>
				<!-- 结算 -->
				<div class="pay-sum clearflx">
					<div class="fl">共计: {{allCount}}件商品</div>
					<div class="sum fr">合计: ￥{{allPrice | decimal}}</div>
				</div>
			</div>
			<!-- 结算按钮 -->
			<div class="pay-btn">
				<van-button color="#0b34ba" @click="paydialog">立即结算</van-button>
			</div>
		</div>
		<!-- 选择地址 -->
		<van-popup v-model="addressShow" position="bottom" :style="{height: '30%'}" closeable round>
			<div class="popup-title">选择收货地址</div>
			<van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="$router.push({name: 'Address'})" @select="selectAddress" />
		</van-popup>	
	</div>
</template>

<script>
import "../assets/less/pay.less"	
export default {
	data() {
		return {
			// 是否显示查询地址
			addressShow: false,
			// 默认地址
			chosenAddressId: '',
			// 地址的数据
			list: [],
			// 当前选中的地址
			currentAddress: {},
			// 需要购买商品的sid
			sids: [],
			// 订单商品信息
			payInfo: [],
			// 总价
			allPrice: 0,
			// 总数量
			allCount: 0
			
		};
	},
	created() {
		this.sids = this.$route.query.sids.split('-');
		this.findAddress();
		this.commitShopcart();
	},
	methods: {
		// 查询商品订单
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
						this.$toast(res.data.msg);
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 20000) {
						res.data.result.map((v) => {
							if (v.isDefault) {
								this.chosenAddressId = v.id;
								// 选中默认地址
								this.currentAddress = v;
							}
							v.isDefault = Boolean(v.isDefault);
							v.address = `${v.province}${v.city}${v.country}${v.addressDetail}`;
						});
						this.list = res.data.result;
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 选择地址
		selectAddress (item) {
			this.currentAddress = item;
		},
		// 获取到订单信息
		commitShopcart () {
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
					url: "/commitShopcart",
					params: {
						appkey: this.appkey,
						tokenString,
						sids: JSON.stringify(this.sids)
					},
				}).then((res) => {
					// this.$toast.clear();
					if (res.data.code === 700) {
						this.$toast(res.data.msg);
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 50000) {
						if (res.data.result.length === 0) {
							this.$router.push({name: "Shopcart"});
						}
						res.data.result.map(v => {
							this.allPrice += v.price * v.count;
							this.allCount += v.count;
						})
						this.payInfo = res.data.result;
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 立即结算弹窗
		paydialog () {
			this.$dialog.confirm({
			  title: '订单信息',
			  message: '是否确认提交订单?',
			}).then(() => {
			    // on confirm
			}).catch(() => {
			    // on cancel
			});
		},
		// 立即结算
		pay () {
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
					url: "/pay",
					data: {
						appkey: this.appkey,
						tokenString,
						sids: JSON.stringify(this.sids),
						phone: this.currentAddress.tel,
						address: this.currentAddress.address,
						receiver: this.currentAddress.name
					},
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						this.$toast(res.data.msg);
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					} else if (res.data.code === 60000) {
						this.$toast(res.data.msg);
						setTimeout(() => {
							this.$router.push({name: "Shopcart"});
						}, 300);
					}
				}).catch((err)=> {
					// 关闭加载提示
					this.$toast.clear();
				});
		}
	}
}	
</script>


