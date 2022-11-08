import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/api/course', para)
}
// 列表
export const listApi = async(para) => {
  return await http.get('/api/course/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/api/course', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/api/course', para)
}
// 分配教师
export const assignSaveApi = async(para) => {
  return await http.post('/api/course/assignSave', para)
}
// 解除教师
export const removeTeacherApi = async(para) => {
  return await http.post('/api/course/removeTeacher', para)
}
// 班级树
export const getClassTreeApi = async() => {
  return await http.get('/api/classCourse/getClassTree', null)
}
// 课程列表
export const getCourseListApi = async() => {
  return await http.get('/api/classCourse/getCourseList', null)
}
// 分配课程
export const saveCourseApi = async(para) => {
  return await http.post('/api/classCourse/saveCourse', para)
}
// 班级课程
export const getClassCourseApi = async(para) => {
  return await http.get('/api/classCourse/getClassCourse', para)
}
// 删除分配课程
export const deleteClassCourseApi = async(para) => {
  return await http.delete('/api/classCourse', para)
}
