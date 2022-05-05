<template>
	<div class="shopbag">
		<!-- 导航栏 -->
		<van-nav-bar title="购物袋" left-text="返回" left-arrow @click-right="isEdit = !isEdit" @click-left="$router.back()" fixed>
			<template #right v-if="ShopcartData.length > 0">
				<span class="nav-right-text">{{ isEdit ? "完成" : "编辑"}}</span>
			</template>
		</van-nav-bar>
		<!-- 空状态 -->
		<van-empty description="购物车空空如也，去逛一逛！" v-if="!ShopcartData.length > 0">
			<van-button round type="default" class="bottom-button" @click="$router.push({name:'Home'})">去逛一逛</van-button>
		</van-empty>
		<!-- 背景图 -->
		<div v-else>
			<div class="shopbag-bg">
				<img class="auto-img" src="../assets/images/shopbag_bg.png" alt="">
			</div>
			<!-- 购物袋商品 -->
			<div class="products-box">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了，不要再往下拉了" offset="0" @load="onLoad">
					<div class="pro-item" v-for="(item,index) in ShopcartData" :key="index">
						<!-- disabled为true禁用滑动 -->
						<van-swipe-cell :disabled="!isEdit">
							<div class="item-box">
								<div class="item-left">
									<van-checkbox v-model="item.isActive" @click="simpselect" />
								</div>
								<div class="item-right">
									<div class="right-content">
										<div class="right-img">
											<img class="auto-img" :src="item.large_img" alt="">
										</div>
										<div class="right-info">
											<div class="info-box">
												<div class="info-text">
													<div class="info-name">{{item.name}}</div>
													<div class="info-rule">{{item.rule}}</div>
												</div>
												<div class="info-enname">{{item.enname}}</div>
												<div class="price-box clearflx">
													<div class="price fl">￥{{item.price}}</div>
													<div class="fr">
														<van-stepper v-model="item.count" theme="round" button-size="20" disable-input @change="modifyShopcartCount(item.sid,item.count)" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<template #right>
								<van-button square type="danger" text="删除" :color="isEdit ? '#f00' : '#0b34ba'" @click="removeOne(index, item.sid)" />
							</template>
						</van-swipe-cell>
					</div>
				</van-list>
			</div>
			<!-- 提交订单栏 -->
			<van-submit-bar :price="total" button-text="提交订单" v-if="!isEdit" @submit="gopay">
				<van-checkbox v-model="Allchecked" @click="allselect">全选</van-checkbox>
			</van-submit-bar>

			<van-submit-bar button-text="删除选择" v-else @submit="removeSelect()" :button-color="isEdit ? '#f00' : '#0b34ba'">
				<van-checkbox v-model="Allchecked" @click="allselect">全选</van-checkbox>
			</van-submit-bar>
		</div>
	</div>
</template>

<script>
import "../assets/less/shopbag.less"
export default {
	data() {
		return {
			checked: false,
			value: 0,
			Allchecked: false,
			isEdit: false,
			AllShopcartData: [],
			ShopcartData: [],
			loading: false,
			finished: false,
			// 每次触底懒加载7条数据
			dataCount: 7,
			// 从哪个位置开始截取购物袋数据
			startIndex: 0,
			// 计算总价1
			total: 0
		};
	},
	created() {
		this.findAllShopcart();
	},
	methods: {
		findAllShopcart() {
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
					url: "/findAllShopcart",
					params: {
						appkey: this.appkey,
						tokenString
					},
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						this.$router.push({name: "Login"});
					} else if (res.data.code === 5000) {
						res.data.result.map(v => {
							v.isActive = false;
						})
						this.AllShopcartData = res.data.result;
						// 每次截取7条数据
						this.ShopcartData = this.AllShopcartData.slice(
							this.startIndex,
							this.startIndex + this.dataCount
						);
						// 更新截取位置（8~15）
						this.startIndex += this.dataCount;
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 懒加载
		onLoad() {
			// 每次截取7条数据
			setTimeout(() => {
				let data = this.AllShopcartData.slice(this.startIndex, this.startIndex + this.dataCount);
				// 更新截取位置（8~15）
				this.startIndex += this.dataCount;
				this.ShopcartData.push(...data);
				// 取消全选
				this.Allchecked = false;
				if (data.length < this.dataCount) {
					this.finished = true;
				}else {
					// 代表本次懒加载完成
					this.loading = false;
				}
			}, 1500);
		},
		// 全选
		allselect () {
			this.ShopcartData.map(v => {
				v.isActive = this.Allchecked;
			})
			this.sum();
		},
		// 选择单个
		simpselect () {
			for (let i = 0; i < this.ShopcartData.length; i++) {
				this.sum();
				if (!this.ShopcartData[i].isActive) {
					return this.Allchecked = false;
				}
			}
			this.Allchecked = true;
		},
		//删除单个
		removeOne (i, sid) {
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
					url: "/deleteShopcart",
					data: {
						appkey: this.appkey,
						tokenString,
						sids: JSON.stringify([sid]),
					},
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 7000) {
						// 前端的删除
								this.ShopcartData.splice(i, 1);
						this.sum();
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 删除多个
		removeSelect () {
			let isHas = false;
			for (let i = 0; i < this.ShopcartData.length; i++) {
				if (this.ShopcartData[i].isActive) {
					isHas = true;
					break;
				}
			}
			if (!isHas) {
				this.$toast('请选择删除的商品');
			}
			let sids = [];
			this.ShopcartData.map(v => {
				if (v.isActive) {
					sids.push(v.sid);
				}
			});
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
					url: "/deleteShopcart",
					data: {
						appkey: this.appkey,
						tokenString,
						sids: JSON.stringify(sids)
					},
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 7000) {
						// 前端的删除
						for (let i = 0; i < this.ShopcartData.length; i++) {
							if (this.ShopcartData[i].isActive) {
								this.ShopcartData.splice(i, 1);
								i --;
							}
						}
						this.sum();
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		//计算总价
		sum () {
			this.total = 0;
			this.ShopcartData.map(v => {
				if (v.isActive) {
					this.total += v.price * v.count * 100;
				}
			})
		},
		// 修改购物车商品数量
		modifyShopcartCount (sid, count) {
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
					url: "/modifyShopcartCount",
					params: {
						appkey: this.appkey,
						tokenString,
						sid,
						count
					},
				}).then((res) => {
					this.$toast.clear();
					if (res.data.code === 700) {
						// 验证失败,回去登录
						this.$router.push({name: "Login"});
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
		},
		// 跳转订单页面
		gopay () {
			let isHas = false;
			for (let i = 0; i < this.ShopcartData.length; i++) {
				if (this.ShopcartData[i].isActive) {
					isHas = true;
					break;
				}
			}
			if (!isHas) {
				return this.$toast('请选择需要购买的商品');
			}
			// 获取到选中商品的sid
			let sids = [];
			this.ShopcartData.map(v => {
				if (v.isActive) {
					sids.push(v.sid);
				}
			})
			sids = sids.join('-');
			this.$router.push({name: "Pay", query:{sids}});
		}
	},
};
</script>

<style>

</style>
