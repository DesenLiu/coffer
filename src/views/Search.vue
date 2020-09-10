<template>
  <div class="search">
    <van-search v-model="value" show-action placeholder="请输入搜索关键词">
      <template #action>
        <div @click="searchData">搜索</div>
      </template>
    </van-search>

    <div class="search-box clearfix" v-if="typeData.length > 0">
      <div
        class="search-item clearfix"
        @click="targetDetail(item.pid)"
        v-for="(item , index) in typeData"
        :key="index"
      >
        <div class="item-img fl" @click="viewProductInfo(item.pid)">
          <img class="auto-img" :src="item.smallImg" alt />
        </div>
        <div class="item-text fl">
          <div class="text-title">{{item.name}}</div>
          <div class="text-ename">{{item.enname}}</div>
          <div class="text-price">￥{{item.price}}</div>
        </div>
        <div class="item-icon fr">
          <van-icon name="arrow" size="20px" />
        </div>
      </div>
    </div>
    <div v-else>不存在该商品</div>
  </div>
</template>

<script>
import "../assets/css/search.less";
export default {
  data() {
    return {
      value: "",
      typeData: [],
    };
  },
  methods: {
    searchData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        url: "/search",
        method: "GET",
        params: {
          appkey: this.appkey,
          name: this.value,
        },
      })
        .then((result) => {
          if (result.data.code == "Q001") {
            this.$toast.clear();
            this.typeData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    targetDetail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
  },
};
</script>

<style lang="less" scoped>
</style>