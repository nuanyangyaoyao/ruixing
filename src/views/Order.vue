<template>
	<div class="order">
		<!-- 导航栏 -->
		<van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="$router.back()" fixed></van-nav-bar>
		<div class="order_bg"></div>
		<!-- 订单状态 -->
		<div class="order_box">
			<div class="order-type">
				<!-- 头部 -->
				<div class="clearflx order-item-box">
					<div class="type-item fl" v-for="(item, index) in typeData" :key="index" @click="toggleType(index, item.type)">
						<div class="item-name" :class="currentTypeIndex === index ? 'active' : ''">{{item.title}}</div>
					</div>
				</div>
				<!-- 订单信息 -->
				<van-cell title="订单号" value="已完成">
				  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
				  <template #right-icon>
				    <van-icon name="delete-o" size="24px" />
				  </template>
				</van-cell>
				<div class="order-info">
					<div class="pro-item" v-for="(item, index) in 2" :key="index">
						<!-- disabled为true禁用滑动 -->
						<div class="item-box">
							<div class="item-right">
								<div class="right-content">
									<div class="right-img">
										<img class="auto-img" src="" alt="" >
									</div>
									<div class="right-info">
										<div class="info-box">
											<div class="info-text">
												<div class="info-name">{{  }}</div>
												<div class="info-rule">{{  }}</div>
											</div>
											<div class="info-enname">{{  }}</div>
											<div class="price-box clearflx">
												<div class="price fl">￥{{  }}</div>
												<div class="fr"><span>x</span>2</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 结算 -->
				<div class="order-sum clearflx">
					<div class="sum-date">2021-11-13 11:04:54</div>
					<div class="fl">共计: {{}}件商品</div>
					<div class="sum fr">合计: ￥{{}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import "../assets/less/order.less"	
export default {
	data() {
		return {
			currentTypeIndex: 0,
			// 收藏商品信息
			orderInfo: [],
			typeData: [{
				title: '全部'
			},{
				title: '已完成'
			},{
				title: '进行中'
			}]
		}
	},
	created() {
		
	},
	methods:{
		
	}
}
</script>

