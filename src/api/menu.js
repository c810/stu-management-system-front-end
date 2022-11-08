import http from '@/utils/http'
// 列表
export const getListApi = async() => {
  return await http.get('/api/menu/list', null)
}
// 上级菜单列表
export const getParentListApi = async() => {
  return await http.get('/api/menu/parent', null)
}
// 新增
export const addMenuApi = async(para) => {
  return await http.post('/api/menu', para)
}
// 编辑
export const editMenuApi = async(para) => {
  return await http.put('/api/menu', para)
}
// 删除
export const deleteMenuApi = async(para) => {
  return await http.delete('/api/menu', para)
}
// 获取菜单数据
export const getMenuListApi = async(para) => {
  return await http.get('/api/login/getMenuList', para)
}
