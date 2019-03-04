//时间戳转时间
export function timestampToTime(datetimes) {
  var date = new Date(datetimes),
    Y = date.getFullYear() + '-',
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
    D = date.getDate() + ' ',
    //  h = date.getHours() + ':',
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
    //  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
    m = date.getMinutes();
  //s = date.getSeconds();
  M < 10 ? M='0'+M : M=M;
  D < 10 ? D='0'+D : D=D;
  h < 10 ? h='0'+h : h=h;
  m < 10 ? m='0'+m : m=m;

  //年 月 日 时 分
  return Y+M+D+h+m;
}

//日期格式化  2018-11-17
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

//只有日期
export function dateFormatter1(str) {//默认返回yyyy-MM-dd HH-mm-ss
  var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
  var d = new Date(str);
  var year = d.getFullYear();
  var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  if (hasTime) {
    return [year, month, day].join('-');
  }
}

/*2018-11-17 13:51:38*/
//时间格式化函数，此处仅针对yyyy-MM-dd 的格式进行格式化
export function dateFormat(time) {
  var date=new Date(time);
  var year=date.getFullYear();
  /* 在日期格式中，月份是从0开始的，因此要加0
   * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
   * */
  var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
  var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
  var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
  var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
  var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
  // 拼接
  return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
}

//获取前一天日期
export function dateFormatPrev() {
  var curDate = new Date();
  var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
  var day = preDate.getDate();
  var year = preDate.getFullYear();
  var month = (preDate.getMonth() + 1) < 10 ? '0' + (preDate.getMonth() + 1) : (preDate.getMonth() + 1);
  return year+"-"+month+"-"+day;
}
