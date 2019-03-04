import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getOfficePage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/sys_office/query',
    method: 'post',
    data:data
  })
}

//新增、编辑
export function getOfficeInsert(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/sys_office/save',
    method: 'post',
    data: data
  })
}
//删除
export function getOfficeDel(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/sys_office/delete',
    method: 'post',
    data: data
  })
}
