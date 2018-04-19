var app = getApp();
Page({
    data:{
      sid:'',
      path:'',
      region:'',
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
      positionArr5:['请选择'],
      isAddNewPosition:true,
      positionText:''
    },
    onLoad:function(option){
      var sid = '';
      try {
        sid = wx.getStorageSync('sid');
        if (sid=='') {
          wx.reLaunch({
            url: "../login/login"
          })
        }else{
          this.setData({
            sid:sid
          });
        }
      }catch(e){}
    },
    onShow:function(){
      var that = this;
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      var areaType = '';
      var path = '';
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
    },
    bindPickerChange:function(e){
      var that = this;
      var role = e.currentTarget.dataset.id;
      var index = e.detail.value;
      switch (role) {
        case 'state':
          this.setData({
            index1:index,
            index2:0,
            index3:0,
            index4:0,
            index5:0
          });
          if (true) {
            var fid = this.data.positionKey1[index].id;
            var areaType = '';
            var path = '';
            var appValue = app.globalData.app;
            var platform = app.globalData.platform;
            var ver = app.globalData.ver;
            wx.request({
              url: app.globalData.url+'/area/areaList?sid='+this.data.sid,
              method:'POST',
              data: {
                  'fid':fid,
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
                      positionKey2:b,
                      positionArr2:a,
                      positionKey3:[{id:0,path:'',pname:''}],
                      positionArr3:['请选择'],
                      positionKey4:[{id:0,path:'',pname:''}],
                      positionArr4:['请选择'],
                      positionKey5:[{id:0,path:'',pname:''}],
                      positionArr5:['请选择']
                    });
                }
              }
            })
          }
          break;
        case 'country':
          this.setData({
            index2:index,
            index3:0,
            index4:0,
            index5:0
          });
          if (true) {
            var fid = this.data.positionKey2[index].id;
            var areaType = '';
            var path = '';
            var appValue = app.globalData.app;
            var platform = app.globalData.platform;
            var ver = app.globalData.ver;
            wx.request({
              url: app.globalData.url+'/area/areaList?sid='+this.data.sid,
              method:'POST',
              data: {
                  'fid':fid,
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
                      positionKey3:b,
                      positionArr3:a,
                      positionKey4:[{id:0,path:'',pname:''}],
                      positionArr4:['请选择'],
                      positionKey5:[{id:0,path:'',pname:''}],
                      positionArr5:['请选择']
                    });
                }else{
                  var region = that.data.positionArr2[index];
                  var path = that.data.positionKey2[index].path;
                  that.setData({
                    path:path,
                    region:region
                  });
                }
              }
            })
          }
          break;
        case 'province':
          this.setData({
            index3:index,
            index4:0,
            index5:0,
          });
          if (index!=0) {
            var fid = this.data.positionKey3[index].id;
            var areaType = '';
            var path = '';
            var appValue = app.globalData.app;
            var platform = app.globalData.platform;
            var ver = app.globalData.ver;
            wx.request({
              url: app.globalData.url+'/area/areaList?sid='+this.data.sid,
              method:'POST',
              data: {
                  'fid':fid,
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
                      positionKey4:b,
                      positionArr4:a,
                      positionKey5:[{id:0,path:'',pname:''}],
                      positionArr5:['请选择']
                    });
                }else{
                  var region = that.data.positionArr3[index];
                  var path = that.data.positionKey3[index].path;
                  that.setData({
                    region:region,
                    path:path
                  });
                }
              }
            })
          }
          break;
        case 'city':
          this.setData({
            index4:index,
            index5:0
          });
          if (index!=0) {
            var fid = this.data.positionKey4[index].id;
            var areaType = '';
            var path = '';
            var appValue = app.globalData.app;
            var platform = app.globalData.platform;
            var ver = app.globalData.ver;
            wx.request({
              url: app.globalData.url+'/area/areaList?sid='+this.data.sid,
              method:'POST',
              data: {
                  'fid':fid,
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
                      positionKey5:b,
                      positionArr5:a
                    });
                }else{
                  var region = that.data.positionArr4[index];
                  var path = that.data.positionKey4[index].path;
                  that.setData({
                    path:path,
                    region:region
                  });
                }
              }
            })
          }
          break;
        case 'district':
          this.setData({
            index5:index
          });
          if (index!=0) {
            var region = this.data.positionArr5[index];
            var path = this.data.positionKey5[index].path;
            this.setData({
              path:path,
              region:region
            });
          }
        break;
      }
    },
    initLocationPicker:function(){
      var that = this;
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      var areaType = '';
      var path = '';
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
            var data = res.data.result['Area.list'];
            var a = [];
            var b = [];
            var c = ['请选择'];
            var d = [{id:0,path:''}];
            for (var i = 0; i < data.length; i++){
              if (data[i].id&&data[i].name&&data[i].path){
                var e = {id:data[i].id,path:data[i].path};
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
      this.setData({
        index4:0,
        index5:0,
        positionKey4:[{id:0,path:''}],
        positionArr4:['请选择'],
        positionKey5:[{id:0,path:''}],
        positionArr5:['请选择'],
        positionText:''
      });
    },
    confirmSelect:function(e){
      var positionText = this.data.positionText;
      var a = [];
      var b = [];
      var c = [];
      a.push(this.data.positionKey1);
      a.push(this.data.positionKey2);
      a.push(this.data.positionKey3);
      a.push(this.data.positionKey4);
      a.push(this.data.positionKey5);

      b.push(this.data.index1);
      b.push(this.data.index2);
      b.push(this.data.index3);
      b.push(this.data.index4);
      b.push(this.data.index5);

      c.push(this.data.positionArr1);
      c.push(this.data.positionArr2);
      c.push(this.data.positionArr3);
      c.push(this.data.positionArr4);
      c.push(this.data.positionArr5);

      for (var i=(b.length-1);i>=0;i--) {
        if (b[i]!=0) {
          var region = positionText==""?c[i][b[i]]:positionText;;
          var path = a[i][b[i]].path;
          this.setData({
            region:region,
            path:path
          });
          console.log(region);
          console.log(path);
          break;
        }else{
          var region = positionText==""?'中国':positionText;
          var path = ',1,7,';
          this.setData({
            path:path,
            region:region
          });
        }
      }

      var that = this;
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      if (this.data.path==''||this.data.region=='') {
        wx.showModal({
          title: '提示',
          content: '区域不能为空',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        return;
      }
      var pages = getCurrentPages();
      var prePage = pages[pages.length-2];
      var formData = prePage.data.formData;
      formData.destiCity = this.data.region;
      formData.destiPath = this.data.path;
      prePage.setData({
        formData:formData
      })
      wx.navigateBack({
        delta:1
      });
    },
    positionListener:function(e){
      var value = e.detail.value;
      this.setData({
        positionText:value
      });
    }
})