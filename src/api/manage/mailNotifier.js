import request from '../../request.js'
import qs from 'qs'

//常量
export function getConstant() {
  return request({
    url: '/om/warn/constant',
    method: 'get',
    data: ''
  })
}

//邮件服务器配置（提交）
export function getSeverConfirm(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/warn/add_or_update',
    method: 'post',
    data: data
  })
}

//添加接收者邮箱
export function getAddEmail(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/warn/add_email_client',
    method: 'post',
    data: data
  })
}
//所有信息
export function getAllInfo() {
  return request({
    url: '/om/warn/get_info',
    method: 'get',
    data: ''
  })
}

//删除邮箱
export function getDelInfo(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/warn/del_email_client',
    method: 'post',
    data: data
  })
}

//发送服务器（提交）
export function getRecive(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/warn/update_email',
    method: 'post',
    data: data
  })
}
