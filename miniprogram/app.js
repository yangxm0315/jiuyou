//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.globalData.openid = wx.getStorageSync('openid');
    this.globalData.role = wx.getStorageSync('role');

    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo;
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:'',
    role:''
  },
  userLogin: function () {
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.http('v1/wx/getUser', { code: res.code }).then(res => {
            console.log(res.data);
            this.globalData.openid = res.data.openid;
            this.globalData.role = res.data.role;
            wx.setStorageSync('role', res.data.role);
            wx.setStorageSync('openid', res.data.openid);
          })
        }
        else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    })
  },

  http: function (url, data = '', method = "GET") { //封装http请求
    const apiUrl = 'https://wx.etgps.cn/api/' //请求域名
    const currency = {
      openid: this.globalData.openid
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: apiUrl + url,
        data: Object.assign(currency, data),
        method: method,
        success: function (res) {
          //          console.log(url)
          //          console.log(res)

          if (res.data.code != 200) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          resolve(res.data)
        },
        fail: function (res) {
          console.log(res);
          reject(res);
        },
        complete: function () {
          //console.log('complete');
        }
      })
    })
  },
})
