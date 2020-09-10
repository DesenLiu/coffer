import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Search,Notify ,Uploader,AddressList, Dialog, Empty, GoodsAction, SwipeCell, Card, Checkbox, GoodsActionIcon, submitBar, GoodsActionButton, Button, Stepper, Cell, CellGroup, Form, Field, Popup, Toast, Tabbar, TabbarItem, NavBar, Icon, Swipe, SwipeItem, Tab, Tabs, AddressEdit } from 'vant'
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Router from 'vue-router'
// Vue.prototype.$ajax = axios
Vue.use(VueAxios, axios)
Vue.use(Button)
  .use(Cell)
  .use(Search)
  .use(CellGroup)
  .use(submitBar)
  .use(Field)
  .use(Form)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(NavBar)
  .use(Icon)
  .use(Swipe)
  .use(SwipeItem)
  .use(SwipeCell)
  .use(Uploader)
  .use(Tab)
  .use(Card)
  .use(Tabs)
  .use(Notify)
  .use(AddressList)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(GoodsAction)
  .use(Checkbox)
  .use(Dialog)
  .use(Empty)
  .use(AddressEdit)
  .use(Stepper);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  // console.log('全局路由守卫')
  next();
})
// 配置头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// 基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
// 添加一个原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

// 关闭生产环境提示
Vue.config.productionTip = false

// 全局日期过滤器
Vue.filter('formatDate', (value, format) => {
  //value 需要过滤的对象
  // format 指定格式
  let date = new Date(value);

  // 获取年份
  let year = date.getFullYear();

  if (/(y+)/.test(format)) {
    let content = RegExp.$1;

    format = format.replace(content, year.toString().slice(4 - content.length));

    // console.log('format =>', format);
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }


  for (let k in o) {
    let reg = new RegExp(`(${k}+)`)
    if (reg.test(format)) {
      let content = RegExp.$1;

      let newTime = o[k] >= 10 ? o[k] : content.length == 2 ? "0" + o[k] : o[k];
      format = format.replace(content, newTime);
    }
  }

  return format;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
