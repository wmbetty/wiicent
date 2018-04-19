var app = getApp();
Page({
  	data:{
  		sid:'',
  	  sign:'',
      timeStamp:0
  	},
  	onLoad:function(option){
  		var sid = '';
  		var sign = '';
  		try {
        sign = wx.getStorageSync('sign');
        sid = wx.getStorageSync('sid');
        if (sid=='') {
          wx.reLaunch({
            url: "../login/login"
          })
        }else{
          this.setData({
            sid:sid,
            sign:sign
          });
        }
  	  }catch(e){}
  	},
  	inputListener:function(e){
  		var value = e.detail.value;
  		this.setData({
  			sign:value
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
      if (this.data.sign=='') {
        wx.showModal({
          title: '提示',
          content: '签名不能为空',
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
        url: app.globalData.url+'/customer/customerEdit?sid='+this.data.sid,
        method:'POST',
        data: {
            'key':'sign',
            'val':this.data.sign,
            'app':appValue,
            'platform':platform,
            'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            wx.setStorageSync('sign',that.data.sign);
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '编辑失败',
              icon: 'fail',
              duration: 2000
            });
          }
        }
      })
  	}
})