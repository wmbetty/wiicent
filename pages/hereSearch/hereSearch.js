var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    sid:'',
    searchSpot:'',
    longitude:'',
    latitude:'',
    pageId:1,
    size:10,
    hasMore:true,
    height:0,
    timeStamp:0,
    spotListData:[],
    menuListData:[{name:'全部',isSelect:true,color:'#5baef3'},{name:'美食',isSelect:false,color:'#fd8881'},{name:'购物',isSelect:false,color:'#a59cde'},{name:'住宿',isSelect:false,color:'#8ad13e'},{name:'景点',isSelect:false,color:'#f8b55d'}]
  },
  onLoad:function(option){
    var that = this;
    var sid = '';
    var longitude = '';
    var latitude = '';
    try {
      sid = wx.getStorageSync('sid');
      longitude = wx.getStorageSync('current_lng');
      latitude = wx.getStorageSync('current_lat');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
          sid:sid,
          longitude:longitude,
          latitude:latitude
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
  cancel:function(e){
    this.setData({
      searchSpot:'',
      spotListData:[]
    });
  },
  searchBtn:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var menuListData = this.data.menuListData;
    var mType = '';
    for (var i = 0; i < menuListData.length; i++) {
      if (menuListData[i].isSelect) {
        mType = menuListData[i].name;
      }
    }
    mType = mType=='全部'?'':mType;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.request({
      url: app.globalData.url+'/here/hereIndex?sid='+this.data.sid,
      method:'POST',
      data: {
        'title':this.data.searchSpot,
        'mtype':mType,
        'longitude':this.data.longitude,
        'latitude':this.data.latitude,
        'distance':'',
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
        wx.hideLoading();
        if (res.data.code=="10000") {
          var result = res.data.result['HereList.list'];
          var pageId = ++that.data.pageId;
          for (var i = 0; i < result.length; i++) {
            result[i].distance = (result[i].distance+'').match(/^\d+(\.\d{1,2})?/g)[0];
          }
          console.log(result);
          that.setData({
            spotListData:result,
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
  bindSearchInput:function(e){
    var b = e.detail.value;
    this.setData({
      searchSpot:b
    });
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
    var menuListData = this.data.menuListData;
    var mType = '';
    for (var i = 0; i < menuListData.length; i++) {
      if (menuListData[i].isSelect) {
        mType = menuListData[i].name;
      }
    }
    mType = mType=='全部'?'':mType;
    wx.request({
        url: app.globalData.url+'/here/hereIndex?sid='+this.data.sid,
        method:'POST',
        data: {
          'title':this.data.searchSpot,
          'mtype':mType,
          'longitude':this.data.longitude,
          'latitude':this.data.latitude,
          'distance':'',
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
          wx.hideLoading();
          if (res.data.code=="10000") {
            var result = res.data.result['HereList.list'];
            for (var i = 0; i < result.length; i++) {
              result[i].distance = (result[i].distance+'').match(/^\d+(\.\d{1,2})?/g)[0];
            }
            var spotListData = that.data.spotListData.concat(result);
            var pageId = ++that.data.pageId;
            that.setData({
              spotListData:spotListData,
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
  tapMenu:function(e){
    var id = e.currentTarget.dataset.id;
    var menuListData = this.data.menuListData;
    var mType = menuListData[id].name;
    for (var i = 0; i < menuListData.length; i++) {
      if (id==i) {
        menuListData[i].isSelect = true;
      }else{
        menuListData[i].isSelect = false;
      }
    }
    this.setData({
      menuListData:menuListData,
      pageId:1,
      hasMore:true
    })
    this.searchBtn();
  },
  viewDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:"../../pages/hereView/hereView?spotId="+id
    })
  }
})