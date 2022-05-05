<template>
  <div class="menu">
    <van-nav-bar right-text="按钮" fixed>
      <template #right>
        <van-search placeholder="请输入搜索关键词" />
      </template>
    </van-nav-bar>
    <!--  -->
    <div class="menu-box">
      <!-- 商品类型 -->
      <div class="menu-type">
       <div class="clearflx menu-item-box">
          <div class="type-item fl" v-for="(item,index) in typeData" :key="index" @click="toggleType(index,item.type)">
          <div class="item-img">
            <img :src="currentTypeIndex === index ? item.imgActive : item.img" />
          </div>
          <div class="item-name" :class="currentTypeIndex === index ? 'active' : ''">{{item.title}}</div>
        </div>
       </div>
      </div>
      <!-- 商品内容 -->
      <div class="type-pro">
        <div class="pro-item" v-for="(item,index) in typepro" :key="index" 
        @click="$router.push({name:'Detail',params:{pid:item.pid}})">
          <div class="type-pro-img">
            <img class="auto-img" :src="item.largeImg" alt="">
          </div>
          <div class="type-pro-info clearflx">
            <div class="fl">
              <div class="info-name">{{item.name}}</div>
              <div class="info-ennmae">{{item.enname}}</div>
            </div>
            <div class="fr price">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
  data(){
    return{
      currentTypeIndex:0,
      typeData:[
        {
          title:"推荐",
          img:require("../assets/images/icons_09.gif"),
          imgActive:require("../assets/images/icons_21.gif"),
          key:"isHot",
          type:1,
        },
        {
          title:"拿铁",
          img:require("../assets/images/icons_05.gif"),
          imgActive:require("../assets/images/icons_19.gif"),
        },
        {
          title:"咖啡",
          img:require("../assets/images/icons_03.gif"),
          imgActive:require("../assets/images/icons_18.gif"),
        },
        {
          title:"瑞纳冰",
          img:require("../assets/images/icons_07.gif"),
          imgActive:require("../assets/images/icons_20.gif"),
        },
        ],
      typepro:[],
    }
  },
  created(){
    this.getType();
    this.toggleType(0,'isHot');
  },
  methods:{
    getType(){
      this.axios({
        // 请求类型
        method: "GET",
        // 请求路径
        url: "/type",
        // 键名一定要一致
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          this.typeData.map(v=>{
              for(let i = 0; i<res.data.result.length; i++){
              if(res.data.result[i].typeDesc === v.title){
              v.type = res.data.result[i].type;
            }         
          }
          })
          
        })
        .catch((err) => {
        });
    },
    // 切换类型
    toggleType(index,value){
      this.currentTypeIndex = index;
      this.axios({
        // 请求类型
        method: "GET",
        // 请求路径
        url: "/typeProducts",
        // 键名一定要一致
        params: {
          appkey: this.appkey,
          key: value == 1 ?'isHot':'type',
          value
        },
      })
        .then((res) => {
          if(res.data.code === 500){
            this.typepro = res.data.result;
          }
        })
        .catch((err) => {
        });
    }
  }
};
</script>