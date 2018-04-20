// pages/findSpotByArea/findSpotByArea.js
import wxJs from '../../util/wxjs'
import util from '../../util/util'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempList = [];

Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    spotList: [],
    type: '',
    pageId: 1,
    size: 15,
    listUrl: '',
    postData: {},
    hasMore: true,
    timeStamp: 0,
    destiCity: ''
  },
  onLoad: function (options) {
    var that = this;
    let index = options.index * 1;
    let detail = JSON.parse(options.detail);
    let type = '';
    switch (index) {
      case 0:
        type = '景点'
        break;
      case 1:
        type = '玩法'
        break;
      case 2:
        type = '锦囊'
        break;
      case 3:
        type = '美食'
        break;
      case 4:
        type = '购物'
        break;
      case 5:
        type = '住宿'
        break;
      case 6:
        type = '休闲'
        break;
      case 7:
        type = '综合'
        break;
      default:
        console.log("都不是");
        break;
    }

    let winHeight = wx.getStorageSync('winHeight');
    that.setData({
      type: type,
      currentTab: index,
      destiCity: detail.name,
      winHeight: winHeight - 90 / 750 * 300
    });

    let sid = wx.getStorageSync('sid');
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url + '/baike/baikeIndex?sid=' + sid;
      let postData = {
        'pageId': that.data.pageId,
        'destiPath': detail.path,
        'size': that.data.size,
        'mtype': that.data.type,
        'app': appValue,
        'platform': platform,
        'ver': ver
      };
      that.setData({
        listUrl: url,
        postData: postData
      });
      that.getSpotList(url, postData);
    }

  },
  getSpotList(url, postData) {
    wxJs.showLoading('加载中');
    let that = this;
    let lat = '';
    let lon = '';
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        lat = res.latitude;
        lon = res.longitude;
        wxJs.postRequest(url, postData, (res) => {
          let result = res.data.result;
          if (res.data) {
            wx.hideLoading();
          }
          let lists = result['ShowList.list'] || [];
          // 计算距离
          if (lists.length > 0) {
            for (let item of lists) {
              let dis = util.getDistance(item.latitude, item.longitude, lat, lon);
              item.sDis = dis;
            }
          }
          if (result && lists.length > 0 && that.data.pageId <= 1) {
            that.setData({
              spotList: lists
            });
          }
          if (that.data.pageId > 1 && result && lists.length > 0) {
            tempList = result['ShowList.list'];
            let list = that.data.spotList;
            that.setData({
              spotList: list.concat(tempList)
            });
          }
          if (!res.data) {
            that.setData({
              hasMore: false
            });
            wxJs.showToast('暂无数据');
          }
        })
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this;
    let type = ''
    let cur = e.target.dataset.current;
    if (cur * 1 === 0) {
      type = '景点'
    }
    if (cur * 1 === 1) {
      type = '玩法'
    }
    if (cur * 1 === 2) {
      type = '锦囊'
    }
    if (cur * 1 === 3) {
      type = '美食'
    }
    if (cur * 1 === 4) {
      type = '购物'
    }
    if (cur * 1 === 5) {
      type = '住宿'
    }
    if (cur * 1 === 6) {
      type = '休闲'
    }
    if (cur * 1 === 7) {
      type = '综合'
    }
    if (that.data.currentTaB == cur) { return false; }
    else {
      let postData = that.data.postData;
      postData.pageId = 1;
      postData.mtype = type;
      that.setData({
        currentTab: cur,
        postData: postData,
        spotList: []
      });
      that.getSpotList(that.data.listUrl, postData);
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      });
    } else {
      this.setData({
        scrollLeft: 0
      });
    }
  },
  searchScrollLower(e) {
    let that = this;
    if (e.timeStamp - that.data.timeStamp < 3000) { return }
    that.setData({
      timeStamp: e.timeStamp
    });
    if (that.data.hasMore) {
      let pageId = that.data.pageId;
      pageId = pageId + 1;
      let postData = that.data.postData;
      postData.pageId = pageId;
      that.setData({
        pageId: pageId,
        postData: postData
      });
      let url = that.data.listUrl;
      that.getSpotList(url, postData);
    } else {
      wxJs.showToast('数据已全部加载');
    }
  },
  // 詳情
  gotoDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/previewDetail/previewDetail?item=' + JSON.stringify(item)
    })
  },
  goChooseArea () {
    wx.navigateTo({
      url: '/pages/areaList/areaList'
    })
  }

})