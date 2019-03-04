import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getHoleData(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/vulnresource/search',
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
//修改
export function modifyInfo(param){
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/vulnresource/update?'+data,
    method: 'post',
    data: ''
  })
}

//详情
export function detailsHole(param){
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/vulnresource/detail/?'+data,
    method: 'get',
    data: ''
  })
}
//漏洞库更新
export function updateHole(data){
  return request({
    url: '/om/vulnresource/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}
