<template>
  <div class="menu">
      <van-nav-bar right-text="按钮">
          <template> 
              <van-search placeholder="请输入搜索关键词">
          </template>
      </van-nav-bar>

      <!--  -->
      <div class="menu-box">
          <div class="menu-type">
              <div class="type-item" v-for="(item,index) in typeData" :key="index" @click="toggleType">
                  <div class="item-img">
                      <img :src="currentTypeIndex === index ? item.imgActive : item.img" alt="">
                  </div>
                  <div class="item-name" 
                       :class="currentTypeIndex === index ? 'active' : '' ">
                  
                    {{item.title}}</div>
              </div>
          </div>
          <!-- 商品内容 -->
          <div class="type-pro">
              <div class="pro-item" v-for="(item,index) in 10" :key="index">
                  <div class="type-pro-img">
                      <img src="" alt="">
                  </div>
                  <div class="type-pro-info clearflx">
                      <div class="fl">
                          <div class="info-name">焦糖玛奇朵</div>
                          <div class="info-enname">AAAAA</div>
                      </div>
                      <div class="fr price"> ￥28.00 </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import "../assets/less/menu.less"
export default {
    data() {
        return{
            currentTypeIndex:0,
            typeData:[
                {
                    title:"推荐",
                    img:requires("../assets/images/icon_07.gif"),
                    imgActive:required("../assets/images/icon_21.gif")
                },
                {
                    title:"拿铁",
                    img:requires("../assets/images/icon_05.gif"),
                    imgActive:required("../assets/images/icon_19.gif")
                },
                {
                    title:"咖啡",
                    img:requires("../assets/images/icon_03.gif"),
                    imgActive:required("../assets/images/icon_1.gif")
                },
                {
                    title:"瑞纳冰",
                    img:requires("../assets/images/icon_07.gif"),
                    imgActive:required("../assets/images/icon_20.gif")
                }
            ],
        }
    },
    created(){
        this.getType();
    },
    methods:{
        getType(){
            this.axios({
                method:"GET",
                url:"/type",
                params:{
                    appkey:this.appkey
                },
            })
            .then((res) => {
                console.log("res ==>", res);
            }).catch((err) => {
                console.log("err ==>", err);
            });
        },
        toggleType(index){
            this.currentTypeIndex = index;
        }
    }
}
</script>

<style>

</style>