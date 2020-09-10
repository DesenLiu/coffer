<template>
  <div class="like">
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      :right-text="text?'编辑':'取消'"
      @click-right="onToggle"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div v-if="shopData.length > 0">
      <div class="goods">
        <div class="goods-item" v-for="(item , index) in shopData" :key="index">
          <van-swipe-cell>
            <div class="cell clearfix">
              <div class="fl check">
                <van-checkbox
                  v-model="item.isCheck"
                  icon-size="24px"
                  checked-color="#e4be6b"
                  @change="simpleSelect(item)"
                ></van-checkbox>
              </div>
              <div class="fl cell-img">
                <img class="auto-img" :src="item.small_img" alt />
              </div>
              <div class="fl cell-text">
                <div class="text-top">{{item.name}}</div>
                <div class="text-center">{{item.rule}}</div>
                <div class="text-bottom clearfix">
                  <div class="text-price fl">￥{{item.price}}</div>
                  <div class="text-count fr">
                    <van-stepper
                      v-model="item.count"
                      theme="round"
                      button-size="22"
                      disable-input
                      @change="changeCount(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="removeOne(item.sid,index)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <van-submit-bar :price="total"  button-text="提交订单" v-if="text" @submit="commit">
        <van-checkbox  v-model="checkedAll" checked-color="#e4be6b" @click="allCheck">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar @submit="removeAll" button-text="删除订单" v-else>
        <van-checkbox v-model="checkedAll" class="ml" checked-color="#e4be6b" @click="allCheck">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <div v-else>
      <van-empty description="快去挑选你心仪的咖啡吧~" :image="require('../../assets/images/bg.png')">
        <van-button round type="danger" class="bottom-button" @click="$router.push({name:'Coffers'})">去看看</van-button>
      </van-empty>

    </div>
  </div>
</template>

<script>
import "../../assets/css/like.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      value: 1,
      text: true,
      // 购物车数据
      shopData: [],
      total: 0,
      checkedAll: false,
    };
  },
  created() {
    this.findShopbag();
 
  },
  methods: {
    commit(){
      let sids = [];
      this.shopData.map(( v, i) => {
        if(v.isCheck){
          sids.push(v.sid)
        }
      })

      sids = sids.join('-');

      this.$router.push({name: 'Address', query: {sids}});
    },
    onToggle() {
      this.text = !this.text;
    },
    // 查询购物车数据
    findShopbag() {
      // 获得token字符串
      let tokenString = localStorage.getItem("_token");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isCheck = false;
            });
            this.shopData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    // 全选
    allCheck() {
      this.shopData.map((v) => {
        v.isCheck = this.checkedAll;
      });

      this.allMoney();
    },
    // 单选
    simpleSelect() {
      this.allMoney();
      for (let i = 0; i < this.shopData.length; i++) {
        if (!this.shopData[i].isCheck) {
          this.checkedAll = false;
          return;
        }
      }
      this.checkedAll = true;
    },
    //修改商品数量
    changeCount(item) {
      let token = localStorage.getItem("_token");
      if (!token) {
        reutrn;
      }

      // 参数序列化
      let data = utils.quertString({
        appkey: this.appkey,
        tokenString: token,
        sid: item.sid,
        count: item.count,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          this.allMoney();
          
          if (result.data.code !== 6000) {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    // 删除 购物车数据
    removeShop(sids) {
      let token = localStorage.getItem("_token");
      let o = {
        appkey: this.appkey,
        tokenString: token,
        sids: JSON.stringify([sids]),
      };

      let data = utils.quertString(o);

      return this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data,
      });
    },

    // 单个购物袋
    removeOne(sid, index) {
      this.removeShop([sid])
        .then((result) => {
          // 

          if (result.data.code == 7000) {
            this.shopData.splice(index, 1);
            this.allMoney();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          
        });
    },
    //删除多个
    removeAll() {
      let sids = [];
      this.shopData.map((v) => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      this.removeShop(sids)
        .then((result) => {
          
          if (result.data.code == 7000) {
            for (let i = this.shopData.length - 1; i >= 0; i--) {
              if (this.shopData[i].isCheck) {
                this.shopData.splice(i, 1);
              }
            }
            this.allMoney();
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          
        });
    },
    // 计算价格
    allMoney() {
      let sum = 0;
      this.shopData.map((v) => {
        if (v.isCheck) {
          sum += Number(v.count * v.price);
        }
      });
      
      this.total = sum * 100;
    },
   
  },
};
</script>

<style lang="less" scoped>
</style>