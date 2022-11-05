import http from '@/utils/http'
// 获取列表
export const getListApi = async(para) => {
  return await http.get('/api/role/list', para)
}
// 新增
export const addRoleApi = async(para) => {
  return await http.post('/api/role', para)
}
// 编辑
export const editRoleApi = async(para) => {
  return await http.put('/api/role', para)
}
// 删除
export const deleteRoleApi = async(para) => {
  return await http.delete('/api/role', para)
}
// 分配权限回显(获取分配权限的数据)
export const assignRoleApi = async(para) => {
  return await http.get('/api/role/getAssignShow', para)
}
// 分配权限保存
export const saveAssignApi = async(para) => {
  return await http.post('/api/role/saveRoleMenu', para)
}
