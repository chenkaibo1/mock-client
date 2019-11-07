import axios from '../plugins/axios'
// 获取用户所创建团队
export const getUserCreateGroupsApi = () => {
  return axios.get('/group')
}
