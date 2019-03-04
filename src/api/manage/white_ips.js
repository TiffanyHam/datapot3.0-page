import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getWhiteIpPage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/white_ips/query',
    method: 'post',
    data: data
  })
}
//新增
export function getWhiteIpInsert(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/white_ips/save',
    method: 'post',
    data: data
  })
}
//删除
export function getWhiteIpDel(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/white_ips/delete',
    method: 'post',
    data: data
  })
}
