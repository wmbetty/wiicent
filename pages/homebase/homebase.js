var app = getApp();
var util = require('../../util/util.js');
var QQMapWX = require('../../comm/script/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key:'KSIBZ-PQZ6D-EHJ4J-HLCWU-CDBLS-TSBUN'
})
function getAddress(lat,lng){
  return new Promise((resolve,reject)=>{
    demo.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: function(res) {
        resolve(res);
      },
      fail: function(res) {
        reject(res);
      }
    });
  });
}
Page({
	data: {
    sid:'',
    xchSn:'',
    xid:'',
    rid:'',
    lng:'',
    lat:'',
    userId:'',
    pageId:1,
    size:5,
    height:0,
    dairyListData:[],
    hasMore:true,
    indicatorDots: true,
    autoplay: false,
    projectData:{},
    tripStatus:['未提交','待确认','待支付','待支付','已付款','待出发','进行中','已完成','已评价','已关闭'],
    itemListData:[
      {text:'游客位置',imgsrc:'../../dist/images/home_icon1.png',name:'visitorPosition',bgcolor:'#49cce4',isEnd:true},
      {text:'公告栏',imgsrc:'../../dist/images/home_icon2.png',name:'announcement',bgcolor:'#fd8881',isEnd:true},
      {text:'导游日志',imgsrc:'../../dist/images/home_icon3.png',name:'lineDairy',bgcolor:'#f8b55d',isEnd:true},
      {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde',isEnd:true},
      {text:'成员名单',imgsrc:'../../dist/images/home_icon6.png',name:'personList',bgcolor:'#8ad13e',isEnd:true},
      {text:'分房',imgsrc:'../../dist/images/home_icon7.png',name:'shareRoom',bgcolor:'#f8b55d',isEnd:true},
      {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde',isEnd:true},
      {text:'行程二维码',imgsrc:'../../dist/images/home_icon17.png',name:'xchQrcode',bgcolor:'#8ad13e',isEnd:true},
      {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3',isEnd:true},
      {text:'紧急事件',imgsrc:'../../dist/images/home_icon11.png',name:'emergency',bgcolor:'#fd8881',isEnd:true},
      {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4',isEnd:true},
      {text:'出团短信',imgsrc:'../../dist/images/home_icon4.png',name:'xchMsg',bgcolor:'#8ad13e',isEnd:true},
      {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d',isEnd:true}
    ],
    itemListData1:[
      {text:'导游位置',imgsrc:'../../dist/images/home_icon1.png',name:'touristPosition',bgcolor:'#49cce4',isEnd:true},
      {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde',isEnd:true},
      {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3',isEnd:true},
      {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde',isEnd:true},
      {text:'我的房号',imgsrc:'../../dist/images/home_icon16.png',name:'myRoom',bgcolor:'#f8b55d',isEnd:true},
      {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4',isEnd:true},
      {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d',isEnd:true}
    ],
    isClosePositionBtn:false,
    isOpenPositionBtn:false,
    isFinishProjectBtn:false,
    isStartProjectBtn:true,
    isCloseProjectBtn:true,
    isShowBtnBox:true,
    menuOpen:false,
    hereData:{},
    address:'',
    hereMenuData:[{name:'美食',src:'../../dist/images/here_index_icon3.png'},{name:'购物',src:'../../dist/images/here_index_icon4.png'},{name:'住宿',src:'../../dist/images/here_index_icon2.png'},{name:'景点',src:'../../dist/images/here_index_icon1.png'}]
	},
  onLoad: function(option) {
    var that = this;
    var sid = '';
    var xid = option.xid;
    var rid = option.rid;
    var xchSn = option.xchSn;
    var userId = '';
    var lat = '';
    var lng = '';
    var address = '';
    try {
      sid = wx.getStorageSync('sid');
      userId = wx.getStorageSync('userId');
      lat = wx.getStorageSync('current_lat');
      lng = wx.getStorageSync('current_lng');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        getAddress(lat,lng).then(res=>{
          if (res.result.address) {
            address = res.result.address.length>22?res.result.address.substring(0,22)+'..':res.result.address;
            that.setData({
              address:address
            })
          }
          console.log(res);
        });
        this.getHereData(lat,lng);
        this.setData({
          sid:sid,
          xid:xid,
          xchSn:xchSn,
          userId:userId,
          lat:lat,
          lng:lng,
          rid:rid
        });
      }
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          var a = res.windowHeight;
          that.setData({
              height: a
          })
        }
      })
    } catch (e) {}
  },
  getMenuList(isManager,isEnd){
    var itemListData = [];
    if (isManager) {
      if (isEnd) {
        /*是导游并且行程结束显示的菜单*/
        itemListData = [
          {text:'公告栏',imgsrc:'../../dist/images/home_icon2.png',name:'announcement',bgcolor:'#fd8881'},
          {text:'导游日志',imgsrc:'../../dist/images/home_icon3.png',name:'lineDairy',bgcolor:'#f8b55d'},
          {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde'},
          {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde'},
          {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3'},
          {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4'},
        ];
      }else{
        /*是导游并且行程未结束显示的菜单*/
        itemListData = [
          {text:'游客位置',imgsrc:'../../dist/images/home_icon1.png',name:'visitorPosition',bgcolor:'#49cce4',isEnd:true},
          {text:'公告栏',imgsrc:'../../dist/images/home_icon2.png',name:'announcement',bgcolor:'#fd8881',isEnd:true},
          {text:'导游日志',imgsrc:'../../dist/images/home_icon3.png',name:'lineDairy',bgcolor:'#f8b55d',isEnd:true},
          {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde',isEnd:true},
          {text:'成员名单',imgsrc:'../../dist/images/home_icon6.png',name:'personList',bgcolor:'#8ad13e',isEnd:true},
          {text:'分房',imgsrc:'../../dist/images/home_icon7.png',name:'shareRoom',bgcolor:'#f8b55d',isEnd:true},
          {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde',isEnd:true},
          {text:'行程二维码',imgsrc:'../../dist/images/home_icon17.png',name:'xchQrcode',bgcolor:'#8ad13e',isEnd:true},
          {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3',isEnd:true},
          {text:'紧急事件',imgsrc:'../../dist/images/home_icon11.png',name:'emergency',bgcolor:'#fd8881',isEnd:true},
          {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4',isEnd:true},
          {text:'出团短信',imgsrc:'../../dist/images/home_icon4.png',name:'xchMsg',bgcolor:'#8ad13e',isEnd:true},
          {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d',isEnd:true}
        ];
      }
    }else{
      if (isEnd) {
        /*游客行程结束显示的菜单*/
        itemListData = [
          {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde'},
          {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3'},
          {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde'},
          {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4'},
          {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d'}
        ];
      }else{
        /*游客行程未结束显示的菜单*/
        itemListData = [
          {text:'导游位置',imgsrc:'../../dist/images/home_icon1.png',name:'touristPosition',bgcolor:'#49cce4'},
          {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde'},
          {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3'},
          {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde'},
          {text:'我的房号',imgsrc:'../../dist/images/home_icon16.png',name:'myRoom',bgcolor:'#f8b55d'},
          {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4'},
          {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d'}
        ];
      }
    }
    this.setData({
      itemListData:itemListData
    })
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseView?sid='+this.data.sid,
      method:'POST',
      data: {
          'xid':this.data.xid,
          'rid':this.data.userId,
          'app':appValue,
          'platform':platform,
          'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchBase'];
          var itemListData1 = that.data.itemListData1;
          var itemListData = that.data.itemListData;
          var isManager = result.isManager==1?true:false;
          var isEnd = true;
          console.log(result);
          result.startCity = result.startCity.length>6?result.startCity.substring(0,6)+'..':result.startCity;
          result.destiCity = result.destiCity.length>6?result.destiCity.substring(0,6)+'..':result.destiCity;
          result.startDate = util.getDate(Number(result.startDate));
          result.finishDate = result.finishDate.split(' ')[0];
          that.setData({
            projectData:result
          });
          if (result.tripStatus>=7) {
            isEnd = true;
            that.setData({
              itemListData1:itemListData1,
              itemListData:itemListData,
              isShowBtnBox:false
            });
          }else{
            isEnd = false;
            if (result.tripStatus<6) {
              that.setData({
                isClosePositionBtn:false,
                isOpenPositionBtn:false,
                isFinishProjectBtn:false,
                isStartProjectBtn:true,
                isCloseProjectBtn:true
              });
            }else{
              that.setData({
                isFinishProjectBtn:true,
                isStartProjectBtn:false,
                isCloseProjectBtn:false
              });
              if (result.locStatus=="0") {
                that.setData({
                  isClosePositionBtn:false,
                  isOpenPositionBtn:true
                })
              }else{
                that.setData({
                  isClosePositionBtn:true,
                  isOpenPositionBtn:false
                })
              }
            }
          };
          that.getMenuList(isManager,isEnd);
          wx.request({
            url: app.globalData.url+'/weBlog/lvxingrijiList?sid='+that.data.sid,
            method:'POST',
            data: {
              'fid':that.data.projectData.xid,
              'pageId':1,
              'size':5,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                var result = res.data.result['WeBlog.list'];
                var pageId = ++that.data.pageId;
                if (result) {
                  for (var i = 0; i < result.length; i++) {
                    var a = util.toTimestamp(result[i].uptime);
                    var b = Date.parse(new Date())-a
                    var uptime = util.timeFormat(b);
                    result[i].uptime = uptime;
                    result[i].mcontentImage = result[i].mcontentImage.split('middle_')[1]==''?'':result[i].mcontentImage;
                  }
                  that.setData({
                    dairyListData:result,
                    pageId:pageId
                  })
                }
              }else{
                that.setData({
                  hasMore:false
                });
              }
            }
          })
        }
      }
    });
  },
  onReachBottom: function(e) {
    if (this.data.projectData.xid) {
      this.loadMore();
    }
  },
  closePosition:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var locStatus = 1;
    var longitude = this.data.lng;
    var latitude = this.data.lat;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定打开位置共享？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/setXchLocStatus?sid='+that.data.sid,
            method:'POST',
            data: {
              'xid':xid,
              'locStatus':locStatus,
              'longitude':longitude,
              'latitude':latitude,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
                app.updateGeo(latitude,longitude);
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  openPosition:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var locStatus = 0;
    var longitude = this.data.lng;
    var latitude = this.data.lat;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定关闭位置共享？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/setXchLocStatus?sid='+that.data.sid,
            method:'POST',
            data: {
              'xid':xid,
              'locStatus':locStatus,
              'longitude':longitude,
              'latitude':latitude,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  finishProject:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var current = this.data.projectData.tripStatus;
    var next = 7;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定结束行程？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/xchBaseStatus?sid='+that.data.sid,
            method:'POST',
            data: {
                'xid':xid,
                'current':current,
                'next':next,
                'app':appValue,
                'platform':platform,
                'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  startProject:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var current = this.data.projectData.tripStatus;
    var next = 6;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定开始行程？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/xchBaseStatus?sid='+that.data.sid,
            method:'POST',
            data: {
                'xid':xid,
                'current':current,
                'next':next,
                'app':appValue,
                'platform':platform,
                'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  closeProject:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var current = this.data.projectData.tripStatus;
    var next = 9;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定关闭行程？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/xchBaseStatus?sid='+that.data.sid,
            method:'POST',
            data: {
              'xid':xid,
              'current':current,
              'next':next,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
	viewItem:function(e){
    var name = e.currentTarget.dataset.id;
    var rid = '';
    var lat = wx.getStorageSync('current_lat');
    var lng = wx.getStorageSync('current_lng');

    if (name=='touristPosition') {
      if (this.data.projectData.locStatus=='0') {
        wx.showModal({
          title: '提示',
          content: '位置共享还未开启，无法查看导游位置',
          success: function(res) {
          }
        })
      }else{
        if (lat!=''&&lng!='') {
          var url = '../../pages/'+name+'/'+name+'?xid='+this.data.projectData.xid+'&xchSn='+this.data.projectData.xchSn+'&rid='+this.data.projectData.rid+'&isManager='+this.data.projectData.isManager+'&coDay='+this.data.projectData.coDay+'&startDate='+this.data.projectData.startDate;
          wx.navigateTo({
            url:url
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '获取定位失败...',
            success: function(res) {
            }
          })
        }
      }
    }else if(name=="visitorPosition"){
      if (this.data.projectData.locStatus=='0') {
        wx.showModal({
          title: '提示',
          content: '位置共享还未开启，无法查看游客位置',
          success: function(res) {
          }
        })
      }else{
        if (lat!=''&&lng!='') {
          var url = '../../pages/'+name+'/'+name+'?xid='+this.data.projectData.xid+'&xchSn='+this.data.projectData.xchSn+'&rid='+this.data.projectData.rid+'&isManager='+this.data.projectData.isManager+'&coDay='+this.data.projectData.coDay+'&startDate='+this.data.projectData.startDate;
          wx.navigateTo({
            url:url
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '获取定位失败...',
            success: function(res) {
            }
          })
        }
      }
    }else{
      var url = '../../pages/'+name+'/'+name+'?xid='+this.data.projectData.xid+'&xchSn='+this.data.projectData.xchSn+'&rid='+this.data.projectData.rid+'&isManager='+this.data.projectData.isManager+'&coDay='+this.data.projectData.coDay+'&startDate='+this.data.projectData.startDate;
      wx.navigateTo({
        url:url
      })
    }
  },
  viewDairyDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var sourceType = e.currentTarget.dataset.sourcetype;
    var targetId = e.currentTarget.dataset.targetid;
    wx.navigateTo({
      url: "../../pages/tourDairyDetail/tourDairyDetail?id="+id+"&sourceType="+sourceType+"&targetId="+targetId
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
        url: app.globalData.url+'/weBlog/lvxingrijiList?sid='+this.data.sid,
        method:'POST',
        data: {
          'fid':that.data.projectData.xid,
          'pageId':that.data.pageId,
          'size':that.data.size,
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
            var result = res.data.result['WeBlog.list'];
            var dairyListData = that.data.dairyListData.concat(result);
            var pageId = ++that.data.pageId;
            for (var i = 0; i < result.length; i++) {
              var a = util.toTimestamp(result[i].uptime);
              var b = Date.parse(new Date())-a
              var uptime = util.timeFormat(b);
              result[i].uptime = uptime;
              result[i].mcontentImage = result[i].mcontentImage.split('middle_')[1]==''?'':result[i].mcontentImage;
            }
            that.setData({
              dairyListData:dairyListData,
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
  goType:function(e){
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url:'../../pages/hereType/hereType?mtype='+name+'&xid='+this.data.projectData.xid
    })
  },
  changeMenu:function(e){
    var menuOpen = !this.data.menuOpen;
    this.setData({
      menuOpen:menuOpen
    })
  },
  getHereData:function(lat,lng){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/here/hereIndex?sid='+this.data.sid,
      method:'POST',
      data: {
        'title':'',
        'mtype':'',
        'longitude':lng,
        'latitude':lat,
        'distance':'',
        'pageId':1,
        'size':1,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['HereList.list'][0];
          result.distance = (result.distance+'').match(/^\d+(\.\d{1,2})?/g)[0];
          console.log(result);
          that.setData({
            hereData:result
          })
        }else{
          that.setData({
            hereData:{}
          })
        }
      }
    })
  },
  refreshGeo:function(e){
    var that = this;
    wx.getLocation({
      type: 'gcj02',//gcj02,wgs84
      success: function(res) {
        var lat = res.latitude;
        var lng = res.longitude;
        var address = '';
        app.updateGeo(lat,lng);
        that.getHereData(lat,lng);
        getAddress(lat,lng).then(res=>{
          if (res.result.address) {
            address = res.result.address.length>22?res.result.address.substring(0,22)+'..':res.result.address;
            that.setData({
              address:address
            })
          }
          console.log(res);
        });
        wx.setStorageSync('current_lat',lat);
        wx.setStorageSync('current_lng',lng);
      }
    });
  }
})