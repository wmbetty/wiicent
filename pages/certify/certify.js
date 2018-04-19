var app = getApp();
Page({
  data:{
    sid:'',
    userId:'',
    formData:{
      trueName:'',
      cardId:'',
      qualId:'',
      coQualPhoto:0,
      file:''
    },
    flag:false
  },
  onLoad:function(option){
    var sid = '';
    var userId = '';
    try {
      sid = wx.getStorageSync('sid');
      userId = wx.getStorageSync('userId');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
            sid:sid,
            userId:userId
        });
      }
    }catch(e){}
  },
  inputListener:function(e){
    var id = e.currentTarget.dataset.id;
    var value = e.detail.value;
    var formData = this.data.formData;
    formData[id] = value;
    this.setData({
      formData:formData
    });
    this.checkFlag(this);
  },
  getAlbum:function(e){
    var that = this;
    try{
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album'],
        success: function (res) {
          var formData = that.data.formData;
          formData['file'] = res.tempFiles[0].path;
          that.setData({
            formData:formData
          });
          that.checkFlag(that);
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
          console.log(res);
          var formData = that.data.formData;
          formData['file'] = res.tempFiles[0].path;
          that.setData({
            formData:formData
          });
          that.checkFlag(that);
        }
      })
    }catch(e){}
  },
  checkFlag:function(that){
    if (that.data.formData.trueName!=''&&that.data.formData.cardId!=''&&/^[a-zA-Z0-9]+$/.test(that.data.formData.cardId)&&that.data.formData.qualId!=''&&/^[a-zA-Z0-9]+$/.test(that.data.formData.qualId)&&that.data.formData.file!='') {
      that.setData({
        flag:true
      });
    }else{
      that.setData({
        flag:false
      });
    }
  },
  submit:function(e){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showLoading({
      title:'请稍侯..',
      mask:true
    });
    wx.request({
      url: app.globalData.url+'/certify/lxTalentApplySimplify?sid='+this.data.sid,
      method:'POST',
      data: {
        'tag':'',
        'trueName':this.data.formData.trueName,
        'cardId':this.data.formData.cardId,
        'qualId':this.data.formData.qualId,
        'coQualPhoto':1,
        'app':appValue,
        'platform':platform,
        'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code=="10000") {
          console.log(that.data.userId);
          wx.uploadFile({
            url: app.globalData.url+'/fileUpload/fileUpload?sid='+that.data.sid,
            filePath: that.data.formData.file,
            name: 'file',
            formData:{
              'sourceType':'LxTalent',
              'sourceId':that.data.userId,
              'coImage':1
            },
            success: function(res){
              console.log(res.data);
              if (/"10000"/.test(res.data)) {
                wx.navigateTo({
                  url:"../../pages/certify_success/certify_success"
                })
              }else{
                wx.showToast({
                  title: '图片提交失败',
                  icon: 'fail',
                  duration: 2000
                });
                return;
              }
            }
          })
        }else{
          wx.showToast({
            title: '提交失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }
})