    <template>
  <div class="coffer-type" @click="targetDetail">
    <div class="cofferTitleImg">
      <img class="auto-img" :src="itemData.largeImg" alt />
      <div class="cofferText">{{itemData.name}}</div>
    </div>
    <div class="des">
      <div class="des-text">{{itemData.desc}}</div>
      <div class="name clearfix">
        <div class="names fl">
          <span>{{itemData.enname}}</span>
        </div>
        <div class="name-date fr">{{date}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["itemData"],
  data() {
    return {};
  },
  computed: {
    date() {
      return this.itemData.createdAt.slice(0, 10);
    },
  },
  methods: {
    // 跳转详情页
    targetDetail() {
      this.$emit("targetdetail", this.itemData.pid);
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
</style>