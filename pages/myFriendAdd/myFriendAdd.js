var app = getApp();
Page({
	data: {
		sid:'',
		searchVal:''
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
    searchInput:function(e){
        var value = e.detail.value;
        this.setData({
            searchVal:value
        });
    },
    searchFriend:function(e){
        if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(this.data.searchVal)){
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            });
            return;
        }
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        wx.request({
          url: app.globalData.url+'/customer/customerSearchByPhone?sid='+this.data.sid,
          method:'POST',
          data: {
            'mobilePhone':this.data.searchVal,
            'app':appValue,
            'platform':platform,
            'ver':ver
          },
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.code=="10000") {
                var result = res.data.result['Delete'];
                wx.navigateTo({
                    url: "../myFriendDetail/myFriendDetail?rid="+result.id
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: '未查询到该用户',
                    showCancel:false,
                    success: function(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                });
            }
          }
        })
    },
  	getCode:function(e){
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        wx.scanCode({
            onlyFromCamera: false,
            success: (res) => {
                console.log(res)
                wx.request({
                    url: app.globalData.url+'/qrCode/qrCodeCheck?sid='+that.data.sid,
                    method:'POST',
                    data: {
                        'resultString':res.result,
                        'descrip':'',
                        'app':appValue,
                        'platform':platform,
                        'ver':ver
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function(res) {
                        console.log(res.data);
                        if (res.data.code=="10000") {
                            if (res.data.result['QrCodeResult'].code=="10000") {
                                wx.navigateTo({
                                    url:'../myFriendDetail/myFriendDetail?rid='+res.data.result['QrCodeResult'].transforId
                                });
                            }else{
                                wx.showToast({
                                    title: '解析失败',
                                    icon: 'fail',
                                    duration: 2000
                                })
                            }
                        }else{
                            wx.showToast({
                                title: '解析失败',
                                icon: 'fail',
                                duration: 2000
                            })
                        }
                    }
                })
            }
        })
    }
})