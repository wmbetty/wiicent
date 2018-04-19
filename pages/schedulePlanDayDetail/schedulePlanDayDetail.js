var app = getApp();
Page({
  data:{
    xid:'',
    sid:'',
    day:'',
    id:'',
    xchSn:'',
    isManager:false,
    scheduleDayDetail:{}
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var day = option.day;
    var xchSn = option.xchSn;
    var isManager = option.isManager;
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
            day:day,
            xchSn:xchSn,
            isManager:isManager
        });
      }
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
              var id = result[i].id;
              that.setData({
                scheduleDayDetail:a,
                id:id
              });
              wx.setNavigationBarTitle({
                title: '第'+result[i].day+'天'
              });
            }
          }
        }
      }
    })
  },
  edit:function(e){
    wx.redirectTo({
      url: "../schedulePlanDayDetailEdit/schedulePlanDayDetailEdit?xid="+this.data.xid+"&id="+this.data.id+"&xchSn="+this.data.xchSn+"&day="+this.data.day
    })
  }
})