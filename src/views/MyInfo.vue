<template>
  <div class="account">
    <van-nav-bar
      title="设置"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="$router.push({name:'My'})"
    />

    <div class="list-box">
      <van-cell title="头像">
        <div class="avatar fr">
          <img class="auto-img" :src="userInfo.userImg" alt />
          <van-uploader class="uploader-box" :after-read="uploadUserImg" />
        </div>
      </van-cell>
      <van-cell title="用户id">
        <div class="fr">{{userInfo.userId}}</div>
      </van-cell>
      <van-cell title="手机号">
        <div class="fr">{{userInfo.phone}}</div>
      </van-cell>
      <van-cell title="昵称">
        <div class="fr">
          <input
            class="nickname"
            type="text"
            v-model="userInfo.nickName"
            @change="modifyUserInfo('nickName', '/updateNickName')"
          />
        </div>
      </van-cell>
      <div class="desc-box">
        <div class="desc-title">简介</div>
        <div>
          <textarea
            v-model="userInfo.desc"
            class="text-area"
            placeholder="这家伙很懒，什么都没有留下"
            @change="modifyUserInfo('desc', '/updateDesc')"
          ></textarea>
        </div>
      </div>
      <div class="btn-noLogin" style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="noLogin">退出登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/myInfo.less";
import { Dialog } from "vant";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      userInfo: {
        userId: "",
        phone: "",
        nickName: "",
        userImg: "",
        desc: "",
      },
      maxSize: 1 * 1024 * 1024,
    };
  },
  methods: {
    // 获得基本资料
    findMy() {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          
          if (result.data.code == "B001") {
            for (let i in this.userInfo) {
              this.userInfo[i] = result.data.result[0][i];
            }
          }
        })
        .catch((err) => {});
    },
    // 修改名称
    modifyUserInfo(key, url) {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }
      let data = utils.quertString({
        appkey: this.appkey,
        tokenString: token,
        [key]: this.userInfo[key],
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url,
        data,
      })
        .then((result) => {
          this.$toast.clear();
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          
        });
    },
    // 上传头像
    uploadUserImg(file) {
      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }

      // 获得文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA",
        });

        return;
      }

      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA",
        });
        return;
      }

      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      //参数序列化

      let data = utils.quertString({
        appkey: this.appkey,
        tokenString: token,
        imgType: type,
        serverBase64Img: base64,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data,
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 退出登录
    noLogin() {
      Dialog.confirm({
        title: "退出",
        message: "确定退出登录吗",
      })
        .then(() => {
          let token = localStorage.getItem("_token");
          if (!token) {
            return;
          }

          let data = utils.quertString({
            appkey: this.appkey,
            tokenString: token,
          });

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });

          this.axios({
            method: "POST",
            url: "/logout",
            data
          })
            .then((result) => {
              this.$toast.clear();
              
              if (result.data.code == 'F001') {
                this.$toast(result.data.msg);
                localStorage.removeItem('_token')
                this.$router.go(-1)
              }
            })
            .catch((err) => {
              this.$toast.clear();
            });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  created() {
    this.findMy();
  },
};
</script>

<style lang="less" scoped>
</style>