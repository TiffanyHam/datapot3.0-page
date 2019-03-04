//日期格式化
export function dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
  var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
  var d = new Date(str);
  var year = d.getFullYear();
  var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
  var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
  var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
  var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
  var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
  if(hasTime){
    return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
  }else{
    return [year, month, day].join('-');
  }
}
