import request from '../../request.js'
import qs from 'qs'

//获取列表
export function getDetecListPage(param) {
 var data = qs.stringify(param);
  return request({
    url: '/om/detection_type/query',
    method: 'post',
    data: data
  })
}

//获取常量
export function getDetecConstant() {
  return request({
    url: '/om/detection_type/constant',
    method: 'get',
    data: ''
  })
}

//新增、编辑
export function addDetec(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_type/save',
    method: 'post',
    data: data
  })
}

//删除
export function delDetec(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_type/delete',
    method: 'post',
    data: data
  })
}
