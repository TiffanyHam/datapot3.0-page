import request from '../../request.js'
import qs from 'qs'

//访问次数统计
export function getChartDate(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/flow/flow_trend',
    method: 'post',
    data:data
  })
}
//访问流量统计
export function getChartDateNew(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/oct/his',
    method: 'post',
    data:data
  })
}

//次数table
export function getTblData(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/flow/flow_infos',
    method: 'post',
    data:data
  })
}

//流量table
export function getTblDataNew(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/flow/flow_infos',
    method: 'post',
    data:data
  })
}
