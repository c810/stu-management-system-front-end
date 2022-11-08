import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const userIdKey = 'userId'
const userTypeKey = 'userType'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存储用户id
export function setUserId(userId) {
  return sessionStorage.setItem(userIdKey, userId)
}

// 获取用户id
export function getUserId(userId) {
  return sessionStorage.getItem(userIdKey)
}

// 删除用户id
export function removeUserId() {
  return sessionStorage.remove(userIdKey)
}

// 清空session
export function clearSession() {
  return sessionStorage.clear()
}

export function getUserType() {
  return Cookies.get(userTypeKey)
}

export function setUserType(userType) {
  return Cookies.set(userTypeKey, userType)
}
