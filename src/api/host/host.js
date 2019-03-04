import request from '../../request.js'
import qs from 'qs'


/*
* 首页
 */

//主机table
export function gethostPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_threat/query', // '/om/host_threat/get_infos'
    method: 'POST',
    data: data
  })
}

//图表数据
export function gethostChart(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_threat/get_host_threat',
    method: 'POST',
    data: data
  })
}

//单个折线图
export function pointerChart(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_threat/get_host_threat_dialog',
    method: 'POST',
    data: data
  })
}

//主机信息
export function hostInfomtion(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_threat/get_detet_infos.json',
    method: 'POST',
    data: data
  })
}


/*
* 检测模式
 */
//chart、table
export function gethostDatailPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_threat/get_detect_host_line',
    method: 'POST',
    data: data
  })
}
//流量上下行趋势
export function getFlowChart(param, url) {
  var data = qs.stringify(param);
  return request({
    url: url,
    method: 'POST',
    data: data
  })
}

/*
* 关联模式
 */
//table
export function getContactPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_threat_detail/get_host_detail',
    method: 'POST',
    data: data
  })
}
//chart
export function getContactChart(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_threat_detail/get_host_detail_extenal',
    method: 'POST',
    data: data
  })
}


/*
* 检测详情
 */
//table
export function getDetecDatailPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_activity/get_activities',
    method: 'POST',
    data: data
  })
}

//时间戳
export function getDetecTimeShaft(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_threat/get_host_threat',
    method: 'POST',
    data: data
  })
}

//检测摘要
export function getDetecabstract(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_activity/get_host_active',
    method: 'POST',
    data: data
  })
}

//添加标签
export function getLabelData(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_tag/get_tags_infos',
    method: 'POST',
    data: data
  })
}
export function addLabel(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/host_tag/host_tags_save',
    method: 'POST',
    data: data
  })
}

//处理
export function getDispotData(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detect_triage/edit',
    method: 'POST',
    data: data
  })
}
export function saveDispotData(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detect_triage/save',
    method: 'POST',
    data: data
  })
}


//获取威胁等级颜色
export function threatGradeFun(threat, certainty){
  
  var x = certainty;
  var y = threat;
  
  //危急状态
  var class_a = '';
  if (x <= 0 && y <= 0){
    //安全
    class_a = 'roundBgc_dgray';
  } else if (x < 50 && y < 50) {
    //低危
    class_a = 'roundBgc_gray';
  } else if (x < 50 && y >= 50) {
    //高危
    class_a = 'roundBgc_orange';
  } else if (x >= 50 && y < 50) {
    //中级
    class_a = 'roundBgc_yellow';
  } else if (x >= 50 && y >= 50) {
    //严重
    class_a = 'roundBgc_red';
  }
  
  return class_a;
}