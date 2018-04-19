var app = getApp();
var md5 = require('../../comm/script/md5.js');
Page({
    data: {
        formData:{
            phone:'',
            newCode:'',
            newCode1:'',
            nickName:''
        },
        isShowCheckcode:true,
        isShowCheckcode1:true,
        timeStamp:0
    },
    onLoad:function(option){
        var phone = option.phone;
        var formData = this.data.formData;
        formData['phone'] = phone;
    },
    submit: function(e) {
        if (e.timeStamp-this.data.timeStamp<2000) {return}
        this.setData({
          timeStamp:e.timeStamp
        });
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        if (this.data.formData.newCode==this.data.formData.newCode1&&/^([a-z]|[A-Z]|[0-9]){6,20}$/.test(this.data.formData.newCode)) {
            wx.showLoading({
              title: '请稍后',
              mask:true
            })
            wx.request({
                url: app.globalData.url+'/customer/customerCreate?sid='+this.data.sid,
                method:'POST',
                data: {
                    'mobilePhone':this.data.formData.phone,
                    'pass':md5(this.data.formData.newCode),
                    'name':this.data.formData.nickName,
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
                        var result = res.data.result.Customer;
                        var userId = result.id;
                        var name = result.name;
                        var mobilePhone = result.mobilePhone;
                        var sid = result.sid;
                        var face = result.face;
                        var background = result.background;
                        var vocation = result.vocation;
                        var region = result.region;
                        var uid = result.uid;
                        var gender = result.gender;
                        var sign = result.sign;
                        var authority = result.authority;
                        try {
                            wx.setStorageSync('userId', userId);
                            wx.setStorageSync('name', name);
                            wx.setStorageSync('mobilePhone', mobilePhone);
                            wx.setStorageSync('sid', sid);
                            wx.setStorageSync('face', face);
                            wx.setStorageSync('background', background);
                            wx.setStorageSync('vocation', vocation);
                            wx.setStorageSync('region', region);
                            wx.setStorageSync('gender', gender);
                            wx.setStorageSync('uid', uid);
                            wx.setStorageSync('sign', sign);
                            wx.setStorageSync('authority', authority);
                        } catch (e) {}
                        wx.switchTab({
                            url: '../home/home'
                        });
                    }else{
                        wx.showToast({
                            title: '注册失败',
                            icon: 'fail',
                            duration: 2000
                        })
                    }
                }
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '密码输入有误',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
        }
    },
    bindinputListener:function(e){
        var id = e.currentTarget.dataset.id;
        var value = e.detail.value;
        var formData = this.data.formData;
        formData[id] = value;
        this.setData({
            formData:formData
        });
    },
    showCode:function(e){
        this.setData({
            isShowCheckcode:true
        });
    },
    hideCode:function(e){
        this.setData({
            isShowCheckcode:false
        });
    },
    showCode1:function(e){
        this.setData({
            isShowCheckcode1:true
        });
    },
    hideCode1:function(e){
        this.setData({
            isShowCheckcode1:false
        });
    },
    goAgreement:function(e){
        wx.navigateTo({
            url:"../../pages/agreement/agreement"
        })
    }
})