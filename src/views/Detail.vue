<template>
  <div class="detail">
    <van-nav-bar :title="detailData.name" left-arrow :fixed="true" @click-left="goBack" />
    <div class="bannerImg">
      <img class="auto-img" :src="detailData.large_img" alt />

      <div class="bannerImgBox">{{detailData.name}}</div>
    </div>
    <div class="des">
      <div class="des-text">{{detailData.desc}}</div>
      <div class="name clearfix">
        <div class="names fl">
          ￥:
          <span>{{detailData.price}}</span>
        </div>
        <div class="name-date fr">
          <van-stepper v-model="value" theme="round" button-size="22" disable-input />
        </div>
      </div>
    </div>

    <div class="detail-info">
      <div class="rule-box">
        <div class="rule-item clearfix" v-for="(item , index) in detailData.rules" :key="index">
          <div class="fl rule-item-title">{{item.title}}</div>
          <div class="fl clearfix">
            <div
              class="fl rule-item-tag"
              v-for="(v ,i ) in item.rules"
              :key="i"
              :class="{active:v.isActive}"
              @click="toggleRule(v,index)"
            >{{v.title}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ulike">
      <div class="ulike-name">猜你喜欢</div>
      <div class="ulike-item clearfix" v-for="(item , index ) in ulikeData" :key="index">
        <div class="fl like-left">
          <img :src="item.urls" alt class="auto-img" />
        </div>
        <div class="fl like-right">
          <div class="like-text">{{item.desc}}</div>
          <div class="content">
            <div class="browse fl">
              <div class="browse-icon fl">
                <img class="auto-img" src="../assets/images/b.png" alt />
              </div>
              <div class="browse-text fl">{{item.browseCount}}</div>
            </div>
            <div class="collection fl">
              <div class="collection-icon fl">
                <img class="auto-img" src="../assets/images/sc-active.png" alt />
              </div>
              <div class="collection-text fl">{{item.likeCount}}</div>
            </div>
            <div class="share fr">
              <div class="share-icon">
                <img class="auto-img" src="../assets/images/分享.png" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="goods-action">
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" />
        <van-goods-action-icon icon="cart-o" text="购物车" :badge="total == 0? '':total" @click="goName"/>
        <van-goods-action-icon
          :icon="isLike? 'star':'star-o'"
          text="收藏"
          color="#ff5000"
          @click="like"
        />
        <van-goods-action-button type="warning" text="加入购物车" @click="addShop" />
        <van-goods-action-button type="danger" text="立即购买" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/css/detail.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      // 详情页数据
      detailData: {},
      pid: "",
      value: 1,
      count: 0,
      ulikeData: [
        {
          urls: require("../assets/images/1.jpg"),
          desc:
            "访问: 咖啡师需要学多久 如何成为一名咖啡师 学咖啡师需要什么条件",
          browseCount: 1700,
          likeCount: 2000,
        },
        {
          urls: require("../assets/images/2.jpg"),
          desc:
            "访问: 咖啡师需要学多久 如何成为一名咖啡师 学咖啡师需要什么条件",
          browseCount: 1630,
          likeCount: 2460,
        },
        {
          urls: require("../assets/images/3.jpg"),
          desc:
            "访问: 咖啡师需要学多久 如何成为一名咖啡师 学咖啡师需要什么条件",
          browseCount: 1820,
          likeCount: 2640,
        },
        {
          urls: require("../assets/images/4.jpg"),
          desc:
            "访问: 咖啡师需要学多久 如何成为一名咖啡师 学咖啡师需要什么条件",
          browseCount: 1770,
          likeCount: 2500,
        },
      ],
      isLike: false,
      total: 0,
    };
  },
  methods: {
    // 返回上一步
    goBack() {
      this.$router.go(-1);
    },
    goName(){
      this.$router.push({name:'Like'})
    },
    //   获取商品详情
    getDetailData(pid) {
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid,
        },
      })
        .then((result) => {
          // 

          if (result.data.code == 600) {
            //   处理商品描述数据 分成行
            // result.data.result[0].desc = result.data.result[0].desc.split(/\n/);

            let ruleItems = ["tem", "sugar", "cream", "milk"];

            let rulesData = [];

            ruleItems.map((v) => {
              // 判断不存在值的时候跳过
              if (result.data.result[0][v] == "") {
                return;
              }

              let rule = {
                title: result.data.result[0][v + "_desc"],
                rules: [],
              };

              let r = result.data.result[0][v].split("/");

              r.map((value, index) => {
                let o = {
                  title: value,
                  isActive: index == 0,
                };
                rule.rules.push(o);
              });

              rulesData.push(rule);
            });
            result.data.result[0].rules = rulesData;
            this.detailData = result.data.result[0];
          }
        })
        .catch((err) => {
          
        });
    },
    // 规格切换
    toggleRule(v, index) {
      if (v.isActive) {
        return;
      }
      let ruleData = this.detailData.rules[index].rules;
      for (let i = 0; i < ruleData.length; i++) {
        if (ruleData[i].isActive) {
          ruleData[i].isActive = false;
          break;
        }
      }
      v.isActive = true;
    },
    // 收藏
    like() {
      let token = localStorage.getItem("_token");
      
      if (!token) {
        return;
      }
      let o = {
        appkey: this.appkey,
        pid: this.pid,
        tokenString: token,
      };

      let url = this.isLike ? "/notlike" : "/like";

      let data = utils.quertString(o);
      this.axios({
        method: "POST",
        url,
        data,
      })
        .then((result) => {
          
          if (result.data.code == 800) {
            this.isLike = true;
            this.$toast(result.data.msg);
          }
          if (result.data.code == 900) {
            this.isLike = false;
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    // 加入购物车
    addShop() {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }
      // 规格
      let rules = this.detailData.rules;

      let rule = [];
      rules.map(v => {
        for(let i = 0 ; i < v.rules.length;i++){
          if(v.rules[i].isActive){
            rule.push(v.rules[i].title);
            break;
          }
        }
      })
      let o = {
        pid: this.pid,
        count: this.value,
        rule: rule.join("/"),
        appkey: this.appkey,
        tokenString: token,
      };
      
      let data = utils.quertString(o);
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          // 
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              this.findShop();
            }
            
            
          }
        })
        .catch((err) => {
          
        });
    },
    // 获取购物车的数据
    findShop() {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params:{
          appkey:this.appkey,
          tokenString:token
        }
      })
        .then((result) => {
          // 
          if(result.data.code == 5000){
              this.total = result.data.result.length 
          }
          
        })
        .catch((err) => {
          
        });
    },
    // 获取收藏
    getSc(){
      let token = localStorage.getItem('_token');
      if(!token){
        return;
      }
      this.axios({
        method:'GET',
        url:'/findlike',
        params:{
          appkey:this.appkey,
          pid:this.pid,
          tokenString:token
        }
      }).then(result => {
        // 
         if (result.data.code == 1000) {
            if (result.data.result.length == 1) {
              this.isLike = true;
            }
          }
      }).catch(err => {
        
      })
    }
  },
  created() {
    this.pid = this.$route.query.pid;
    this.getDetailData(this.pid);

    // 查询购物车
    this.findShop();

    // 查询收藏
    this.getSc();
  },
};
</script>

<style lang="less" scoped>
</style>