var app = getApp();
var md5 = require('../../comm/script/md5.js');
Page({
    data: {
        sid:'',
        formData:{
            oldCode:'',
            newCode:'',
            newCode1:''
        },
        isShowCheckcode:true,
        isShowCheckcode1:true
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
        }catch(e){}
    },
    submit: function(e) {
        var that = this;
        if (this.data.formData.newCode==this.data.formData.newCode1&&/^([a-z]|[A-Z]|[0-9]){6,20}$/.test(this.data.formData.newCode)) {
            var appValue = app.globalData.app;
            var platform = app.globalData.platform;
            var ver = app.globalData.ver;
            wx.showLoading({
              title: '请稍后',
              mask:true
            })
            wx.request({
                url: app.globalData.url+'/customer/resetPwdWithOld?sid='+this.data.sid,
                method:'POST',
                data: {
                    'old':md5(this.data.formData.oldCode),
                    'new':md5(this.data.formData.newCode),
                    'app':appValue,
                    'platform':platform,
                    'ver':ver
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    if (res.data.code=="10000") {
                        wx.hideLoading();
                        wx.reLaunch({
                            url: '../login/login'
                        });
                    }else{
                        wx.hideLoading();
                        wx.showToast({
                            title: '修改失败',
                            icon: 'fail',
                            duration: 2000
                        })
                    }
                }
            })
        }else{
            wx.showToast({
                title: '两次密码不一致',
                icon: 'fail',
                duration: 2000
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
    }
})