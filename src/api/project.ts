import axios from '../plugins/axios'
// 获取项目列表
export function getProjectsApi(type: number = 0, keyword: string = '') {
  return axios.get(`/project/list?type=${type}&keyword=${keyword}`)
}
// 克隆项目
export function cloneProjectApi(id: string) {
  return axios.put(`/project/clone/${id}`)
}
// 删除项目
export function deleteProjectApi(id: string) {
  return axios.delete(`/project/remove/${id}`)
}
