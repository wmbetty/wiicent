// pages/findSpotSearch/findSpotSearch.js
import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempList= [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '', //搜索框文字
    size: 15,
    pageId: 1,
    searchUrl: '',
    searchData: {},
    searchList: [],
    lastList: [],
    listHeight: '',
    timeStamp: 0,
    hasMore: true,
    noList: false,
    winHeight: 0 //窗口高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let winHeight = wx.getStorageSync('winHeight');
    let sid = wx.getStorageSync('sid');
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url + '/baike/bkJingdianSearch?sid=' + sid;
      let postData = {
        'pageId': that.data.pageId,
        'size': that.data.size,
        'title': '',
        'app': appValue,
        'platform': platform,
        'ver': ver
      };
      that.setData({
        searchUrl: url,
        searchData: postData,
        winHeight: winHeight,
        listHeight: winHeight - 60 / 750 * 300
      });
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},

  // 输入框输入文字
  searchTextChange (e) {
    let val = e.detail.value;
    let that = this;
    let postData = that.data.searchData;
    let url = that.data.searchUrl;
    if (val) {
      postData.title = val;
      that.setData({
        searchText: val,
        searchData: postData,
        pageId: 1
      });
      that.getSearchList(url, that.data.searchData);
    }
  },

  // 获取搜索列表
  getSearchList (url, data) {
    wxJs.showLoading('加载中');
    let that = this;
    wxJs.postRequest(url, data, (res) => {
      if (res) {
        wx.hideLoading();
      }
      let resData = res.data.result;
      if (that.data.pageId <= 1 && resData && resData['ShowList.list'].length > 0) {
        that.setData({
          lastList: resData['ShowList.list']
        });
      }
      if (that.data.pageId > 1 && resData && resData['ShowList.list'].length > 0) {
        tempList = resData['ShowList.list'];
        let list = that.data.lastList;
        that.setData({
          lastList: list.concat(tempList)
        });
      }
      if ((!resData || resData['ShowList.list'].length === 0) && that.data.pageId >= 1) {
        that.setData({
          hasMore: false
        });
      }
    })
  },

  // 清除搜索框文字
  clearText () {
    this.setData({
      searchText: ''
    });
  },

  // 点击取消返回上一页
  goBack () {
    wx.navigateBack({
      delta: 1
    })
  },

  searchScrollLower (e) {
    let that = this;
    if (e.timeStamp - that.data.timeStamp < 3000) { return }
    that.setData({
      timeStamp: e.timeStamp
    });
    if (that.data.hasMore && that.data.searchText) {
      let pageId = that.data.pageId;
      pageId = pageId + 1;
      let postData = that.data.searchData;
      postData.pageId = pageId;
      that.setData({
        pageId: pageId,
        searchData: postData
      });
      let url = that.data.searchUrl;
      that.getSearchList(url, postData);
    } else {
      wxJs.showToast('数据已全部加载')
    }
  },

  // 詳情
  gotoDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/previewDetail/previewDetail?item=' + JSON.stringify(item)
    })
  }

})