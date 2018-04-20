import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempAreaList = []

Page({
  data:{
    searchSpot:'',
    lastAreaList: [],
    listHeight: '', //列表高度
    pageId:1,
    size:10,
    hasMore:true,
    pname: '',
    postData: {},
    listUrl: '',
    tabIndex: 0,
    timeStamp: 0
  },

  // 获取列表数据
  getList(url, postData) {
    let that = this;
    wxJs.showLoading('加载中');
    wxJs.postRequest(url, postData, (res) => {
      let resData = res.data; //接口返回数据
      if (resData) {
        wx.hideLoading();
      }
      if (that.data.pageId <= 1 && resData.result && resData.result['Area.list'].length > 0) {
        that.setData({
          lastAreaList: resData.result['Area.list']
        });
      }
      if (that.data.pageId > 1 && resData.result && resData.result['Area.list'].length > 0) {
        tempAreaList = resData.result['Area.list'];
        let list = that.data.lastAreaList;
        that.setData({
          lastAreaList: list.concat(tempAreaList)
        });
      }
      if ((!resData.result || resData.result['Area.list'].length === 0) && that.data.pageId > 1) {
        that.setData({
          hasMore: false
        });
      }
    })
  },
  onLoad: function(option) {
    let that = this;
    let sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid === '') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        let url = app.globalData.url+'/lxArea/lxAreaIndex?sid=' + sid;
        let postData = {
          'mtype':'',
          'destiPath':'',
          'pname': that.data.pname,
          'showType':'ShowList',
          'pageId':that.data.pageId,
          'size':that.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        };
        let winHeight = wx.getStorageSync('winHeight');
        that.setData({
          listUrl: url,
          postData: postData,
          listHeight: winHeight - 316 / 750 * 300
        });
        that.getList(url, postData);
      }
    } catch (e) {}
  },
  // 左侧切换
  changeSpot (e) {
    let that = this;
    let pname = e.target.dataset.name;
    let tabIndex = e.target.dataset.index;
    let pageId = 1;
    let postData = that.data.postData;
    postData.pageId = 1;
    postData.pname = pname;
    that.setData({
      tabIndex: tabIndex,
      pageId: pageId,
      pname: pname,
      postData: postData
    });
    let url = that.data.listUrl;
    that.getList(url, postData);
  },
  //滚动到底部触发事件
  searchScrollLower (e) {
    let that = this;
    if (e.timeStamp-that.data.timeStamp<3000) {return}
    that.setData({
      timeStamp:e.timeStamp
    });  
    if(that.data.hasMore){
      let pageId = that.data.pageId + 1;
      
      let url = that.data.listUrl;
      let postData = that.data.postData;
      postData.pageId = pageId;
      that.setData({
        pageId: pageId,
        postData: postData
      });
      that.getList(url, postData);
    } else {
      wxJs.showToast('数据已全部加载');
    }
  },
  // 点击跳转
  goDetails (e) {
    let item = e.target.dataset.item;
    wx.navigateTo({
      url: '/pages/previewSpot/previewSpot?item=' + JSON.stringify(item)
    })
  },
  // 点击搜索
  gotoSearch () {
    wx.navigateTo({
      url: '/pages/findSpotSearch/findSpotSearch',
    })
  }
})