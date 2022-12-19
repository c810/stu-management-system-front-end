import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/api/practice', para)
}
// 列表
export const listApi = async(para) => {
  return await http.get('/api/practice/list', para)
}
/* // 我的实践列表
export const myListApi = async(para) => {
  return await http.get('/api/practice/myList', para)
}*/
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/practice', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/practice', para)
}
/* // 分配学生
export const assignSaveApi = async(para) => {
  return await http.post('/api/practice/assignSave', para)
}
// 解除学生
export const removeStudentApi = async(para) => {
  return await http.post('/api/practice/removeTStudent', para)
}*/
// 班级树
/* export const getClassTreeApi = async() => {
  return await http.get('/api/stuPractice/getClassTree', null)
}*/
// 实践列表
/* export const getPracticeListApi = async() => {
  return await http.get('/api/stuPractice/getStudentList', null)
}*/
// 分配实践
/* export const savePracticeApi = async(para) => {
  return await http.post('/api/stuPractice/savePractice', para)
}*/
// 班级课程
/* export const getClassCourseApi = async(para) => {
  return await http.get('/api/classCourse/getClassCourse', para)
}*/
// 删除分配课程
/* export const deleteClassCourseApi = async(para) => {
  return await http.delete('/api/classCourse', para)
}*/
