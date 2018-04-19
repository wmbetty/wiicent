var app =getApp();
Page({
  data:{
  	sid:'',
  	xid:'',
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
  goXchMsgDetail:function(e){
    wx.navigateTo({
      url:"../../pages/xchMsgDetail/xchMsgDetail?xid="+this.data.xid
    })
  }
})