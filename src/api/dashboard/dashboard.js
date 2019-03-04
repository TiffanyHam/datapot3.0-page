import request from '../../request.js'
import qs from 'qs'

//初始化数据
export function dashboardTbl_init() {
  return request({
    url: '/om/detection_threat/dashboard_data',
    method: 'post',
    data: ''
  })
}
//仪表盘页面点击主机名跳转页面
export function pageTransition() {
  return request({
    url: '/om/host_threat/index',
    method: 'post',
    data: ''
  })
}
//核心资产 --主机跳转到  主机检测模式
export function hostTransition() {
  return request({
    url: '/om/host_threat/index',
    method: 'post',
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
