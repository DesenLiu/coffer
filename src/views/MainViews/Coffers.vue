<template>
  <div class="coffers">
    <van-tabs
      @click="gettypeProducts($event)"
      title-active-color="#e4be6b"
      title-inactive-color="#232321"
      :sticky="true"
    >
      <van-tab v-for="(item ,index) in tabData" :title="item.typeDesc" :key="index">
        <coffet-type
          v-for="(item , index) in productData"
          :key="index"
          :itemData="item"
          @targetdetail="detail"
        ></coffet-type>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import coffetType from "../../components/cofferType.vue";
import "../../assets/css/coffers.less";
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: vm.appkey,
        },
      })
        .then((result) => {
          vm.tabData = result.data.result;
          vm.tabData.unshift({
            isHot: 1,
            typeDesc: "最新热门",
          });
        })
        .catch((err) => {});
    });
  },
  data() {
    return {
      tabData: [],

      // 商品类型数据
      productData: [],
    };
  },
  components: {
    coffetType,
  },
  methods: {
    //   获取商品类型
    // getType() {
    //   this.axios({
    //     method: "GET",
    //     url: "/type",
    //     params: {
    //       appkey: this.appkey,
    //     },
    //   })
    //     .then((result) => {

    //       this.tabData = result.data.result;
    //       this.tabData.unshift({
    //         isHot: 1,
    //         typeDesc: "最新热门",
    //       });
    //     })
    //     .catch((err) => {

    //     });
    // },
    // 根据商品类型获得数据
    gettypeProducts(e) {
      sessionStorage.setItem("index", e);
      // 声明一个对象 用于存放接口所需要的值
      let params = {};
      if (e == 0) {
        params = {
          key: "isHot",
          value: "1",
        };
      } else {
        for (let k in this.tabData[e]) {
          if (k == "type") {
            params.key = k;
            params.value = this.tabData[e][k];
          }
        }
      }

      params.appkey = this.appkey;
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.productData = result.data.result;
        })
        .catch((err) => {});
    },
    // 跳转详情页
    detail(pid) {
      this.$router.push({
        name: "Detail",
        query: {
          pid,
        },
      });
    },
  },
  created() {
    //   调用商品类型接口
    // this.getType();
    // 刚进来的时候默认0
    this.gettypeProducts(0);
  },
};
</script>

<style lang="less" scoped>
</style>