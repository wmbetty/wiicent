var app =getApp();
Page({
  data:{
    value:'',
    role:''
  },
  onLoad:function(option){
    var name = option.name;
    var role = option.role;
    wx.setNavigationBarTitle({
      title: name
    });
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var formData = prePage.data.formData;
    var value = formData[role];
    this.setData({
      value:value,
      role:role
    })
  },
  inputListener:function(e){
  	var value = e.detail.value;
  	this.setData({
  		value:value
  	});
  },
  submit:function(e){
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var formData = prePage.data.formData;
    var role = this.data.role;
    formData[role] = this.data.value;
    prePage.setData({
      formData:formData
    })
    wx.navigateBack({
      delta:1
    })
  }
})