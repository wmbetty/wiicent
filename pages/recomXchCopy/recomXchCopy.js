var app = getApp();
Page({
  data:{
    xid:'',
    sid:'',
    formData:{
      name:'',
      startPath:'',
      startL:'',
      startDate:''
    },
    isFormShow:true,
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
    var that = this;
    var xid = option.xid;
    var cxSn = option.cxSn;
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid
        });
      }
    } catch (e) {}
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
  changeData(e){
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    var formData = this.data.formData;
    formData[id] = value;
    this.setData({
      formData:formData
    });
  },
  submit:function(e){
    if (this.data.formData.name=='') {
      wx.showModal({
        title: '提示',
        content: '行程名称不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (this.data.formData.startL==''||this.data.formData.startPath=='') {
      wx.showModal({
        title: '提示',
        content: '出发地区不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (this.data.formData.startDate=='') {
      wx.showModal({
        title: '提示',
        content: '出发日期不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseCopy?sid='+this.data.sid,
      method:'POST',
      data: {
          'xid':this.data.xid,
          'title':this.data.formData.name,
          'startCity':this.data.formData.startL,
          'startPath':this.data.formData.startPath,
          'startDate':this.data.formData.startDate,
          'app':appValue,
          'platform':platform,
          'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code=="10000") {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: '创建失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  bindPickerChange:function(e){
    var that = this;
    var role = e.currentTarget.dataset.id;
    var index = e.detail.value;
    var formData = this.data.formData;
    var positionRole = this.data.positionRole;
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
                if (true) {
                  formData.startL = that.data.positionArr2[index];
                  formData.startPath = that.data.positionKey2[index].path;
                  that.setData({
                    formData:formData,
                    isFormShow:true
                  });
                  wx.setNavigationBarTitle({
                    title: '复制行程'
                  });
                  that.initLocationPicker();
                }
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
                if (true) {
                  formData.startL = that.data.positionArr3[index];
                  formData.startPath = that.data.positionKey3[index].path;
                  that.setData({
                    formData:formData,
                    isFormShow:true
                  });
                  wx.setNavigationBarTitle({
                    title: '复制行程'
                  });
                  that.initLocationPicker();
                }
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
                if (true) {
                  formData.startL = that.data.positionArr4[index];
                  formData.startPath = that.data.positionKey4[index].path;
                  that.setData({
                    formData:formData,
                    isFormShow:true
                  });
                  wx.setNavigationBarTitle({
                    title: '复制行程'
                  });
                  that.initLocationPicker();
                }
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
          if (true) {
            formData.startL = this.data.positionArr5[index];
            formData.startPath = this.data.positionKey5[index].path;
            this.setData({
              formData:formData,
              isFormShow:true
            });
            wx.setNavigationBarTitle({
              title: '复制行程'
            });
            this.initLocationPicker();
          }
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
  goSelectPosition:function(e){
    this.setData({
      isFormShow:false
    });
    wx.setNavigationBarTitle({
      title: '地区选择'
    });
  },
  cancelSelect:function(e){
    this.setData({
      isFormShow:true
    });
    wx.setNavigationBarTitle({
      title: '复制行程'
    });
    this.initLocationPicker();
  },
  confirmSelect:function(){
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

    var formData = this.data.formData;
    var positionText = this.data.positionText;
    for (var i=(b.length-1);i>=0;i--) {
      if (b[i]!=0) {
        if (true) {
          formData.startL = positionText==""?c[i][b[i]]:positionText;
          formData.startPath = a[i][b[i]].path;
          this.setData({
            formData:formData,
            isFormShow:true
          });
          wx.setNavigationBarTitle({
            title: '复制行程'
          });
          this.initLocationPicker();
        }
        return;
      }else{
        if (true) {
          formData.startL = positionText==""?'中国':positionText;
          formData.startPath = ',1,7,';
          this.setData({
            formData:formData,
            isFormShow:true
          });
          wx.setNavigationBarTitle({
            title: '复制行程'
          });
          this.initLocationPicker();
        }
      }
    }
  },
  positionListener:function(e){
    var value = e.detail.value;
    this.setData({
      positionText:value
    });
  }
})