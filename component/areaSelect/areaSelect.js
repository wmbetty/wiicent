let __areaData = {
  __res_name:'',
  __res_path:'',
  index1:0,
  index2:0,
  index3:0,
  index4:0,
  index5:0,
  positionKey1:[0],
  positionArr1:['亚洲'],
  positionKey2:[0],
  positionArr2:['中国'],
  positionKey3:[0],
  positionArr3:['请选择'],
  positionKey4:[0],
  positionArr4:['请选择'],
  positionKey5:[0],
  positionArr5:['请选择']
}
function selectArea(){
  let pages = getCurrentPages();
  let curPage = pages[pages.length-1];
  this._page = curPage;
  Object.assign(curPage,__areaEvent,__areaMethod);
  curPage.setData(__areaData);
  curPage.selectArea = this;
  return this;
}

export {selectArea}

let __areaMethod = {
  __init_data:function(){
    wx.request({
        url: app.globalData.url+'/area/areaList?sid='+that.data.sid,
        method:'POST',
        data: {
          'fid':0,
          'areaType':areaType,
          'path':path,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            console.log(res.data.result);
            var data = res.data.result['Area.list'];
            var a = [];
            var b = [];
            for (var i = 0; i < data.length; i++){
              if (data[i].id&&data[i].name&&data[i].path){
                var e = {id:data[i].id,path:data[i].path};
                a.push(data[i].name);
                b.push(e);
              }
            }
            that.setData({
              index1:0,
              positionKey1:b,
              positionArr1:a
            });
          }
        }
    });
    wx.request({
        url: app.globalData.url+'/area/areaList?sid='+that.data.sid,
        method:'POST',
        data: {
            'fid':1,
            'areaType':areaType,
            'path':path,
            'app':appValue,
            'platform':platform,
            'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
              console.log(res.data.result);
              var data = res.data.result['Area.list'];
              var a = [];
              var b = [];
              for (var i = 0; i < data.length; i++){
                if (data[i].id&&data[i].name&&data[i].path&&data[i].pname){
                  var e = {id:data[i].id,path:data[i].path,pname:data[i].pname};
                  a.push(data[i].name);
                  b.push(e);
                }
              }
              that.setData({
                index2:0,
                positionKey2:b,
                positionArr2:a
              });
          }
        }
    })
    wx.request({
        url: app.globalData.url+'/area/areaList?sid='+that.data.sid,
        method:'POST',
        data: {
            'fid':7,
            'areaType':areaType,
            'path':path,
            'app':appValue,
            'platform':platform,
            'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            console.log(res.data.result);
            var data = res.data.result['Area.list'];
            var a = [];
            var b = [];
            var c = ['请选择'];
            var d = [{id:0,path:''}];
            for (var i = 0; i < data.length; i++){
              if (data[i].id&&data[i].name&&data[i].path&&data[i].pname){
                var e = {id:data[i].id,path:data[i].path,pname:data[i].pname};
                a.push(data[i].name);
                b.push(e);
              }
            }
            a = c.concat(a);
            b = d.concat(b);
            that.setData({
              index3:0,
              positionKey3:b,
              positionArr3:a
            });
          }
        }
    })
  }
}

let __areaEvent = {

}