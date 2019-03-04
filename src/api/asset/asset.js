import request from '../../request.js'
import qs from 'qs'

//资产列表
export function assetPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/search',
    method: 'POST',
    data: data
  })
}

//新增资产
export function addAssetAPI(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/add',
    method: 'POST',
    data: data
  })
}

//修改资产
export function updateAssetAPI(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/updateinfo/all',
    method: 'POST',
    data: data
  })
}

//资产详情
export function assetInfo(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/detail',
    method: 'POST',
    data: data
  })
}

//端口列表
export function portListInfo(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/port/page',
    method: 'POST',
    data: data
  })
}

//附件信息更新
export function updateAttach(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/attach/update',
    method: 'POST',
    data: data
  })
}
//漏洞详情列表
export function holeInfo(ulr) {
  return request({
    url: ulr,
    method: 'GET',
    data: ''
  })
}
//漏洞列表-初始化参数
export function holePrams(param) {
  return request({
    url: '/om/vuln/constants',
    method: 'GET',
    data: ''
  })
}

//漏洞列表
export function holeList(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/manager/search',
    method: 'post',
    data: data
  })
}


//漏洞处理
export function dispotHoleStatus(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/manager/fix',
    method: 'POST',
    data: data
  })
}

//资产详情-漏洞列表-详情
export function holeListInfo(url) {
  return request({
    url: url,
    method: 'POST',
    data: {}
  })
}

//端口处理
export function dispotPortStatus(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/port/deal_port?'+data,
    method: 'GET',
    data: ''
  })
}



//资产扫描
export function scanAsset(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/scan',
    method: 'POST',
    data: data
  })
}

//端口扫描
export function scanPort(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/assets/port/scan',
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

//端口定时扫描任务-终止
export function scanPortSettimeEnd(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/nmap/schedule/stop',
    method: 'POST',
    data: data
  })
}

//漏洞扫描 
export function scanHole(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/scan/launch',
    method: 'POST',
    data: data
  })
}

//漏洞定时扫描任务
export function scanHoleSettime(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/schedule/create',
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

//漏洞扫描批量取消
export function holeScanEnd(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/scan/stopTask',
    method: 'POST',
    data: data
  })
}


//资产、端口扫描状态(初始化)
export function scanState() {
  return request({
    url: '/om/scantask/taskStatus',
    method: 'POST',
    data: {}
  })
}

//漏洞扫描状态（初始化）
export function holeState() {
  return request({
    url: '/om/vuln/scan/running',
    method: 'POST',
    data: {}
  })
}

//端口扫描进度
export function portProgress(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/scantask/status',
    method: 'POST',
    data: data
  })
}

//漏洞扫描进度
export function holeProgress(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/scan/task',
    method: 'POST',
    data: data
  })
}

//漏洞扫描单个任务进度
export function holeSingeProgress(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/vuln/scan/status',
    method: 'POST',
    data: data
  })
}


//扫描记录
export function scanRecord(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/scantask/search',
    method: 'POST',
    data: data
  })
}

//扫描任务
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

//所属机构
export function organization() {
  return request({
    url: '/sys/sys_office/find_all',
    method: 'POST',
    data: {}
  })
}


//设备类型
export function assetsType() {
  return request({
    url: '/om/assets/constants',
    method: 'GET',
    data: {}
  })
}

//网段列表
export function ipsParagraph() {
  return request({
    url: '/om/scan/assets/records',
    method: 'GET',
    data: {'limit': ''}
  })
}

//新增网段
export function addIPs(param) {
  var data = qs.stringify(param); 
  return request({
    url: '/om/scan/assets/add',
    method: 'POST',
    data: data
  })
}

//删除网段
export function delIPS(param) {
  var data = qs.stringify(param); 
  return request({
    url: '/om/scan/assets/delete',
    method: 'POST',
    data: data
  })
}