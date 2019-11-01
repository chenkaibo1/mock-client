import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import localComponent from '@/components'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins' // 加载插件
import '@/assets/scss/index.scss' // 引入全局样式
import '@/assets/iconfont/iconfont.js' // 引入iconfont
// @ts-ignore
import zhLocale from 'element-ui/lib/locale/lang/zh-CN.js'
// @ts-ignore
import enLocale from 'element-ui/lib/locale/lang/en.js'
import zhLocaleIView from '@/locales/zh-CN.js'
import enLocaleIView from '@/locales/en.js'

// 添加国际化
Vue.use(VueI18n)
const messages = {
  'zh-CN': {
    ...zhLocaleIView,
    ...zhLocale
  },
  en: {
    ...enLocaleIView,
    ...enLocale
  }
}
const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  fallbackLocale: 'zh-CN',
  messages // set locale messages
})
// 添加element-ui
Vue.use(Element, {
  i18n: (key: any, value: any) => i18n.t(key, value)
})

// 注册本地组件
Vue.use(localComponent)

Vue.config.productionTip = false // 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.devtools = process.env.NODE_ENV === 'production' // 是否开启vue-devtools

document.body.ondrop = (event) => {
  event.preventDefault()
  event.stopPropagation()
} // 禁用拖拽行为

new Vue({
  router,
  store,
  i18n,
  render: (h: any) => h(App)
}).$mount('#app')
