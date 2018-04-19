var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    id:'',
    xid:'',
    userId:'',
    isAddStatus:false,
    isFormShow:true,
    height:'auto',
    formData:{
      content:'',
      privilege:0,
      expiredType:0,
      keywords:'',
      longitude:0,
      latitude:0,
      address:'',
      coImage:0,
      file:''
    },
    privilegeData:['所有人可见','好友可见','仅自己可见'],
    expiredTypeData:['永久可见','4小时可见','1天可见','1周可见','1月可见','1年可见'],
    statusList:[{isSelect:true,keyword:'旅游'},{isSelect:false,keyword:'美食'},{isSelect:false,keyword:'留念'},{isSelect:false,keyword:'笔记'},{isSelect:false,keyword:'纪实'},{isSelect:false,keyword:'自然'},{isSelect:false,keyword:'艺术'},{isSelect:false,keyword:'建筑'}],
    newStatus:''
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var sid = '';
    var userId = '';
    try {
      sid = wx.getStorageSync('sid');
      userId = wx.getStorageSync('userId');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid,
            userId:userId
        });
      }
    } catch (e) {}
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
            height: a
        })
      }
    })
  },
  goAddStatus:function(e){
    wx.setNavigationBarTitle({
      title: '关键词'
    });
    this.setData({
      isAddStatus:true,
      isFormShow:false
    });
  },
  addStatus:function(e){
    var a = this.data.statusList;
    if (this.data.newStatus) {
      var b = {isSelect:false,keyword:this.data.newStatus};
      a.push(b);
      this.setData({
        statusList:a,
        newStatus:''
      });
    }
  },
  addStatusBtn:function(e){
    var a = [];
    var b = this.data.formData;
    for (var i = 0; i < this.data.statusList.length; i++) {
      if (this.data.statusList[i].isSelect) {
        a.push(this.data.statusList[i].keyword);
      }
    }
    b.keywords = a.join(',');
    wx.setNavigationBarTitle({
      title: '分享片刻'
    })
    this.setData({
      formData:b,
      isAddStatus:false,
      isFormShow:true,
      statusList:[{isSelect:true,keyword:'旅游'},{isSelect:false,keyword:'美食'}]
    });
  },
  bindinputStatus:function(e){
    var a = e.detail.value;
    this.setData({
      newStatus:a
    });
  },
  changeStatusSelect:function(e){
    var index = e.currentTarget.dataset.index;
    var a = this.data.statusList;
    for (var i = 0; i < a.length; i++) {
      if (index==i) {
        if (a[i].isSelect) {
          a[i].isSelect = false;
        }else{
          a[i].isSelect = true;
        }
      }
    }
    this.setData({
      statusList:a
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
          var formData = that.data.formData;
          formData['file'] = res.tempFiles[0].path;
          that.setData({
            formData:formData
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
          var formData = that.data.formData;
          formData['file'] = res.tempFiles[0].path;
          that.setData({
            formData:formData
          });
        }
      })
    }catch(e){}
  },
  inputListener:function(e){
    var value = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var formData = this.data.formData;
    formData[id] = value;
    this.setData({
      formData:formData
    });
  },
  submit:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.formData.content=='') {
      wx.showModal({
        title: '提示',
        content: '日记内容不能为空',
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
    if (this.data.formData.file!='') {
      wx.uploadFile({
        url: app.globalData.url+'/weBlog/weBlogAdd?sid='+this.data.sid,
        method:'POST',
        filePath:this.data.formData.file,
        name:'file',
        formData: {
          'ftype':'XchBase',
          'fid':this.data.xid,
          'authorId':this.data.userId,
          'authorType':'Customer',
          'keywords':this.data.formData.keywords,
          'content':this.data.formData.content,
          'privilege':this.data.formData.privilege,
          'expiredType':this.data.expiredTypeData[this.data.formData.expiredType],
          'tag':this.data.userId+Date.parse(new Date())+'Weblog',
          'longitude':this.data.formData.longitude,
          'latitude':this.data.formData.latitude,
          'coImage':this.data.formData.file!=''?1:0,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        success: function(res) {
          console.log(res.data);
          wx.hideLoading();
          if (/"10000"/.test(res.data)) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            console.log(res.data);
            wx.showToast({
              title: '保存失败',
              icon: 'fail',
              duration: 2000
            });
          }
        },
        fail:function(res){
          console.log(res.data);
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    }else{
      wx.request({
        url: app.globalData.url+'/weBlog/weBlogAdd?sid='+this.data.sid,
        method:'POST',
        data: {
          'ftype':'XchBase',
          'fid':this.data.xid,
          'authorId':this.data.userId,
          'authorType':'Customer',
          'keywords':this.data.formData.keywords,
          'content':this.data.formData.content,
          'privilege':this.data.formData.privilege,
          'expiredType':this.data.expiredTypeData[this.data.formData.expiredType],
          'tag':this.data.userId+Date.parse(new Date())+'Weblog',
          'longitude':this.data.formData.longitude,
          'latitude':this.data.formData.latitude,
          'coImage':this.data.formData.file!=''?1:0,
          'file':this.data.formData.file,
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
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '保存失败',
              icon: 'fail',
              duration: 2000
            })
          }
        },
        fail:function(res){
          console.log(res.data);
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    }
  },
  goSelectPosition:function(e){
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
                scope: 'scope.userLocation',
                success() {
                  wx.chooseLocation({
                    success: function(res) {
                      console.log(res);
                      if (res.latitude&&res.longitude){
                        var lat = res.latitude;
                        var lng = res.longitude;
                        var address = res.name.length>12?res.name.subtring(0,12)+'..':res.name;
                        var formData = that.data.formData;
                        formData['longitude'] = lng;
                        formData['latitude'] = lat;
                        formData['address'] = address;
                        that.setData({
                          formData:formData
                        });
                      }else{
                        wx.getLocation({
                          type: 'gcj02',
                          success: function(res) {
                            var lat = res.latitude;
                            var lng = res.longitude;
                            var formData = that.data.formData;
                            formData['longitude'] = lng;
                            formData['latitude'] = lat;
                            that.setData({
                              formData:formData
                            });
                          }
                        })
                      }
                    },
                    fail:function(res){
                      console.log(res);
                      wx.getLocation({
                        type: 'gcj02',
                        success: function(res) {
                          var lat = res.latitude;
                          var lng = res.longitude;
                          var formData = that.data.formData;
                          formData['longitude'] = lng;
                          formData['latitude'] = lat;
                          that.setData({
                            formData:formData
                          });
                        }
                      })
                    }
                  })
                }
            })
        }else{
          wx.chooseLocation({
            success: function(res) {
              console.log(res);
              if (res.latitude&&res.longitude){
                var lat = res.latitude;
                var lng = res.longitude;
                var address = res.name.length>13?res.name.substring(0,13)+'..':res.name;
                var formData = that.data.formData;
                formData['longitude'] = lng;
                formData['latitude'] = lat;
                formData['address'] = address;
                that.setData({
                  formData:formData
                });
              }else{
                wx.getLocation({
                  type: 'gcj02',
                  success: function(res) {
                    var lat = res.latitude;
                    var lng = res.longitude;
                    var formData = that.data.formData;
                    formData['longitude'] = lng;
                    formData['latitude'] = lat;
                    that.setData({
                      formData:formData
                    });
                  }
                })
              }
            },
            fail:function(res){
              console.log(res);
              wx.getLocation({
                type: 'gcj02',
                success: function(res) {
                  var lat = res.latitude;
                  var lng = res.longitude;
                  var formData = that.data.formData;
                  formData['longitude'] = lng;
                  formData['latitude'] = lat;
                  that.setData({
                    formData:formData
                  });
                }
              })
            }
          })
        }
      }
    })
  }
})