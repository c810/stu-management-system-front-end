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
// 教授课程
export const getCourseListApi = async(para) => {
  return await http.get('/api/teacher/getCourseList', para)
}
// 导入成绩
export const importStuInfoApi = async(para) => {
  return await http.upload('/api/teacher/importStuInfo', para)
}
// 重置密码
export const resetPasswordApi = async(para) => {
  return await http.post('/api/teacher/resetPassword', para)
}
// 根据教师id查询教师
export const getTeacherByIdApi = async(para) => {
  return await http.get('/api/teacher/getTeacherById', para)
}
