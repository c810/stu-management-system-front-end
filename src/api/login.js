import http from '@/utils/http'
// 统计首页总数
export const getHomeCountApi = async(para) => {
  return await http.get('/api/login/getHomeCount', para)
}
