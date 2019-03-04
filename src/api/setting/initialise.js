import request from '../../request.js'
import qs from 'qs'

//同步数据
export function setSysInit(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/initialise/sync_init.json',
    method: 'post',
    /*headers: {'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'},*/
    data: data
  })
}