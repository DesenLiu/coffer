<template>
  <div class="main">
    <div class="main-box">
      <router-view></router-view>
    </div>
    <van-tabbar route v-model="active" active-color="#e4be6b"> 
      <van-tabbar-item   v-for="(item , index) in tabberData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import '../assets/css/main.less'
export default {
  data() {
    return {
      active: 0,
      tabberData: [
        {
          title: "首页",
          icon: {
              active:require('../assets/images/label-active.png'),
              inactive: require("../assets/images/label.png"),
          },
          url:{
            name:'Label'
          }
        },
        {
          title: "咖啡",
          icon: {
              active:require('../assets/images/coffers-active.png'),
              inactive: require("../assets/images/coffers.png"),
          },
          url:{
            name:'Coffers'
          }
        },
        {
          title: "好店",
          icon: {
              active:require('../assets/images/like-active.png'),
              inactive: require("../assets/images/like.png"),
          },
          url:{
            name:'Like'
          }
        },
        {
          title: "我的",
          icon: {
              active:require('../assets/images/my-active.png'),
              inactive: require("../assets/images/my.png"),
          },
         url:{
            name:'My'
          }
        },
      ],
    };
  },
  methods: {
    // 跳转路由
    targetRouter(name){
      this.$router.push({name})
    }
  },
};
</script>

<style lang="less" scoped>
html {
  color: black;
  background-color: #fff;
}
</style>