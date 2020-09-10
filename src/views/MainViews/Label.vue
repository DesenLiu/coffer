<template>
  <div class="label">
    <van-nav-bar title="+Cafe" class="navbarTitle">
      <template #right>
        <van-icon name="search" size="18" @click="$router.push({name:'Search'})"/>
      </template>
    </van-nav-bar>

    <div class="container">
      <!-- 轮播图 -->
      <div class="banner">
        <div class="banner-title clearfix">
          <div class="title-text fl">今日推荐</div>
          <div class="countTotal fr">
            <span class="count">{{count}}</span>/4
          </div>
        </div>
        <div class="banner-img">
          <div class="ban">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" @change="onIndex">
              <van-swipe-item v-for="(item , index) in bannerData" :key="index">
                <img class="auto-img" :src="item.bannerImg" alt="">
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
        <div class="banner-text">
          <div class="banner-ttop">
            精品咖啡种类及特点介绍 | Specialty Coffee
          </div>
          <div class="banner-des">
            <div class="des-left fl"> Specialty Coffee是1974年由努森女士提出来的概念</div>
            <div class="des-right fr">今日讲座</div>
          </div>
        </div>
      </div>
      <!-- 介绍 -->
      <div class="introduce">
        <div class="introduce-title">
          <h3>识货,能品,有格调</h3>
        </div>
        <div class="introify">
          <div v-for="(item , index) in introduce" :key="index">
            <div class="intro-img">
              <img class="auto-img" :src="item.url" alt="">
            </div>
            <div class="text">{{item.text}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/label.less";
export default {
  data() {
    return {
      count: 1,
      // banner图数据
      bannerData:[],
      // introduce图标数据
      introduce:[
        {
          url:require('../../assets/images/1.png'),
          text:'咖啡品牌'
        },
        {
          url:require('../../assets/images/2.png'),
          text:'咖啡文化'
        },
        {
          url:require('../../assets/images/3.png'),
          text:'咖啡制作'
        },
        {
          url:require('../../assets/images/4.png'),
          text:'咖啡知识'
        }
      ]
    };
  },
  methods: {
    // 接口获取banner数据
    getBanner(){
      // 判断是否有缓存值
      let data = sessionStorage.getItem('bannerData');
      if(data){
        this.bannerData = JSON.parse(data);
        return;
      }


      this.axios({
        method:'GET',
        url:'/banner',
        params:{
          appkey:this.appkey
        }
      }).then(result => {
        
        if(result.data.code == 300){
          
          this.bannerData = result.data.result;
          sessionStorage.setItem('bannerData',JSON.stringify(result.data.result));
        }
      }).catch(err =>{
        
      })
    },
    // 监听轮播图索引
    onIndex(index){
      this.count = index + 1
    }
  },
  created() {
    // 调用banner接口
    this.getBanner();


  },
};
</script>

<style lang="less" scoped>
html {
  background-color: white;
}
</style>