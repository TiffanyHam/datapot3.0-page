import request from '../../request.js'
import qs from 'qs'

export function getCompanyIpPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/company_ip/query',
    method: 'post',
    data: data
  })
}

export function addCompanyIP(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/company_ip/save',
    method: 'post',
    data: data
  })
}

export function getOfficeAll() {
  return request({
    url: '/sys/sys_office/find_all',
    method: 'get',
    data: ''
  })
}

export function delCompanyIP(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/company_ip/delete',
    method: 'post',
    data: data
  })
}

