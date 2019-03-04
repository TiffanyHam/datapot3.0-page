import request from '../../request.js'
import qs from 'qs'

//初始化数据
export function topDataName() {
  return request({
    url: '/om/over_view/get_tops',
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


//城市Ip、协议占比
export function upAndDowData() {
  return request({
    url: '/om/over_view/get_event_updown',
    method: 'post',
    data:''
  })
}

//日志分析
export function LogData(){
   return request({
     url:'/om/over_view/get_file_info',
     method:'post',
     data:''
   })
}
//流量趋势
export function upAndDowDataNew() {
  return request({
    url: '/om/oct/day',
    method: 'get',
    data:''
  })
}

//外网IP访问流量TOP10
export function topDataNameNew(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/oct/out',
    method: 'get',
    data:data
  })
}

//内网IP访问流量TOP10
export function topDataIpNew(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/oct/in',
    method: 'get',
    data:data
  })
}
