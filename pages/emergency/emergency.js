var app = getApp();
Page({
  data:{
    xid:'',
    sid:'',
    xchSn:'',
    isSelectPosition:false,
    isFormShow:true,
    materialData:{
    	title:'',
    	content:'',
    	file:'',
      coImage:0,
      phone:'',
      location:'',
      path:''
    },
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
    var xid = option.xid;
    var xchSn = option.xchSn;
    var id = option.id;
    var coDay = option.coDay;
    var sid = '';
    var dayListData = [];
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:14,
            xchSn:xchSn
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
  goSelectPosition:function(e){
    this.setData({
      isSelectPosition:true,
      isFormShow:false,
    });
  },
  getAlbum:function(e){
    var that = this;
    try{
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: function (res) {
          console.log(res);
          var materialData = that.data.materialData;
          materialData['file'] = res.tempFiles[0].path;
          that.setData({
            materialData:materialData
          });
        }
      })
    }catch(e){}
  },
  getPhoto:function(e){
    var that = this;
    try{
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['camera'],
        success: function (res) {
          console.log(res);
          var materialData = that.data.materialData;
          materialData['file'] = res.tempFiles[0].path;
          that.setData({
            materialData:materialData
          });
        }
      })
    }catch(e){}
  },
  inputListener:function(e){
    var materialData = this.data.materialData;
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    materialData[id] = value;
    this.setData({
      materialData:materialData
    });
  },
  submit:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.materialData.content=='') {
      wx.showModal({
        title: '提示',
        content: '内容不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (this.data.materialData.location=='') {
      wx.showModal({
        title: '提示',
        content: '地址不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (this.data.materialData.title=='') {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
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
      title: '请稍侯',
      mask:true
    })
    if (this.data.materialData.file!='') {
      wx.uploadFile({
        url: app.globalData.url+'/xchShijian/xchShijianAdd?sid='+this.data.sid,
        method:'POST',
        filePath:this.data.materialData.file,
        name:'file',
        formData:{
          'xid':this.data.xid,
          'content':this.data.materialData.content,
          'title':this.data.materialData.title,
          'coImage':1,
          'shijianCity':this.data.materialData.location,
          'shijianPath':this.data.materialData.path,
          'mobile':this.data.materialData.phone,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        success: function(res) {
          console.log(res);
          wx.hideLoading();
          if (/"10000"/.test(res.data)) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '发送失败',
              icon: 'fail',
              duration: 2000
            })
          }
        },
        fail:function(res){
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '发送失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    }else{
      wx.request({
        url: app.globalData.url+'/xchShijian/xchShijianAdd?sid='+this.data.sid,
        method:'POST',
        data:{
          'xid':this.data.xid,
          'content':this.data.materialData.content,
          'title':this.data.materialData.title,
          'coImage':0,
          'file':'',
          'shijianCity':this.data.materialData.location,
          'shijianPath':this.data.materialData.path,
          'mobile':this.data.materialData.phone,
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
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '发送失败',
              icon: 'fail',
              duration: 2000
            })
          }
        },
        fail:function(res){
          wx.hideLoading();
          wx.showToast({
            title: '发送失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    }
  },
  bindPickerChange:function(e){
    var that = this;
    var role = e.currentTarget.dataset.id;
    var index = e.detail.value;
    var materialData = this.data.materialData;
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
                materialData.location = that.data.positionArr2[index];
                materialData.path = that.data.positionKey2[index].path;
                that.setData({
                  materialData:materialData,
                  isSelectPosition:false,
                  isFormShow:true
                });
                that.initLocationPicker();
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
                materialData.location = that.data.positionArr3[index];
                materialData.path = that.data.positionKey3[index].path;
                that.setData({
                  materialData:materialData,
                  isSelectPosition:false,
                  isFormShow:true
                });
                that.initLocationPicker();
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
                materialData.location = that.data.positionArr4[index];
                materialData.path = that.data.positionKey4[index].path;
                that.setData({
                  materialData:materialData,
                  isSelectPosition:false,
                  isFormShow:true
                });
                that.initLocationPicker();
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
          materialData.location = this.data.positionArr5[index];
          materialData.path = this.data.positionKey5[index].path;
          this.setData({
            materialData:materialData,
            isSelectPosition:false,
            isFormShow:true
          });
          this.initLocationPicker();
        break;
      }
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
  cancelSelect:function(e){
    this.setData({
      isSelectPosition:false,
      isFormShow:true
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

    var materialData = this.data.materialData;
    var positionText = this.data.positionText;
    for (var i=(b.length-1);i>=0;i--) {
      if (b[i]!=0) {
        materialData.location = positionText==""?c[i][b[i]]:positionText;
        materialData.path = a[i][b[i]].path;
        this.setData({
          materialData:materialData,
          isSelectPosition:false,
          isFormShow:true
        });
        this.initLocationPicker();
        return;
      }else{
        materialData.location = positionText==""?'中国':positionText;
        materialData.path = ',1,7,';
        this.setData({
          materialData:materialData,
          isSelectPosition:false,
          isFormShow:true
        });
        this.initLocationPicker();
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