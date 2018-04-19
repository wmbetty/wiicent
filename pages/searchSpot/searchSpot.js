var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    xid:'',
    sid:'',
    day:'',
  	isSearchShow:true,
    isEdit:false,
    searchSpot:'',
    pageId:1,
    size:10,
    showLoading:false,
    hasMore:true,
    height:0,
    timeStamp:0,
    spotListData:[],
    formData:{
      content:'',
      title:'',
      date:'',
      longitude:'',
      latitude:'',
      bid:'',
      title:'',
      coImage:'',
      btype:''
    }
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var day = option.day;
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
            xid:xid,
            day:day
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
  searchBtn:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.setData({
      pageId:1,
      hasMore:true
    });
    wx.request({
      url: app.globalData.url+'/xchJingdian/xchJingdianSearch?sid='+this.data.sid,
      method:'POST',
      data: {
        'title':this.data.searchSpot,
        'pageId':this.data.pageId,
        'size':this.data.size,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['ShowList.list'];
          var pageId = ++that.data.pageId;
          console.log(result);
          that.setData({
            spotListData:result,
            pageId:pageId
          });
          wx.hideLoading();
        }else{
          that.setData({
            hasMore:false
          });
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '暂无相关景点，请添加',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  },
  addSpot:function(e){
    var id = e.currentTarget.dataset.id;
    var formData = {
      title:this.data.spotListData[id].title,
      content:this.data.spotListData[id].content,
      date:'',
      longitude:this.data.spotListData[id].longitude,
      latitude:this.data.spotListData[id].latitude,
      bid:this.data.spotListData[id].realId,
      btype:this.data.spotListData[id].realType,
      colImage:this.data.spotListData[id].coImage
    }
    this.setData({
      formData:formData,
      isEdit:true,
      isSearchShow:false
    })
  },
  bindSearchInput:function(e){
    var b = e.detail.value;
    this.setData({
      searchSpot:b
    });
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
    var formData = this.data.formData;
    formData['date'] = b
    this.setData({
      formData:formData
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
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    console.log(this.data.formData);
    if (this.data.formData.title==''||this.data.formData.date=='') {
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
    })
    wx.request({
      url: app.globalData.url+'/xchJingdian/setXchJingdian?sid='+this.data.sid,
      method:'POST',
      data: {
        'id':this.data.spotId,
        'xid':this.data.xid,
        'day':this.data.day,
        'content':this.data.formData.content,
        'title':this.data.formData.title,
        'bid':this.data.formData.bid,
        'btype':this.data.formData.btype,
        'coImage':this.data.formData.coImage,
        'startTime':this.data.formData.date,
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
          that.setData({
            isEdit:false,
            isSearchShow:true
          });
        }
      }
    })
  },
  cancel:function(e){
    this.setData({
      isEdit:false,
      isSearchShow:true
    });
  },
  loadMore:function(e){
    if (!this.data.hasMore) {return}
    if (e.timeStamp-this.data.timeStamp<3000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
    console.log(e);
    console.log(this.data.pageId);
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
        url: app.globalData.url+'/xchJingdian/xchJingdianSearch?sid='+this.data.sid,
        method:'POST',
        data: {
          'title':this.data.searchSpot,
          'pageId':this.data.pageId,
          'size':this.data.size,
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
            var result = res.data.result['ShowList.list'];
            var spotListData = that.data.spotListData.concat(result);
            var pageId = ++that.data.pageId;
            that.setData({
              spotListData:spotListData,
              pageId:pageId
            });
          }else{
            that.setData({
              hasMore:false,
              showLoading:false
            });
          }
        }
    })
  },
  addSpotDetail:function(e){
    wx.redirectTo({
      url:'../spotDetail/spotDetail?xid='+this.data.xid+'&day='+this.data.day+'&spotId='+''
    });
  }
})