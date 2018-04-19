var app = getApp();
Page({
  data:{
    xid:'',
    sid:'',
    xchSn:'',
    coDay:'',
    pageId:1,
    size:5,
    height:0,
    dairyListData:[],
    hasMore:true,
    timeStamp:0
  },
  onLoad:function(option){
  	var xid = option.xid;
    var xchSn = option.xchSn;
    var coDay = option.coDay;
    var sid = '';
    var that = this;
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
            coDay:coDay
        });
      }
    }catch(e){}
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
            height: a
        })
      }
    })
  },
  onShow:function(){
  	var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.setData({
      pageId:1,
      hasMore:true
    });
    wx.request({
      url: app.globalData.url+'/ptXchBlog/ptXchBlogIndex?sid='+this.data.sid,
      method:'POST',
      data: {
        'xid':this.data.xid,
        'xchSn':this.data.xchSn,
        'pageId':this.data.pageId,
        'size':this.data.size,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchBlog.list'];
          var pageId = ++that.data.pageId;
          var result1 = {};
          var result2 = [];
          if (result) {
            for (var i = 0; i < result.length; i++) {
              result[i].createTime = result[i].createTime.split(' ')[0].split('-')[1]+'-'+result[i].createTime.split(' ')[0].split('-')[2]+' '+result[i].createTime.split(' ')[1].split(':')[0]+':'+result[i].createTime.split(' ')[1].split(':')[1];
              if(result1[result[i].day]){
                result[i].isDayShow = false;
                result1[result[i].day].push(result[i]);
              }else{
                result1[result[i].day] =[];
                result[i].isDayShow = true;
                result1[result[i].day].push(result[i]);
              }
            }
            for (var i in result1) {
              for (var j = 0; j < result1[i].length; j++) {
                result2.push(result1[i][j]);
              }
            }
          	that.setData({
            	dairyListData:result2,
              pageId:pageId
         	  })
            wx.hideLoading();
          }
        }else{
          that.setData({
            hasMore:false
          });
          wx.hideLoading();
        }
      }
    })
  },
  addDairyDetail:function(){
    wx.navigateTo({
      url: "../../pages/lineDairyDetail/lineDairyDetail?xid="+this.data.xid+"&xchSn="+this.data.xchSn+"&id=0&coDay="+this.data.coDay
    })
  },
  editDairyDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../pages/lineDairyDetail/lineDairyDetail?xid="+this.data.xid+"&xchSn="+this.data.xchSn+"&id="+id+"&coDay="+this.data.coDay
    })
  },
  loadMore:function(e){
    if (!this.data.hasMore) {return}
    if (e.timeStamp-this.data.timeStamp<3000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
    console.log(e);
    console.log(this.data.pageId);
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
        url: app.globalData.url+'/ptXchBlog/ptXchBlogIndex?sid='+this.data.sid,
        method:'POST',
        data: {
          'xid':that.data.xid,
          'pageId':that.data.pageId,
          'xchSn':that.data.xchSn,
          'size':that.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['XchBlog.list'];
            var pageId = ++that.data.pageId;
            var result1 = {};
            var result2 = [];
            for (var i = 0; i < result.length; i++) {
              result[i].createTime = result[i].createTime.split(' ')[0].split('-')[1]+'-'+result[i].createTime.split(' ')[0].split('-')[2]+' '+result[i].createTime.split(' ')[1].split(':')[0]+':'+result[i].createTime.split(' ')[1].split(':')[1];
              if(result1[result[i].day]){
                result[i].isDayShow = false;
                result1[result[i].day].push(result[i]);
              }else{
                result1[result[i].day] =[];
                result[i].isDayShow = true;
                result1[result[i].day].push(result[i]);
              }
            }
            for (var i in result1) {
              for (var j = 0; j < result1[i].length; j++) {
                result2.push(result1[i][j]);
              }
            }
            var dairyListData = that.data.dairyListData.concat(result2);
            that.setData({
              dairyListData:dairyListData,
              pageId:pageId
            });
            wx.hideLoading();
          }else{
            that.setData({
              hasMore:false
            });
            wx.hideLoading();
          }
        }
    })
  }
})