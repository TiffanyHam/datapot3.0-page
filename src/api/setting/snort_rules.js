import request from '../../request.js'
import qs from 'qs'

//获取列表
export function getSRulesPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/snort_rule/query',
    method: 'post',
    data: data
  })
}

//获取常量
export function getRCons() {
  return request({
    url: '/om/snort_rule/constant',
    method: 'get',
    data: ''
  })
}

//详情
export function getRulesInfo(param) {
 var data = qs.stringify(param);
  return request({
    url: '/om/snort_rule/get_info',
    method: 'post',
    data: data
  })
}

//上传
export function upLoad(param) {
 //var data = qs.stringify(param);
  return request({
    url: '/om/snort_rule/save',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    /*contentType: "multipart/form-data",*/
    data: param
  })
}