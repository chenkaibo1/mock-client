import axios from '../plugins/axios'
// 根据项目获取接口
export function getMockListApi(pid: string = '') {
  return axios.get(`/mock/list?pid=${pid}`)
}
// 获取接口详情
export function getMockDetailApi(id: string = '') {
  return axios.get(`/mock/detail?id=${id}`)
}
// 创建接口
export function createMockApi(data: any) {
  return axios.post(`/mock`, data)
}
// 编辑接口
export function editMockApi(data: any) {
  return axios.put(`/mock/${data._id}`, data)
}
// 删除
export function deleteMockApi(id: string = '') {
  return axios.delete(`/mock/${id}`)
}
