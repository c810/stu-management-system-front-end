import { logout, getInfo, loginApi } from '@/api/user'
import { getToken, setToken, removeToken, setUserId } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login 登录
  login({ commit }, userInfo) {
    // 解构传来的参数
    const { username, password, userType } = userInfo
    return new Promise((resolve, reject) => {
      // 调用 api -> user.js -> loginApi()
      loginApi({ username: username.trim(), password: password, userType: userType }).then(response => {
        const { data } = response
        console.log(response)
        // commit('SET_TOKEN', data.token)
        // 模拟数据，以后会做分配权限的对接，再用真实的数据
        commit('SET_TOKEN', 'admin-token')
        // 设置用户id
        setUserId(data.userId)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 获取用户的权限信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 对接自己的接口
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // 把返回的信息存放到vuex里面
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

