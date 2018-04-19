var app = getApp();
Page({
  	data:{
  		xid:'',
  		sid:'',
      submitData:{
        projectName:'',
        projectFlight:'',
        projectAssemble:'',
        projectLeader:'',
        projectRemark:'',
        projectPhone:'',
        authorFace:'',
        authorName:'',
        xchSn:'',
        tripStatus:'',
        isManager:false
      },
      tripStatusList:['未提交','待确认','待支付','待支付','已付款','待出发','进行中','已完成','已评价','已关闭'],
  	},
  	onLoad:function(option){
  		var xid = option.xid;
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
  	},
    onShow:function(e){
      var that = this;
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      wx.request({
        url: app.globalData.url+'/xchChutuan/xchChutuanView?sid='+this.data.sid,
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
            var result = res.data.result['XchChutuan'];
            var submitData = that.data.submitData;
            submitData.projectName = result.title;
            submitData.projectFlight = result.transportInfo;
            submitData.projectAssemble = result.jiheInfo;
            submitData.projectLeader = result.talentInfo;
            submitData.projectRemark = result.remark;
            submitData.projectPhone = result.jinjiPhone;
            submitData.authorName = result.authorName;
            submitData.authorFace = result.authorFace;
            submitData.tripStatus = result.tripStatus;
            submitData.xchSn = result.xchSn;
            submitData.isManager = result.isManager;
            that.setData({
              submitData:submitData
            });
          }
        }
      })
    },
  	inputListener:function(e){
      var submitData = this.data.submitData;
  		var id = e.currentTarget.dataset.id;
  		var value = e.detail.value;
      submitData[id] = value;
  		this.setData({
  			submitData:submitData
  		});
  	},
  	submit:function(e){
  		var that = this;
  	  var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      wx.showLoading({
        title: '请稍侯',
        showCancel:false
      })
      wx.request({
        url: app.globalData.url+'/xchChutuan/setXchChutuan?sid='+this.data.sid,
        method:'POST',
        data: {
            'xid':that.data.xid,
            'transportInfo':that.data.submitData.projectFlight,
            'jiheInfo':that.data.submitData.projectAssemble,
            'talentInfo':that.data.submitData.projectLeader,
            'remark':that.data.submitData.projectRemark,
            'jinjiPhone':that.data.submitData.projectPhone,
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
              title: '设置成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '设置失败',
              icon: 'fail',
              duration: 2000
            });
          }
        }
      })
  	}
})