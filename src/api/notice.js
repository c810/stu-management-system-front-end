import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/api/notice', para)
}
// 列表
export const listApi = async(para) => {
  return await http.get('/api/notice/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/notice', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/notice', para)
}
// 查询最近3条公告
export const getTopListApi = async() => {
  return await http.get('/api/notice/getTopList', null)
}
