import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getUserPage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/account/accountQuery',
    method: 'post',
    data: data
  })
}

//新增、编辑
export function getUserInsert(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/account/save',
    method: 'post',
    data: data
  })
}
//修改密码
export function getUserPwd(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/account/upd_user_pwd',
    method: 'post',
    data: data
  })
}
//删除
export function getUserDel(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/account/delete',
    method: 'post',
    data: data
  })
}
//所属分支机构
export function getOfficeIdAll() {
  return request({
    url: '/sys/sys_office/find_all',
    method: 'post',
    data: ''
  })
}

//访问系统、用户状态、是否主管
export function getConstantsAll() {
  return request({
    url: '/sys/account/constant',
    method: 'get',
    data: ''
  })
}
//角色
export function getGroupAll() {
  return request({
    url: '/sys/group/find_all',
    method: 'post',
    data: ''
  })
}
