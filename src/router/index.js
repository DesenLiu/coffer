import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => {
      return import('../views/Login.vue');
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => {
      return import('../views/Main.vue');
    },
    children: [
      {
        path: 'label',
        name: 'Label',
        component: () => {
          return import('../views/MainViews/Label.vue');
        },
      },
      {
        path: 'coffers',
        name: 'Coffers',
        component: () => {
          return import('../views/MainViews/Coffers.vue');
        },
      },
      {
        path: 'like',
        name: 'Like',
        component: () => {
          return import('../views/MainViews/Like.vue');
        },
      },
      {
        path: 'my',
        name: 'My',
        component: () => {
          return import('../views/MainViews/My.vue');
        },
      },
    ]
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => {
      return import('../views/Detail.vue')
    }
  },
  {
    path: '/changepass',
    name: 'Changepass',
    component: () => {
      return import('../views/Changepass.vue')
    }
  },
  {
    path: '/newaddress',
    name: 'Newaddress',
    component: () => {
      return import('../views/Newaddress.vue');
    },
  },
  {
    path: '/address',
    name: 'Address',
    component: () => {
      return import('../views/Address.vue');
    },
  },
  {
    path: '/myinfo',
    name: 'MyInfo',
    component: () => {
      return import('../views/MyInfo.vue');
    },
  },
  {
    path: '/order',
    name: 'Order',
    component: () => {
      return import('../views/Order.vue');
    },
  },
  {
    path: '/mylike',
    name: 'Mylike',
    component: () => {
      return import('../views/Mylike.vue');
    },
  },
  {
    path: '/myaddress',
    name: 'Myaddress',
    component: () => {
      return import('../views/Myaddress.vue');
    },
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => {
      return import('../views/Forgot.vue');
    },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => {
      return import('../views/Search.vue');
    },
  },
  {
    path: '*',
    redirect: {
      name: 'Login'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
