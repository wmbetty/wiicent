var app =getApp();
Page({
  data:{
    height:'auto',
    statusList:[{isSelect:true,keyword:'深度游'},{isSelect:false,keyword:'户外游'},{isSelect:false,keyword:'摄影游'},{isSelect:false,keyword:'海岛游'},{isSelect:false,keyword:'蜜月旅行'},{isSelect:false,keyword:'登山徒步'},{isSelect:false,keyword:'极地探险'},{isSelect:false,keyword:'亲子游'}]
  },
  onLoad:function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
            height: a
        })
      }
    })
  },
  addStatus:function(e){
    var a = this.data.statusList;
    if (this.data.newStatus) {
      var b = {isSelect:false,keyword:this.data.newStatus};
      a.push(b);
      this.setData({
        statusList:a,
        newStatus:''
      });
    }
  },
  addStatusBtn:function(e){
    var a = [];
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var b = prePage.data.formData;
    for (var i = 0; i < this.data.statusList.length; i++) {
      if (this.data.statusList[i].isSelect) {
        a.push(this.data.statusList[i].keyword);
      }
    }
    b.keywords = a.join(',');
    prePage.setData({
      formData:b
    });
    wx.navigateBack({
      delta:1
    })
  },
  bindinputStatus:function(e){
    var a = e.detail.value;
    this.setData({
      newStatus:a
    });
  },
  changeStatusSelect:function(e){
    var index = e.currentTarget.dataset.index;
    var a = this.data.statusList;
    for (var i = 0; i < a.length; i++) {
      if (index==i) {
        if (a[i].isSelect) {
          a[i].isSelect = false;
        }else{
          a[i].isSelect = true;
        }
      }
    }
    this.setData({
      statusList:a
    });
  }
})