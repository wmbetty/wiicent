var app = getApp();
var QR = require("../../comm/script/qrcode.js");
Page({
  data:{
    sid:'',
    qcodePath:'',
    personInfoData:{}
  },
  onLoad:function(option){
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid
        });
      }
    }catch(e){}
  },
  onShow:function(){
    try {
      var userId = wx.getStorageSync('userId');
      var name = wx.getStorageSync('name');
      var mobilePhone = wx.getStorageSync('mobilePhone');
      var sid = wx.getStorageSync('sid');
      var face = wx.getStorageSync('face');
      var background = wx.getStorageSync('background');
      var vocation = wx.getStorageSync('vocation');
      var region = wx.getStorageSync('region');
      var gender = wx.getStorageSync('gender');
      var uid = wx.getStorageSync('uid')?wx.getStorageSync('uid'):'';
      var sign = wx.getStorageSync('sign');
      var authority = wx.getStorageSync('authority');
      var personInfoData = {
        userId:userId,
        name:name,
        mobilePhone:mobilePhone,
        face:face,
        background:background,
        vocation:vocation,
        region:region,
        gender:gender,
        uid:uid,
        sign:sign,
        authority:authority
      };
      this.setData({
        personInfoData:personInfoData
      });
      var size = this.setCanvasSize();//动态设置画布大小
      if (uid) {
        this.createQrCode('customerViewById;'+userId, "mycanvas", size.w, size.h);
      }
    } catch (e) {
      console.log(e);
    }
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
              imagePath:tempFilePath,
             // canvasHidden:true
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  },
  showQcode:function(){
    var img = this.data.imagePath;
    if (img) {
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表
      })
    }
  },
  editFace:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        var faceFile = res.tempFiles;
        if (faceFile.length) {
          wx.showModal({
            title: '提示',
            content: '确定修改头像？',
            success: function(res) {
              if (res.confirm) {
                wx.showLoading({
                  title: '请稍后',
                  mask:true
                })
                wx.uploadFile({
                  url: app.globalData.url+'/customer/customerSetAvater?sid='+that.data.sid,
                  method:'POST',
                  filePath:faceFile[0].path,
                  name:'file',
                  formData:{
                    'app':appValue,
                    'platform':platform,
                    'ver':ver
                  },
                  success: function(res) {
                    console.log(res.data);
                    if (/"10000"/.test(res.data)){
                      var personInfoData = that.data.personInfoData;
                      personInfoData.face = faceFile[0].path;
                      wx.setStorageSync('face',faceFile[0].path);
                      that.setData({
                        personInfoData:personInfoData
                      });
                      wx.hideLoading();
                      wx.showToast({
                        title: '上传成功',
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      wx.hideLoading();
                      wx.showToast({
                        title: '上传失败',
                        icon: 'fail',
                        duration: 2000
                      })
                    }
                  },
                  fail:function(res){
                    console.log(res);
                    wx.hideLoading();
                    wx.showToast({
                      title: '上传失败',
                      icon: 'fail',
                      duration: 2000
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  goEditName:function(){
    wx.navigateTo({
      url: '../editName/editName'
    })
  },
  goEditVocation:function(){
    wx.navigateTo({
      url: '../editVocation/editVocation'
    })
  },
  goEditSign:function(){
    wx.navigateTo({
      url: '../editSign/editSign'
    })
  },
  goEditRegion:function(){
    wx.navigateTo({
      url: '../editRegion/editRegion'
    })
  },
  goEditGender:function(){
    wx.navigateTo({
      url: '../editGender/editGender'
    })
  }
})