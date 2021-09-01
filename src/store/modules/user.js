// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences
import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken, setValue, getValue, removeValue } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    role: '',
    namespace: 'default'
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
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ state, commit }, { userInfo, projectId }) {
    const { username, password } = userInfo
    // eslint-disable-next-line no-const-assign
    return new Promise((resolve, reject) => {
      login({ username: projectId + '-' + username, password: password, namespace: state.namespace }).then(response => {
        if (response.code === 20000) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          setValue('name', projectId + '-' + username)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ dispatch }) {
    return new Promise(resolve => {
      dispatch('resetToken').then(() => {
        removeValue('name')
        removeValue('role')
        resolve()
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
  },
  getRole({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo({ token: state.token, username: getValue('name'), namespace: state.namespace }).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { role } = data
        commit('SET_ROLE', role)
        // commit('SET_AVATAR', avatar)
        commit('SET_NAME', getValue('name'))
        setValue('role', role)
        // setValue('avatar', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

