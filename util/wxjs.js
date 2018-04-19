function postRequest(url, data, callback) {
    wx.request({
        url: url,
        method:'POST',
        data: data,
        header: {
            // 'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
            callback(res)
        }
      })
}

// 操作提示
function showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  }

// loading
function showLoading (title) {
    wx.showLoading({
        title: title,
        mask:true
      })
}

// 获取系统信息
function getSystemInfo(callback) {
  wx.getSystemInfo({
    success: (res) => {
      console.log(res);
      callback(res)
      // // 可使用窗口宽度、高度
      // let windowHeight = res.windowHeight
      // that.setData({
      //   // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
      //   listHeight: windowHeight - 316 / 750 * 300
      // })
    }
  }) 
}

module.exports = {
    postRequest: postRequest,
    showToast: showToast,
    showLoading: showLoading,
    getSystemInfo: getSystemInfo
}