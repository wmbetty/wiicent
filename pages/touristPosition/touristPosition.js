var app = getApp();
var util = require('../../util/util.js');
Page({
  data: {
    sid:'',
    xid:'',
    userId:'',
    height:'auto',
    longitude:'',
    latitude:'',
    markers: [{
      iconPath: "../../dist/images/marker_red.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 20,
      height: 20
    }],
    tourInfo:{},
    allPoints:[]
  },
  onLoad:function(option){
    var that = this;
    var sid = '';
    var xid = option.xid;
    var userId = '';
    var longitude = '';
    var latitude = '';
    try {
      sid = wx.getStorageSync('sid');
      userId = wx.getStorageSync('userId');
      longitude = wx.getStorageSync('current_lng');
      latitude = wx.getStorageSync('current_lat');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
          sid:sid,
          xid:xid,
          userId:userId,
          longitude:longitude,
          latitude:latitude
        });
      }
    }catch(e){}
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
            height: a
        })
      }
    })
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchPosition/getXchPositionGuide?sid='+this.data.sid,
      method:'POST',
      data: {
        'longitude':this.data.longitude,
        'latitude':this.data.latitude,
        'mapType':'GCJ02',
        'xid':this.data.xid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['xchPositionShow'];
          if (result.longitude!=0||result.latitude!=0) {
            var markers = that.data.markers;
            var allPoints = [];
            var lat = wx.getStorageSync('current_lat');
            var lng = wx.getStorageSync('current_lng');
            var a = {};
            a.longitude = lng;
            a.latitude = lat;
            allPoints.push(a);
            var b = {};
            b.longitude = result.longitude;
            b.latitude = result.latitude;
            allPoints.push(b);
            markers[0].longitude = result.longitude;
            markers[0].latitude = result.latitude;
            var tourInfo = that.data.tourInfo;
            tourInfo.name = result.name;
            tourInfo.gender = result.gender;
            tourInfo.uptime = result.uptime;
            tourInfo.mobile = result.mobile;
            that.setData({
              markers:markers,
              tourInfo:tourInfo,
              allPoints:allPoints
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '暂无导游位置信息',
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        }else{
          wx.showModal({
            title: '提示',
            content: '暂无导游位置信息',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    });
  },
  callTourist:function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.tourInfo.mobile
    })
  }
})


