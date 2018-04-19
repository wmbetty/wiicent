var app = getApp();
Page({
  	data:{
  		remark:'',
  		sid:'',
      timeStamp:0
  	},
  	onLoad:function(option){
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
  	},
  	bindinput:function(e){
  		var value = e.detail.value;
  		this.setData({
  			remark:value
  		});
  	},
  	submit:function(e){
      if (e.timeStamp-this.data.timeStamp<2000) {return}
      this.setData({
        timeStamp:e.timeStamp
      });
  		var that = this;
  		var appValue = app.globalData.app;
    	var platform = app.globalData.platform;
    	var ver = app.globalData.ver;
      if (this.data.remark=='') {
        wx.showModal({
          title: '提示',
          content: '评论不能为空',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        return;
      }
    	wx.request({
    	    url: app.globalData.url+'/feedback/feedbackCreate?sid='+this.data.sid,
    	    method:'POST',
    	    data: {
    	        'content':this.data.remark,
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
					  	      title: '提交成功',
					  	      icon: 'success',
					  	      duration: 2000
                  })
                  wx.navigateBack({
                    delta: 1
                  })
    	        }else{
    	        	wx.showToast({
					  	    title: '提交失败',
					  	    icon: 'fail',
					  	    duration: 2000
                })
    	        }
    	    }
    	})
  	}
})