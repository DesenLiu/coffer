<template>
  <div class="changep">
    <van-nav-bar title="找回密码" left-arrow @click-left="$router.go(-1)" />

    <div class="main">
      <van-form>
        <van-field
          class="notStyle"
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入您的手机号"
        />
        <van-field
          label="密码"
          class="notStyle"
          placeholder="密码"
          v-model="userInfo.password"
          :type="isPassword ? 'password' : 'text'"
          :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
          @click-right-icon="viewPassword"
        />
        <van-field label="邮箱" class="notStyle" placeholder="邮箱" v-model="userInfo.email" />

        <van-field
          v-model="userInfo.validCode"
          class="notStyle"
          center
          clearable
          label="验证码"
          placeholder="请输入邮箱验证码"
        >
          <template #button>
            <van-button
              size="small"
              color="#0C34BA"
              :disabled="isSend"
              @click="sendValidCode"
            >{{text}}</van-button>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <!-- <div class="fr">注册密码</div> -->
          <van-button round block type="info" native-type="submit" @click="commit">提交</van-button>
          <div class="mm fr" @click="$router.push({name:'Login'})">注册密码</div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import "../assets/css/changep.less";
import { utils } from "../assets/js/utils";
import { vaildFrom } from "../assets/js/vaildFrom";
export default {
  data() {
    return {
      isPassword: true,
      userInfo: {
        phone: "",
        password: "",
        email: "",
        validCode: "",
      },
      text: "发送验证码",
      isSend: false,
    };
  },
  methods: {
    // 显示隐藏密码
    viewPassword() {
      this.isPassword = !this.isPassword;
    },
    //发送验证码
    sendValidCode() {
      let time = 5;
      this.text = time + "s后重新发送";
      this.isSend = true;

      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.isSend = false;
          this.text = "发送验证码";
        } else {
          time--;
          this.text = time + "s后重新发送";
        }
      }, 1000);
      //发起获取邮箱验证码请求
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //参数序列化
      let data = utils.quertString({
        email:this.userInfo.email,
        appkey:this.appkey
      })

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          

          this.$notify({
            type: "warning",
            message: result.data.msg,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

      //提交
    commit() {

      //验证修改密码表单
      let o = {
        phone: {
          value: this.userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: '手机号格式不正确'
        },
        password: {
          value: this.userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: '密码支持字母数字_组合'
        },
        email: {
          value: this.userInfo.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: '邮箱格式不正确'
        },
        validCode: {
          value: this.userInfo.validCode,
          reg: /^\d{6}$/,
          errorMsg: '验证为6位数字'
        }
      };

      if (!vaildFrom.vaild(o)) {
        //验证不通过
        return;
      }
    
      //发起忘记密码请求
      
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
        loadingType: 'spinner'
      })

      //参数序列化
      let data = utils.quertString({
        validCode: this.userInfo.validCode,
        appkey: this.appkey
      });

      
      // return;

      this.axios({
        method: 'POST',
        url: '/checkValidCode',
        data
      }).then(result => {
        this.$toast.clear();
        
        if (result.data.code == 'K001') {
          this.$router.push({name:'Forgot'})

        } else {
          this.$notify({
            type: 'warning', 
            message: result.data.msg
          })
        }

        
      }).catch(err => {
        this.$toast.clear();
        

      })

    },

      //修改密码
    // updatePassword() {
    //   this.$toast.loading({
    //     message: '加载中...',
    //     forbidClick: true,
    //     duration: 0,
    //     loadingType: 'spinner'
    //   })

    //   //参数序列化
    //   let data = utils.queryString({
    //     phone: this.userInfo.phone,
    //     password: this.userInfo.password,
    //     appkey: this.appkey
    //   });

    //   this.axios({
    //     method: 'POST',
    //     url: '/retrievePassword',
    //     data
    //   }).then(result => {
    //     this.$toast.clear();
    //     

    //     if (result.data.code == 'L001') {
    //       this.$router.push({name: 'Login'});
    //     } else {
    //       this.$toast(result.data.msg);
    //     }

    //   }).catch(err => {
    //     this.$toast.clear();
    //     

    //   })
    // }
  },
};
</script>

<style lang="less" scoped>
</style>