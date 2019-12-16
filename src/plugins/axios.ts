import Vue, { PluginObject } from 'vue'
import axios from 'axios'
import router from '@/router'
import { Loading, Message } from 'element-ui'
import { getItem, clear } from '../common/storage'
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: process.env.baseURL || process.env.apiUrl || '/api'
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

let loadinginstace: any = '' // loading对象
let needLoadingRequestCount = 0 // 请求的loading次数
function startLoading() {
  // 使用Element loading-start 方法
  loadinginstace = Loading.service({
    fullscreen: true,
    background: 'rgba(0, 0, 0, 0.8)'
  })
}

function endLoading() {
  // 使用Element loading-close 方法
  loadinginstace.close()
}
function showFullScreenLoading() {
  // 显示加载
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

function tryHideFullScreenLoading() {
  // 隐藏加载
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
const _axios = axios.create(config)
_axios.interceptors.request.use(
  (cfg) => {
    showFullScreenLoading()
    if (!cfg.headers.common.token) cfg.headers.common.token = getItem('token') ? getItem('token') : ''
    // Do something before request is sent
    return cfg
  },
  (err) => {
    // Do something with request error
    return Promise.reject(err)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  (res) => {
    tryHideFullScreenLoading() // 关闭加载动画
    if (res.status === 200) {
      if (Object.getOwnPropertyDescriptor(res.data, 'success') && !res.data.success) {
        if (res.data.message) {
          Message.error({
            message: res.data.message,
            onClose: function() {
              if (res.data.code === 401) {
                router.push({ path: '/login' })
                clear()
              }
            }
          })
        }
        return Promise.reject(res.data)
      } else {
        if (res.data.message) {
          Message.success(res.data.message)
        }
      }
      return res.data
    }
    // Do something with response data
  },
  (error) => {
    // Do something with response error
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break
        case 401:
          error.message = '未授权，请重新登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      error.message = '连接到服务器失败'
    }

    Message.error({
      message: error.message
    })

    return Promise.reject(error)
  }
)

const Plugin: PluginObject<any> = {
  install: (Vue) => {
    Vue.prototype.$axios = _axios
  }
}

Vue.use(Plugin)

export default _axios
