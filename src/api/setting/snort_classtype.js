import request from '../../request.js'
import qs from 'qs'

//获取列表
export function getSCTypePage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/snort_classtype/query',
    method: 'post',
    data: data
  })
}

//上传
export function upLoad(param) {
 //var data = qs.stringify(param);
  return request({
    url: '/om/snort_classtype/import_excel',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: param
  })
}