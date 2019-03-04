import request from '../../request.js'
import qs from 'qs'

/* http事件总数、流量趋势图*/
export function analysisNum() {
  return request({
    url: '/om/httpflow/flow_trend',
    method: 'post',
    data:''
  })
}

/*http请求方式、响应码、城市top10、源IpTop10、目标IpTop10*/
export function analyzeCharts() {
  return request({
    url: '/om/httpflow/method_code',
    method: 'post',
    data:''
  })
}
//仪表盘初始化数据
export function dashboardTbl_init() {
  return request({
    url: '/om/detection_threat/dashboard_data',
    method: 'post',
    data: ''
  })
}
