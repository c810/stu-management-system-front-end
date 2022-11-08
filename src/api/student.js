import http from '@/utils/http'
// 根据专业id查询班级
export const getClassListApi = async(para) => {
  return await http.get('/api/student/getClassList', para)
}
// 查询学生角色
export const getRoleListApi = async(para) => {
  return await http.get('/api/student/getRoleList', para)
}
// 新增
export const addApi = async(para) => {
  return await http.post('/api/student', para)
}
// 列表
export const getListApi = async(para) => {
  return await http.get('/api/student/list', para)
}
// 编辑回显查询(根据学生id查询学生)
export const getByIdApi = async(para) => {
  return await http.get('/api/student/getById', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/student', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/student', para)
}
// 编辑回显查询(根据学生id查询角色id)
export const getRoleByIdApi = async(para) => {
  return await http.get('/api/student/getRoleId', para)
}
