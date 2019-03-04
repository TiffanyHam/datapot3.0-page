import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from './store/index.js'
import { getToken, setToken } from './utils/auth.js'


/*
* 测试环境接口地址:  192.168.10.216:8082
* 开发环境接口地址:  192.168.10.189:8080
* 后端本地：        192.168.20.141:18075
 */

//接口常量定义
const interConfig = {
  baseUrl: 'http://192.168.10.216:8082', //后端代码接口地址
  screen: 'http://192.168.10.230:18082' //大屏地址
}

// 创建axios实例
const service = axios.create({
  baseURL: interConfig.baseUrl, //api的base_url process.env.BASE_API
  timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {

  //var token = getToken();
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (store.getters.token) {
    config.headers['token'] = getToken(); // 让每个请求携带自定义token
    //config.headers['token'] = 'token_session:eb42019d6d75463ea51050983c8bc34715393073674120'
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {

    const res = response.data;

    if (res.retCode != '1') {

      if (res.msg) {
        //失败
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 400:用户未登录; 403:用户未授权;
      if (res.retCode === '400' || res.retCode === '403') {
        MessageBox.confirm('你已被登出，请重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
          this.$router.push('/login');
        })
      } else if (res.retCode === '404') {
         this.$router.push('/404');
      }
      return Promise.reject(res)

    } else {

      //返回响应到组件
      return response.data
    }

  },
  error => {

    //错误打印
    console.log('error-------------------------------' + error);
    console.log(error);

    if (error) {
      error = "数据异常"
    }

    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })

    //token失效
    if (error.response) {
          if (error.response.status && error.response.status == '400') {
                // 返回 401 清除token信息并跳转到登录页面
                store.dispatch('FedLogOut').then(() => {
                  location.reload()
                })
                this.$router.push('/login');
          }
    }

    //返回错误响应到组件
    return Promise.reject(error).catch(function(reason){
            console.log('catch:', reason);
          });

  }
)

export default service
export const domain = interConfig
