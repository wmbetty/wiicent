var app = getApp();
Page({
	data: {
		sid:'',
		searchVal:'',
		friendListData:[],
        pageId:1,
        size:11,
        hasMore:true,
        height:0
	},
	onLoad: function() {
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
        });
    	wx.request({
            url: app.globalData.url+'/bkFans/getFollowList?sid='+this.data.sid,
            method:'POST',
            data: {
                'pageId':1,
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
                    var result = res.data.result['BkFansCustomer.list'];
                    var pageId = ++that.data.pageId;
                    that.setData({
                      friendListData:result,
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
    loadMore:function(e){
        if (!this.data.hasMore) {return}
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        wx.showLoading({
            title: '加载中',
            mask:true
        });
        wx.request({
            url: app.globalData.url+'/bkFans/getFollowList?sid='+this.data.sid,
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
                wx.hideLoading();
                if (res.data.code=="10000") {
                    var result = res.data.result['BkFansCustomer.list'];
                    var friendListData = that.data.friendListData.concat(result);
                    var pageId = ++that.data.pageId;
                    that.setData({
                      friendListData:friendListData,
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
    searchInput:function(e){
        var value = e.detail.value;
        this.setData({
            searchVal:value
        });
    },
  	viewFriendDetail:function(e){
  		var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url:"../../pages/myFriendDetail/myFriendDetail?rid="+id
        })

  	}
})