import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import route from './modules/route'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    route,
    settings,
    user
  },
  getters,
  state:{
    count:[],
    tableData:null
  },
  mutations:{
    add(state){
      state.count.push(0)
    },
    delArr(state,index){
      state.count.splice(index,1)
    },
    addData(state){
      return state.tableData=[{
        env:'1',
        name:'1',
        type:'1',
      }]
    }
  }
})

export default store
