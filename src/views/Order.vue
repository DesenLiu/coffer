<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="$router.push({name:'My'})"/>
    <div class="order-bg"></div>
    <div class="tab-box">
      <van-tabs class="tabs-box" v-model="active" @change="toggleStatus">
        <van-tab :title="value.title" v-for="(value , idex) in tabltems" :key="idex">
          <div v-if="orderDatas.length > 0">
            <div class="tab-item" v-for="(item , index) in orderDatas" :key="index">
              <div class="tab-item-box clearfix">
                <div class="fl no">{{item.orderId}}</div>
                <div class="fr">
                  <div class="text" v-if="item.status == 1" @click="confirmReceive(item,index)">确认收货</div>
                  <div class="text-box-tab" v-else>
                    <div class="finished">已完成</div>
                    <div class="remove" @click="removeOrder(item.orderId,index)">
                      <van-icon name="delete" size="20px"/>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 商品列表 -->
              <div class="order-box">
                <div class="clearfix cell-box" v-for="(v , i) in item.products" :key="i">
                  <div class="pro-img fl">
                    <img class="auto-img" :src="v.smallImg" alt />
                  </div>
                  <div class="pro-info fl">
                    <div class="text-box">
                      <div class="clearfix">
                        <div class="text-name fl">{{v.name}}</div>
                        <div class="text-rule fl">{{v.rule}}</div>
                      </div>
                      <div class="enname">{{v.enname}}</div>
                    </div>
                    <div class="price-box">
                      <div class="fl price">￥{{v.price}}</div>
                      <div class="fr count">x{{item.count}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 总价 -->
              <div class="pro-box">
                <div class="pro-boxing">
                  <div class="date">{{item.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                  <div class="clearfix">
                    <div class="fl pro-count">共计{{item.count}}件商品</div>
                    <div class="fr pro-total">合计￥{{item.total}}</div>
                  </div>
                </div>
                <div class="left-box left"></div>
                <div class="left-box right"></div>
              </div>
            </div>
          </div>
          <div v-else></div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/css/order.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      active: 0,
      orderDatas: [],
      tabltems: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],
    };
  },
  created() {
    this.getOrderData(0);
  },
  methods: {
    // 获取订单数据
    getOrderData(status) {
      // status 订单状态
      let token = localStorage.getItem("_token");
      if (!token) {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString: token,
          status,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          this.orderDatas = [];
          if (result.data.code == 70000) {
            let orderData = {};

            result.data.result.map((v) => {
              if (!orderData[v.oid]) {
                // 不存在该订单数据 则初始化一个对象
                orderData[v.oid] = {
                  orderId: v.oid,
                  date: v.createdAt,
                  count: v.count,
                  total: v.count * v.price,
                  products: [v],
                  status: v.status,
                };
              } else {
                orderData[v.oid].count += v.count;
                orderData[v.oid].total += v.count * v.price;
                orderData[v.oid].products.push(v);
              }
            });

            for (let k in orderData) {
              this.orderDatas.push(orderData[k]);
            }

            this.orderDatas.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 切换订单切换
    toggleStatus(name) {
      
      this.getOrderData(name);
    },
    // 确认收货
    confirmReceive(item, index) {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }
      // 参数序列化
      let data = utils.quertString({
        appkey: this.appkey,
        tokenString: token,
        oid: item.orderId,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });


      this.axios({
        method:'POST',
        url:'/receive',
        data
      }).then(result => {
        this.$toast.clear();
        
        if(result.data.code == 80000){
          this.$toast(result.data.msg);
          if(this.active == 1){
            this.orderDatas.splice(index , 1);
          }else{
            item.status = 2;
          }
        }
      }).catch(err => {
        
      })
    },
    // 删除订单
    removeOrder(oid , index){
      let token = localStorage.getItem('_token');
      if(!token){
        return;
      }

      let data = utils.quertString({
        appkey:this.appkey,
        tokenString:token,
        oid
      })

       this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

      this.axios({
        method:'POST',
        url:'/removeOrder',
        data
      }).then(result => {
        this.$toast.clear()
        
        
        if(result.data.code == 90000){
          this.$toast(result.data.msg);
          this.orderDatas.splice(index,1);
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>