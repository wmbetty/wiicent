var app = getApp();
var util = require('../../util/util.js');
Page({
	data: {
    sid:'',
    pageId:0,
    size:10,
    projectListData:[],
    hasMore:true,
    height:0,
    tripStatus:['未提交','待确认','待支付','待支付','已付款','待出发','进行中','已完成','已评价','已关闭'],
    tabList:[{text:'行程状态',isActive:false,id:0},{text:'排列顺序',isActive:false,id:1}],
    stateList:[{text:'全部',isSelect:true,status:''},{text:'待出发',isSelect:false,status:5},{text:'进行中',isSelect:false,status:6},{text:'已完成',isSelect:false,status:7},{text:'已关闭',isSelect:false,status:9}],
    orderList:[{text:'时间正序',isSelect:false,value:1},{text:'时间逆序',isSelect:true,value:2}],
    isStateShow:false,
    isOrderShow:false,
    isIconShow:true,
    queryData:{
      title:'',
      tripStatus:'',
      startDate:'出发日期',
      sequence:''
    }
  },
  onLoad: function() {
    var that = this;
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
    } catch (e) {}
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
      url: app.globalData.url+'/xchBase/xchBaseList?sid='+this.data.sid,
      method:'POST',
      data: {
        'pageId':this.data.pageId,
        'size':this.data.size,
        'showType':'XchBase',
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
          var result = res.data.result['XchBase.list'];
          var pageId = ++that.data.pageId;
          for (var i = 0; i < result.length; i++) {
            result[i].startCity = result[i].startCity.length>6?result[i].startCity.substring(0,6)+'..':result[i].startCity;
            result[i].destiCity = result[i].destiCity.length>6?result[i].destiCity.substring(0,6)+'..':result[i].destiCity;
            result[i].startDate = util.getDate(Number(result[i].startDate));
            result[i].finishDate = result[i].finishDate.split(' ')[0];
          }
          console.log(result);
          that.setData({
            projectListData:result,
            pageId:pageId
          });
        }else{
          that.setData({
            hasMore:false
          });
        }
      }
    })
  },
  loadMore:function(e){
    if (!this.data.hasMore) {return}
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
      url: app.globalData.url+'/xchBase/xchBaseList?sid='+this.data.sid,
      method:'POST',
      data: {
        'title':this.data.queryData.title,
        'tripStatus':this.data.queryData.tripStatus,
        'startDate':this.data.queryData.startDate=='出发日期'?'':util.toTimestamp(this.data.queryData.startDate+' 00:00:00')/1000,
        'sequence':this.data.queryData.sequence,
        'pageId':that.data.pageId,
        'size':that.data.size,
        'showType':'XchBase',
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchBase.list'];
          for (var i = 0; i < result.length; i++) {
            result[i].startDate = util.getDate(Number(result[i].startDate));
            result[i].finishDate = result[i].finishDate.split(' ')[0];
          }
          var projectListData = that.data.projectListData.concat(result);
          var pageId = ++that.data.pageId;
          that.setData({
            projectListData:projectListData,
            pageId:pageId,
            hasMore:true
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
  },
  addMaterialDetail:function(e){
    wx.navigateTo({
      url: '../projectDetail/projectDetail'
    });
  },
  viewProjectDetail:function(e){
    var xid = e.currentTarget.dataset.xid;
    var xchSn = e.currentTarget.dataset.xchsn;
    var rid = e.currentTarget.dataset.rid;
    wx.redirectTo({
      url: '../homebase/homebase?xid='+xid+'&xchSn='+xchSn+'&rid='+rid
    });
  },
  searchInput:function(e){
    var value = e.detail.value;
    if (value=='') {
      this.setData({
        isIconShow:true
      });
    }else{
      this.setData({
        isIconShow:false
      });
    }
    var queryData = this.data.queryData;
    queryData['title'] = value;
    this.setData({
      queryData:queryData
    });
  },
  searchTitle:function(e){
    this.getQueryData();
  },
  tapTab:function(e){
    var id = e.currentTarget.dataset.id;
    var tabList = this.data.tabList;
    switch(id){
      case 0:
        if (tabList[0].isActive) {
          tabList[0].isActive = false;
          this.setData({
            isStateShow:false,
            tabList:tabList
          });
        }else{
          tabList[0].isActive = true;
          this.setData({
            isStateShow:true,
            tabList:tabList
          });
        }
        break;
      case 1:
        if (tabList[1].isActive) {
          tabList[1].isActive = false;
          this.setData({
            isOrderShow:false,
            tabList:tabList
          });
        }else{
          tabList[1].isActive = true;
          this.setData({
            isOrderShow:true,
            tabList:tabList
          });
        }
        break;
    }
  },
  tapState:function(e){
    var index = e.currentTarget.dataset.index;
    var stateList = this.data.stateList;
    var tabList = this.data.tabList;
    var queryData = this.data.queryData;
    for (var i = 0; i < stateList.length; i++) {
      if (index == i) {
        stateList[i].isSelect = true;
        tabList[0].text = stateList[i].text;
        tabList[0].isActive = false;
        queryData['tripStatus'] = stateList[i].status;
      }else{
        stateList[i].isSelect = false;
      }
    }
    this.setData({
      stateList:stateList,
      tabList:tabList,
      isStateShow:false,
      queryData:queryData
    });
    this.getQueryData();
  },
  tapOrder:function(e){
    var index = e.currentTarget.dataset.index;
    var orderList = this.data.orderList;
    var tabList = this.data.tabList;
    var queryData = this.data.queryData;
    for (var i = 0; i < orderList.length; i++) {
      if (index == i) {
        orderList[i].isSelect = true;
        tabList[1].isActive = false;
        tabList[1].text = orderList[i].text;
        queryData['sequence'] = orderList[i].value;
      }else{
        orderList[i].isSelect = false;
      }
    }
    this.setData({
      orderList:orderList,
      tabList:tabList,
      isOrderShow:false,
      queryData:queryData
    });
    this.getQueryData();
  },
  tapDate:function(e){
    var value = e.detail.value;
    var queryData = this.data.queryData;
    queryData['startDate'] = value;
    this.setData({
      queryData:queryData
    });
    this.getQueryData();
  },
  cancelDate:function(e){
    console.log(e);
    var queryData = this.data.queryData;
    queryData['startDate'] = '出发日期';
    this.setData({
      queryData:queryData
    });
    this.getQueryData();
  },
  getQueryData:function(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseList?sid='+this.data.sid,
      method:'POST',
      data: {
        'title':this.data.queryData.title,
        'tripStatus':this.data.queryData.tripStatus,
        'startDate':this.data.queryData.startDate=='出发日期'?'':util.toTimestamp(this.data.queryData.startDate+' 00:00:00')/1000,
        'sequence':this.data.queryData.sequence,
        'pageId':1,
        'size':this.data.size,
        'showType':'XchBase',
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchBase.list'];
          for (var i = 0; i < result.length; i++) {
            result[i].startDate = util.getDate(Number(result[i].startDate));
            result[i].finishDate = result[i].finishDate.split(' ')[0];
          }
          console.log(result);
          that.setData({
            projectListData:result,
            hasMore:true,
            pageId:2
          });
          wx.hideLoading();
        }else{
          that.setData({
            projectListData:[],
            hasMore:false
          });
          wx.hideLoading();
        }
      }
    })
  }
})