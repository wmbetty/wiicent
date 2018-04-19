var app = getApp();
Page({
  data:{
    xid:'',
    sid:'',
    userId:'',
    xchDetailData:{},
    xchScheduleData:[],
    isAllOpen:true,
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var userId = '';
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      userId = wx.getStorageSync('userId');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid,
            userId:userId
        });
      }
    } catch (e) {}
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var dayData = [];
    wx.request({
      url: app.globalData.url+'/xchRichengShow/xchRichengShowList?sid='+this.data.sid,
      method:'POST',
      data: {
        'xid':this.data.xid,
        'myId':this.data.userId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result;
          for (var i = 0; i < result.length; i++) {
            result[i].isOpen = true;
            if (result[i].attr.length) {
              for (var j = 0; j < result[i].attr.length; j++) {
                result[i].attr[j].startTime = result[i].attr[j].startTime.split(' ')[1]?result[i].attr[j].startTime.split(' ')[1]:result[i].attr[j].startTime.split(' ')[0];
              }
            }
          }
          that.setData({
            isAllOpen:true,
            xchScheduleData:result
          });
        }
      }
    });
    wx.request({
      url: app.globalData.url+'/xchBase/XchBaseShowView?sid='+this.data.sid,
      method:'POST',
      data: {
        'xid':this.data.xid,
        'myId':this.data.userId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['xchBaseShow'];
          if (result) {
            that.setData({
              xchDetailData:result
            });
          }
        }
      }
    })
  },
  closeAll:function(e){
    var xchScheduleData = this.data.xchScheduleData;
    for (var i = 0; i < xchScheduleData.length; i++) {
      xchScheduleData[i].isOpen = false;
    }
    this.setData({
      xchScheduleData:xchScheduleData,
      isAllOpen:false
    });
  },
  openAll:function(e){
    var xchScheduleData = this.data.xchScheduleData;
    for (var i = 0; i < xchScheduleData.length; i++) {
      xchScheduleData[i].isOpen = true;
    }
    this.setData({
      xchScheduleData:xchScheduleData,
      isAllOpen:true
    });
  },
  openOne:function(e){
    var index = e.currentTarget.dataset.index;
    var xchScheduleData = this.data.xchScheduleData;
    xchScheduleData[index].isOpen = true;
    this.setData({
      xchScheduleData:xchScheduleData
    })
  },
  closeOne:function(e){
    var index = e.currentTarget.dataset.index;
    var xchScheduleData = this.data.xchScheduleData;
    xchScheduleData[index].isOpen = false;
    this.setData({
      xchScheduleData:xchScheduleData
    })
  },
  viewPlotDetail:function(e){
    var spotId = e.currentTarget.dataset.spotid;
    wx.navigateTo({
      url: "../schedulePlanPlotDetail/schedulePlanPlotDetail?xid="+this.data.xid+"&spotId="+spotId
    })
  },
  copyXch:function(e){
    wx.navigateTo({
      url: "../recomXchCopy/recomXchCopy?xid="+this.data.xid
    })
  }
})