import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getTagsPage(param) {
  var data = qs.stringify(param)
  return request({
    url: '/om/host_tag/get_infos',
    method: 'post',
    data: data
  })
}

//新增、编辑
export function getTagsInsert(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/host_tag/save',
    method: 'post',
    data: data
  })
}
//删除
export function getTagsDel(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/host_tag/delete',
    method: 'post',
    data: data
  })
}
