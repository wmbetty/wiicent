var app = getApp();
Page({
	data: {
		sid:'',
		pageId:1,
		size:10,
		noMessage:false,
		lineMesListData:[],
    showLoading:false,
    hasMore:true,
    height:0,
    timeStamp:0
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
      url: app.globalData.url+'/aboutMe/aboutMeXchList?sid='+this.data.sid,
      method:'POST',
      data: {
        'pageId':this.data.pageId,
        'size':this.data.size,
        'showType':'AboutMe',
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['AboutXchMsgLog.list'];
          var pageId= ++that.data.pageId;
          console.log(result);
          that.setData({
          	lineMesListData:result,
          	pageId:pageId
          });
          wx.hideLoading();
        }else{
        	that.setData({
          	noMessage:true,
            hasMore:false
          });
          wx.hideLoading();
        }
      }
    })
	},
	loadMore: function(e) {
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
      url: app.globalData.url+'/aboutMe/aboutMeXchList?sid='+this.data.sid,
      method:'POST',
      data: {
        'pageId':this.data.pageId,
        'size':this.data.size,
        'showType':'CxAboutMe',
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['AboutXchMsgLog.list'];
          var pageId= ++that.data.pageId;
          var lineMesListData = that.data.lineMesListData.concat(result);
          that.setData({
          	lineMesListData:lineMesListData,
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