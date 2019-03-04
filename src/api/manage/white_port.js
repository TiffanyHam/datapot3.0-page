import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getWhitePortPage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/white_port/query',
    method: 'post',
    data: data
  })
}
//新增
export function getWhitePortInsert(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/white_port/add',
    method: 'post',
    data: data
  })
}
//删除
export function getWhitePortDel(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/white_port/del',
    method: 'post',
    data: data
  })
}

//上传
export function upLoad(param) {
  return request({
    url: '/om/white_port/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: param
  })
}

