var app = getApp();
Page({
	data: {
		sid:'',
		searchVal:'',
		friendListData:[]
	},
	onLoad: function() {
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
	},
	onShow:function(){
    	var that = this;
    	var appValue = app.globalData.app;
    	var platform = app.globalData.platform;
    	var ver = app.globalData.ver;
    	wx.request({
            url: app.globalData.url+'/customer/customerFriendsList?sid='+this.data.sid,
            method:'POST',
            data: {
                'app':appValue,
                'platform':platform,
                'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                if (res.data.code=="10000") {
                    var result = res.data.result['Customer.list'];
                    console.log(result);
                    that.setData({
                        friendListData:result
                    });
                }
            }
    	})
  	},
  	viewFriendDetail:function(e){
  		var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url:"../../pages/myFriendDetail/myFriendDetail?rid="+id
        })
  	},
	addFriend: function(e) {
		wx.navigateTo({
			url: "../../pages/myFriendAdd/myFriendAdd"
		})
	},
    newFriend:function(e){
        wx.navigateTo({
            url: "../../pages/myFriendNew/myFriendNew"
        })
    }
})