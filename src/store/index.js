import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
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
    tableData:[]
  },
  mutations:{
    add(state){
      state.count.push(0)
    },
    delArr(state,index){
      state.count.splice(index,1)
    },

    initList(state, tableData){
      state.tableData = tableData
    }
  },
  actions:{
    getTableData(context) {
      axios.get('/tabledata.json').then(({data}) =>{
        console.log(data)
        context.commit('initList', data)
      })
    }
  }
})

export default store
