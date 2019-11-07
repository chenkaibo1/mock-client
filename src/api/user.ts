import axios from '../plugins/axios'
// 用户注册
export function registerApi(params: any) {
  return axios.post('/user/register', params)
}
// 用户登录
export function loginApi(params: any) {
  return axios.post('/user/login', params)
}

// 通过关键字查找用户
export function getUserByKeywordApi(keyword: string) {
  return axios.get(`/user/keyword?keyword=${keyword}`)
}
