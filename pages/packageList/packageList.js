var app =getApp();
Page({
  data:{
  	sid:'',
  	xid:'',
    packageListData:[],
    showSelect:false
  },
  onLoad:function(option){
  	var that = this;
  	var xid = 71;
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
            xid:xid
        });
      }
    }catch(e){}
    this.freshData();
    console.log('onLoad');
  },
  freshData:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/bkQingdan/getBkQingdan?sid='+this.data.sid,
      method:'POST',
      data: {
        'xid':this.data.xid,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result;
          for (var i = 0; i < result.length; i++) {
            result[i].isShow = true;
            if (result[i].attr.length) {
              for (var j = 0; j < result[i].attr.length; j++) {
                  result[i].attr[j].isShow = true;
              }
            }
          }
          console.log(result);
          that.setData({
            packageListData:result
          })
        }
      }
    })
  },
  showAll:function(e){
    var packageListData = this.data.packageListData;
    for (var i = 0; i < packageListData.length; i++) {
      packageListData[i].isShow = true;
      for (var j = 0; j < packageListData[i].attr.length; j++) {
        packageListData[i].attr[j].isShow = true;
      }
    }
    this.setData({
      packageListData:packageListData,
      showSelect:false
    })
  },
  showSelect:function(e){
    var packageListData = this.data.packageListData;
    for (var i = 0; i < packageListData.length; i++) {
      packageListData[i].isShow = false;
      for (var j = 0; j < packageListData[i].attr.length; j++) {
        if (packageListData[i].attr[j].is_used==1) {
          packageListData[i].attr[j].isShow = true;
        }else{
          packageListData[i].attr[j].isShow = false;
        }
      }
    }
    this.setData({
      packageListData:packageListData,
      showSelect:true
    })
  },
  openItem:function(e){
    var id = e.currentTarget.dataset.id;
    var packageListData = this.data.packageListData;
    packageListData[id].isShow = true;
    for (var i = 0; i < packageListData[id].attr.length; i++) {
      packageListData[id].attr[i].isShow = true;
    }
    this.setData({
      packageListData:packageListData
    })
  },
  closeItem:function(e){
    var id = e.currentTarget.dataset.id;
    var packageListData = this.data.packageListData;
    packageListData[id].isShow = false;
    for (var i = 0; i < packageListData[id].attr.length; i++) {
      packageListData[id].attr[i].isShow = false;
    }
    this.setData({
      packageListData:packageListData
    })
  },
  selectList:function(e){
    var id = e.currentTarget.dataset.id;
    var fid = e.currentTarget.dataset.fid;
    var packageListData = this.data.packageListData;
    if (packageListData[fid].attr[id].is_used==0) {
      packageListData[fid].attr[id].is_used=1;
    }else{
      packageListData[fid].attr[id].is_used=0;
    }
    this.setData({
      packageListData:packageListData
    })
  },
  submit:function(e){
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var packageListData = this.data.packageListData;
    var arrStr = '';
    var name = '';
    for (var i = 0; i < packageListData.length; i++) {
      if (packageListData[i].id!=8) {
        for (var j = 0; j < packageListData[i].attr.length; j++) {
          if (packageListData[i].attr[j].is_used==1) {
            arrStr+='&arrs[][id]='+packageListData[i].attr[j].id;
          }
        }
      }else{
        for (var j = 0; j < packageListData[i].attr.length; j++) {
          if (packageListData[i].attr[j].is_used==1) {
            name+=';'+packageListData[i].attr[j].name;
          }
        }
      }
    }
    if (name!='') {
      name = name.substring(1,name.length);
    }
    arrStr+='&arrs[][name]='+name+'&xid='+this.data.xid+'&app='+appValue+'&platform='+platform+'&ver='+ver;
    if (arrStr!='') {
      arrStr = arrStr.substring(1,arrStr.length);
    }
    console.log(arrStr);
    wx.request({
      url: app.globalData.url+'/bkQingdan/setBkQingdans?sid='+this.data.sid,
      method:'POST',
      data:arrStr,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code=="10000") {
          that.freshData();
        }else{
          wx.showToast({
            title: '提交失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  addPackage:function(e){
    wx.navigateTo({
      url:'../packageAdd/packageAdd'
    })
  }
})