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
    commentVal:''
  },
  onLoad:function(option){
    var that = this;
    var sourceType = option.sourceType;
    var id = option.sourceId;
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
    wx.request({
      url: app.globalData.url+'/bkComment/bkCommentList?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':this.data.sourceType,
        'sourceId':this.data.id,
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
        'subType':'Customer',
        'subId':this.data.userId,
        'targetType':'Customer',
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