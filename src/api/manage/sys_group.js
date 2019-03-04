import request from '../../request.js'
import qs from 'qs'

//列表数据
export function getSysGroupPage(param) {
  var data = qs.stringify(param);
  return request({
    url: '/sys/group/query',
    method: 'post',
    data: data
  })
}

//新增、编辑
export function getSysGroupInsert(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/group/save',
    method: 'post',
    data: data
  })
}

//树形菜单/表单id
export function getTreeMenu(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/menu/get_menus_userid',
    method: 'post',
    data: data
  })
}


export function getTreeMenuId(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/menu/get_menus_groupid',
    method: 'post',
    data: data
  })
}



//保存
export function getAuth(param) {
  var data = qs.stringify(param);//qs.stringify()将对象 序列化成URL的形式，以&进行拼接
  return request({
    url: '/sys/group/add_auth',
    method: 'post',
    data: data
  })
}

// 循环出父节点
export function toTreeData(data,id,pid,name) {
  // 建立个树形结构,需要定义个最顶层的父节点，pid是0
  let parent = [];
  for (let i = 0; i < data.length; i++) {
   // console.log(data[i][pid])
    if(data[i][pid] !== 0){
    }else{
      let obj = {
        label: data[i][name],
        id: data[i][id],
        children: []
      };
      parent.push(obj);//数组加数组值
    }
  }
  children(parent);

  // 调用子节点方法,参数为父节点的数组
  function children(parent) {
   // console.log(parent)
    if (data.length !== 0) {
      for (let i = 0; i < parent.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (parent[i].id == data[j][pid]){
            let obj = {
              label: data[j][name],
              id: data[j][id],
              children: []
            };
            parent[i].children.push(obj);
          }
        }
        children(parent[i].children);
      }
    }
  }
  return parent;
}




