import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return http.post('/api/college', para)
}
// 列表
export const listApi = async(para) => {
  return await http.get('/api/college/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/college', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/college', para)
}
// 根据id查名称
export const getCollegeNameByIdApi = async(para) => {
  return await http.get('/api/college/getCollegeNameById', para)
}
