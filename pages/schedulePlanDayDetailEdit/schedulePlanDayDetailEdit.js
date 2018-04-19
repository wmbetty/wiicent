var app = getApp();
Page({
  data:{
    sid:'',
    xid:'',
    id:'',
    day:'',
    xchSn:'',
    formData:{
      title:'',
      content:'',
      breakfast:'',
      lunch:'',
      supper:'',
      transport:'',
      hotel:''
    }
  },
  onLoad:function(option){
    var xid = option.xid;
    var id = option.id;
    var xchSn = option.xchSn;
    var day = option.day;
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
            id:id,
            xchSn:xchSn,
            day:day
        });
      }
      wx.setNavigationBarTitle({
        title: '第'+this.data.day+'天'
      });
    } catch (e) {}
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchScheduleDay/xchScheduleDayList?sid='+this.data.sid,
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
          var result = res.data.result['XchScheduleDay.list'];
          console.log(result);
          for (var i = 0; i < result.length; i++) {
            if(result[i].day==that.data.day){
              var a = result[i];
              that.setData({
                formData:a
              });
            }
          }
        }
      }
    })
  },
  bindinputListener:function(e){
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    var formData = this.data.formData;
    formData[id] = value;
    this.setData({
      formData:formData
    });
  },
  submit:function(e){
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.formData.title=='') {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    wx.showLoading({
      title: '请稍候',
      mask:true
    })
    wx.request({
      url: app.globalData.url+'/xchScheduleDay/setXchScheduleDay?sid='+this.data.sid,
      method:'POST',
      data: {
        'id':this.data.id,
        'title':this.data.formData.title,
        'content':this.data.formData.content,
        'breakfast':this.data.formData.breakfast,
        'lunch':this.data.formData.lunch,
        'supper':this.data.formData.supper,
        'transport':this.data.formData.transport,
        'hotel':this.data.formData.hotel,
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
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '提交失败',
            icon: 'fail',
            duration: 2000
          })
        }
      },
      fail:function(){
        wx.hideLoading();
        wx.showToast({
          title: '网络故障',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  }
})