var app = getApp();
var util = require('../../util/util.js');
Page({
  data:{
    xid:'',
    xchSn:'',
    sid:'',
    rid:'',
    isAdd:false,
    isAddIdentity:false,
    isFormShow:true,
    longitude:'',
    latitude:'',
    renyuanData:{
    	name:'',
      gender:'',
      birthday:'',
      mobile:'',
      remark:'',
    	identity:'请添加',
      longitude:0,
      latitude:0
    },
    timeStamp:0,
    newIdentity:'',
    identityList:[{isSelect:true,identity:'导游'},{isSelect:false,identity:'游客'}],
    genderList:['男','女']
  },
  onLoad:function(option){
    var that = this;
    var sid = '';
    var authority = '';
    var xid = option.xid;
    var rid = option.rid;
    var xchSn = option.xchSn;
    var longitude = '';
    var latitude = '';
    try {
      sid = wx.getStorageSync('sid');
      authority = wx.getStorageSync('authority');
      longitude = wx.getStorageSync('current_lng');
      latitude = wx.getStorageSync('current_lat');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            xid:xid,
            xchSn:xchSn,
            longitude:longitude,
            latitude:latitude
        });
      }
    }catch(e){}
    if (rid) {
      this.setData({
        rid:rid,
        isAdd:true
      });
      var appValue = app.globalData.app;
      var platform = app.globalData.platform;
      var ver = app.globalData.ver;
      wx.request({
        url: app.globalData.url+'/xchRenyuan/xchRenyuanView?sid='+this.data.sid,
        method:'POST',
        data: {
          'rid':this.data.rid,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['XchRenyuan'];
            console.log(result);
            var renyuanData = that.data.renyuanData;
            renyuanData.name= result.name;
            renyuanData.gender = result.gender;
            renyuanData.birthday = result.birthday;
            renyuanData.mobile = result.mobile;
            renyuanData.remark = result.remark;
            renyuanData.identity = result.shenfen;
            renyuanData.longitude = result.longitude;
            renyuanData.latitude = result.latitude;
            wx.setNavigationBarTitle({
              title: result.name
            });
            that.setData({
              renyuanData:renyuanData
            });
          }
        }
      })
    }else{
      this.setData({
        rid:0,
        isAdd:false
      });
    }
  },
  goAddIdentity:function(e){
    wx.setNavigationBarTitle({
      title: '身份类别'
    });
    this.setData({
      isAddIdentity:true,
      isFormShow:false
    });
  },
  addIdentity:function(e){
    var a = this.data.identityList;
    if (this.data.newIdentity) {
      var b = {isSelect:false,identity:this.data.newIdentity};
      a.push(b);
      this.setData({
        identityList:a,
        newIdentity:''
      });
    }
  },
  addIdentityBtn:function(e){
    var a = '';
    var b = this.data.renyuanData;
    for (var i = 0; i < this.data.identityList.length; i++) {
      if (this.data.identityList[i].isSelect) {
        a+=this.data.identityList[i].identity;
      }
    }
    b.identity = a;
    wx.setNavigationBarTitle({
      title: b.name
    });
    this.setData({
      renyuanData:b,
      isAddIdentity:false,
      isFormShow:true,
      identityList:[{isSelect:true,identity:'导游'},{isSelect:false,identity:'游客'}]
    });

  },
  bindinputIdentity:function(e){
    var a = e.detail.value;
    this.setData({
      newIdentity:a
    });
  },
  changeIdentitySelect:function(e){
    var index = e.currentTarget.dataset.index;
    var a = this.data.identityList;
    for (var i = 0; i < a.length; i++){
      if (index==i) {
        a[i].isSelect = true;
      }else{
        a[i].isSelect = false;
      }
    };
    this.setData({
      identityList:a
    });
  },
  submit:function(e){
    if (e.timeStamp-this.data.timeStamp<2000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
    var that = this;
    var renyuanData = this.data.renyuanData;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(renyuanData.mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不正确',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (renyuanData.name==''||renyuanData.identity=='') {
      wx.showModal({
        title: '提示',
        content: '姓名、身份不能为空',
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
      url: app.globalData.url+'/xchRenyuan/setXchRenyuan?sid='+this.data.sid,
      method:'POST',
      data: {
        'rid':this.data.rid,
        'xid':this.data.xid,
        'xchSn':this.data.xchSn,
        'mobile':renyuanData.mobile,
        'name':renyuanData.name,
        'remark':renyuanData.remark,
        'descrip':renyuanData.identity,
        'gender':renyuanData.gender,
        'birthday':renyuanData.birthday,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          console
          if (that.data.rid!=0) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }else{
          wx.showToast({
            title: '上传失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  viewRoom:function(e){
    wx.navigateTo({
      url:"../../pages/myRoom/myRoom?xid="+this.data.xid+"&rid="+this.data.rid
    });
  },
  inputListener:function(e){
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    var renyuanData = this.data.renyuanData;
    if (id=='gender') {
      renyuanData[id] = this.data.genderList[Number(value)];
      this.setData({
        renyuanData:renyuanData
      });
    }else{
      renyuanData[id] = value;
      this.setData({
        renyuanData:renyuanData
      });
    }
  },
  makeCall:function(e){
    var that = this;
    if (this.data.renyuanData.mobile) {
      wx.makePhoneCall({
        phoneNumber: that.data.renyuanData.mobile
      })
    }
  },
  openLocation:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchPosition/getXchPositionVisitor?sid='+this.data.sid,
      method:'POST',
      data: {
        'rid':this.data.rid,
        'xid':this.data.xid,
        'xchSn':this.data.xchSn,
        'mapType':'GCJ02',
        'longitude':this.data.longitude,
        'latitude':this.data.latitude,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['xchPositionShow'];
          if (result.longitude!="0"&&result.latitude!="0") {
            wx.openLocation({
              latitude: Number(result.latitude),
              longitude: Number(result.longitude),
              scale: 28
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '暂无该成员位置信息',
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }
          console.log(result);
        }else{
          wx.showModal({
            title: '提示',
            content: '暂无该成员位置信息',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      }
    })
  }
})