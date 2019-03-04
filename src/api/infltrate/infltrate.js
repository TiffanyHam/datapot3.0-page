import request from '../../request.js'
import qs from 'qs'

//渗透测试
export function infRsult(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/start',
    method: 'POST',
    data: data
  })
}

//近期结果列表
export function getResult(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/jobs/list?'+data,
    method: 'GET',
    data: ''
  })
}


//删除测试结果
export function deleteJob(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/jobs/delete',
    method: 'POST',
    data: data
  })
}

//立即结束测试
export function killJob(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/kill_job',
    method: 'POST',
    data: data
  })
}

//查看测试、培训进度
export function getStatus(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/status?'+data,
    method: 'GET',
    data: ''
  })
}

//导出
/*export function getReport(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/report?'+data,
    method: 'GET',
    data: data
  })
}*/

//详情
export function getTargetInfo() {
  return request({
    url: '/om/deepexploit/target_info',
    method: 'GET',
    data: ''
  })
}

//端口详情
export function getTargetDetail(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/detail?'+data,
    method: 'GET',
    data: ''
  })
}

//统计
export function getTotalCount(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/deepexploit/total_count?'+data,
    method: 'GET',
    data: ''
  })
}


/*
* web测试
 */


//目标列表
export function targetList(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/searchTarget?'+data,
    method: 'GET',
    data: ''
  })
}
//扫描列表
export function sancanList(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/searchScan?'+data,
    method: 'GET',
    data: ''
  })
}
//目标漏洞
export function targetHole(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/searchVulnForTarget?'+data,
    method: 'GET',
    data: ''
  })
}
//扫描漏洞
export function scanHole(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/searchVulnForScan?'+data,
    method: 'GET',
    data: ''
  })
}
//新增目标
export function addTarget(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/add_target',
    method: 'POST',
    data: data
  })
}
//修改目标
export function updTarget(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/updateUrl',
    method: 'POST',
    data: data
  })
}
//删除目标、删除扫描任务
export function removeTarget(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/delete',
    method: 'POST',
    data: data
  })
}
//开始扫描
export function scanTarget(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/start_scan',
    method: 'POST',
    data: data
  })
}

//停止扫描
export function stopScan(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/stop_scan',
    method: 'POST',
    data: data
  })
}

//扫描报告查询
export function getReportsPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/searchReportForScan?'+data,
    method: 'GET',
    data: ''
  })
}

//生成报告
export function getReports(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/webexploit/reports',
    method: 'POST',
    data: data
  })
}