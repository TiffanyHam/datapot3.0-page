import request from '../../request.js'
import qs from 'qs'


//主机table
export function gethostPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/detection_threat/query',
    method: 'POST',
    data: data
  })
}
