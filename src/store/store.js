import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    list: localStorage.getItem("type")|| ''
  },
  mutations: {
    createService(state){
      state.list = state.list + 1
      localStorage.setItem("type",state.list)
    }
  },
  actions: {

  }
})


export default store
