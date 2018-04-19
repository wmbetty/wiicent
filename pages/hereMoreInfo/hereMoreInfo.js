var app =getApp();
Page({
  data:{
    formData:{}
  },
  onLoad:function(){
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var formData = prePage.data.formData;
    this.setData({
      formData:formData
    })
  },
  inputListener:function(e){
  	var value = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var formData = this.data.formData;
    formData[id] = value;
    this.setData({
      formData:formData
    });
  },
  submit:function(e){
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var formData = this.data.formData;
    prePage.setData({
      formData:formData
    })
    wx.navigateBack({
      delta:1
    })
  },
  getValue:function(e){
    var name = e.currentTarget.dataset.name;
    var role = e.currentTarget.dataset.role;
    wx.navigateTo({
      url:"../../pages/hereValue/hereValue?name="+name+"&role="+role
    })
  },
  getKeywords:function(e){
    wx.navigateTo({
      url:"../../pages/hereKeywords/hereKeywords"
    })
  }
})