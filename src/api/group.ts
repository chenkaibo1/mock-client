import axios from '../plugins/axios'
// 获取用户所创建团队
export const getUserCreateGroupsApi = () => {
  return axios.get('/group')
}

// 获取团队列表
export const getGroupListApi = (keyword?: string) => {
  return axios.get(`/group/list?keyword=${keyword}`)
}

// 创建团队
export const createGroupApi = (params: any) => {
  return axios.post('/group/create', params)
}

// 编辑团队
export const editGroupApi = (params: any) => {
  return axios.put(`/group/edit/${params._id}`, params)
}

// 加入团队
export const joinGroupApi = (params: any) => {
  return axios.put(`/group/join`, params)
}

// 删除团队
export const delGroupApi = (id: string) => {
  return axios.delete(`/group/del/${id}`)
}
