import http from '@/utils/http'
// 获取学院列表
export const getCollegeApi = async() => {
  return await http.get('/api/major/college', null)
}
// 新增
export const addApi = async para => {
  return await http.post('/api/major', para)
}
// 列表
export const getListApi = async(para) => {
  return await http.get('/api/major/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/major', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/major', para)
}
