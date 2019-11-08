import axios from '../plugins/axios'
// 获取项目列表
export function getProjectsApi(type: number = 0, keyword: string = '') {
  return axios.get(`/project/list?type=${type}&keyword=${keyword}`)
}
// 获取团队项目列表
export function getGroupProjectsApi(group: string = '') {
  return axios.get(`/project/group?group=${group}`)
}
// 克隆项目
export function createProjectApi(params: any) {
  return axios.post(`/project/create`, params)
}
// 克隆项目
export function cloneProjectApi(id: string) {
  return axios.put(`/project/clone/${id}`)
}
// 删除项目
export function deleteProjectApi(id: string) {
  return axios.delete(`/project/remove/${id}`)
}
