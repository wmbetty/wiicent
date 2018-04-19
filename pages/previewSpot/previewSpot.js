// pages/previewSpot/previewSpot.js
import wxJs from '../../util/wxjs'
import util from '../../util/util'

var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempList = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: 1,
    size: 10,
    finalList: [],
    details: {},
    hasMore: true,
    listHeight: '', //列表高度
    winHeight: '', //窗口高度
    listUrl: '',
    path: null,
    distance: 0,
    navLists: [
      { 'text': '景点', 'img':'../../dist/images/ic_jingdian.png'},
      { 'text': '玩法', 'img': '../../dist/images/ic_wanfa.png'},
      { 'text': '锦囊', 'img': '../../dist/images/ic_jinnang.png'},
      { 'text': '美食', 'img': '../../dist/images/ic_meishi.png'},
      { 'text': '购物', 'img': '../../dist/images/ic_gouwu.png' },
      { 'text': '住宿', 'img': '../../dist/images/ic_zhusu.png' },
      { 'text': '休闲', 'img': '../../dist/images/ic_xiuxian.png' },
      { 'text': '综合', 'img': '../../dist/images/ic_zonghe.png' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let item = JSON.parse(options.item)
    that.setData({
      details: item
    })
    let path = item.path
    let sid = wx.getStorageSync('sid')
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url+'/baike/baikeIndex?sid=' + sid
      that.setData({
        listUrl: url,
        path: path
      })
      let postData = {
        'mtype':'',
        'destiPath': path,
        'pageId':that.data.pageId,
        'size':that.data.size,
        'app':appValue,
        'platform':platform,
        'ver':ver
      }

      that.getList(url, postData);

      // 获取当前经纬度
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          let dis = util.getDistance(res.latitude, res.longitude, item.latitude, item.longitude)
          that.setData({
            distance: dis
          })
        }
      })
    }

    wxJs.getSystemInfo((res) => {
      // 可使用窗口宽度、高度
      let windowHeight = res.windowHeight
      that.setData({
        // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
        winHeight: windowHeight,
        listHeight: windowHeight - 508 / 750 * 300      
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

// 获取列表数据
  getList (url, postData) {
    wxJs.showLoading('加载中');
    let that = this
    let lat =  ''
    let lon =  ''
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        lat = res.latitude
        lon = res.longitude
        wxJs.postRequest(url, postData, (res) => {
          let resData = res.data
          if (resData) {
            wx.hideLoading();
          }
          let lists = resData.result['ShowList.list'] || []
          // 计算距离
          if (lists.length > 0) {
            for (let item of lists) {
              let dis = util.getDistance(item.latitude, item.longitude, lat, lon)
              item.sDis = dis
            }
          }
          if (resData.result && lists.length > 0 && that.data.pageId <= 1) {
            that.setData({
              finalList: lists
            })
          }
          if (that.data.pageId > 1 && resData.result && lists.length > 0) {
            tempList = resData.result['ShowList.list']
            let list = that.data.finalList
            that.setData({
              finalList: list.concat(tempList)
            })
          }
          if ((!resData.result || lists.length === 0) && that.data.pageId > 1) {
            that.setData({
              hasMore: false
            })
          }
        })
      }
    })
  },
  //滚动到底部触发事件
  searchScrollLower(e) {
    let that = this;
    if (e.timeStamp - this.data.timeStamp < 3000) { return }
    this.setData({
      timeStamp: e.timeStamp
    });
    if (that.data.hasMore) {
      let pageId = that.data.pageId + 1
      that.setData({
        pageId: pageId
      })

      let url = that.data.listUrl
      let postData = {
        'mtype': '',
        'destiPath': that.data.path,
        'pageId': that.data.pageId,
        'size': that.data.size,
        'app': appValue,
        'platform': platform,
        'ver': ver
      }
      that.getList(url, postData)
    } else {
      wxJs.showToast('数据已全部加载')
    }
  },

  // 詳情
  gotoDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/previewDetail/previewDetail?item=' + JSON.stringify(item)
    })
  },
  // 八个图标点击
  goSpot (e) {
    console.log(e, 'navitem')
    let index = e.target.dataset.index
    let spotDetail = e.target.dataset.detail
    wx.navigateTo({
      url: '/pages/findSpotByArea/findSpotByArea?detail=' + JSON.stringify(spotDetail) + '&index=' + index
    })
  }

})