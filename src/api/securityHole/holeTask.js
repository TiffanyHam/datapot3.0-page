//扫描任务
import request from "../../request";
import qs from "qs";

export function taskSearch(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/schedule/search',
    method: 'POST',
    data: data
  })
}
//指定扫描任务详情
export function taskDetail(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/schedule/detail',
    method: 'POST',
    data: data
  })
}
//指定任务中的IP移除
export function deteTmip(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/schedule/rmip',
    method: 'POST',
    data: data
  })
}
//漏洞定时扫描任务
export function scanHoleSettime(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/schedule/reschedule',
    method: 'POST',
    data: data
  })
}
//端口定时任务
export function scanPortSettime(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/nmap/schedule/create',
    method: 'POST',
    data: data
  })
}
//漏洞定时扫描任务-终止
export function scanHoleSettimeEnd(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/schedule/stop',
    method: 'POST',
    data: data
  })
}
//端口定时扫描任务-终止
export function scanPortSettimeEnd(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/nmap/schedule/stop',
    method: 'POST',
    data: data
  })
}

