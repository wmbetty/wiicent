// pages/spotComment/spotComment.js
import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempList = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: 1,
    size: 10,
    sourceId: '',
    commentList: [],
    lastList: [],
    winHeight: '',
    commentVal: '',
    showComment: false,
    textFocus: false,
    spotInfos: {},
    sid: '',
    listUrl: '',
    listPost: {},
    hasMore: true,
    noList: false,
    timeStamp: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    wxJs.getSystemInfo((res) => {
      // 可使用窗口宽度、高度
      let windowHeight = res.windowHeight
      that.setData({
        // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
        winHeight: windowHeight
      })
    })
    let spotInfos = JSON.parse(options.spot)
    that.setData({
      sourceId: spotInfos.id,
      spotInfos: spotInfos
    })
    let sid = wx.getStorageSync('sid')
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      that.setData({
        sid: sid
      })
      let url = app.globalData.url + '/bkComment/bkCommentList?sid=' + sid
      let postData = {
        'sourceType': 'Baike',
        'sourceId': that.data.sourceId,
        'size': that.data.size,
        'pageId': that.data.pageId,
        'app': appValue,
        'platform': platform,
        'ver': ver
      }
      that.setData({
        listUrl: url,
        listPost: postData
      })
      that.getCommList(url, postData)
    }
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

  getCommList(url, postData) {
    let that = this
    wxJs.showLoading('加载中');
    wxJs.postRequest(url, postData, (res) => {
      if (res) {
        wx.hideLoading();
      }
      let resData = res.data.result
      if (that.data.pageId <= 1 && resData && resData['BkComment.list'].length > 0) {
        that.setData({
          lastList: resData['BkComment.list']
        })
      }
      if (that.data.pageId > 1 && resData && resData['BkComment.list'].length > 0) {
        tempList = resData['BkComment.list']
        let list = that.data.lastList
        that.setData({
          lastList: list.concat(tempList)
        })
        console.log(that.data.lastList, 'last')
      }
      
      if ((!resData || resData['BkComment.list'].length === 0) && that.data.pageId >= 1) {
        that.setData({
          hasMore: false,
          noList: true
        })
      }
    })
  },

  searchScrollLower(e) {
    let that = this;
    if (e.timeStamp - that.data.timeStamp < 3000) { return }
    that.setData({
      timeStamp: e.timeStamp
    });
    if (that.data.hasMore) {
      let pageId = that.data.pageId + 1
      let postData = that.data.listPost
      postData.pageId = pageId
      that.setData({
        pageId: pageId,
        listPost: postData
      })
      let url = that.data.listUrl
      that.getCommList(url, postData)
    } else {
      wxJs.showToast('数据已全部加载')
    }
  },

  // input输入
  inputListener: function (e) {
    var value = e.detail.value;
    this.setData({
      commentVal: value
    })
  },

  // 点击评论
  goComment () {
    let that = this
    that.setData({
      showComment: true,
      textFocus: true
    })
  },
  // 取消
  cancelComment () {
    this.setData({
      showComment: false
    })
  },
  // 提交评论
  submitComment () {
    let that = this
    let comment = that.data.commentVal
    if (comment === '') {
      wxJs.showToast('请填写评论内容')
    } else {
      let url = app.globalData.url + '/bkComment/bkCommentCreate?sid=' + that.data.sid
      let postData = {
        'content': comment,
        'subId': that.data.spotInfos.myId, 
        'sourceId': that.data.spotInfos.id,
        'targetId': that.data.spotInfos.myId, 
        'targetType': 'Customer',
        'sourceType': 'Baike',
        'app': appValue,
        'platform': platform,
        'ver': ver
      }
      wxJs.postRequest(url, postData, (res) => {
        if (res.data.message === 'Create comment ok') {
          setTimeout(() => {
            that.setData({
              showComment: false
            })
            wxJs.postRequest(that.data.listUrl, that.data.listPost, (res) => {
              let data = res.data.result
              if (data && data['BkComment.list'].length > 0) {
                that.setData({
                  commentList: data['BkComment.list']
                })
              }
            })
          }, 1000)
        }
      })
    }
  }
})