import request from '../../request.js'
import qs from 'qs'

//获取检测页table
export function getDectecPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_threat/query',
    method: 'POST',
    data: data
  })
}

//获取检测页chart
export function getDectecChart(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_threat/get_detections',
    method: 'POST',
    data: data
  })
}


