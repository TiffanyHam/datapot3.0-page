import request from '../../request.js'
import qs from 'qs'

//初始化数据
export function getFlowData(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/flowview/getFlowViewByIp',
    method: 'post',
    data: data
  })
}