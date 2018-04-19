var app =getApp();
Page({
  data:{
  	sid:'',
  	xid:'',
    modelType:'',
    formdata:{
      manageName:'',
      managePhone:'',
      jiheDate:'',
      jiheTime:'',
      jiheSite:'',
      jiheAddress:'',
      zhengjian:'',
      destiCity:'',
      diwen:'',
      gaowen:''
    }
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
    var id = e.currentTarget.dataset.id;
    var formdata = this.data.formdata;
    formdata[id] = value;
    this.setData({
      formdata:formdata
    })
  },
  submit:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var formdata = this.data.formdata;
    formdata.app = appValue;
    formdata.platform = platform;
    formdata.ver = ver;
    formdata.xid = this.data.xid;
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    wx.request({
      url: app.globalData.url+'/bkSmsNotice/chutuanSmsSend1?sid='+this.data.sid,
      method:'POST',
      data: formdata,
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