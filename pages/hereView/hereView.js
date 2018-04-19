var app = getApp();
var innerAudioContext = wx.createInnerAudioContext();
var util = require('../../util/util.js');
Page({
  data:{
    sid:'',
    spotId:'',
    scheduleSpotData:{},
    longitude:'',
    latitude:'',
    userId:'',
    markers: [{
      iconPath: "../../dist/images/marker_red_1.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 20,
      height: 20
    }],
    canPlay:false,
    stop:false
  },
  onLoad:function(option){
    var that = this;
    var sid = '';
    var longitude = '';
    var latitude = '';
    var spotId = option.spotId;
    var userId = '';
    try {
      sid = wx.getStorageSync('sid');
      longitude = wx.getStorageSync('current_lng');
      latitude = wx.getStorageSync('current_lat');
      userId = wx.getStorageSync('userId');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
          sid:sid,
          spotId:spotId,
          longitude:longitude,
          latitude:latitude,
          userId:userId
        });
      }
    } catch (e) {}
  },
  onShow:function(){
    var that = this;
    var sid = '';
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/here/hereView?sid='+this.data.sid,
      method:'POST',
      data: {
        'id':this.data.spotId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['Baike'];
          console.log(result);
          var markers = that.data.markers;
          result.bcontentImage = result.bcontentImage.split(' ')[0].split('big_')[1]!=''?result.bcontentImage.split(' ')[0]:'';
          markers[0].latitude = result.latitude;
          markers[0].longitude = result.longitude;
          if (result.latitude!=0&&result.longitude&&that.data.longitude&&that.data.latitude) {
            result.distance = util.getDistance(result.latitude,result.longitude,that.data.latitude,that.data.longitude);
          }
          var voiceData = [];
          var voicePathData = [];
          /*var voiceContent = result.content.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g,'');*/
          var voiceContent = result.content;
          for (var i = 0; i < Math.ceil(voiceContent.length/400); i++) {
            var a = voiceContent.substring(400*i,400*(i+1));
            voiceData.push(a);
          }
          if (result) {
            that.setData({
              scheduleSpotData:result,
              markers:markers
            });
            wx.setNavigationBarTitle({
              title: result.title
            });
            wx.request({
              url: 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=d6cmh8XMfoNbdXIjz3jezuNNBFqoZYaV&client_secret=TuzFujQG7ZqHKlXYGsob5CFlCyhaz1B5',
              method:'GET',
              success: function(res) {
                console.log(res);
                var token = res.data.access_token;
                try{
                  console.log(voiceData);
                  uploadFiles(voiceData,token,{
                    success:reses=>{
                      that.setData({
                        canPlay:true
                      })
                      var index = 0;
                      innerAudioContext.src = reses[index];
                      innerAudioContext.onPlay(()=>{
                        console.log(reses[index]);
                      });
                      innerAudioContext.autoplay = false;
                      innerAudioContext.onEnded(() => {
                        console.log(index);
                        if (index>=(reses.length-1)) {return}
                        index++;
                        innerAudioContext.src = reses[index];
                        that.startVoice();
                      });
                    }
                  })
                }catch(e){console.log(e);}
              }
            })
          }
        }
      }
    })
  },
  stopVoice:function(e){
    innerAudioContext.pause();
    this.setData({
      canPlay:true,
      stop:false
    })
  },
  startVoice:function(e){
    if (!this.data.canPlay) {return}
    innerAudioContext.play();
    this.setData({
      canPlay:false,
      stop:true
    })
  },
  goComment:function(e){
    wx.navigateTo({
      url:"../../pages/hereComment/hereComment?sourceId="+this.data.scheduleSpotData.id+"&sourceType="+this.data.scheduleSpotData.mcode+"&targetId="+this.data.scheduleSpotData.authorId
    })
  },
  love:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/bkLove/bkLove?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':this.data.scheduleSpotData.mcode,
        'sourceId':this.data.scheduleSpotData.id,
        'targetId':this.data.userId,
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
    })
  },
  cancelLove:function(e){
    var sourceType = e.currentTarget.dataset.sourcetype;
    var sourceId = e.currentTarget.dataset.id;
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/bkLove/bkLove?sid='+this.data.sid,
      method:'POST',
      data: {
        'sourceType':this.data.scheduleSpotData.mcode,
        'sourceId':this.data.scheduleSpotData.id,
        'targetId':this.data.userId,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="14001") {
          that.onShow();
        }else{

        }
      }
    })
  },
})

function uploadFile (pic,token) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: 'https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=356982065156001&tok='+token+'&tex='+pic,
      success: function(res) {
        console.log('downloadFile success');
        console.log(res);
        if (res.statusCode == 200) {
          console.log('load'+Date.parse(new Date()));
          resolve(res.tempFilePath);
        }
      },
      fail:function(res){
        console.log('downloadFile fail');
      }
    }).onProgressUpdate((res) => {
      if (res.progress==100) {
        console.log('progress'+Date.parse(new Date()));
      }
    })
  })
}

function uploadFiles(pics = [], token = '', opts = {}) {
  let promises = []
  pics.forEach(pic => {
    promises.push(uploadFile(pic,token))
  })
  function noop() {}
  Promise.all(promises).then(opts.success || noop).catch(opts.fail || noop)
}