var app = getApp();
var md5 = require('../../comm/script/md5.js');
var util = require('../../util/util.js');
Page({
    data: {
        account:'',
        code:'',
        isShowCheckcode:true
    },
    onLoad:function(){
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        var currentTime = Date.parse(new Date());
        var lastTime = '';
        try{
            lastTime = wx.getStorageSync('timeStamp');
        }catch(e){console.log(e);}
        if (lastTime!='') {
            if (currentTime-lastTime<604800000) {
                wx.switchTab({
                    url: '../home/home'
                });
            }
        }
    },
    submit: function() {
        var that = this;
        var mobile = this.data.account;
        var code = md5(this.data.code);
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        if (!/^([a-z]|[A-Z]|[0-9]){6,20}$/.test(mobile)) {
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
            return;
        }
        if (this.data.code=="") {
            wx.showModal({
                title: '提示',
                content: '密码不能为空',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
            return;
        }
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        wx.request({
            url: app.globalData.url+'/index/login',
            method:'POST',
            data: {
                'mobilePhone':mobile,
                'pass':code,
                'app':appValue,
                'platform':platform,
                'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                if (res.data.code=="10000") {
                    console.log(res.data.result)
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
                        wx.setStorageSync('timeStamp', Date.parse(new Date()));
                    } catch (e) {}
                    wx.hideLoading();
                    try {
                        wx.switchTab({
                            url: '../home/home'
                        });
                    } catch(e){
                        console.log(e);
                    }
                }else{
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '登录失败',
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
    },
    bindwx:function(e){
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.authorize({
                    scope: 'scope.userInfo',
                    success() {
                        wx.login({
                          success: function(res) {
                            console.log(res);
                            if (res.code) {
                                var code = res.code;
                                wx.getUserInfo({
                                    withCredentials:true,
                                    lang:'zh_CN',
                                    success: function(res) {
                                        console.log(res);
                                        wx.request({
                                            url: 'https://cx.wiicent.com/weixin/login',
                                            method:'POST',
                                            data: {
                                                'mobilePhone':'',
                                                'pass':'',
                                                'wxType':'xch',
                                                'code': code,
                                                'encryptedData':res.encryptedData,
                                                'iv':res.iv,
                                                'app':appValue,
                                                'platform':platform,
                                                'ver':ver
                                            },
                                            header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                            },
                                            success: function(res) {
                                                console.log(res);
                                                if (res.data.code=='10000') {
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
                                                        wx.setStorageSync('timeStamp', Date.parse(new Date()));
                                                    } catch (e) {}
                                                    try {
                                                        wx.switchTab({
                                                            url: '../home/home'
                                                        });
                                                    } catch(e){
                                                        console.log(e);
                                                    }
                                                }else{
                                                    wx.navigateTo({
                                                        url:'../loginBindPhone/loginBindPhone'
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            } else {
                              console.log('登录失败！' + res.errMsg)
                            }
                          }
                        });
                    }
                })
            }else{
                wx.login({
                    success: function(res) {
                        console.log(res);
                        if (res.code) {
                            var code = res.code;
                            wx.getUserInfo({
                                withCredentials:true,
                                lang:'zh_CN',
                                success: function(res) {
                                    console.log(res);
                                    wx.request({
                                        url: 'https://cx.wiicent.com/weixin/login',
                                        method:'POST',
                                        data: {
                                            'mobilePhone':'',
                                            'pass':'',
                                            'wxType':'xch',
                                            'code': code,
                                            'encryptedData':res.encryptedData,
                                            'iv':res.iv,
                                            'app':appValue,
                                            'platform':platform,
                                            'ver':ver
                                        },
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        success: function(res) {
                                            console.log(res);
                                            if (res.data.code=='10000') {
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
                                                    wx.setStorageSync('timeStamp', Date.parse(new Date()));
                                                } catch (e) {}
                                                try {
                                                    wx.switchTab({
                                                        url: '../home/home'
                                                    });
                                                } catch(e){
                                                    console.log(e);
                                                }
                                            }else{
                                                wx.navigateTo({
                                                    url:'../loginBindPhone/loginBindPhone'
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                });
              }
            }
        })
    },
    forgetCode:function(){
        wx.redirectTo({
          url: '../forgetcode/forgetcode'
        });
    },
    inputPhone:function(e){
        var a = e.detail.value;
        this.setData({
            account:a
        });
    },
    inputCode:function(e){
        var a = e.detail.value;
        this.setData({
            code:a
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
    goRegister:function(e){
        wx.redirectTo({
            url:"../../pages/register/register"
        });
    }
})