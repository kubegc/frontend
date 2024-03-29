import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
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
    tableData:[],
    inputValue:'',
    inputIndex:'',
    inputType:''
  },
  mutations:{
    add(state){
      state.count.push(0)
    },
    delArr(state,index){
      state.count.splice(index,1)
    },

    // initList(state, tableData){
    //   state.tableData = tableData
    // },
    setInputValue(state, val){
      state.inputValue = val
    },
    setInputIndex(state, index){
      state.inputIndex = index
    },
    setInputType(state, type){
      state.inputType = type
    },
    addTable(state){
      const obj = {
        name: state.inputValue.trim(),
        index: state.inputIndex.trim(),
        type: state.inputType.trim()
      }
      state.tableData.push(obj)
      state.inputValue = ''
      state.inputIndex = ''
      state.inputType = ''
    }
  },
  // actions:{
  //   getTableData(context) {
  //     axios.get('/tabledata.json').then(({data}) =>{
  //       console.log(data)
  //       context.commit('initList', data)
  //     })
  //   }
  // }
})

export default store
