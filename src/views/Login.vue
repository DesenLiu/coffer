<template>
  <div class="login">
    <div class="container">
      <!-- logo 图标 -->
      <div class="logo">
        <div class="img-box">
          <img class="auto-img" src="../assets/images/coffer.png" alt />
        </div>
      </div>
      <!-- 登录注册框 -->
      <div class="form">
        <div class="form_head clearfix">
          <div class="toggle_btn fr" @click="toggleLogin">
            切换至
            <span>{{this.toggle? '手机':'账号'}}</span>登录
          </div>
        </div>

        <van-form class="from" v-if="toggle">
          <van-field
            v-model="loginObj.phone"
            name="用户名"
            left-icon="manager-o"
            placeholder="请输入您的名称"
            class="serverPadding"
          />
          <van-field
            v-model="loginObj.password"
            class="serverPadding"
            :type="isActive ? 'text':'password'"
            left-icon="manager"
            name="密码"
            placeholder="请输入您的密码"
            :right-icon="isActive ? 'eye-o':'closed-eye'"
            @click-right-icon="toggleClick"
          ></van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="loginFrom">登录</van-button>
          </div>
        </van-form>
        <!-- 手机登录 -->
        <div class="from" v-else>
          <van-field name="手机" left-icon="manager-o" placeholder="请输入您的手机号" class="serverPadding" />
          <van-field center clearable label="短信验证码" placeholder="请输入短信验证码" class="serverPadding">
            <template #button v-show="toggle">
              <van-button size="small" type="primary">发送验证码</van-button>
            </template>
          </van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </div>
      </div>
      <!-- 忘记密码 注册密码 -->
      <div class="pasStatus clearfix">
        <div class="fl notPas" @click="$router.push({name:'Changepass'})">忘记密码</div>
        <div class="fr ctePas" @click="showRes">注册账号</div>
      </div>
      <!-- three 第三方 -->
      <div class="thrType">
        <span class="line fl line1"></span>
        <span class="type-title fl">第三方账号登录</span>
        <span class="line fr line2"></span>
      </div>
      <div class="type-list">
        <div class="box-list clearfix">
          <div class="fl">
            <div class="pd-box">
              <img class="auto-img" src="../assets/images/微信.png" alt />
            </div>
          </div>
          <div class="fl">
            <div class="pd-box">
              <img class="auto-img" src="../assets/images/qq.png" alt />
            </div>
          </div>
          <div class="fl">
            <div class="pd-box">
              <img class="auto-img" src="../assets/images/新浪.png" alt />
            </div>
          </div>
        </div>
      </div>

      <!-- 弹出层 -->
      <van-popup
        v-model="showResgister"
        position="bottom"
        :style="{ height: '35%',backgroundColor:'#232321' }"
      >
        <div class="container">
          <van-form @submit="registerFrom">
            <van-field
              v-model="registerObj.phone"
              name="用户名"
              left-icon="user-o"
              placeholder="请输入你的账号或者手机号"
              class="cell-pad"
            />
            <van-field
              v-model="registerObj.password"
              type="password"
              name="密码"
              left-icon="closed-eye"
              class="cell-pad"
              placeholder="请输入注册密码"
            />
            <van-field
              v-model="registerObj.nickName"
              type="text"
              name="名称"
              left-icon="user-circle-o"
              class="cell-pad"
              placeholder="输入用户名名称"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">注册</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/css/login.less";
import { vaildFrom } from "../assets/js/vaildFrom";
import { utils } from "../assets/js/utils";

export default {
  data() {
    return {
      // 隐藏显示密码
      isActive: true,
      password: "",
      // 切换手机登录
      toggle: true,
      // 点击注册弹出注册界面
      showResgister: false,
      // 注册的号码
      registerObj: {
        phone: "",
        password: "",
        nickName: "",
      },
      loginObj: {
        phone: "",
        password: "",
      },
    };
  },
  methods: {
    toggleClick() {
      this.isActive = !this.isActive;
    },
    // 切换登录模式
    toggleLogin() {
      this.toggle = !this.toggle;
    },
    // 弹出注册
    showRes() {
      this.showResgister = !this.showResgister;
    },
    // 提交注册
    registerFrom() {
      this.toggle = true;
      // 获取用户注册信息
      let userInfo = this.registerObj;
      // 验证注册表单
      let o = {
        phone: {
          value: userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        password: {
          value: userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
        nickName: {
          value: userInfo.nickName,
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
          errorMsg: "昵称格式不正确",
        },
      };
      //判断是否正确
      if (!vaildFrom.vaild(o)) {
        return;
      }
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        //防止穿透
        forbidClick: true,
        //显示时间, 如果时间为0，则不会自动关闭
        duration: 0,
        loadingType: "spinner",
      });
      // 序列化参数
      let info = Object.assign({}, userInfo);
      info.appkey = this.appkey;
      let data = utils.quertString(info);
      this.axios({
        method: "POST",
        url: "/register",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 100) {
            this.showResgister = false;
            // 情况表单数据
            for (let k in userInfo) {
              userInfo[k] = "";
            }
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 登录
    loginFrom() {
      let userInfo = this.loginObj;

      // 验证登录表单
      let o = {
        phone: {
          value: userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        password: {
          value: userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };
      // 验证格式是否正确
      if (!vaildFrom.vaild(o)) {
        return;
      }

      this.$toast.loading({
        message: "加载中",
        //防止穿透
        forbidClick: true,
        //显示时间, 如果时间为0，则不会自动关闭
        duration: 0,
        loadingType: "spinner",
      });
      let infoObj = Object.assign({}, userInfo);
      infoObj.appkey = this.appkey;
      let data = utils.quertString(infoObj);

      this.axios({
        method: "POST",
        url: "/login",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 200) {
            this.$toast.success(result.data.msg);
            localStorage.setItem("_token", result.data.token);
            this.$router.push({ name: "Label" });
          } else {
            this.$toast.fail(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>