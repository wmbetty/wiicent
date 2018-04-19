var app = getApp();
Page({
  data:{
    phoneNumber:'020-31125397'
  },
  submit:function(e){
  	wx.makePhoneCall({
  		phoneNumber: this.data.phoneNumber
    })
  }
})