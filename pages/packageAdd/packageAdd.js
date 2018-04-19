var app =getApp();
Page({
  data:{
    name:''
  },
  onLoad:function(option){

  },
  inputListener:function(e){
  	var value = e.detail.value;
  	this.setData({
  		name:value
  	});
  },
  submit:function(e){
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var packageListData = prePage.data.packageListData;
    var a = {};
    a.id = null;
    a.name = this.data.name;
    a.fid = 8;
    a.is_used = 1;
    a.isShow = true;
    packageListData[7].attr.push(a);
    prePage.setData({
      packageListData:packageListData
    })
    wx.navigateBack({
      delta:1
    })
  }
})