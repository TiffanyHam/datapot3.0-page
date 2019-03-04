import request from '../request.js'
import qs from 'qs'

//登录
export function login(param) {
  var data = qs.stringify(param)
  return request({
    url: '/login',
    method: 'post',
    data: data
    /*
    headers: {
	'Content-Type''application/x-www-form-urlencoded'
	}
     */
  })
}

//获取用户信息
export function getInfo() {
  return request({
    url: '',
    method: 'get',
    data: {}
  })
}

//登出
export function logout() {
  debugger
  return request({
    url: '/logout',
    method: 'post',
    data: {}
  })
}

//请求验证码
export function getValidateCode() {
  return request({
    url: '/vcode',
    method: 'get',
    data: {}
  })
}


//修改密码
export function updatepassword(param) {
  var data = qs.stringify(param)
  return request({
    url: '/sys/account/upd_account_pwd',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
    data: data
  })
}