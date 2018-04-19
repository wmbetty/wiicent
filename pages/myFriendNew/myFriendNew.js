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
    	  url: app.globalData.url+'/customer/getNewFriendsList?sid='+this.data.sid,
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
    agreeNewFriend:function(e){
        var id = e.currentTarget.dataset.id;
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        wx.request({
          url: app.globalData.url+'/customer/friendApplyById?sid='+this.data.sid,
          method:'POST',
          data: {
            'customerId':id,
            'sendDesc':1,
            'app':appValue,
            'platform':platform,
            'ver':ver
          },
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.code=="10000") {
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                })
                that.onShow();
            }else{
                wx.showToast({
                  title: '添加失败',
                  icon: 'fail',
                  duration: 2000
                })
            }
          }
        })
    },
  	viewFriendDetail:function(e){
  		var id = e.currentTarget.dataset.id;

  	},
	addFriend: function(e) {
		wx.navigateTo({
			url: "../lineMesDetail/lineMesDetail"
		})
	}
})