App({
  globalData: {
    url:'https://cx.wiicent.com',
    // url:'http://192.168.1.188:8001',
    app:'liexing',
    platform:'web',
    ver:'3'
  },
  onLaunch:function(){
    var that = this;
    var count = 0;
    if (wx.getStorageSync('timer')) {return;}
    var a = setInterval(function(){
      count++;
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation']) {
            wx.getLocation({
              type: 'gcj02',//gcj02,wgs84
              success: function(res){
                that.updateGeo(res.latitude,res.longitude);
                wx.setStorageSync('current_lat',res.latitude);
                wx.setStorageSync('current_lng',res.longitude);
              }
            })
          }
        }
      });
    },60000);
    wx.setStorageSync('timer',a);
  },
  onHide:function(){
    wx.removeStorageSync('timer');
  },
  updateGeo:function(lat,lng){
    if (lat!=''&&lng!=''){
      var that = this;
      var sid = '';
      try{
        sid = wx.getStorageSync('sid');
      }catch(e){console.log(e)}
      wx.request({
        url: this.globalData.url+'/aboutMe/unReadCount?sid='+sid,
        method:'POST',
        data: {
          'longitude':lng,
          'latitude':lat,
          'mapType':'GCJ02',
          'app':this.globalData.app,
          'platform':this.globalData.platform,
          'ver':this.globalData.ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
          }else{
          }
        }
      });
    }
  }
})
