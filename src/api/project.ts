import axios from '../plugins/axios'
export function getProjects(type: number = 0) {
  return axios.get(`/project/list?type=${type}`)
}
