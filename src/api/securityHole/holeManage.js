import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getHoleList(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/vuln/manager/search',
    method: 'post',
    data: data
  })
}

//常量
export function getConstants() {
  return request({
    url: '/om/vuln/constants',
    method: 'get',
    data: ''
  })
}
//所属机构
export function getOrganaizate(){
  return request({
    url: '/sys/sys_office/find_all',
    method: 'post',
    data: ''
  })
}

//漏洞处理
export function saveHolefix(param){
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/vuln/manager/fix',
    method: 'post',
    data: data
  })
}
//详情
export function detailsShole(param){
  var data = param.id;
  return request({
    url: '/om/vuln/manager/detail/'+ data,
    method: 'get',
    data: ''
  })
}
