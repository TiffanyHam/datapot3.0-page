import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getSnortAlertPage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/snort_alert/snort_alert_query',
    method: 'post',
    data: data
  })
}
//威胁类型
export function getClassTypeAll() {
  return request({
    url: '/om/snort_alert/constant',
    method: 'post',
    data: ''
  })
}
//详情
export function getDetailsAll(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/snort_alert/get_info',
    method: 'post',
    data: data
  })
}


//导出
/*export function getExport(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/snort_alert/export',
    method: 'get',
    data: data
  })
}*/
export function getDown(url) {
  //var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: url,
    method: 'post',
    data: ''
  })
}
