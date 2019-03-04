import request from '../../request.js'
import qs from 'qs'


//仪表盘初始化数据
export function dashboardTbl_init(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/detection_threat/dashboard_data',
    method: 'post',
    data: data
  })
}
//报告初始化数据
export function hostResults_init(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/om/reports/reports_date',
    method: 'post',
    data: data
  })
}
//常量  威胁阶段
export function constantSta() {
  return request({
    url: '/om/reports/constant',
    method: 'get',
    data: ''
  })
}
//威胁类型
export function constantTy() {
  return request({
    url: '/om/detection_type/detection_types',
    method: 'get',
    data: ''
  })
}
// obj转为{name1:value1}形式的数组
export function objToArr(obj) {
  var arr = []
  for (let i in obj) {
    /* let o = {};
     o = obj[i];*/
    //  arr.push(o)
    arr.push({
      'name': i,
      'value': obj[i]
    });
  }
  return arr;
}
