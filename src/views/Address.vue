<template>
  <div class="address">
    <van-nav-bar title="提交订单" left-arrow :fixed="true" @click-left="$router.go(-1)"/>

    <div class="container">
      <div class="tog-btn clearfix">
        <div class="fl btn active">寄件</div>
        <div class="fl btn ml">自取</div>
      </div>

      <div class="one-box">
        <div class="address-info clearfix" v-if="addActive" @click="slideWin">
          <div class="address-icon fl">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
          <div class="user-info fl">
            <div class="add">{{currentAddress.address}}</div>
            <div class="info-center clearfix">
              <div class="fl name">{{currentAddress.name}}</div>
              <div class="fl pto">{{currentAddress.tel}}</div>
            </div>
          </div>
          <div class="right-icon fr">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>

        <div class="address-info" v-else>
          <div class="address-h clearfix" @click="slideWin">
            <div class="address-icon fl">
              <van-icon name="arrow" class="arrow-icon" />
            </div>
            <div class="address-text fl">请选择你的地址</div>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>

    <div class="shopBox">
      <div class="shop-item">
        <div class="item-top clearfix">
          <div class="fl item-icon">
            <img class="auto-img" :src="require('../assets/images/待配送.png')" alt />
          </div>
          <div class="fl item-title">订单待付款</div>
          <div class="fr item-right">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="item-content">
          <div class="total-count">共{{product.count}}件</div>
          <div class="item clearfix" v-for="(item , index) in shopbagData" :key="index">
            <div class="fl ruls">
              {{item.name}}
              <span class="r">{{item.rule}}</span>
            </div>
            <div class="fr count-box">
              <span class="count">*{{item.count}}</span>
            </div>
          </div>
          <div class="bottom clearfix">
            <div class="l-text fl">小计:</div>
            <div class="l-total fr">￥{{product.total}}</div>
          </div>
        </div>

        <!-- <div class="box">
          <div class="box-circle c1"></div>
          <div class="box-line"></div>
          <div class="box-circle c2"></div>
        </div>-->
      </div>
    </div>

    <div class="pay-btn">
      <div class="btnBot" @click="pay">确认付款</div>
    </div>
    <van-popup v-model="isOpen" position="bottom">
      <!-- <div class="address-title-box">选择收货地址</div> -->
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="selectAddress"
        @add="newAddress"
        @edit="edit"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/css/address.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      addActive: false,
      chosenAddressId: "",
      isOpen: false,
      list: [],
      currentAddress: {
        name: "",
        tel: "",
        address: "",
      },
      sids: [],
      product: {
        count: 0,
        total: 0,
      },
      shopbagData: [],
    };
  },
  methods: {
    edit(item){
      let aid = item.id;
      this.$router.push({name:'Newaddress',query:{aid}})
    },
    // 弹出选择地址框
    slideWin() {
      this.isOpen = true;
    },
    newAddress() {
      this.$router.push({
        name: "Newaddress",
      });
    },
    selectAddress(item, index) {
      this.isOpen = false;
      for (let k in this.currentAddress) {
        this.currentAddress[k] = item[k];
      }

      this.addActive = true;
    },
    findAddress() {
      let token = localStorage.getItem("_token");
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          // 
          if (result.data.code == 20000) {
            result.data.result.map((v) => {
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault),
              });

              if (Boolean(v.isDefault)) {
                this.chosenAddressId = v.aid;
                this.currentAddress.address =
                  v.province + v.city + v.county + v.addressDetail;
                this.currentAddress.name = v.name;
                this.currentAddress.tel = v.tel;
                this.addActive = true;
              }
            });
          }
        })
        .catch((err) => {
          
        });
    },
    // 根据sid获取购物袋数据
    getShopbagDataBySids() {
      //获取token字符串
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString: token,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          // 
          if (result.data.code == 50000) {
            result.data.result.map((v) => {
              this.product.count += v.count;
              this.product.total += v.count * v.price;
            });

            this.shopbagData = result.data.result;
            // 
          }
        })
        .catch((err) => {
          
        });
    },
    // 立即付款
    pay() {
      // 判断是否选择地址
      if (!this.chosenAddressId) {
        this.$toast("请选择收货地址");
        return;
      }

      let token = localStorage.getItem("_token");

      if (!token) {
        return;
      }

      // 参数序列化
      let data = utils.quertString({
        appkey: this.appkey,
        tokenString: token,
        sids: JSON.stringify(this.sids),
        phone: this.currentAddress.tel,
        address: this.currentAddress.address,
        receiver: this.currentAddress.name,
      });

      // 

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          // 
          if (result.data.code == 60000) {
            this.$router.push({ name: "Order" });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
  created() {
    // 
    this.sids = this.$route.query.sids.split("-");

    this.findAddress();
    this.getShopbagDataBySids();
  },
};
</script>

<style lang="less" scoped>
</style>