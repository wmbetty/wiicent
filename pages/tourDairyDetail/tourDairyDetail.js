var app = getApp();
Page({
  data:{
    id:'',
    sid:'',
    userId:'',
    sourceType:'',
    targetId:'',
    pageId:1,
    size:10,
    hasMore:true,
    height:0,
    commentListData:[],
    tourDetailData:{},
    commentVal:''
  },
  onLoad:function(option){
    var that = this;
    var sourceType = option.sourceType;
    var id = option.id;
    var targetId = option.targetId;
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
            id:id,
            userId:userId,
            sourceType:sourceType,
            targetId:targetId
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
  onShow:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    this.setData({
      hasMore:true
    });
    wx.request({
      url: app.globalData.url+'/weBlog/weBlogView?sid='+this.data.sid,
      method:'POST',
      data: {
        'id':this.data.id,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['WeBlog'];
          console.log(result);
          result.bcontentImage = result.bcontentImage.split('big_')[1]==''?'':result.bcontentImage;
          that.setData({
            tourDetailData:result
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '获取日志详情失败',
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
    wx.request({
      url: app.globalData.url+'/bkComment/bkCommentList?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':this.data.sourceType,
        'sourceId':this.data.id,
        'onlyFriends':0,
        'isManager':0,
        'pageId':0,
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
          var result = res.data.result['BkComment.list'];
          var pageId = ++that.data.pageId;
          console.log(result);
          that.setData({
            commentListData:result,
            pageId:pageId
          });
        }else{
          that.setData({
            hasMore:false
          });
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
  inputListener:function(e){
    var value = e.detail.value;
    this.setData({
      commentVal:value
    });
  },
  sendComment:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/bkComment/bkCommentCreate?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceId':this.data.id,
        'sourceType':this.data.sourceType,
        'subId':this.data.userId,
        'targetId':this.data.targetId,
        'content':this.data.commentVal,
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
          that.setData({
            commentVal:''
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '评论失败',
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
  loadMore:function(e){
    if (!this.data.hasMore) {return}
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
      url: app.globalData.url+'/bkComment/bkCommentList?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':this.data.sourceType,
        'sourceId':this.data.id,
        'onlyFriends':0,
        'isManager':0,
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
          var result = res.data.result['BkComment.list'];
          console.log(result);
          var commentListData = that.data.commentListData.concat(result);
          var pageId = ++that.data.pageId;
          that.setData({
            commentListData:commentListData,
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
  zoomPic:function(e){
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
      success:function(res){
        console.log(res);
      }
    })
  }
})