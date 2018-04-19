var app = getApp();
var util = require('../../util/util.js');
Page({
  data: {
    sid:'',
    xid:'',
    longitude:'',
    latitude:'',
    height:'auto',
    markers: [],
    visitorPosListData:[],
    visitorInfo:{},
    visitorListData:[],
    allPoints:[]
  },
  onLoad:function(option){
    var that = this;
    var sid = '';
    var xid = option.xid;
    var longitude = '';
    var latitude = '';
    try {
      sid = wx.getStorageSync('sid');
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
      url: app.globalData.url+'/xchPosition/getXchAllRenyuanPosition?sid='+this.data.sid,
      method:'POST',
      data: {
        'xid':this.data.xid,
        'longitude':this.data.longitude,
        'latitude':this.data.latitude,
        'mapType':'GCJ02',
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var data = res.data.result['getXchAllRenyuanPosition'];
          var result = [];
          var allPoints = [];
          for (var i in data) {
            if (data[i].longitude!=0&&data[i].latitude!=0) {
              var a = {};
              a.longitude = Number(data[i].longitude);
              a.latitude = Number(data[i].latitude);
              allPoints.push(a);
              data[i].longitude = Number(data[i].longitude);
              data[i].latitude = Number(data[i].latitude);
              result.push(data[i]);
            }
          }
          var b = {};
          b.longitude = that.data.longitude;
          b.latitude = that.data.latitude;
          allPoints.push(b);
          console.log(result);
          var markers = [];
          var visitorPosListData = [];
          var visitorInfo = {};
          for (var i = 0; i < result.length; i++) {
            var a = {};
            a.id = result[i].rid;
            a.iconPath = "../../dist/images/vispos_normal.png";
            a.longitude = result[i].longitude;
            a.latitude = result[i].latitude;
            a.width = 20;
            a.height = 20;
            markers.push(a);
          }
          that.setData({
            visitorPosListData:result,
            markers:markers,
            visitorInfo:visitorInfo,
            allPoints:allPoints
          })
        }else{
          that.setData({
            visitorPosListData:[],
            markers:[],
            visitorInfo:{}
          })
        }
      }
    });
    wx.request({
      url: app.globalData.url+'/xchRenyuan/xchRenyuanList?sid='+this.data.sid,
      method:'POST',
      data: {
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
          var result = res.data.result['XchRenyuan.list'];
          console.log(result);
          for (var i = 0; i < result.length; i++){
            result[i].isSelect = false;
          }
          that.setData({
            visitorListData:result
          });
        }
      }
    });
  },
  tapPerson:function(e){
    var rid = e.currentTarget.dataset.rid;
    var visitorListData = this.data.visitorListData;
    var visitorPosListData = this.data.visitorPosListData;
    var markers = this.data.markers;
    var visitorInfo = {};
    console.log(rid);
    for (var i = 0; i < visitorListData.length; i++) {
      if (rid==visitorListData[i].rid) {
        visitorListData[i].isSelect = true;
      }else{
        visitorListData[i].isSelect = false;
      }
    }
    for (var i = 0; i < visitorPosListData.length; i++) {
      if (rid==visitorPosListData[i].rid) {
        visitorInfo = visitorPosListData[i];
      }
    }
    if (visitorInfo.rid==undefined) {
      wx.showModal({
        title: '提示',
        content: '暂无该成员位置信息',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    for (var i = 0; i < markers.length; i++) {
      if (rid==markers[i].id) {
        markers[i].iconPath = "../../dist/images/vispos_active.png";
        markers[i].width = 48;
        markers[i].height = 56;
      }else{
        markers[i].iconPath = "../../dist/images/vispos_normal.png";
        markers[i].width = 20;
        markers[i].height = 20;
      }
    }
    this.setData({
      visitorListData:visitorListData,
      visitorInfo:visitorInfo,
      markers:markers
    })
  },
  tapMarker:function(e){
    var rid = e.markerId;
    var visitorListData = this.data.visitorListData;
    var visitorPosListData = this.data.visitorPosListData;
    var markers = this.data.markers;
    var visitorInfo = {};
    console.log(rid);
    for (var i = 0; i < visitorListData.length; i++) {
      if (rid==visitorListData[i].rid) {
        visitorListData[i].isSelect = true;
      }else{
        visitorListData[i].isSelect = false;
      }
    }
    for (var i = 0; i < visitorPosListData.length; i++) {
      if (rid==visitorPosListData[i].rid) {
        visitorInfo = visitorPosListData[i];
      }
    }
    if (visitorInfo.rid==undefined) {
      wx.showModal({
        title: '提示',
        content: '暂无该成员位置信息',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    for (var i = 0; i < markers.length; i++) {
      if (rid==markers[i].id) {
        markers[i].iconPath = "../../dist/images/vispos_active.png";
        markers[i].width = 48;
        markers[i].height = 56;
      }else{
        markers[i].iconPath = "../../dist/images/vispos_normal.png";
        markers[i].width = 20;
        markers[i].height = 20;
      }
    }
    this.setData({
      visitorListData:visitorListData,
      visitorInfo:visitorInfo,
      markers:markers
    })
  }
})


