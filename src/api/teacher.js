import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/api/teacher', para)
}
// 列表
export const listApi = async(para) => {
  return await http.get('/api/teacher/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/teacher', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/teacher', para)
}
// 分配教师列表
export const assignListApi = async() => {
  return await http.get('/api/teacher/getList', null)
}
// 角色列表
export const getRoleApi = async() => {
  return await http.get('/api/teacher/getRole', null)
}
// 角色查询(编辑回显)
export const getRoleByIdApi = async(para) => {
  return await http.get('/api/teacher/getRoleById', para)
}
