var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    sid:'',
    xid:'',
    xchSn:'',
    rid:'',
    date: '',
    time: '',
    costData:{value:'',category:'0',categoryname:'餐饮',date:'',remark:''},
    isShowCostCategory: false,
    isShowCostList: true,
    costCategoryList: [{name:"餐饮",isSelect:true},{name:"交通",isSelect:false},{name:"住宿",isSelect:false},{name:"门票",isSelect:false},{name:"其它",isSelect:false}]
  },
  onLoad:function(option){
    var xid = option.xid;
    var rid = option.rid;
    var xchSn = option.xchSn;
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid,
            rid:rid,
            xchSn:xchSn,
            date:util.getDate(),
            time:util.getTime()
        });
      }
    }catch(e){}
  },
  bindDateChange:function(e){
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  submit:function(e){
    var a = this.data.date+' '+this.data.time;
    var b = this.data.costData;
    b.date = a;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (!/^(([1-9]\d*)|0)(\.\d{1,2})?$/.test(b.value)) {
      wx.showModal({
        title: '提示',
        content: '请输入数字金额',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (b.date==''||b.categoryname=='') {
      wx.showModal({
        title: '提示',
        content: '日期、分类不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    wx.request({
        url: app.globalData.url+'/xchJizhang/xchJizhangAdd?sid='+this.data.sid,
        method:'POST',
        data: {
          'xid':that.data.xid,
          'xchSn':that.data.xchSn,
          'amount':b.value,
          'dateTime':b.date,
          'keywords':b.categoryname,
          'remark':b.remark,
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
            var costData = {};
            costData.value = '';
            costData.remark = '';
            costData.category = '0';
            costData.categoryname = '餐饮';
            costData.date = '';
            that.setData({
              costData:costData
            });
            wx.showToast({
              title: '记账成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '记账失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }
    })
  },
  costCategorySubmit:function(e){
    this.setData({
      isShowCostCategory: false,
      isShowCostList: true
    })
  },
  goChangeCategory:function(e){
    this.setData({
      isShowCostCategory: true,
      isShowCostList: false
    })
  },
  bindinputRemark:function(e){
    var a = this.data.costData;
    a.remark = e.detail.value;
    this.setData({
      costData: a
    })
  },
  bindinputVal:function(e){
    var a = this.data.costData;
    a.value = e.detail.value;
    this.setData({
      costData: a
    })
  },
  changeCategory:function(e){
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.value;
    var b = this.data.costData;
    b.category = index;
    b.categoryname = value;
    this.setData({
      costData:b
    });
    var a = this.data.costCategoryList;
    for (var i = 0; i < a.length; i++){
      if (index==i) {
        a[i].isSelect = true;
      }else{
        a[i].isSelect = false;
      }
    }
    this.setData({
      costCategoryList:a
    });
  },
  viewCostList:function(e){
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../costDetail/costDetail?xid="+this.data.xid+"&rid="+this.data.rid
    })
  }
})