var app = getApp();
Page({
  	data:{
  		sid:'',
  	  name:'',
      timeStamp:0
  	},
  	onLoad:function(option){
  		var sid = '';
  		var name = '';
  		try {
        name = wx.getStorageSync('name');
        sid = wx.getStorageSync('sid');
        if (sid=='') {
          wx.reLaunch({
            url: "../login/login"
          })
        }else{
          this.setData({
            sid:sid,
            name:name
          });
        }
  	  }catch(e){}
  	},
  	inputListener:function(e){
  		var value = e.detail.value;
  		this.setData({
  			name:value
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
      if (this.data.name=='') {
        wx.showModal({
          title: '提示',
          content: '昵称不能为空',
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
            'key':'name',
            'val':this.data.name,
            'app':appValue,
            'platform':platform,
            'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            wx.setStorageSync('name',that.data.name);
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