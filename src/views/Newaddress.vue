<template>
  <div class="newAddress">
    <van-nav-bar :title="aid?'编辑地址':'新增地址'" left-text="返回" left-arrow :fixed="true" @click-left="$router.go(-1)"/>
    <div class="mt">
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :address-info="addressInfo"
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="addAddress"
        @delete="delAddress"
      />
    </div>
  </div>
</template>

<script>
import areaList from "../assets/js/arealist";
// import { delete } from 'vue/types/umd';
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      areaList,
      searchResult: [],
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false,
      },
      aid: "",
    };
  },
  created() {
    // 获取aid
    this.aid = this.$route.query.aid;
    

    if (this.aid) {
      this.getAddressDataByAid();
    }
  },
  methods: {
    // 新增地址
    newAddress(address) {
      let content = Object.assign({}, address);

      let token = localStorage.getItem("_token");
      if (!token) {
        return;
      }

      delete content.id;
      delete content.county;

      content.isDefault = Number(content.isDefault);

      content.appkey = this.appkey;
      content.tokenString = token;

      let data = utils.quertString(content);

      this.axios({
        method: "POST",
        url: "/addAddress",
        data,
      })
        .then((result) => {
          
          if ((result.data.code = 9000)) {
            this.$router.go(-1);
          }
        })
        .catch((err) => {
          
        });
    },
    addAddress(address) {
      if (this.aid) {
        // 编辑
        this.editAddress(address);
      } else {
        this.newAddress(address);
      }
    },
    // 编辑地址
    editAddress(content) {
      

      let token = localStorage.getItem("_token");
      if (!token) {
        return this.$router.push({ name: "Login" });
      }

      // 
      // 
      // 

      // 判断地址是否被修改
      let isModify = false;
      for (let key in this.addressInfo) {
        if (this.addressInfo[key] != content[key]) {
          // 已经被修改
          isModify = true;
          break;
        }
      }

      if (isModify) {
        // 发起修改地址请求
        // 

        // 复制对象
        let addressData = Object.assign({}, content);
        delete addressData.country;
        delete addressData.id;
        addressData.aid = this.aid;

        addressData.tokenString = token;
        addressData.appkey = this.appkey;
        addressData.isDefault = Number(addressData.isDefault);

        // 

        let data = utils.quertString(addressData);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner",
        });

        this.axios({
          method: "POST",
          url: "/editAddress",
          data,
        })
          .then((result) => {
            this.$toast.clear();
            // 
            this.$toast(result.data.msg);
            if (result.data.code == 30000) {
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            }
          })
          .catch((err) => {
            
          });
      } else {
        this.$router.push({ name: "Address" });
      }
    },
    // 根据id获得地址
    getAddressDataByAid() {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString: token,
          aid: this.aid,
        },
      }).then((result) => {
        this.$toast.clear();
        // 
        
        if (result.data.code == 40000) {
          
          for (let key in this.addressInfo) {
            if (key == "id") {
              this.addressInfo[key] = result.data.result[0].aid;
              continue;
            }
            this.addressInfo[key] =
              key == "isDefault"
                ? Boolean(result.data.result[0][key])
                : result.data.result[0][key];
          }
          // 
        }
      });
    },
    // 删除地址
    delAddress(content) {
      

      let token = localStorage.getItem('_token');
      if(!token){
        return;
      }
      //       请求地址：http://www.kangliuyong.com:10002/deleteAddress
      // 请求类型： POST
      // 请求参数： {
      //   appkey: 你的appkey,
      //   tokenString: token字符串,
      //   aid: 地址唯一标识
      // }
      let data = utils.quertString({
        appkey:this.appkey,
        tokenString:token,
        aid:content.id
      })
      this.axios({
        url:'/deleteAddress',
        method:'POST',
        data
      }).then(result => {
        
        if(result.data.code == 10000){
          this.$router.go(-1);
        }
      }).catch(err => {
        
      })

    },
  },
};
</script>

<style lang="less" scoped>
.mt {
  margin-top: 40px;
}
</style>