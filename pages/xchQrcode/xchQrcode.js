var app = getApp();
var QR = require("../../comm/script/qrcode.js");
Page({
  data:{
    sid:'',
    xid:'',
    xchSn:'',
    codePath:'',
    projectData:{}
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var xchSn = option.xchSn;
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
            xchSn:xchSn
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
      url: app.globalData.url+'/qrCodeRutuan/qrCodeRutuanCreate?sid='+this.data.sid,
      method:'POST',
      data: {
          'xid':this.data.xid,
          'app':appValue,
          'platform':platform,
          'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var a = res.data.result['Delete'].sourceType;
          var size = that.setCanvasSize();
          that.createQrCode(a,"mycanvas",size.w,size.h);
        }else{

        }
      }
    });
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseView?sid='+this.data.sid,
      method:'POST',
      data: {
          'xid':this.data.xid,
          'app':appValue,
          'platform':platform,
          'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchBase'];
          that.setData({
            projectData:result
          })
        }else{
          that.setData({
            projectData:{}
          })
        }
      }
    });
  },
  setCanvasSize:function(){
    var size={};
    try {
        var res = wx.getSystemInfoSync();
        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败"+e);
      }
    return size;
  } ,
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url,canvasId,cavW,cavH);
    setTimeout(() => { this.canvasToTempImage();},1000);

  },
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
              codePath:tempFilePath
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  }
})