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
    xid:'',
    rid:'',
    lng:'',
    lat:'',
    address:'',
    userId:'',
    size:5,
    height:0,
    dairyListData:[],
    pageId:1,
    hasMore:true,
    menuOpen:false,
    projectData:{},
    tripStatus:['未提交','待确认','待支付','待支付','已付款','待出发','进行中','已完成','已评价','已关闭'],
    itemListData:[
      {text:'游客位置',imgsrc:'../../dist/images/home_icon1.png',name:'visitorPosition',bgcolor:'#49cce4'},
      {text:'公告栏',imgsrc:'../../dist/images/home_icon2.png',name:'announcement',bgcolor:'#fd8881'},
      {text:'导游日志',imgsrc:'../../dist/images/home_icon3.png',name:'lineDairy',bgcolor:'#f8b55d'},
      {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde'},
      {text:'成员名单',imgsrc:'../../dist/images/home_icon6.png',name:'personList',bgcolor:'#8ad13e'},
      {text:'分房',imgsrc:'../../dist/images/home_icon7.png',name:'shareRoom',bgcolor:'#f8b55d'},
      {text:'行程二维码',imgsrc:'../../dist/images/home_icon17.png',name:'xchQrcode',bgcolor:'#8ad13e'},
      {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde'},
      {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3'},
      {text:'紧急事件',imgsrc:'../../dist/images/home_icon11.png',name:'emergency',bgcolor:'#fd8881'},
      {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4'},
      {text:'出团短信',imgsrc:'../../dist/images/home_icon4.png',name:'xchMsg',bgcolor:'#8ad13e'},
      {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d'}
    ],
    itemListData1:[
      {text:'导游位置',imgsrc:'../../dist/images/home_icon1.png',name:'touristPosition',bgcolor:'#49cce4'},
      {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde'},
      {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3'},
      {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde'},
      {text:'我的房号',imgsrc:'../../dist/images/home_icon16.png',name:'myRoom',bgcolor:'#f8b55d'},
      {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4'},
      {text:'行李清单',imgsrc:'../../dist/images/home_icon12.png',name:'packageList',bgcolor:'#f8b55d'}
    ],
    isClosePositionBtn:false,
    isOpenPositionBtn:false,
    isFinishProjectBtn:false,
    isStartProjectBtn:true,
    isCloseProjectBtn:true,
    isShowBtnBox:true,
    recomXchData:[],
    pageId1:1,
    hasMore1:true,
    hereData:{},
    hereMenuData:[{name:'美食',src:'../../dist/images/here_index_icon3.png'},{name:'购物',src:'../../dist/images/here_index_icon4.png'},{name:'住宿',src:'../../dist/images/here_index_icon2.png'},{name:'景点',src:'../../dist/images/here_index_icon1.png'}]
	},
  onLoad: function(option) {
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var sid = '';
    var xid = '';
    var userId = '';
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
            height: a
        })
      }
    });
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
          userId:userId
        });
      }
    } catch (e) {}
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseShowList?sid='+this.data.sid,
      method:'POST',
      data: {
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
          var result = res.data.result['xchBaseShow.list'];
          if (result) {
            for (var i = 0; i < result.length; i++) {
              result[i].bcontentImage = result[i].bcontentImage.split('big_')[1]==''?'':result[i].bcontentImage;
            }
            var pageId1 = ++that.data.pageId1;
            that.setData({
              pageId1:pageId1,
              recomXchData:result
            })
          }
        }else{
          that.setData({
            hasMore1:false
          });
        }
      }
    })
  },
  onReachBottom: function(e) {
    if (this.data.projectData.xid) {
      this.loadMore();
    }
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    try{
      wx.getLocation({
        type: 'gcj02',//gcj02,wgs84
        success: function(res) {
          var lat = res.latitude;
          var lng = res.longitude;
          var address = '';
          app.updateGeo(lat,lng);
          console.log('getgeosuccess');
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
          that.setData({
            lng:lng,
            lat:lat,
            pageId:0
          });
          wx.request({
            url: app.globalData.url+'/xingcheng/xingchengIndex?sid='+that.data.sid,
            method:'POST',
            data: {
              'mapType':'GCJ02',
              'longitude':that.data.lng,
              'latitude':that.data.lat,
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
                var xid = result.xid;
                var rid = result.rid;
                console.log(result);
                result.startCity = result.startCity.length>6?result.startCity.substring(0,6)+'..':result.startCity;
                result.destiCity = result.destiCity.length>6?result.destiCity.substring(0,6)+'..':result.destiCity;
                result.startDate = util.getDate(Number(result.startDate));
                result.finishDate = result.finishDate.split(' ')[0];
                that.setData({
                  projectData:result,
                  rid:rid
                });
                if (result.tripStatus>=7) {
                  that.setData({
                    isShowBtnBox:false
                  });
                }else{
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
                          pageId:2
                        })
                      }
                    }else{
                      that.setData({
                        dairyListData:[],
                        hasMore:false
                      });
                    }
                  }
                })
              }else{
                that.setData({
                  projectData:{}
                });

              }
            }
          })
        },
        fail:function(){
          var lat = wx.getStorageSync('current_lat');
          var lng = wx.getStorageSync('current_lng');
          console.log('getgeofail');
          console.log(lat);
          console.log(lng);
          getAddress(lat,lng).then(res=>{
            if (res.result.address) {
              address = res.result.address.length>22?res.result.address.substring(0,22)+'..':res.result.address;
              that.setData({
                address:address
              })
            }
            console.log(res);
          });
          that.setData({
            lng:lng,
            lat:lat,
            pageId:1
          });
          wx.request({
            url: app.globalData.url+'/xingcheng/xingchengIndex?sid='+that.data.sid,
            method:'POST',
            data: {
              'mapType':'GCJ02',
              'longitude':that.data.lng,
              'latitude':that.data.lat,
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
                var xid = result.xid;
                var rid = result.rid;
                console.log(result);
                result.startCity = result.startCity.length>6?result.startCity.substring(0,6)+'..':result.startCity;
                result.destiCity = result.destiCity.length>6?result.destiCity.substring(0,6)+'..':result.destiCity;
                result.startDate = util.getDate(Number(result.startDate));
                result.finishDate = result.finishDate.split(' ')[0];
                that.setData({
                  projectData:result,
                  rid:rid
                });
                if (result.tripStatus>=7) {
                  that.setData({
                    isShowBtnBox:false
                  });
                }else{
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
                          pageId:2
                        })
                      }
                    }else{
                      that.setData({
                        dairyListData:[],
                        hasMore:false
                      });
                    }
                  }
                })
              }else{
                that.setData({
                  projectData:{}
                });
              }
            }
          })
        }
      })
    }catch(e){}
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
    var lat = wx.getStorageSync('current_lat');
    var lng = wx.getStorageSync('current_lng');
    console.log(lat);
    console.log(lng);
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
  loadMore1:function(e){
    if (!this.data.hasMore1) {return}
    console.log(this.data.pageId1);
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseShowList?sid='+this.data.sid,
      method:'POST',
      data: {
        'pageId':this.data.pageId1,
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
          var result = res.data.result['xchBaseShow.list'];
          var recomXchData = that.data.recomXchData.concat(result);
          var pageId1 = ++that.data.pageId1;
          for (var i = 0; i < result.length; i++) {
            result[i].bcontentImage = result[i].bcontentImage.split('big_')[1]==''?'':result[i].bcontentImage;
          }
          that.setData({
            recomXchData:recomXchData,
            pageId1:pageId1
          });
        }else{
          that.setData({
            hasMore1:false
          });
        }
      }
    })
  },
  viewRecomXch:function(e){
    var xid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'../../pages/recomXchDetail/recomXchDetail?xid='+xid
    });
  },
  createXch:function(e){
    wx.navigateTo({
      url:'../../pages/projectDetail/projectDetail'
    });
  },
  qrJoinXch:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log(res)
        wx.request({
          url: app.globalData.url+'/qrCode/qrCodeCheck?sid='+that.data.sid,
          method:'POST',
          data: {
              'resultString':res.result,
              'descrip':'',
              'app':appValue,
              'platform':platform,
              'ver':ver
          },
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.code=="10000") {
              if (res.data.result['QrCodeResult'].code=="10000") {
                if (res.data.result['QrCodeResult'].action=='qrCodeRutuanCheck') {
                  wx.showToast({
                    title: '入团成功',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.navigateTo({
                    url:'../myFriendDetail/myFriendDetail?rid='+res.data.result['QrCodeResult'].transforId
                  });
                }
              }else{
                wx.showToast({
                  title: '解析失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }else{
              wx.showToast({
                title: '解析失败',
                icon: 'fail',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  goCertify:function(e){
    wx.navigateTo({
      url:'../certify/certify'
    });
  },
  viewRecomXch:function(e){
    var xid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'../../pages/recomXchDetail/recomXchDetail?xid='+xid
    });
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
  }
})