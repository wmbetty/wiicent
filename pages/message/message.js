var app = getApp();
var util = require('../../util/util.js');
Page({
	data: {
		sid:'',
		pageId:1,
		size:10,
		noMessage:true,
		lineMesData:{},
		sysMesData:{}
	},
	onLoad: function() {
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
	onShow:function(){
		var that = this;
		var appValue = app.globalData.app;
    	var platform = app.globalData.platform;
    	var ver = app.globalData.ver;
    	wx.request({
    	    url: app.globalData.url+'/aboutMe/aboutMeIndex?sid='+this.data.sid,
    	    method:'POST',
    	    data: {
    	      'pageId':this.data.pageId,
    	      'size':this.data.size,
    	      'app':appValue,
    	      'platform':platform,
    	      'ver':ver
    	    },
    	    header: {
    	        'content-type': 'application/x-www-form-urlencoded'
    	    },
    	    success: function(res) {
                if (res.data.code=="10000") {
                    var result = res.data.result['AboutMe.list'];
                    var lineMesData = {};
                    var sysMesData = {};
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].atype=="SYS") {
                            sysMesData = result[i];
                            if (sysMesData.uptime) {
                                var a = (Date.parse(new Date())-util.toTimestamp(sysMesData.uptime));
                                sysMesData.uptime = util.timeFormat(a);
                            }else{
                                sysMesData.uptime = '';
                            }
                            sysMesData.content = sysMesData.content.length>17?sysMesData.content.slice(0,18)+'...':sysMesData.content;
                        }else if(result[i].atype=="XCH"){
                            lineMesData = result[i];
                            if (lineMesData.uptime) {
                                var a = (Date.parse(new Date())-util.toTimestamp(lineMesData.uptime));
                                lineMesData.uptime = util.timeFormat(a);
                            }else{
                                lineMesData.uptime = '';
                            }
                            lineMesData.content = lineMesData.content.length>17?lineMesData.content.slice(0,18)+'...':lineMesData.content;
                        }
                    }
                    that.setData({
                    	lineMesData:lineMesData,
                    	sysMesData:sysMesData,
                        noMessage:false
                    });
                }else{
                    that.setData({
                        noMessage:true
                    });
                }
    	    }
    	})
	},
	goSystemMessage: function(e) {
		wx.navigateTo({
			url: "../sysMessage/sysMessage"
		})
	},
	goLineMesList:function(e){
		wx.navigateTo({
			url: "../lineMesDetail/lineMesDetail"
		})
	}
})