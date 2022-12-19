import http from '@/utils/http'

// 查询学生教师
export const getTeacherListApi = async(para) => {
  return await http.get('/api/evaluate/getTeacherList', para)
}
// 新增
export const addApi = async(para) => {
  return await http.post('/api/evaluate', para)
}
// 根据学生id查询评价
export const getEvaluateByStuIdApi = async(para) => {
  return await http.get('/api/evaluate/getEvaluateByStuId', para)
}
// 根据教师id查询评价
export const getMyEvaluateListApi = async(para) => {
  return await http.get('/api/evaluate/getMyEvaluateList', para)
}
// 评价教师+1
export const isEvaluatedApi = async(para) => {
  return await http.put('/api/evaluate/isEvaluated', para)
}
// 未读消息置0
export const clearUnreadEvaluateApi = async(para) => {
  return await http.put('/api/evaluate/clearUnreadEvaluate', para)
}
// 根据教师id查询评价平均分
export const getEvaluateAverageScoreListApi = async(para) => {
  return await http.get('/api/evaluate/getEvaluateAverageScoreList', para)
}
