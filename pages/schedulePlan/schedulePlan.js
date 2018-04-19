var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    xchSn:'',
    xid:'',
    sid:'',
    startDate:'',
    isManager:0,
    scheduleListData:[]
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var xchSn = option.xchSn;
    var startDate = option.startDate;
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
          xchSn:xchSn,
          isManager:isManager,
          startDate:startDate
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
      url: app.globalData.url+'/xchScheduleDay/xchScheduleDayIndex?sid='+this.data.sid,
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
          var result = res.data.result['XchRicheng.list'];
          for (var i = 0; i < result.length; i++) {
            if (result[i].sourceType=='XchScheduleDay') {
              if(result[i].sourceTitle.length>26){
                result[i].sourceTitle = result[i].sourceTitle.substring(0,25)+'..';
              }
              var d = (result[i].day%2)?true:false;
              var a = {left:d,day:result[i].day,title:result[i].sourceTitle,plotList:[]};
              dayData.push(a);
              that.setData({
                scheduleListData:dayData
              });
              var b = [];
              for (var j = 0; j < result.length; j++) {
                if (result[j].day==result[i].day&&result[j].sourceType=='XchJingdian') {
                  if(result[j].sourceTitle.length>26){
                    result[j].sourceTitle = result[j].sourceTitle.substring(0,25)+'..';
                  }
                  if (result[j].startTime.split(' ')[1]) {
                    result[j].startTime = result[j].startTime.split(' ')[1];
                  }else{
                  }
                  var c = {name:result[j].sourceTitle,date:result[j].startTime,id:result[j].sourceId,sourceImage:result[j].sourceImage};
                  b.push(c);
                  var e = result[i].day-1;
                  dayData[e].plotList = b
                  that.setData({
                    scheduleListData:dayData
                  });
                }
              }
            }
          }
        }
      }
    })
  },
  viewPlotDetail:function(e){
    var plotId = e.currentTarget.dataset.plotid;
    wx.navigateTo({
      url: "../schedulePlanPlotDetail/schedulePlanPlotDetail?xid="+this.data.xid+"&spotId="+plotId
    })
  },
  viewPlanDetail:function(e){
    var day = e.currentTarget.dataset.day;
    wx.navigateTo({
      url: "../schedulePlanDayDetail/schedulePlanDayDetail?xid="+this.data.xid+"&xchSn="+this.data.xchSn+"&day="+day+"&isManager="+this.data.isManager
    })
  },
  addSpot:function(e){
    wx.navigateTo({
      url: "../dayList/dayList?xid="+this.data.xid+"&startDate="+this.data.startDate
    })
  }
})