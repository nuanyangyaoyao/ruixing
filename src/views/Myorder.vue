<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <div class="orderbz">
      <div class="order-box">
        <div class="card">
          <van-tabs v-model="active">
            <van-tab title="标签 1">
              <div class="pay-info-box">
                <div class="pay-title">订单信息</div>
                <div class="pay-info">
                  <div
                    class="pro-item"
                    v-for="(item, index) in orderInfo"
                    :key="index"
                  >
                    <div class="item-box">
                      <div class="item-right">
                        <div class="right-content">
                          <div class="right-img">
                            <img
                              class="auto-img"
                              src=""
                              alt=""
                            />
                            <!-- :src="item.large_img" -->
                          </div>
                          <div class="right-info">
                            <div class="info-box">
                              <div class="info-text">
                                <div class="info-name"> item.name </div>
                                <div class="info-rule"> item.rule </div>
                              </div>
                              <div class="info-enname"> item.enname </div>
                              <div class="price-box clearflx">
                                <div class="price fl">￥ item.price </div>
                                <div class="fr">
                                  <span>x</span>item.count 
                                </div>
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
                  <div class="fl">共计 allCount 件商品</div>
                  <div class="sum fr">合计￥ allPrice | decimal </div>
                </div>
              </div>
            </van-tab>
            <van-tab title="标签 2">内容 2</van-tab>
            <van-tab title="标签 3">内容 3</van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/order.less";
export default {
  data() {
    return {
      active: 0,
      orderInfo:[]
    };
  },  
  created() {
    this.findOrder();
  },
  methods:{
     findOrder(){
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
					url: "/findOrder",
					params: {
						appkey: this.appkey,
						tokenString,
            status:this.status
					},
				})
        .then((res) => {
          this.$toast.clear();
					if (res.data.code === 700) {
            // this.$toast(res.data.msg);
						this.$router.push({name: "Login"});
				 }
          //else if (res.data.code === 70000) {
          //   res.data.result.map(v=>{
          //     this.allPrice += v.price * v.count;
          //     this.allCount +=  v.count;
          //   })
					// 	this.payInfo = res.data.result;
					// }
				}).catch((err) => {
					// 关闭加载提示
					this.$toast.clear();
				});
    },
  }
};
</script>

<style>
</style>