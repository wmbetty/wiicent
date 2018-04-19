var app = getApp();
var util = require('../../util/util.js');
Page({
	data: {
    sid:'',
    pageId:0,
    size:10,
    projectListData:[],
    hasMore:true,
    height:0,
    timeStamp:0,
    tripStatus:['未提交','待确认','待支付','待支付','已付款','待出发','进行中','已完成','已评价','已关闭']
  },
  onLoad: function() {
    var that = this;
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
      url: app.globalData.url+'/xingcheng/getXingchengList?sid='+this.data.sid,
      method:'POST',
      data: {
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
          var result = res.data.result['XchBase.list'];
          var pageId = ++that.data.pageId;
          for (var i = 0; i < result.length; i++) {
            result[i].startCity = result[i].startCity.length>6?result[i].startCity.substring(0,6)+'..':result[i].startCity;
            result[i].destiCity = result[i].destiCity.length>6?result[i].destiCity.substring(0,6)+'..':result[i].destiCity;
            result[i].startDate = util.getDate(Number(result[i].startDate));
            result[i].finishDate = result[i].finishDate.split(' ')[0];
          }
          console.log(result);
          that.setData({
              projectListData:result,
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
      url: app.globalData.url+'/xingcheng/getXingchengList?sid='+this.data.sid,
      method:'POST',
      data: {
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
          var result = res.data.result['XchBase.list'];
          for (var i = 0; i < result.length; i++) {
            result[i].startDate = util.getDate(Number(result[i].startDate));
            result[i].finishDate = result[i].finishDate.split(' ')[0];
          }
          var projectListData = that.data.projectListData.concat(result);
          var pageId = ++that.data.pageId;
          that.setData({
            projectListData:projectListData,
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
  },
  viewProjectDetail:function(e){
    var xid = e.currentTarget.dataset.xid;
    var xchSn = e.currentTarget.dataset.xchsn;
    var rid = e.currentTarget.dataset.rid;
    wx.redirectTo({
      url: '../homebase/homebase?xid='+xid+'&xchSn='+xchSn+'&rid='+rid
    });
  }
})