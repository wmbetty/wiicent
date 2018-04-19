var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    xid:'',
    sid:'',
    userId:'',
    cxSn:'',
    pageId:1,
    size:5,
    height:0,
    dairyListData:[],
    hasMore:true,
    timeStamp:0,
    height:0,
  },
  onLoad:function(option){
  	var xid = option.xid;
    var cxSn = option.cxSn;
    var sid = '';
    var userId = '';
    var that = this;
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
            cxSn:cxSn,
            userId:userId
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.setData({
      pageId:1,
      hasMore:true
    });
    wx.request({
      url: app.globalData.url+'/weBlog/lvxingrijiList?sid='+this.data.sid,
      method:'POST',
      data: {
        'fid':14,
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
          var result = res.data.result['WeBlog.list'];
          var pageId = ++that.data.pageId;
          if (result) {
            for (var i = 0; i < result.length; i++) {
              var a = util.toTimestamp(result[i].uptime);
              var b = Date.parse(new Date())-a
              var uptime = util.timeFormat(b);
              result[i].uptime = uptime;
            }
          	that.setData({
            	dairyListData:result,
              pageId:pageId
         	  })
            wx.hideLoading();
          }
        }else{
          that.setData({
            hasMore:false
          });
          wx.hideLoading();
        }
      }
    })
  },
  love:function(e){
    var sourceType = e.currentTarget.dataset.sourcetype;
    var sourceId = e.currentTarget.dataset.id;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/bkLove/bkLove?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':sourceType,
        'sourceId':sourceId,
        'realType':'',
        'realId':1,
        'targetId':this.data.userId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          that.onShow();
        }else{
          
        }
      }
    })
  },
  cancelLove:function(e){
    var sourceType = e.currentTarget.dataset.sourcetype;
    var sourceId = e.currentTarget.dataset.id;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/bkLove/bkLove?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':sourceType,
        'sourceId':sourceId,
        'realType':'',
        'realId':0,
        'targetId':this.data.userId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="14001") {
          that.onShow();
        }else{
          
        }
      }
    })
  },
  viewDairyDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var sourceType = e.currentTarget.dataset.sourcetype;
    var targetId = e.currentTarget.dataset.targetid;
    wx.navigateTo({
      url: "../../pages/tourDairyDetail/tourDairyDetail?id="+id+"&sourceType="+sourceType+"&targetId="+targetId
    })
  },
  addDairyDetail:function(){
    wx.navigateTo({
      url: "../../pages/tourDairyDetailEdit/tourDairyDetailEdit?xid="+this.data.xid
    })
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
        url: app.globalData.url+'/weBlog/lvxingrijiList?sid='+this.data.sid,
        method:'POST',
        data: {
          'xid':that.data.xid,
          'pageId':that.data.pageId,
          'size':that.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['WeBlog.list'];
            var dairyListData = that.data.dairyListData.concat(result);
            var pageId = ++that.data.pageId;
            for (var i = 0; i < result.length; i++) {
              var a = util.toTimestamp(result[i].uptime);
              var b = Date.parse(new Date())-a
              var uptime = util.timeFormat(b);
              result[i].uptime = uptime;
            }
            that.setData({
              dairyListData:dairyListData,
              pageId:pageId
            });
            wx.hideLoading();
          }else{
            that.setData({
              hasMore:false
            });
            wx.hideLoading();
          }
        }
    })
  }
})