import request from '../../request.js'
import qs from 'qs'

//获取列表
export function getJConfigPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/job_config/query',
    method: 'post',
    data: data
  })
}

//禁用或启用
export function isActive(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/job_config/active',
    method: 'post',
    data: data
  })
}