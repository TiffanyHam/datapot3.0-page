import request from "../../request";
import qs from "qs";

//扫描记录
export function scanRecord(param) {
  var data = qs.stringify(param);
  return request({
    url: '/om/scantask/search',
    method: 'POST',
    data: data
  })
}
