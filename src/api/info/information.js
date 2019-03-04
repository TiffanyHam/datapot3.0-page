import request from '../../request.js'
import qs from 'qs'


export function search(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/cif/search',
    method: 'POST',
    data: data
  })
}
