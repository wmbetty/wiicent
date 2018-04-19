var app = getApp();
Page({
  data:{
    sid:'',
    xid:'',
    xchSn:'',
    pageId:0,
    size:15,
    renyuanListData:[]
  },
  onLoad:function(option){
    var xid = option.xid;
    var xchSn = option.xchSn;
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
            xid:xid,
            xchSn:xchSn
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
      url: app.globalData.url+'/xchRenyuan/xchRenyuanList?sid='+this.data.sid,
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
          var result = res.data.result['XchRenyuan.list'];
          console.log(result);
          that.setData({
            renyuanListData:result
          });
        }
      }
    })
  },
  viewPersonDetail:function(e){
    var rid = e.currentTarget.dataset.rid;
    wx.navigateTo({
      url:'../personDetail/personDetail?rid='+rid+'&xid='+this.data.xid+'&xchSn='+this.data.xchSn
    });
  },
  deletePerson:function(e){
    var rid = e.currentTarget.dataset.rid;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '删除',
      content: '确定删除该人员吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/bkDel/bkDelById?sid='+that.data.sid,
            method:'POST',
            data: {
              'sourceType':'XchRenyuan',
              'id':rid,
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
  addPersonDetail:function(e){
    wx.navigateTo({
      url:'../personDetail/personDetail?xid='+this.data.xid+'&xchSn='+this.data.xchSn
    });
  }
})