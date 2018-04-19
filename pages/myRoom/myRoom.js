var app = getApp();
Page({
  data:{
    sid:'',
    xid:'',
    rid:'',
    roomData:{},
    myroom:''
  },
  onLoad:function(option){
    var xid = option.xid;
    var rid = option.rid;
    var that = this;
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
            xid:xid,
            rid:rid
        });
      }
    }catch(e){}
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchFenfang/xchFenfangView?sid='+this.data.sid,
      method:'POST',
      data: {
        'rid':this.data.rid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchFangjian'];
          var myroom = '';
          if (result.roomCode!='') {
            myroom = result.roomCode;
          }
          if (result.gender1=='') {
            result.gender1='../../dist/images/fenfang_empty.png';
          }
          if (result.gender1=='男') {
            result.gender1='../../dist/images/fenfang_nan.png';
          }
          if (result.gender1=='女') {
            result.gender1='../../dist/images/fenfang_nv.png';
          }
          if (result.gender2=='') {
            result.gender2='../../dist/images/fenfang_empty.png';
          }
          if (result.gender2=='男') {
            result.gender2='../../dist/images/fenfang_nan.png';
          }
          if (result.gender2=='女') {
            result.gender2='../../dist/images/fenfang_nv.png';
          }
          if (result.gender3=='') {
            result.gender3='../../dist/images/fenfang_empty.png';
          }
          if (result.gender3=='男') {
            result.gender3='../../dist/images/fenfang_nan.png';
          }
          if (result.gender3=='女') {
            result.gender3='../../dist/images/fenfang_nv.png';
          }
          console.log(result);
          that.setData({
            myroom:myroom,
            roomData:result
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '获取房间信息失败',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  }
})