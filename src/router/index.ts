import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/login.vue'
import NProgress from 'nprogress'
import { getItem } from '../common/storage'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'layout',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "layout" */ '@/views/layout/layout.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import(/* webpackChunkName: "home" */ '@/views/home/home.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  NProgress.start()
  window.scroll(0, 0)
  const isLogin = getItem('isLogin')
  if (to.path === '/login') {
    next()
    NProgress.done()
  } else {
    if (!isLogin) {
      next('/login')
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
export default router
