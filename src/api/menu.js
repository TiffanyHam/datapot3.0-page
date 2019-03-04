import request from '../request.js'
import qs from 'qs'

export function getMenu() {
  return request({
    url: '/sys/menu/level_menus',
    method: 'post',
    data: {}
  })
}

export function getSecondMenus(menuId) {
  var param = qs.stringify({'menuId':menuId})
  return request({
    url: '/sys/menu/second_level_menus',
    method: 'get',
    data: param
  })
}