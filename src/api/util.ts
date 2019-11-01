import axios from '@/plugins/axios'
export function getWallpaper() {
  return axios.get('/util/wallpaper')
}
