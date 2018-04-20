// pages/spotComment/spotComment.js
import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempList = [];

Page({
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
  onLoad: function (options) {
    let that = this;
    let winHeight = wx.getStorageSync('winHeight');
    let spotInfos = JSON.parse(options.spot);
    let sid = wx.getStorageSync('sid');
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url + '/bkComment/bkCommentList?sid=' + sid;
      let postData = {
        'sourceType': 'Baike',
        'sourceId': spotInfos.id,
        'size': that.data.size,
        'pageId': that.data.pageId,
        'app': appValue,
        'platform': platform,
        'ver': ver
      };
      that.setData({
        listUrl: url,
        listPost: postData,
        sid: sid,
        sourceId: spotInfos.id,
        spotInfos: spotInfos,
        winHeight: winHeight
      });
      that.getCommList(url, postData);
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},

  getCommList(url, postData) {
    let that = this;
    wxJs.showLoading('加载中');
    wxJs.postRequest(url, postData, (res) => {
      if (res) {
        wx.hideLoading();
      }
      let resData = res.data.result;
      if (that.data.pageId <= 1 && resData && resData['BkComment.list'].length > 0) {
        that.setData({
          lastList: resData['BkComment.list']
        });
      }
      if (that.data.pageId > 1 && resData && resData['BkComment.list'].length > 0) {
        tempList = resData['BkComment.list'];
        let list = that.data.lastList;
        that.setData({
          lastList: list.concat(tempList)
        });
      }
      if ((!resData || resData['BkComment.list'].length === 0) && that.data.pageId >= 1) {
        that.setData({
          hasMore: false,
          noList: true
        })
      };
    })
  },
  searchScrollLower(e) {
    let that = this;
    if (e.timeStamp - that.data.timeStamp < 3000) { return }
    that.setData({
      timeStamp: e.timeStamp
    });
    if (that.data.hasMore) {
      let pageId = that.data.pageId + 1;
      let postData = that.data.listPost;
      postData.pageId = pageId;
      that.setData({
        pageId: pageId,
        listPost: postData
      });
      let url = that.data.listUrl;
      that.getCommList(url, postData);
    } else {
      wxJs.showToast('数据已全部加载');
    }
  },
  // input输入
  inputListener: function (e) {
    var value = e.detail.value;
    this.setData({
      commentVal: value
    });
  },
  // 点击评论
  goComment () {
    let that = this;
    that.setData({
      showComment: true,
      textFocus: true
    });
  },
  // 取消
  cancelComment () {
    this.setData({
      showComment: false
    });
  },
  // 提交评论异步处理
  postComment (url, postData) {
    return new Promise((resolve, reject) => {
      wxJs.postRequest(url, postData, (res) => {
        if (res.data) {
          resolve(res.data);
        } else{
          reject(res.data);
        }
      });
    });
  },
  // 提交评论
  submitComment () {
    let that = this;
    let comment = that.data.commentVal;
    if (comment === '') {
      wxJs.showToast('请填写评论内容');
    } else {
      let url = app.globalData.url + '/bkComment/bkCommentCreate?sid=' + that.data.sid;
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
      };
      that.postComment(url, postData).then((data) => {
        if (data.message === 'Create comment ok') {
          that.setData({
            showComment: false
          });
          that.getCommList(that.data.listUrl, that.data.listPost);
        }
      });
    }
  }
})