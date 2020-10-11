<template>
  <div class="my">
    <van-nav-bar title="个人中心" class="myBg"></van-nav-bar>

    <div class="header">
      <div v-if="isLogin">
        <div class="img">
          <input type="file" class="inpImg" @change="fileImg" />
          <img ref="imgSlot" class="auto-img" :src="userInfo.userImg" alt />
        </div>
        <div class="username">{{userInfo.nickName}}</div>
        <div class="duction">{{userInfo.desc}}</div>
      </div>
      <div v-else class="notLogin" @click="$router.push({name:'Login'})">
        请先登录账号
      </div>
    </div>

    <div class="container">
      <van-cell
        :icon="require('../../assets/images/order.png')"
        title="我的订单"
        is-link
        @click="$router.push({name:'Order'})"
      />
      <van-cell
        :icon="require('../../assets/images/isLike.png')"
        title="我的收藏"
        is-link
        @click="$router.push({name:'Mylike'})"
      />
      <div class="line"></div>
      <van-cell
        :icon="require('../../assets/images/address.png')"
        title="我的地址"
        is-link
        @click="$router.push({name:'Myaddress'})"
      />
      <van-cell :icon="require('../../assets/images/yhj.png')" title="优惠卷" is-link />
      <div class="line"></div>
      <van-cell
        :icon="require('../../assets/images/aq.png')"
        title="账号安全"
        is-link
        @click="slideCell"
      />
      <van-cell
        :icon="require('../../assets/images/sz.png')"
        title="设置"
        is-link
        @click="$router.push({name:'MyInfo'})"
      />
    </div>

    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <div class="main">
        <van-button round type="info" size="large" color="#e4be6b" @click="changeP">修改密码</van-button>
        <van-button round type="info" size="large" color="#e4be6b" @click="remove">注销密码</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../../assets/css/my.less";
import { Dialog } from "vant";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      show: false,
      userInfo: {
        nickName: "",
        userImg: "",
        userBg: "",
        desc: "",
      },
      isLogin: "",
    };
  },
  methods: {
    slideCell() {
      this.show = !this.show;
    },
    // 跳转到修改密码界面
    changeP() {
      this.$router.push({ name: "Changepass" });
    },
    // 注销
    remove() {
      Dialog.confirm({
        title: "注销",
        message: "是否注销账号密码",
      })
        .then(() => {
          // on confirm

          // 注销账号接口
          let token = localStorage.getItem("_token");
          // xxxxxxxxxxxxxxxxxxx
          this.axios({
            method: "POST",
            url: "/destroyAccount",
            params: {
              appkey: this.appkey,
              tokenString: token,
            },
          })
            .then((result) => {})
            .catch((err) => {});

          this.show = false;
        })
        .catch(() => {
          // on cancel
        });
    },
    // 上传头像
    fileImg(e) {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }
      let imgUrlData = e.target.files[0];
      let imgUrlType = e.target.files[0].name.split(".")[1];
      let reg = /\.(png|jpg|gif|jpeg|webp)$/;
      // 判断图片格式
      if (!reg.test("." + imgUrlType)) {
        this.$toast("请上传正确的图片格式");
        return;
      }

      let _this = this;
      let render = new FileReader();
      render.readAsDataURL(imgUrlData);
      render.onload = function (e) {
        let imgBase = e.currentTarget.result.split(",")[1];

        let o = {
          appkey: _this.appkey,
          tokenString: token,
          imgType: imgUrlType,
          serverBase64Img: imgBase,
        };

        let data = utils.quertString(o);
        _this
          .axios({
            url: "/updateAvatar",
            method: "POST",
            data,
          })
          .then((result) => {
            if (result.data.code == "H001") {
              _this.$refs.imgSlot.src = result.data.userImg;
            }
          })
          .catch((err) => {});
      };
    },
    // 我的接口
    findMy() {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          //
          if (result.data.code == "A001") {
            for (let i in this.userInfo) {
              this.userInfo[i] = result.data.result[0][i];
            }
          }
        })
        .catch((err) => {});
    },
  },
  created() {
    this.findMy();
    let token = localStorage.getItem("_token");
    
    token ? (this.isLogin = true) : (this.isLogin = false);
    
  },
};
</script>

<style lang="less" scoped>
</style>