var app = getApp();
Page({
  data:{
    sid:'',
    xid:'',
    personListData:[],
    roomListData:[]
  },
  onLoad:function(option){
    var xid = option.xid;
    var that = this;
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
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
        url: app.globalData.url+'/xchFenfang/xchFenfangUndoList?sid='+this.data.sid,
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
            var result = res.data.result['XchFenfang.list'];
            console.log(result);
            that.setData({
              personListData:result
            });
          }else{
            that.setData({
              personListData:[]
            });
          }
        }
    });
    wx.request({
        url: app.globalData.url+'/xchFangjian/xchFangjianList?sid='+this.data.sid,
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
            var result = res.data.result['XchFangjian.list'];
            for (var i = 0; i < result.length; i++) {
              result[i].isSelect = false;
            }
            for (var i = 0; i < result.length; i++) {
              if (result[i].gender1=='') {
                result[i].gender1='../../dist/images/fenfang_empty.png';
              }
              if (result[i].gender1=='男') {
                result[i].gender1='../../dist/images/fenfang_nan.png';
              }
              if (result[i].gender1=='女') {
                result[i].gender1='../../dist/images/fenfang_nv.png';
              }
              if (result[i].gender2=='') {
                result[i].gender2='../../dist/images/fenfang_empty.png';
              }
              if (result[i].gender2=='男') {
                result[i].gender2='../../dist/images/fenfang_nan.png';
              }
              if (result[i].gender2=='女') {
                result[i].gender2='../../dist/images/fenfang_nv.png';
              }
              if (result[i].gender3=='') {
                result[i].gender3='../../dist/images/fenfang_empty.png';
              }
              if (result[i].gender3=='男') {
                result[i].gender3='../../dist/images/fenfang_nan.png';
              }
              if (result[i].gender3=='女') {
                result[i].gender3='../../dist/images/fenfang_nv.png';
              }
            }
            console.log(result);
            that.setData({
              roomListData:result
            });
          }else{
            that.setData({
              roomListData:[]
            });
          }
        }
    })
  },
  releasePerson:function(e){
    var rid = e.currentTarget.dataset.rid;
    var roomId = e.currentTarget.dataset.roomid;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (rid==''||roomId=='') {return}
    wx.request({
      url: app.globalData.url+'/xchFangjian/xchFangjianEdit?sid='+this.data.sid,
      method:'POST',
      data: {
        'rid':rid,
        'roomId':roomId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          that.onShow();
        }else{
        }
      }
    });
  },
  selectPerson:function(e){
    var rid = e.currentTarget.dataset.rid;
    console.log(rid);
    var roomListData = this.data.roomListData;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    for (var i = 0; i < roomListData.length; i++) {
      if (roomListData[i].isSelect) {
        if (roomListData[i].isAllIn==1) {
          wx.showModal({
            title: '提示',
            content: '该房间人员已满',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }else{
          wx.request({
            url: app.globalData.url+'/xchFenfang/xchFenfangEdit?sid='+this.data.sid,
            method:'POST',
            data: {
              'roomId':roomListData[i].roomId,
              'rid':rid,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                that.onShow();
              }
            }
          });
        }
      }
    }
  },
  selectRoom:function(e){
    var roomId = e.currentTarget.dataset.roomid;
    var roomListData = this.data.roomListData;
    console.log(roomId);
    for (var i = 0; i < roomListData.length; i++) {
      if (roomListData[i].roomId == roomId) {
        roomListData[i].isSelect = true;
      }else{
        roomListData[i].isSelect = false;
      }
    };
    this.setData({
      roomListData:roomListData
    });
  },
  inputListener:function(e){
    var roomId = e.currentTarget.dataset.roomid;
    var roomListData = this.data.roomListData;
    var value = e.detail.value;
    for (var i = 0; i < roomListData.length; i++) {
      if (roomListData[i].roomId==roomId) {
        roomListData[i].roomCode = value;
      }
    }
    this.setData({
      roomListData:roomListData
    });
  },
  editRoomName:function(e){
    var roomId = e.currentTarget.dataset.roomid;
    var value = e.detail.value;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
        url: app.globalData.url+'/xchFangjian/xchFangjianEdit?sid='+this.data.sid,
        method:'POST',
        data: {
          'roomId':roomId,
          'roomCode':value,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {

          }else{
            wx.showModal({
              title: '提示',
              content: '设置失败',
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        }
    });
  },
  deleteRoom:function(e){
    var roomId = e.currentTarget.dataset.roomid;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '删除',
      content: '确定删除房间吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchFangjian/xchFangjianEdit?sid='+that.data.sid,
            method:'POST',
            data: {
              'roomId':roomId,
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
                that.onShow();
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addRoom:function(e){
    wx.navigateTo({
      url:'../shareRoomAdd/shareRoomAdd?xid='+this.data.xid
    });
  }
})