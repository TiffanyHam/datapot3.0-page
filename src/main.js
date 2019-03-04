import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store/index.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'
import VCharts from 'v-charts'
import Print from 'vue-print-nb'
import VueResource from 'vue-resource'
import VueParticles from 'vue-particles'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import 'vuescroll/dist/vuescroll.css'



Vue.use(Element)
Vue.use(VCharts)
Vue.use(Print)
Vue.use(VueResource)
Vue.use(VueParticles)
Vue.use(vuescroll)


//后退不刷新、前进刷新
Vue.mixin({
  beforeRouteLeave(to, from, next) {
    /*if (to.meta.keepAlive === true) {
      this.$destroy()
    }*/
    //debugger
    //刷新
    if(from.query.black || to.meta.isKeepAlive == 1){
      this.$destroy()
    }
    next()

  }
})


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {

  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.getters.token) {
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app');
