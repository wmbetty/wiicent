var app = getApp();
Page({
  data:{
    xid:'',
    jid:'',
    date: '2018-02-06',
    time: '13:17',
    costData:{value:'',category:'0',categoryname:'餐饮',date:'',remark:''},
    isShowCostCategory: false,
    isShowCostList: true,
    costCategoryList: [{name:"餐饮",isSelect:true},{name:"交通",isSelect:false},{name:"住宿",isSelect:false},{name:"门票",isSelect:false},{name:"其它",isSelect:false}],
    isEdit:true,
    timeStamp:0
  },
  onLoad:function(option){
    var jid = option.jid;
    var xid = option.xid;
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        if (jid&&xid) {
          this.setData({
            sid: sid,
            jid: jid,
            xid: xid
          })
        }
      }
    }catch(e){}
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchJizhang/xchJizhangView?sid='+this.data.sid,
      method:'POST',
      data: {
        'jid':that.data.jid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchJizhang'];
          var a = that.data.costData;
          var date = '';
          var time = '';
          var costCategoryList = that.data.costCategoryList;
          for (var i = 0; i < costCategoryList.length; i++) {
            if (result.keywords==costCategoryList[i].name) {
              a.category = i;
              costCategoryList.isSelect = true;
            }else{
              costCategoryList.isSelect = false;
            }
          }
          a.value = result.amount;
          a.categoryname = result.keywords;
          a.date = result.dateTime;
          a.remark = result.remark;
          date = result.dateTime.split(' ')[0];
          time = result.dateTime.split(' ')[1];
          that.setData({
            costData:a,
            date:date,
            time:time
          })
        }else{
          wx.showToast({
            title: '查询账单详情失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
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
  edit:function(){
    this.setData({
      isEdit: false
    })
  },
  save:function(e){
    if (e.timeStamp-this.data.timeStamp<2000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
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
    wx.request({
      url: app.globalData.url+'/xchJizhang/xchJizhangEdit?sid='+this.data.sid,
      method:'POST',
      data: {
        'jid':that.data.jid,
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
        if (res.data.code=="10000") {
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '编辑失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  delete:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchJizhang/xchJizhangEdit?sid='+this.data.sid,
      method:'POST',
      data: {
        'jid':that.data.jid,
        'status':1,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '编辑失败',
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
  }
})