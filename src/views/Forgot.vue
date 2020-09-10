<template>
  <div class="forgot">
    <van-nav-bar title="修改密码" left-arrow @click-left="$router.go(-1)" />

    <div class="main">
      <van-form>
        <van-field
          v-for="(item , index) in passwords"
          :key="index"
          class="notStyle"
          v-model="item.password"
          name="手机号"
          :label="item.title"
          :type="item.isPassword ? 'password':'text'"
          :right-icon="item.isPassword?'closed-eye':'eye-o'"
          placeholder="6-16位密码且以字母开头"
          @click-right-icon="viewPassword(item)"
        />
        <div style="margin: 16px;">
          <!-- <div class="fr">注册密码</div> -->
          <van-button round block type="info" native-type="submit" @click="confirmPassword">确认修改</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
    
    <script>
    import '../assets/css/forgot.less'
    
import { utils } from "../assets/js/utils";
import { vaildFrom } from "../assets/js/vaildFrom";
export default {
  data() {
    return {
      isOpen: false,
      passwords: {
        old: {
          password: "",
          isPassword: true,
          title: "旧密码",
        },
        new: {
          password: "",
          isPassword: true,
          title: "新密码",
        },
      },
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //   查看密码
    viewPassword(item) {
      item.isPassword = !item.isPassword;
    },
    // 修改密码
    confirmPassword() {
      // 
      // 获得token字符串
      let token = localStorage.getItem("_token");
      if (!token) {
        return this.$router.push({ name: "Login" });
      }
      let o = {
        oldPassword: {
          value: this.passwords.old.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "旧密码支持字母数字_组合",
        },
        password: {
          value: this.passwords.new.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码支持字母数字的组合",
        },
      };

      // 验证表单
      if (!vaildFrom.vaild(o)) {
        // 验证不通过
        return;
      }
      //发起修改密码请求
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });


      let data = utils.quertString({
          appkey:this.appkey,
          tokenString:token,
          oldPassword:this.passwords.old.password,
          password:this.passwords.new.password
      })

       this.axios({
        method: "POST",
        url: "/updatePassword",
        data,
      }).then(result => {
          this.$toast.clear();
          
           if (result.data.code == "E001") {
            localStorage.removeItem("_token");
            this.$router.push({ name: "Login" });
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
      }).catch(err => {
          this.$toast.clear();
          
      })
    },
  },
};
</script>
    
    <style lang="less" scoped>
</style>