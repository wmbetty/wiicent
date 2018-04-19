var app = getApp();
Page({
  data:{

  },
  onLoad:function(option){

  },
  goHome:function(e){
  	wx.switchTab({
  		url:"../../pages/home/home"
  	})
  },
  goBack:function(e){
    wx.navigateBack({
      delta: 1
    })
  }
})