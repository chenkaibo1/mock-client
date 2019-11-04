import axios from '../plugins/axios'
export function getProjects(uid: string) {
	return axios.get(`/project/list?uid=${uid}`)
}
