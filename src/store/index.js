import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import getters from './getters'

Vue.use(Vuex)

const state = {
  httpError:{
    hasError:false,
    status:'',
    statusText:''
  },
  urlHtttp: 'http://192.168.10.216:8082'
}

const mutations = {
  ON_HTTP_ERROR(state,payload){
    state.httpError = payload
  }
}


const store = new Vuex.Store({
  //state,
  //mutations,
  modules: {
    user
  },
  getters
})

export default store
