function MapabcEncryptToBdmap(gg_lat, gg_lon){
  var point=new Object();
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = new Number(gg_lon);
  var y = new Number(gg_lat);
  var z =  Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  var bd_lon = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  point.lng=bd_lon;
  point.lat=bd_lat;
  return point;
}
function BdmapEncryptToMapabc(bd_lat,bd_lon){
  var point=new Object();
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = new Number(bd_lon - 0.0065);
  var y = new Number(bd_lat - 0.006);
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var Mars_lon = z * Math.cos(theta);
  var Mars_lat = z * Math.sin(theta);
  point.lng=Mars_lon;
  point.lat=Mars_lat;
  return point;
}
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }
  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function getDate(a) {
  var time = {};
  if (a!=''&&a) {
    time = new Date(a);
  }else{
    time = new Date()
  }
  var year = time.getFullYear()
  var month = time.getMonth()+1
  month = month < 10 ? '0' + month : month
  var day = time.getDate()
  day = day < 10 ? '0' + day : day
  return [year, month, day].join('-')
}

function getTime() {
  var time = new Date()
  var hours = time.getHours()
  hours = hours < 10 ? '0' + hours : hours
  var minute = time.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = time.getSeconds()
  second = second < 10 ? '0' + second : second
  /*return [hours, minute, second].join(':')*/
  return [hours, minute].join(':')
}

function timeFormat(b){
    var c = '';
    /*显示设置*/
    if (b/(3600*1000)<1){
      c = Math.ceil(b/(60*1000))+'分前';
    }else if(b/(24*3600*1000)<1){
      c = Math.floor(b/(3600*1000))+'小时前';
    }else if(b/(30*24*3600*1000)<1){
      c = Math.floor(b/(24*3600*1000))+'天前';
    }else{
      c = Math.floor(b/(30*24*3600*1000))+'月前';
    };
    return c!=NaN?c:'';
}
function getDistance(lat1,lng1,lat2,lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;//返回距离为km
}
function toTimestamp(a){
  var b = a.split(' ')[0].split('-');//xxxx-xx-xx xx:xx:xx
  var c = a.split(' ')[1].split(':');
  var year = Number(b[0]);
  var month = Number(b[1]-1);
  var day = Number(b[2]);
  var hour = Number(c[0]);
  var minute = Number(c[1]);
  var second = Number(c[2]);
  var d = Date.parse(new Date(year,month,day,hour,minute,second));
  return (d!=NaN)?d:'';
}
module.exports = {
  formatTime: formatTime,
  getDate: getDate,
  getTime: getTime,
  timeFormat:timeFormat,
  getDistance:getDistance,
  toTimestamp:toTimestamp,
  MapabcEncryptToBdmap:MapabcEncryptToBdmap,
  BdmapEncryptToMapabc:BdmapEncryptToMapabc
}
