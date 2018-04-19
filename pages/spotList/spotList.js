var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    sid:'',
    xid:'',
    day:'',
    startDate:'',
    longitude:'',
    latitude:'',
    spotListData:[]
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var day = option.day;
    var startDate = option.startDate;
    var sid = '';
    var longitude = '';
    var latitude = '';
    try {
      sid = wx.getStorageSync('sid');
      latitude =  wx.getStorageSync('current_lat');
      longitude =  wx.getStorageSync('current_lng');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
      this.setData({
          sid:sid,
          xid:xid,
          day:day,
          startDate:startDate,
          longitude:longitude,
          latitude:latitude
      });
      }
    } catch (e) {}
  },
  onShow:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchJingdian/xchJingdianList?sid='+this.data.sid,
      method:'POST',
      data: {
        'xid':this.data.xid,
        'day':this.data.day,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchJingdian.list'];
          console.log(result);
          for (var i = 0; i < result.length; i++) {
            result[i]
            var a = util.getDistance(result[i].latitude,result[i].longitude,that.data.latitude,that.data.longitude);
            result[i].distance = a;
            if (result[i].startTime.split(' ')[1]) {
            }else{
              result[i].startTime = util.getDate((Number(util.toTimestamp(that.data.startDate+' 00:00:00'))+24*3600*1000*(that.data.day-1)))+' '+result[i].startTime.split(' ')[0];
            }
          }
          that.setData({
              spotListData:result
          });
        }
      }
    })
  },
  editSpotDetail:function(e){
    var spotId = e.currentTarget.dataset.id;
    wx.navigateTo({
    	url:'../spotDetail/spotDetail?xid='+this.data.xid+'&spotId='+spotId+'&day='+this.data.day
    });
  },
  addSpotDetail:function(e){
  	wx.navigateTo({
    	url:'../searchSpot/searchSpot?xid='+this.data.xid+'&day='+this.data.day
    });
  }
})