var app = getApp();
Page({
  data:{
    sid:'',
    xid:'',
    rid:'',
    costListData:[],
    pageId:1,
    size:7,
    totalAmount:0,
    hasMore:true,
    height:0,
    timestamp:0
  },
  onLoad:function(option){
  	var xid = option.xid;
    var rid = option.rid;
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
            rid:rid
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
    });
    this.setData({
      pageId:1,
      hasMore:true
    });
    wx.request({
      url: app.globalData.url+'/xchJizhang/xchJizhangList?sid='+this.data.sid,
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
          var result = res.data.result['XchJizhang.list'];
          var pageId = ++that.data.pageId;
          that.setData({
            costListData:result,
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
    wx.request({
      url: app.globalData.url+'/xchRenyuan/xchRenyuanShiji?sid='+this.data.sid,
      method:'POST',
      data: {
        'rid':that.data.rid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['Delete'].id;
          that.setData({
            totalAmount:result
          });
        }else{
          that.setData({
            totalAmount:0
          });
        }
      }
    })
  },
  loadMore:function(e){
    if (!this.data.hasMore) {return}
    if (e.timeStamp-this.data.timeStamp<2000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
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
        url: app.globalData.url+'/xchJizhang/xchJizhangList?sid='+this.data.sid,
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
          wx.hideLoading();
          if (res.data.code=="10000") {
            var result = res.data.result['XchJizhang.list'];
            var costListData = that.data.costListData.concat(result);
            var pageId = ++that.data.pageId;
            that.setData({
              costListData:costListData,
              pageId:pageId
            });
          }else{
            var pageId = that.data.pageId;
            that.setData({
              pageId:pageId,
              hasMore:false
            });
          }
        }
    })
  },
  goCostView:function(e){
    var jid = e.currentTarget.dataset.jid;
    wx.redirectTo({
      url: "../editCostDetail/editCostDetail?jid="+jid+"&xid="+this.data.xid
    })
  }
})