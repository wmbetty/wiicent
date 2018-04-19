var app = getApp();
Page({
  data:{
    sid:'',
    rid:'',
    isAddFriend:true,
    personInfoData:{}
  },
  onLoad:function(option){
    var sid = '';
    var rid = option.rid;
    var friendListData = [];
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
          sid:sid,
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
      url: app.globalData.url+'/customer/customerFriendsList?sid='+this.data.sid,
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
          var result = res.data.result['Customer.list'];
          for (var i = 0; i < result.length; i++) {
            if(result[i].id==that.data.rid){
              that.setData({
                isAddFriend:false
              });
            }
          }
        }
      }
    })
    wx.request({
      url: app.globalData.url+'/customer/customerInfo?sid='+this.data.sid,
      method:'POST',
      data: {
        'customerId':this.data.rid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['Customer'];
          console.log(result);
          that.setData({
            personInfoData:result
          });
        }
      }
    })
  },
  addNewFriend:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showLoading({
      title:'请稍候..',
      mask:true
    });
    wx.request({
      url: app.globalData.url+'/customer/friendApplyById?sid='+this.data.sid,
      method:'POST',
      data: {
        'customerId':this.data.rid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code=="10000") {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '提交失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    });
  }
})