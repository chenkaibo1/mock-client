import axios from '@/plugins/axios'
//
export function getWallpaperApi() {
  return axios.get('/util/wallpaper')
}

export function getDashboardApi() {
  return axios.get('/util/dashboard')
}
