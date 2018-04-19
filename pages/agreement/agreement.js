var app = getApp();
Page({
  data:{
    title:'',
    content:[],
    sid:''
  },
  onLoad:function(option){
    var that = this;
    var sid = '';
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    try {
      sid = wx.getStorageSync('sid');
      this.setData({
        sid:sid
      });
    }catch(e){}
    wx.request({
      url: app.globalData.url+'/agreement/getAgreement?sid='+this.data.sid,
      method:'POST',
      data: {
        'agreeType':'Basic',
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['Agreement'];
          console.log(result);
          var title = result.title;
          var content = result.content.split('\n');
          that.setData({
            title:title,
            content:content
          });
        }
      }
    })
  }
})