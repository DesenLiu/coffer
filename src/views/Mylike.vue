<template>
  <div class="mylike">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="$router.push({name:'My'})" />
    <div class="order-box clearfix" v-if="likeData.length > 0">
      <div class="order-item" :class="index % 2 == 0 ? 'fl' : 'fr'" v-for="(item , index) in likeData" :key="index">
        <div class="item-img" @click="viewProductInfo(item.pid)">
          <img class="auto-img" :src="item.smallImg" alt />
        </div>
        <div class="item-text">
          <div class="text-title">{{item.name}}</div>
          <div class="text-ename">{{item.enname}}</div>
        </div>
        <div class="clearfix">
            <div class="fl price">￥{{item.price}}</div>
            <div class="fr del-icon" @click="removeLike(item.pid , index)">
                <van-icon name="delete" size="20px"/>
            </div>
        </div>
      </div>

     
    </div>
    <div v-else>
        <van-empty description="收藏商品空空如也，去逛一逛!">
          <van-button round color="#e4be6b" class="bottom-button" @click="goLabel">
            去逛一逛
          </van-button>
        </van-empty>
      </div>
  </div>
</template>

<script>
import "../assets/css/mylike.less";
import {utils} from '../assets/js/utils'
export default {
  data() {
    return {
      // 我的收藏数据
      likeData:[],
    }
  },
  methods: {
    back(){
      this.$router.go(-1);
    },
    goLabel(){
      this.$router.push({name:'Label'})
    },
    // 获取我的收藏数据
    getAllLikeData(){
      let token = localStorage.getItem('_token');
      if(!token){
        return this.$router.push({name:'Login'});
      }

       this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method:'GET',
        url:'/findAllLike',
        params:{
          appkey:this.appkey,
          tokenString:token
        }
      }).then(result => {
        this.$toast.clear();
        
        if(result.data.code == 2000){
          this.likeData = result.data.result;
        }
      }).catch(err => {
        this.$toast.clear();
        
      })


    },
    // 取消收藏
    removeLike(pid , index){
      let token = localStorage.getItem('_token');
      if(!token){
        return;
      }
      
      let data = utils.quertString({
        appkey:this.appkey,
        tokenString:token,
        pid
      })

      this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method:'POST',
          url:'/notlike',
          data
        }).then(result => {
          
          if(result.data.code == 700){
            return this.$router.push({name:'Login'});
          }

          if(result.data.code == 900){
            this.likeData.splice(index , 1);
            this.$toast('删除收藏商品成功');
          }else{
            this.$toast('删除收藏商品失败');
          }
        }).catch(err => {
          
        })
      
    },
    // 商品详情
    viewProductInfo(pid){
      this.$router.push({name:'Detail',query:{
        pid
      }})
    }
  },

  created() {
    this.getAllLikeData();
  },
};
</script>

<style lang="less" scoped>
</style>