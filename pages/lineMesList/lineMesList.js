var app = getApp();
Page({
	data: {
		sid:'',
		noMessage:false,
		lineMesListData:[]
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

	},
	onPullDownRefresh: function() {
		var $this = this;
	},
	onReachBottom: function() {
		var $this = this;
	},
	goLineMesDetail: function(e) {
		wx.navigateTo({
			url: "../lineMesDetail/lineMesDetail"
		})
	}
})