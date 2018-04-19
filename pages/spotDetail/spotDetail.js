var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    sid:'',
    xid:'',
    day:'',
    spotId:'',
    date:'',
    formData:{
      content:'',
      title:'',
      date:'',
      longitude:'',
      latitude:'',
    },
    timeStamp:0
  },
  onLoad:function(option){
    var xid = option.xid;
    var day = option.day;
    var spotId = option.spotId;
    var sid = '';
    var that = this;
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid,
            day:day,
            spotId:spotId
        });
      }
    } catch (e) {}
    if (this.data.spotId) {
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      wx.request({
        url: app.globalData.url+'/xchJingdian/xchJingdianView?sid='+this.data.sid,
        method:'POST',
        data: {
          'id':this.data.spotId,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['XchJingdian'];
            var title = result.title;
            var content = result.content;
            var date = result.startTime.split(' ')[1]?result.startTime.split(' ')[1]:result.startTime;
            var longitude = util.BdmapEncryptToMapabc(result.latitude,result.longitude).lng;
            var latitude = util.BdmapEncryptToMapabc(result.latitude,result.longitude).lat;
            var formData = {
              title:title,
              content:content,
              date:date,
              longitude:longitude,
              latitude:latitude
            }
            that.setData({
              date:date,
              formData:formData
            });
          }
        }
      })
    }else{
      try{
        var date = util.getTime();
        this.setData({
          date:date
        });
      }catch(e){}
    }
  },
  bindinput:function(e){
    var b = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var formData = this.data.formData;
    formData[id] = b;
    this.setData({
      formData:formData
    })
  },
  bindPickerChange:function(e){
    var b = e.detail.value;
    var id = e.currentTarget.dataset.id;
    this.setData({
      date:b
    })
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
                      if (res.latitude&&res.longitude){
                        var lat = res.latitude;
                        var lng = res.longitude;
                        var formData = that.data.formData;
                        formData['longitude'] = lng;
                        formData['latitude'] = lat;
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
              if (res.latitude&&res.longitude){
                var lat = res.latitude;
                var lng = res.longitude;
                var formData = that.data.formData;
                formData['longitude'] = lng;
                formData['latitude'] = lat;
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
  },
  submit:function(e){
    if (e.timeStamp-this.data.timeStamp<500) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.formData.title==''||this.data.date=='') {
      wx.showModal({
        title: '提示',
        content: '标题、开始时间不能为空',
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
    });
    wx.request({
      url: app.globalData.url+'/xchJingdian/setXchJingdian?sid='+this.data.sid,
      method:'POST',
      data: {
        'id':this.data.spotId,
        'xid':this.data.xid,
        'day':this.data.day,
        'content':this.data.formData.content,
        'title':this.data.formData.title,
        'startTime':this.data.date,
        'longitude':this.data.formData.longitude,
        'latitude':this.data.formData.latitude,
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
          });
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
      }
    })
  },
  delete:function(e){
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    wx.request({
      url: app.globalData.url+'/bkDel/bkDelById?sid='+this.data.sid,
      method:'POST',
      data: {
        'id':this.data.spotId,
        'sourceType':'XchJingdian',
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
            title: '删除成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
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
                      if (res.latitude&&res.longitude){
                        var lat = res.latitude;
                        var lng = res.longitude;
                        var formData = that.data.formData;
                        formData['longitude'] = lng;
                        formData['latitude'] = lat;
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
              if (res.latitude&&res.longitude){
                var lat = res.latitude;
                var lng = res.longitude;
                var formData = that.data.formData;
                formData['longitude'] = lng;
                formData['latitude'] = lat;
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
  },
})