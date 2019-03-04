import request from '../request.js'

export function getDetecListPage(url, params) {
  return request({
    url: url,
    method: 'get',
    params: params
  })
}

export function getDetecPost(url, params) {
  return request({
    url: url,
    method: 'post',
    params: params
  })
}
