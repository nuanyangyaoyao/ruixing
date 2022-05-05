<template>
	<div class="login">
		<!-- 导航栏 -->
		<van-nav-bar left-text="返回" right-text="先逛一逛" left-arrow @click-right="goHome">
			<template #left>
				<div>
					<div class="logo">logo</div>
					<div class="logo-text">Luckin Coffee</div>
				</div>
			</template>
		</van-nav-bar>
		<!-- User容器 -->
		<div class="User-box">
			<div class="welcome-box">
				<h2 class="User-title">欢迎回来</h2>
				<p class="User-welcome">Please login to your accounts</p>
			</div>
			<!-- 表单 -->
			<van-form>
				<van-field v-model="userInfo.phone" name="手机号" label="手机号" placeholder="手机号" />	
				<van-field v-model="userInfo.password" name="密码" :type="loginpasswordShow ? '' : 'password'" label="密码" placeholder="密码" :right-icon="loginpasswordShow ? 'eye-o' : 'closed-eye'" @click-right-icon="loginpasswordShow = !loginpasswordShow" />
				<div class="forget" @click="$router.push({name: 'Forgetpsw'})">
					<span>忘记密码?</span>
				</div>
				<div class="btn">
					<van-button round block type="info" color="#0b34ba" @click="Userlogin">登录</van-button>
				</div>
				<div class="btn" @click="registerShow = true">
					<van-button round block type="default">注册</van-button>
				</div>
			</van-form>
			<!-- 注册 -->
			<van-popup v-model="registerShow" closeable position="bottom">
				<div class="register-title">注册</div>
				<!-- 注册的表单 -->
				<van-form>
					<van-field v-model="registerInfo.phone" name="手机号" label="手机号" placeholder="11位手机号" />
					<van-field v-model="registerInfo.nickName" name="昵称" label="昵称" placeholder="1~10位昵称" />
					<van-field v-model="registerInfo.password" name="密码" :type="passwordShow ? '' : 'password'" label="密码" placeholder="6~16位密码且以字母开头" :right-icon="passwordShow ? 'eye-o' : 'closed-eye'" @click-right-icon="ispsw" />
					<div class="btn">
						<van-button round block type="info" color="0b34ba" @click="validRegister">注册</van-button>
					</div>
				</van-form>
			</van-popup>
		</div>
	</div>
</template>

<script>
// 引入less文件
import '../assets/less/login.less';
// 引入验证表单
//import vaildForm from '../validFrom/vaildForm.js';
import { Toast } from 'vant';
export default {
	data () {
		return {
			// 注册弹出层(true出现 false消失)
			registerShow: false,
			// 注册密码显示隐藏
			passwordShow: false,
			// 登录密码隐藏显示
			loginpasswordShow: false,
			// 用户登录信息
			userInfo: {
				phone: "",
				password: "",
			},
			// 用户注册的信息
			registerInfo: {
				phone: "",
				nickName: "",
				password: ""
			}
		};
	},
	methods: {
		ispsw () {
			this.passwordShow = !this.passwordShow;
		},
		validate(o) {
			console.log('验证表单', o);
			for (let key in o) {
				console.log('key', key);
				console.log('o[key]', o[key]);
				// 判断对应的value是否匹配
				// o[key].reg  正则表达式(验证value是否匹配)
				if (!o[key].reg.test(o[key].value)) {
					// 验证失败
					this.$toast.fail(o[key].errorMsg);
					return false;
				}
			}
			// 验证通过
			return true;
		},
		// 验证表单信息是否符合要求
		validRegister () {
			// 构造表单验证信息
			let o = {
				// 验证手机号码
				phone: {
					// 获取注册输入手机文本
					value: this.registerInfo.phone,
					errorMsg: '手机格式错误',
					reg: /^1[3-9]\d{9}$/
				},
				// 验证昵称
				nickName: {
					// 获取注册输入昵称文本
					value: this.registerInfo.nickName,
					errorMsg: '昵称格式错误',
					// 中文匹配[\u4e00-\u9fa5]
					reg: /^[\u4e00-\u9fa5]{1,10}$/
				},
				// 验证密码
				password: {
					// 获取注册输入密码文本
					value: this.registerInfo.password,
					errorMsg: '密码格式错误',
					reg: /^[A-Za-z]\w{5,15}$/
				}
			};
			// 拷贝一份用户注册的信息
			let userInfo = Object.assign({}, this.registerInfo)
			userInfo.appkey = this.appkey;
			// 验证格式是否正确发起请求
			if (this.validate(o)) {
				this.axios({
					// 请求类型
					method: "POST",
					// 请求路径
					url: "/register",
					data: userInfo
				}).then(res => {
					this.registerShow = false;
					this.$toast(res.data.msg);
				}).catch(err => {
					
				})
			}
			this.validate(o);
		},
		// 用户登录
		Userlogin () {
			// 拷贝数据
			let o = {
				// 验证手机号码
				phone: {
					// 获取注册输入手机文本
					value: this.userInfo.phone,
					errorMsg: '手机格式错误',
					reg: /^1[3-9]\d{9}$/
				},
				// 验证密码
				password: {
					// 获取注册输入密码文本
					value: this.userInfo.password,
					errorMsg: '密码格式错误',
					reg: /^[A-Za-z]\w{5,15}$/
				}
			};
			// 拷贝一份用户注册的信息
			let userInfo = Object.assign({}, this.userInfo)
			userInfo.appkey = this.appkey;
			// 验证格式是否正确发起请求
			if (this.validate(o)) {
				this.axios({
					// 请求类型
					method: "POST",
					// 请求路径
					url: "/login",
					// 键名要一致
					data: userInfo
				}).then(res => {
					if (res.data.code === 200) {
						// 为了下次登录不用输入账号密码, 自动登录
						localStorage.setItem('__tk', res.data.token)
					}
					this.$toast(res.data.msg);
					this.$router.push({name: "Home"});
				}).catch(err => {
					
				});
			}
		},
		// 跳转首页
		goHome () {
			this.$router.push({name: "Home"});
		}
	},
};	
</script>

<style>
</style>
