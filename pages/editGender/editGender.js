var app = getApp();
Page({
  	data:{
  		sid:'',
      genderList: [{name:'男',isSelect:true},{name:'女',isSelect:false}],
      timeStamp:0
  	},
  	onLoad:function(option){
  		var sid = '';
      var gender = '';
  		try {
        gender = wx.getStorageSync('gender');
        sid = wx.getStorageSync('sid');
        if (sid=='') {
          wx.reLaunch({
            url: "../login/login"
          })
        }else{
          var genderList = [];
          if (gender=='男'||gender=='') {
            genderList = [{name:'男',isSelect:true},{name:'女',isSelect:false}];
          }else{
            genderList = [{name:'男',isSelect:false},{name:'女',isSelect:true}];
          }
          this.setData({
            sid:sid,
            genderList:genderList
          });
        }
  	  }catch(e){}
  	},
    changeCategory:function(e){
      var index = e.currentTarget.dataset.index;
      var a = this.data.genderList;
      for (var i = 0; i < a.length; i++){
        if (index==i) {
          a[i].isSelect = true;
        }else{
          a[i].isSelect = false;
        }
      }
      this.setData({
        genderList:a
      });
    },
  	costCategorySubmit:function(e){
      if (e.timeStamp-this.data.timeStamp<2000) {return}
      this.setData({
        timeStamp:e.timeStamp
      });
  		var that = this;
  	  var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      var genderList = this.data.genderList;
      var gender = '';
      for (var i = 0; i < genderList.length; i++) {
        if(genderList[i].isSelect){
          gender = genderList[i].name;
        }
      }
      wx.request({
        url: app.globalData.url+'/customer/customerEdit?sid='+this.data.sid,
        method:'POST',
        data: {
            'key':'gender',
            'val':gender,
            'app':appValue,
            'platform':platform,
            'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            wx.setStorageSync('gender',gender);
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '编辑失败',
              icon: 'fail',
              duration: 2000
            });
          }
        }
      })
  	}
})