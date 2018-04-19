var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    xid:'',
    id:0,
    sid:'',
    xchSn:'',
    coDay:'',
    dayListData:[],
    sdid:'',
    day:'',
    height:'auto',
    isAddKey:false,
    isFormShow:true,
    materialData:{
    	keywords:'请添加',
    	content:'',
      day:'',
    	file:'',
      coImage:0
    },
    newStatus:'',
    statusList:[{isSelect:true,keyword:'深度游'},{isSelect:false,keyword:'户外游'},{isSelect:false,keyword:'摄影游'},{isSelect:false,keyword:'海岛游'},{isSelect:false,keyword:'蜜月旅行'},{isSelect:false,keyword:'登山徒步'},{isSelect:false,keyword:'极地探险'},{isSelect:false,keyword:'亲子游'}]
  },
  onLoad:function(option){
    var that = this;
    var xid = option.xid;
    var xchSn = option.xchSn;
    var id = option.id;
    var coDay = option.coDay;
    var sid = '';
    var dayListData = [];
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
            xchSn:xchSn,
            coDay:coDay,
            id:id
        });
      }
    }catch(e){}
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
            height: a
        })
      }
    })
    for (var i = 1; i <= this.data.coDay; i++) {
      if (i == 1) {
        var a = {day:i,isSelect:true};
        dayListData.push(a);
      }else{
        var a = {day:i,isSelect:false};
        dayListData.push(a);
      }
    }
    this.setData({
      dayListData:dayListData,
      day:1
    });
  },
  onShow:function(){
    if (this.data.id!=0) {
      var that = this;
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      wx.request({
        url: app.globalData.url+'/xchBlog/xchBlogView?sid='+this.data.sid,
        method:'POST',
        data: {
          'id':this.data.id,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['XchBlog'];
            console.log(result);
            if (result) {
              var materialData = that.data.materialData;
              var dayListData = that.data.dayListData;
              materialData.keywords = result.keywords;
              materialData.content = result.content;
              materialData.day = result.day;
              materialData.coImage = result.coImage;
              materialData.file = result.bcontentImage;
              for (var i = 0; i < dayListData.length; i++) {
                if(dayListData[i].day==result.day){
                  dayListData[i].isSelect = true;
                }else{
                  dayListData[i].isSelect = false;
                }
              }
              that.setData({
                materialData:materialData,
                dayListData:dayListData,
                day:result.day
              })
            }
          }
        }
      })
    }
  },
  selectDay:function(e){
    var day = e.currentTarget.dataset.day;
    var index = e.currentTarget.dataset.index;
    var materialData = this.data.materialData;
    materialData.content = '';
    materialData.keywords = '请选择';
    materialData.file = '';
    materialData.coImage = '';
    var dayListData = this.data.dayListData;
    for (var i = 0; i < dayListData.length; i++) {
      if (i==index) {
        dayListData[i].isSelect = true;
      }else{
        dayListData[i].isSelect = false;
      }
    }
    this.setData({
      day:day,
      materialData:materialData,
      dayListData:dayListData
    });
  },
  getAlbum:function(e){
    var that = this;
    try{
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: function (res) {
          var materialData = that.data.materialData;
          materialData['file'] = res.tempFiles[0].path;
          that.setData({
            materialData:materialData
          });
        }
      })
    }catch(e){}
  },
  getPhoto:function(e){
    var that = this;
    try{
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['camera'],
        success: function (res) {
          var materialData = that.data.materialData;
          materialData['file'] = res.tempFiles[0].path;
          that.setData({
            materialData:materialData
          });
        }
      })
    }catch(e){}
  },
  goAddStatus:function(e){
    wx.setNavigationBarTitle({
      title: '关键词'
    });
    this.setData({
      isAddKey:true,
      isFormShow:false
    });
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
    var b = this.data.materialData;
    for (var i = 0; i < this.data.statusList.length; i++) {
      if (this.data.statusList[i].isSelect) {
        a.push(this.data.statusList[i].keyword);
      }
    }
    if (a==[]) {
      a='请添加'
    }
    b.keywords = a.join(',');
    wx.setNavigationBarTitle({
      title: '发表日志'
    })
    this.setData({
      materialData:b,
      isAddKey:false,
      isFormShow:true,
      statusList:[{isSelect:true,keyword:'深度游'},{isSelect:false,keyword:'户外游'},{isSelect:false,keyword:'摄影游'},{isSelect:false,keyword:'海岛游'},{isSelect:false,keyword:'蜜月旅行'},{isSelect:false,keyword:'登山徒步'},{isSelect:false,keyword:'极地探险'},{isSelect:false,keyword:'亲子游'}]
    });
  },
  bindinputStatus:function(e){
    var a = e.detail.value;
    this.setData({
      newStatus:a
    });
  },
  inputListener:function(e){
    var materialData = this.data.materialData;
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    materialData[id] = value;
    this.setData({
      materialData:materialData
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
  },
  submit:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.materialData.content=='') {
      wx.showModal({
        title: '提示',
        content: '内容不能为空',
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
      title: '请稍侯',
      mask:true
    })
    if (this.data.materialData.file!='') {
      wx.uploadFile({
        url: app.globalData.url+'/xchBlog/xchBlogAdd?sid='+this.data.sid,
        method:'POST',
        filePath:this.data.materialData.file,
        name:'file',
        formData:{
          'id':this.data.id,
          'xid':this.data.xid,
          'day':this.data.day,
          'content':this.data.materialData.content,
          'keywords':this.data.materialData.keywords=='请添加'?'':this.data.materialData.keywords,
          'coImage':1,
          'longitude':this.data.materialData.longitude,
          'latitude':this.data.materialData.latitude,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        success: function(res) {
          console.log(res);
          wx.hideLoading();
          if (/"10000"/.test(res.data)) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '保存失败',
              icon: 'fail',
              duration: 2000
            })
          }
        },
        fail:function(res){
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    }else{
      wx.request({
        url: app.globalData.url+'/xchBlog/xchBlogAdd?sid='+this.data.sid,
        method:'POST',
        data:{
          'id':this.data.id,
          'xid':this.data.xid,
          'day':this.data.day,
          'content':this.data.materialData.content,
          'keywords':this.data.materialData.keywords=='请添加'?'':this.data.materialData.keywords,
          'coImage':0,
          'longitude':this.data.materialData.longitude,
          'latitude':this.data.materialData.latitude,
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
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '保存失败',
              icon: 'fail',
              duration: 2000
            })
          }
        },
        fail:function(res){
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    }
  }
})