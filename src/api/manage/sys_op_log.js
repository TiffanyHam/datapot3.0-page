import request from '../../request.js'
import qs from 'qs'

//操作日志列表数据
export function getSyslogPage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/log/log_query',
    method: 'post',
    data: data
  })
}

//登录日志列表
export function getSysloginPage(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/login_log/login_query',
    method: 'post',
    data: data
  })
}
