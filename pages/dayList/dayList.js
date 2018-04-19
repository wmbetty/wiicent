var app = getApp();
Page({
  data:{
  	xid:'',
  	sid:'',
    startDate:'',
    dayListData:[]
  },
  onLoad:function(option){
  	var xid = option.xid;
    var sid = '';
    var startDate = option.startDate;
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
            startDate:startDate
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
        url: app.globalData.url+'/xchJingdian/xchJingdianIndex?sid='+this.data.sid,
        method:'POST',
        data: {
          'xid':that.data.xid,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['XchJingdianIndex.list'];
            for (var i = 0; i < result.length; i++) {
              result[i].title = result[i].title.length>12?result[i].title.substring(0,11)+'..':result[i].title;
            }
            if (result) {
              that.setData({
                dayListData:result
              });
            }
          }
        }
    })
  },
  viewSpotList:function(e){
    var day = e.currentTarget.dataset.day;
    wx.redirectTo({
    	url:'../spotList/spotList?xid='+this.data.xid+'&day='+day+'&startDate='+this.data.startDate
    });
  }
})