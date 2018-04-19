var app = getApp();
Page({
  data:{
    sid:'',
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
      var name = wx.getStorageSync('name');
      var face = wx.getStorageSync('face');
      var uid = wx.getStorageSync('uid')?wx.getStorageSync('uid'):'';
      var personInfoData = {
        name:name,
        face:face,
        uid:uid
      };
      this.setData({
        personInfoData:personInfoData
      });
    } catch (e) {
      console.log(e);
    }
  },
  getCode:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log(res)
        wx.request({
          url: app.globalData.url+'/qrCode/qrCodeCheck?sid='+that.data.sid,
          method:'POST',
          data: {
              'resultString':res.result,
              'descrip':'',
              'app':appValue,
              'platform':platform,
              'ver':ver
          },
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.code=="10000") {
              console.log(res.data.result['QrCodeResult']);
              if (res.data.result['QrCodeResult'].code=="10000") {
                if (res.data.result['QrCodeResult'].action=='qrCodeRutuanCheck') {
                  wx.showToast({
                    title: '入团成功',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.navigateTo({
                    url:'../myFriendDetail/myFriendDetail?rid='+res.data.result['QrCodeResult'].transforId
                  });
                }
              }else{
                wx.showToast({
                  title: '解析失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }else{
              wx.showToast({
                title: '解析失败',
                icon: 'fail',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  viewCertify:function(e){
    wx.navigateTo({
      url: "../certify/certify"
    })
  },
  viewProject: function(e) {
		wx.navigateTo({
			url: "../projectManager/projectManager"
		})
  },
  viewSetting: function(e){
    wx.navigateTo({
      url: "../setting/setting"
    })
  },
  viewFriend: function(e){
    wx.navigateTo({
      url: "../myFriend/myFriend"
    })
  },
  viewFan: function(e){
    wx.navigateTo({
      url: "../myFan/myFan"
    })
  },
  viewFollow: function(e){
    wx.navigateTo({
      url: "../myFollow/myFollow"
    })
  },
  viewPersonInfo:function(e){
    var data = e.currentTarget.dataset
    console.log(data);
    wx.navigateTo({
      url: "../personInfo/personInfo"
    })
  },
  viewHistory:function(e){
    wx.navigateTo({
      url: "../projectHistory/projectHistory"
    })
  }
})