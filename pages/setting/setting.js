var app = getApp();
Page({
  data:{
    sid:''
  },
  onLoad:function(option){
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      this.setData({
        sid:sid
      });
    }catch(e){}
  },
  logout:function(e){
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    try {
      wx.clearStorageSync();
      wx.reLaunch({
        url:'../login/login'
      });
    } catch(e) {
    }
  },
  unbindWx:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+' /weixin/unbindUnionid?sid='+this.data.sid,
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
          wx.showToast({
            title: '解绑成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '解绑失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  goAgreement:function(e){
    wx.navigateTo({
      url:'../agreement/agreement'
    });
  },
  goAboutUs:function(e){
    wx.navigateTo({
      url:'../aboutUs/aboutUs'
    });
  },
  goEditPhone:function(e){
    wx.navigateTo({
      url:'../editPhone/editPhone'
    });
  },
  goEditCode:function(e){
    wx.navigateTo({
      url:'../editCode/editCode'
    });
  },
  goRemark:function(e){
    wx.navigateTo({
      url:'../remark/remark'
    });
  },
  addPersonDetail:function(e){
    wx.navigateTo({
      url:'../renyuanDetail/renyuanDetail'
    });
  }
})