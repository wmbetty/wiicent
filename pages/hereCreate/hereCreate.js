var app = getApp();
Page({
  data:{
    sid:'',
    formData:{
      ftype:'',
      fid:'',
      mtype:'',
      title:'',
      content:'',
      destiCity:'',
      destiPath:'',
      address:'',
      enName:'',
      keywords:'',
      coImage:'',
      stayTime:'',
      link:'',
      phone:'',
      site:'',
      abs:'',
      notice:'',
      transportInfo:'',
      addition:'',
      longitude:'',
      latitude:'',
      file:''
    }
  },
  onLoad:function(option){
    var sid = '';
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
          sid:sid
        });
      }
    }catch(e){console.log(e);}
  },
  onShow:function(e){

  },
  inputListener:function(e){
    var value = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var formData = this.data.formData;
    formData[id] = value;
    this.setData({
      formData:formData
    });
  },
  submit:function(e){
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    var formData = this.data.formData;
    formData.app = appValue;
    formData.platform = platform;
    formData.ver = ver;
    if (formData.file!='') {
      formData.coImage = 1;
    }else{
      formData.coImage = 0;
    }
    console.log(formData);
    if (formData.mtype=='') {
      wx.showModal({
        title: '提示',
        content: '景点类型不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (formData.title=='') {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (formData.content=='') {
      wx.showModal({
        title: '提示',
        content: '简要内容不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (formData.destiCity==''||formData.destiPath=='') {
      wx.showModal({
        title: '提示',
        content: '所在地区不能为空',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
    if (formData.address=='') {
      wx.showModal({
        title: '提示',
        content: '地址不能为空',
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
      url: app.globalData.url+'/here/hereAdd?sid='+this.data.sid,
      method:'POST',
      data: formData,
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
          var result = res.data.result['Delete'];
          var sourceType = result.sourceType;
          var sourceId = result.sourceId;
          var sid = that.data.sid;
          var file = formData.file;
          if (file!='') {
            uploadFile(file,sid,sourceId,sourceType).then(res=>{
              console.log(res);
              if (/"10000"/.test(res.data)) {
                wx.showToast({
                  title: '图片上传成功',
                  icon: 'success',
                  duration: 2000
                })
              }else{
                wx.showToast({
                  title: '图片上传失败',
                  icon: 'fail',
                  duration: 2000
                });
              }
            });
          }
          console.log(res);
        }else{
          wx.showToast({
            title: '保存失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  chooseLocation:function(e){
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.chooseLocation({
                success: function(res) {
                  if (res.latitude&&res.longitude){
                    var formData = that.data.formData;
                    formData.longitude = res.longitude;
                    formData.latitude = res.latitude;
                    formData.address = res.address;
                    that.setData({
                      formData:formData
                    });
                  }else{
                    var formData = that.data.formData;
                    formData.longitude = '';
                    formData.latitude = '';
                    formData.address = '';
                    that.setData({
                      formData:formData
                    });
                  }
                },
                fail:function(res){
                }
              })
            }
          })
        }else{
          wx.chooseLocation({
            success: function(res) {
              if (res.latitude&&res.longitude){
                var formData = that.data.formData;
                formData.longitude = res.longitude;
                formData.latitude = res.latitude;
                formData.address = res.address;
                that.setData({
                  formData:formData
                });
              }else{
                var formData = that.data.formData;
                formData.longitude = '';
                formData.latitude = '';
                formData.address = '';
                that.setData({
                  formData:formData
                });
              }
            },
            fail:function(res){
            }
          })
        }
      }
    })
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
          formData.file = res.tempFiles[0].path;
          that.setData({
            formData:formData
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
          var formData = that.data.formData;
          formData.file = res.tempFiles[0].path;
          that.setData({
            formData:formData
          });
        }
      })
    }catch(e){}
  },
  getCategory:function(e){
    wx.navigateTo({
      url:"../../pages/hereCategory/hereCategory"
    })
  },
  getValue:function(e){
    var name = e.currentTarget.dataset.name;
    var role = e.currentTarget.dataset.role;
    wx.navigateTo({
      url:"../../pages/hereValue/hereValue?name="+name+"&role="+role
    })
  },
  getMoreInfo:function(e){
    wx.navigateTo({
      url:"../../pages/hereMoreInfo/hereMoreInfo"
    })
  },
  getArea:function(e){
    wx.navigateTo({
      url:"../../pages/hereArea/hereArea"
    })
  }
})
function uploadFile(file,sid,id,type){
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      url: app.globalData.url+'/fileUpload/fileUpload?sid='+sid,
      filePath:file,
      name:'file',
      header:{
        'content-type':'multipart/form-data'
      },
      formData:{
        sourceType:type,
        sourceId:id,
        coImage:1,
        app:app.globalData.app,
        platform:app.globalData.platform,
        ver:app.globalData.ver
      },
      success:function(res){
        resolve(res);
      },
      fail:function(res){
        reject(res);
      }
    })
  })
}