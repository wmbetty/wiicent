var app = getApp();
Page({
  data:{
    sid:'',
    xid:'',
    roomData:{
      total:0,
      totalPerson:0,
      single:'',
      double:'',
      three:'',
      isAdd:true
    }
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

  },
  inputListener:function(e){
    var value = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var roomData = this.data.roomData;
    var total = 0;
    var totalPerson = 0;
    roomData[id] = value;
    if (roomData.single!='') {total+=Number(roomData.single);totalPerson+=Number(roomData.single);}
    if (roomData.double!='') {total+=Number(roomData.double);totalPerson+=roomData.double*2;}
    if (roomData.three!='') {total+=Number(roomData.three);totalPerson+=roomData.three*3;}
    if (total>50) {
      wx.showModal({
        title: '提示',
        content: '最多可添加50间房！',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
          }
        }
      });
      roomData['isAdd'] = true;
    }else{
      roomData['isAdd'] = false;
    }
    roomData['total'] = total;
    roomData['totalPerson'] = totalPerson;
    this.setData({
      roomData:roomData
    });
  },
  submit:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    if (this.data.roomData.single==''&&this.data.roomData.double==''&&this.data.roomData.three=='') {
      wx.showModal({
        title: '提示',
        content: '请添加房间数',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    wx.request({
        url: app.globalData.url+'/xchFangjian/xchFangjianAdd?sid='+this.data.sid,
        method:'POST',
        data: {
          'xid':this.data.xid,
          'roomCapacity3':this.data.roomData.three,
          'roomCapacity2':this.data.roomData.double,
          'roomCapacity1':this.data.roomData.single,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '添加失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }
    })
  }
})