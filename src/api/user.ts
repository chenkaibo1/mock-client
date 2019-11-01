import axios from '../plugins/axios'
// 用户注册
export const registerApi = (params: any) => {
  return axios.post('/user/register', params)
}
// 用户登录
export const loginApi = (params: any) => {
  return axios.post('/user/login', params)
}
