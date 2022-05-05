<template>
  <div class="retrievePassword">
      <van-nav-bar 
      left-text="返回"
      right-text="先逛一逛"
      left-arrow
      @click-right="getHome">
        <template #left>
           <div class="nav-left">
               <div class="logo">logo</div>
               <div class="logo-text">Lickin Coffee</div>

           </div>
        </template>
      </van-nav-bar>
      <!-- User容器 -->
      <div class="User-box">
          <div class="welcome-box">
              <h2 class="User-title">忘记密码!</h2>
              <p class="user-welcome">forgot password!</p>
          </div>
          
        <!-- 表单 -->
        <van-form>
            <van-field
                v-model="userInfo.phone"
                name="手机号"
                label="手机号"
                placeholder="手机号"
            />
            <van-field
                v-model="userInfo.password"
                :type="loginpasswordShow? '': 'password'"
                name="密码"
                label="密码"
                placeholder="密码"
                :right-icon="loginpasswordShow ? 'eye-o': 'closed-eye'"
                @click-right-icon="loginpasswordShow =!loginpasswordShow"
            />
            <van-field
                v-model="userInfo.email"
                name="邮箱"
                label="邮箱"
                placeholder="邮箱"
            />
            <van-field
                v-model="userInfo.emailValidCode"
                name="邮箱验证码"
                label="邮箱验证码"
                placeholder="邮箱验证码"
            />
            <van-button type="info" class="yzm">发送验证码</van-button>
            
            <div class="forget">
                <span>已有账号，立即登录</span>
            </div>
            <div class="btn">
                <van-button round block type="info" color="#0b34ba" >提交</van-button>
            </div>
           
            </van-form>
      </div>
     
  </div>
</template>
<script>
// 引入less文件
import "../assets/less/retrievePassword.less";
export default {
    data(){
        return{
            registerShow:false,
            passwordShow:false,
            loginpasswordShow:false,
            userInfo:{
                phone:'',
                password:'',
                email:'',
                emailValidCode:''
            }
        }
    },
    methods:{
     
        getHome(){
            this.$router.push({name:'Home'})
        }
    }
};
</script>