import Vue from 'vue'
import Router, { RawLocation } from 'vue-router'
import Login from '@/views/login/index.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getItem } from '../common/storage'

Vue.use(Router)
// 解决Element导航重复点击报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location: RawLocation) {
  // @ts-ignore
  return originalPush.call(this, location).catch((err) => err)
}
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: 'project'
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
      component: () => import(/* webpackChunkName: "layout" */ '@/views/layout/index.vue'),
      children: [
        {
          path: '/project',
          name: 'project',
          component: () => import(/* webpackChunkName: "home" */ '@/views/project/index.vue')
        },
        {
          path: '/project/:id',
          name: 'projectDetail',
          component: () => import(/* webpackChunkName: "projectDetail" */ '@/views/projectDetail/index.vue')
        },
        {
          path: '/new',
          name: 'new',
          component: () => import(/* webpackChunkName: "new" */ '@/views/new/index.vue')
        },
        {
          path: '/group',
          name: 'group',
          component: () => import(/* webpackChunkName: "group" */ '@/views/group/index.vue')
        },
        {
          path: '/editor',
          name: 'editor',
          component: () => import(/* webpackChunkName: "editor" */ '@/views/editor/index.vue')
        },
        {
          path: '/docs',
          name: 'docs',
          component: () => import(/* webpackChunkName: "docs" */ '@/views/docs/index.vue')
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/project'
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
