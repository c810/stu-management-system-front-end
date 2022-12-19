import http from '@/utils/http'
// 查专业列表
export const getMajorListApi = async(para) => {
  return await http.get('/api/class/getMajorListByCollegeId', para)
}
// 新增
export const addApi = async(para) => {
  return await http.post('/api/class', para)
}
// 列表
export const listApi = async(para) => {
  return await http.get('/api/class/list', para)
}
// 根据专业id查询学院id
export const getMajorApi = async(para) => {
  return await http.get('/api/class/getCollegeId', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/class', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/class', para)
}
// // 根据学院id查询专业
// export const getMajorListsApi = async(para) => {
//   return await http.get('/api/class/getMajorListByCollegeId', para)
// }
// 根据id查名称
export const getClassNameByIdApi = async(para) => {
  return await http.get('/api/class/getClassNameById', para)
}
