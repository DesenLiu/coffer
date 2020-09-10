<template>
  <div class="myaddress">
          <van-nav-bar title="我的地址" left-text="返回" left-arrow @click-left="$router.push({name:'My'})" />
    <van-address-list v-model="chosenAddressId" :list="addressData" default-tag-text="默认" @edit="edit" @delete="delAddress"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addressData: [],
      chosenAddressId: "1",
    };
  },
  methods: {
    // 获取地址
    getAddress() {
      let token = localStorage.getItem("_token");
      if (!token) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: token,
        },
      })
        .then((result) => {
          
          if ((result.data.code = 20000)) {
            result.data.result.map((v) => {
              let o = {
                id: "",
                name: "",
                tel: "",
                address: "",
                isDefault: "",
                aid:''
              };
              for (let k in o) {
                  if(k == 'address'){
                      o[k] = v.province + v.city + v.county;
                      continue;
                  }
                o[k] = v[k];
              }
              this.addressData.push(o);
            });

            
          }

          
        })
        .catch((err) => {
          
        });
    },
    // 编辑地址
     edit(item){
         
      let aid = item.aid;
      
      this.$router.push({name:'Newaddress',query:{aid}})
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
  created() {
    this.getAddress();
  },
};
</script>

<style lang="less" scoped>
</style>