<template>
	<div class="detail">
		<!-- 导航栏 -->
		<van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="back" />
		<!-- 图片 -->
		<div class="detail-img">
			<img class="auto-img" :src="detailData.large_img" alt="" />
			<div class="pro-name">{{ detailData.name }}</div>
		</div>
		<!-- 商品规格 -->
		<div class="rule-box">
			<!-- 选择规格 -->
			<div class="rule-select">
				<div class="rule-item" v-for="(item, index) in detailData.rule" :key="index">
					<div class="item-name">{{ item.title }}</div>
					<div style="display: flex;">
						<div class="itema" :class="{active:item.ruleIndex === i}" v-for="(n, i) in item.rules" :key="i" @click="toggleRule(item, i)">{{ n }}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 商品描述 -->
		<div class="product-desc">
			<div class="desc-title">商品描述</div>
			<div>
				<div class="desc-item" v-for="(item, index) in detailData.desc" :key="item">{{ `${index+1}. ${item}` }}</div>
			</div>
		</div>
		<!-- 商品价格数量 -->
		<div class="price-box">
			<div class="pro-price">￥{{detailData.price}}</div>
			<div class="fr">
				<van-stepper v-model="proCount" them="round" button-size="22" disable-input />
			</div>
		</div>
		<!-- 商品导航 -->
		<van-goods-action>
			<van-goods-action-icon icon="bag" color="isShopcart ? '#919191' : '#0b34ba'" :badge="isShopcart ? '' : this.ShopCount" text="购物袋" @click="$router.push({name:'Shopbag'})" />
			<van-goods-action-icon icon="like" :text="isLike ? '收藏' : '未收藏'" :color="isLike ? '#0b34ba' : '#919190'"  @click="getLikeData" />
			<van-goods-action-button type="warning" text="加入购物车" @click="addShopcart" />
			<van-goods-action-button color="#0b34ba" type="danger" text="立即购买" @click="$router.push({name: 'Shopcart'})" />
		</van-goods-action>
	</div>
</template>

<script>
import "../assets/less/detail.less"	
export default {
	name: 'Default',
	data() {
		return {
			pid: "",
			detailData: {},
			// 是否收藏
			isLike: false,
			// 商品数量
			proCount: 0,
			// 购物袋是否有商品
			isShopcart: false,
			// 购物袋数量
			ShopCount: 0
		};
	},
	created() {
		this.pid = this.$route.params.pid;
		this.getDetailData();
		// 查询收藏商品接口
		this.findLikeData();
		// 查询购物车商品条目
		this.findShopCartCount();
	},
	methods: {
		getDetailData () {
			this.$toast.loading({
				message: "加载中...",
				forbidClick: true,
				duration: 0
			});
			this.axios({
				method: "GET",
				url: "/productDetail",
				// 键名一定要一致
				params: {
					appkey: this.appkey,
					pid: this.pid
				},
			}).then((res) => {
				// 切割商品描述信息
				let data = res.data.result[0];
				data.desc = data.desc.split(/\n/);
				// 处理数据
				let rule = [];
				let ruleData = ['cream', 'milk', 'sugar', 'tem'];
				ruleData.map(v => {
					let r = {};
					r.title = data[v + "_desc"];  
					// { title: '奶油' }, { title: '奶' }...
					r.rules = [];
					r.ruleIndex = 0;
					//{ title: "奶油", rule:[] }， { title: "糖分", rule: [] }...
					// 规格数据切割成数组
					let ruleSting = data[v].split('/');
					if (data[v] != '') {
						r.rules = ruleSting;
					}
					// 没有规格可以选择, 不显示
					if (r.rules.length > 0) {
						rule.push(r);	
					}
				})
				data.rule = rule;
				this.detailData = data;
				// 关闭加载提示
				this.$toast.clear();
			});
		},
		back () {
			this.$router.back();
		},
		// 切换规格
		toggleRule (item, i) {
			if (item.ruleIndex !== i) {
				item.ruleIndex = i;
			}
		},
		// 收藏(取消收藏)商品接口
		getLikeData (){
			// 确保用户已登录
			let tokenString = localStorage.getItem("__tk");
			// 未登录跳转登录页
			if (!tokenString) {
				this.$toast('请先登录!');
				return this.$router.push({name: "Login"})
			}
			// 进入详情页查询商品是否被收藏,请求不同的接口
			let url = this.isLike ? '/notlike' : '/like';
			// 发起收藏的请求
			this.$toast.loading({
				message: "加载中...",
				forbidClick: true,
				duration: 0
			});
			this.axios({
				method: "POST",
				url,
				// 键名一致
				data: {
					appkey: this.appkey,
					pid: this.pid,
					tokenString
				},
			}).then((res) => {
				this.$toast(res.data.msg);
				// 收藏成功
				if (res.data.code === 800) {
					this.isLike = true;
				}else if (res.data.code === 700) {
					// token验证失败,返回登录
					this.$router.push({name: "Login"});
				}else if (res.data.code === 900) {
					// 取消收藏
					this.isLike = false;
				}
			}).catch((err) => {
				// 关闭加载提示
				this.$toast.clear();
			})
		},
		// 查询收藏商品接口
		findLikeData () {
			let tokenString = localStorage.getItem("__tk");
			// 未登录
			if (!tokenString) {
				this.$toast('请先登录!');
				return this.$router.push({name: "Login"})
			}
			// 发起收藏的请求
			this.$toast.loading({
				message: "加载中...",
				forbidClick: true,
				duration: 0
			});
			this.axios({
				method: "GET",
				url: "/findlike",
				// 键名一致
				params: {
					appkey: this.appkey,
					pid: this.pid,
					tokenString
				},
			}).then((res) => {
				this.$toast(res.data.msg);
				// 判断验证是否成功
				if (res.data.code === 700) {
					// token验证失败,返回登录
					this.$router.push({name: "Login"});
				}else if (res.data.code === 1000) {
					if (res.data.result.length > 0) {
						this.isLike = true;
					}
				}
			}).catch((err) => {
				// 关闭加载提示
				this.$toast.clear();
			})
		},
		// 添加购物车商品接口
		addShopcart () {
			let tokenString = localStorage.getItem("__tk");
				// 未登录
				if (!tokenString) {
					this.$toast('请先登录!');
					return this.$router.push({name: "Login"})
				}
				// 发起收藏的请求
				this.$toast.loading({
					message: "加载中...",
					forbidClick: true,
					duration: 0
				});
				// 获取商品规格
				let rule = this.detailData.rule.map(v => {
					return v.rules[v.ruleIndex];
				})
				rule = rule.join('/');
				this.axios({
					method: "POST",
					url: "/addShopcart",
					// 键名一致
					data: {
						appkey: this.appkey,
						pid: this.pid,
						tokenString,
						count: this.proCount,
						rule
					},
				}).then((res) => {
					this.$toast(res.data.msg);
					// 判断验证是否成功
					if (res.data.code === 700) {
						// token验证失败,返回登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 3000) {
						// 修改商品数量不需要增加购物袋数量
						if (res.data.status === 1) {
							this.ShopCount ++;
						}
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				})
		},
		// 查询购物车商品条目
		findShopCartCount () {
			let tokenString = localStorage.getItem("__tk");
				if (!tokenString) {
					return;
				}
				// 发起收藏的请求
				this.$toast.loading({
					message: "加载中...",
					forbidClick: true,
					duration: 0
				});
				this.axios({
					method: "GET",
					url: "/shopcartRows",
					// 键名一致
					params: {
						appkey: this.appkey,
						tokenString
					},
				}).then((res) => {
					// 判断验证是否成功
					if (res.data.code === 700) {
						// token验证失败,返回登录
						this.$router.push({name: "Login"});
					}else if (res.data.code === 8000) {
						this.ShopCount = res.data.result;
					}
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				})
		},
	}
};	
</script>

<style>
</style>
