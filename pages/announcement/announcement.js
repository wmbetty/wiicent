var app =getApp();
Page({
  data:{
  	sid:'',
  	xid:'',
    blackboardVal:''
  },
  onLoad:function(option){
  	var that = this;
  	var xid = option.xid;
  	var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid
        });
      }
    }catch(e){}
  },
  inputListener:function(e){
  	var value = e.detail.value;
  	this.setData({
  		blackboardVal:value
  	});
  },
  submit:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.blackboardVal=='') {
      wx.showModal({
        title: '提示',
        content: '内容不能未空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    wx.request({
      url: app.globalData.url+'/xchBase/setXchMsg?sid='+this.data.sid,
      method:'POST',
      data: {
          'xid':this.data.xid,
          'msg':this.data.blackboardVal,
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
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '发送失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  }
})