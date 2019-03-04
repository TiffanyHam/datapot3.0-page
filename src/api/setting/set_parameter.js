import request from '../../request.js'
import qs from 'qs'

//获取列表
export function getParams() {
  return request({
    url: '/om/params/get_params',
    method: 'get',
    data: ''
  })
}

//设置参数
export function setParam(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/params/save_or_update_param',
    method: 'post',
    data: data
  })
}