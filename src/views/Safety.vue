<template>
	<div class="safety">
		<!-- 导航栏 -->
		<van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="$router.back()" fixed></van-nav-bar>
		<div class="safety-bg"></div>
		<div class="safety-box">
			<van-cell title="修改密码" is-link @click="passShow = !passShow" />
			<van-cell title="注销账号" is-link @click="destroyAccount" />
		</div>
		<van-button type="primary" color="#0b34ba" size="large" @click="logout">退出登录</van-button>
		<van-popup v-model="passShow" closeable position="bottom" :style="{ height: '30%' }">
			<div class="security-title">修改密码</div>
			<van-form>
				<van-field v-model="oldPassword" type="password" name="旧密码" label="旧密码" placeholder="6-16位密码且以字母开头" :right-icon="passwordShow ? 'eye-o' : 'closed-eye'" @click-right-icon="ispsw" />
				<van-field v-model="password" type="password" name="新密码" label="新密码" placeholder="6-16位密码且以字母开头" :right-icon="passwordShow ? 'eye-o' : 'closed-eye'" @click-right-icon="ispsw" />
				<div class="btn">
					<van-button round block type="info" color="#0b34ba" @click="updatePassword">修改密码</van-button>
				</div>
			</van-form>
		</van-popup>
		<div class="btn"></div>
	</div>
</template>

<script>
import "../assets/less/safety.less"
export default {
	data() {
		return {
			passShow: false,
			passwordShow: true,
			oldPassword: "",
			password: "",
		}
	},
	created() {
		
	},
	methods: {
	    ispsw() {
	      this.passwordShow = !this.passwordShow;
	    },
	    updatePassword() {
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
	        method: "POST",
	        url: "/updatePassword",
	        data: {
	          appkey: this.appkey,
	          tokenString,
	          oldPassword: this.oldPassword,
	          password: this.password,
	        },
	      }).then((res) => {
	          this.$toast.clear();
	          if (res.data.code === 700) {
	            this.$toast(res.data.msg);
	            this.$router.push({ name: "Login" });
	            // }else if(res.data.code === 'B001') {
	            //               this.myinfo = res.data.result[0];
	          }
	          this.$toast(res.data.msg);
	            this.$router.push({ name: "Login" });
	
	        }).catch((err) => {
	          // 关闭加载提示
	          this.$toast.clear();
	        });
	    },
	    logout() {
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
	        method: "POST",
	        url: "/logout",
	        data: {
	          appkey: this.appkey,
	          tokenString,
	        },
	      }).then((res) => {
	          this.$toast.clear();
	          if (res.data.code === 700) {
	            this.$toast(res.data.msg);
	          }
	          this.$toast(res.data.msg);
	            this.$router.push({ name: "Login" });
	        }).catch((err) => {
	          // 关闭加载提示
	          this.$toast.clear();
	        });
	    },
	    destroyAccount() {
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
	        method: "POST",
	        url: "/destroyAccount",
	        data: {
	          appkey: this.appkey,
	          tokenString,
	        },
	      }).then((res) => {
	          this.$toast.clear();
	          if (res.data.code === 700) {
	            this.$toast(res.data.msg);
	            // this.$router.push({ name: "Login" });
	          }
	          this.$toast(res.data.msg);
	            this.$router.push({ name: "Login" });
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
