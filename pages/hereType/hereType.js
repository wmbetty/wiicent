var app = getApp();
Page({
  data: {
    sid:'',
    xid:'',
    longitude:'',
    latitude:'',
    height:'auto',
    markers: [],
    includeArr:[],
    pointArr:[],
    isCardShow:false,
    cardData:{},
    menuListData:[]
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var sid = '';
    var lng = '';
    var lat = '';
    var mType = option.mtype;
    var menuListData = [{name:'全部',isSelect:true,color:'#5baef3',en:'quanbu'},{name:'美食',isSelect:false,color:'#fd8881',en:'meishi'},{name:'购物',isSelect:false,color:'#a59cde',en:'gouwu'},{name:'住宿',isSelect:false,color:'#8ad13e',en:'zhusu'},{name:'景点',isSelect:false,color:'#f8b55d',en:'jingdian'}];
    for (var i = 0; i < menuListData.length; i++) {
      if (menuListData[i].name==mType) {
        menuListData[i].isSelect = true;
      }else{
        menuListData[i].isSelect = false;
      }
    }
    console.log(menuListData);
    try {
      sid = wx.getStorageSync('sid');
      lng = wx.getStorageSync('current_lng');
      lat = wx.getStorageSync('current_lat');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid,
            longitude:lng,
            latitude:lat,
            menuListData:menuListData
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
    this.getMarkerData(mType);
  },
  getMarkerData:function(mType){
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var longitude = '';
    var latitude = '';
    var menuListData = this.data.menuListData;
    mType = mType=='全部'?'':mType;
    wx.request({
      url: app.globalData.url+'/here/getHereClsAsJinDian?sid='+this.data.sid,
      method:'POST',
      data: {
        'mtype':mType,
        'longitude':this.data.longitude,
        'latitude':this.data.latitude,
        'distance':'',
        'pageId':0,
        'size':50,
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
          var result = res.data.result['getHereClsAsJinDian.list'];
          var markers = [];
          var includeArr = [];
          var pointArr = [];
          for (var i = 0; i < result.length; i++) {
            var a = {};
            a.iconPath = "../../dist/images/here_normal_icon.png";
            a.id = i;
            a.latitude = Number(result[i].latitude);
            a.longitude = Number(result[i].longitude);
            a.width = 20;
            a.height = 20;
            var b = {};
            b.latitude = Number(result[i].latitude);
            b.longitude = Number(result[i].longitude);
            markers.push(a);
            includeArr.push(b);
            pointArr.push(result[i]);
          }
          that.setData({
            markers:markers,
            includeArr:includeArr,
            pointArr:pointArr
          })
        }else{
        }
      }
    })
  },
  regionchange(e) {
    console.log('regionchange');
    console.log(e);
    var that = this;
    var myMap = wx.createMapContext('map',this);
    try{
      myMap.getCenterLocation({
        success:function(res){
          if (e.type!='end') {return;}
          console.log('success');
          console.log(res);
          that.setData({
            longitude:res.longitude,
            latitude:res.latitude
          })
        },
        fail:function(res){
          console.log('fail');
          console.log(res);
        }
      })
    }catch(e){console.log(e)}
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
    this.getMarkerData(mType);
    this.setData({
      menuListData:menuListData,
      cardInfo:{},
      isCardShow:false
    })
  },
  tapCard:function(e){
    var isCardShow = !this.data.isCardShow;
    this.setData({
      isCardShow:isCardShow
    })
  },
  markerTap:function(e){
    console.log(e);
    var index = e.markerId;
    var pointArr = this.data.pointArr;
    var markers = this.data.markers;
    for (var i = 0; i < markers.length; i++) {
      if (index==i) {
        markers[i].iconPath = "../../dist/images/here_act_icon.png";
        markers[i].width = 46;
        markers[i].height = 56;
      }else{
        markers[i].iconPath = "../../dist/images/here_normal_icon.png";
        markers[i].width = 20;
        markers[i].height = 20;
      }
    }
    var cardInfo = pointArr[index];
    cardInfo.distance = (cardInfo.distance+'').match(/^\d+(\.\d{1,2})?/g)[0];
    cardInfo.content = cardInfo.content.length>96?cardInfo.content.subtring(0,96)+'..':cardInfo.content;
    cardInfo.time = cardInfo.seqTime.split(' ')[0];
    this.setData({
      cardInfo:cardInfo,
      markers:markers
    })
  },
  searchPlot:function(e){
    wx.navigateTo({
      url:'../../pages/hereSearch/hereSearch'
    })
  },
  addSpot:function(e){
    wx.navigateTo({
      url:'../../pages/hereCreate/hereCreate'
    })
  }
})


