import Vue from 'vue';
import {Notify} from 'vant'

Vue.use(Notify)

class VaildFrom{
    vaild(o){
        console.log(o)
        for(let key in o){
            if(!o[key].reg.test(o[key].value)){
                Notify({
                    type:'warning',
                    message:o[key].errorMsg
                })
                // 验证失败
                return false;
            }
        }
        // 验证成功
        return true;
    }
}

export const vaildFrom = new VaildFrom();