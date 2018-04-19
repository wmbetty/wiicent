var app = getApp();
var md5 = require('../../comm/script/md5.js');
Page({
    data: {
        phone:'',
        checkCode:'',
        timeCount:60,
        timeStamp:0
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
        if (this.data.phone&&this.data.checkCode) {
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
                                                url: 'https://cx.wiicent.com/weixin/bindUnionid',
                                                method:'POST',
                                                data: {
                                                    'mobilePhone':that.data.phone,
                                                    'smsCode':md5(that.data.checkCode),
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
                                            url: 'https://cx.wiicent.com/weixin/bindUnionid',
                                            method:'POST',
                                            data: {
                                                'mobilePhone':that.data.phone,
                                                'smsCode':md5(that.data.checkCode),
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
        }else{
            wx.showModal({
                title: '提示',
                content: '手机号.验证码不能为空',
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
        }
    },
    getCheckCode: function(e){
        var that = this;
        var appValue = app.globalData.app;
        var platform = app.globalData.platform;
        var ver = app.globalData.ver;
        var phone = this.data.phone;
        if (this.data.isGetCheckCode) {return false;}
        if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(phone)) {
            wx.request({
                url: app.globalData.url+'/bkSmsCode/bkSmsCodeSend',
                method:'POST',
                data: {
                    'mobilePhone':phone,
                    'app':appValue,
                    'platform':platform,
                    'ver':ver
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    if (res.data.code=="10000") {
                        that.setData({
                            isGetCheckCode:true,
                            timeCount:60
                        });
                        var timer = setInterval(function(){
                            var a = --that.data.timeCount;
                            if (a>=1) {
                                that.setData({
                                    timeCount:a
                                });
                            }else{
                                that.setData({
                                    isGetCheckCode:false,
                                    timeCount:60
                                });
                                clearInterval(timer);
                            }
                        },1000);
                    }else{
                        wx.showToast({
                            title: '获取验证码失败',
                            icon: 'fail',
                            duration: 2000
                        })
                    }
                }
            })
        }else{
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
        }
    },
    bindPhone:function(e){
        var value = e.detail.value;
        this.setData({
            phone : value
        });
    },
    bindCheckCode:function(e){
        var value = e.detail.value;
        this.setData({
            checkCode : value
        });
    }
})