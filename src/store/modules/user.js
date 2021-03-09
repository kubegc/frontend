import { login, getUserInfo } from '@/api/user'
import { getResource } from '@/api/kubernetes'
import { getToken, setToken, removeToken, setValue, getValue, removeValue } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    // avatar: '',
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
  login({ state, commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, namespace: state.namespace }).then(response => {
        if (response.code === 20000) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          setValue('name', username.trim())
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
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
  },

  logout({ dispatch }) {
    return new Promise(resolve => {
      dispatch('resetToken').then(() => {
        resetRouter()
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
  /**
   * @author chace
   * @param state
   * @returns {Promise<unknown>}
   */
  getRoutesConfig({ state }, role) {
    return new Promise(resolve => {
      getResource({
        token: state.token,
        kind: 'Frontend',
        namespace: state.namespace,
        name: 'routes-' + role
      }).then(response => {
        resolve(response.data)
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

