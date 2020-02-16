// pages/bindPhone/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    code: '',
    smscode: '',
    mobile: '',
    otherInfo: ''
  },
  bindMobileInput: function (e) {
    let mobile = e.detail.value
    if (mobile.length === 11) {
      let checkedNum = this.checkPhoneNum(mobile)
      if (checkedNum) {
        this.setData({
          mobile: mobile
        })
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        mobile: ''
      })
      this.hideSendMsg()
    }
  },
  checkPhoneNum: function (mobile) {
    let str = /^1\d{10}$/
    if (str.test(mobile)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: '../../images/fail.png'
      })
      return false
    }
  },
  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },
  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true
    })
  },
  sendMsg: function () {
    var mobile = this.data.mobile;
    var sessionId = wx.getStorageSync('sessionId');
    console.log(sessionId);

    app.http('v1/wx/mobilecode', {
      mobile: mobile,
      sid: sessionId,
      sign: "易特科技"
    }, "GET").then(res => {
      //      console.log(res)
      if (res.code == 200) {
        this.setData({
          smscode: res.smscode
        })
      }
    })

    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true,
              code: ''
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  bindKeyCode: function (e) {
    let code = e.detail.value
    if (code.length === 6) {
      this.setData({
        code: code,
        otherInfo: code
      })
      this.activeButton()
    }
    else {
      this.setData({
        otherInfo: ''
      })
      this.activeButton()
    }
  },
  activeButton: function () {
    let { mobile, code, otherInfo } = this.data
    if (mobile && code && otherInfo) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },
  submitFun: function () {
    //    console.log(getApp().globalData.openid)
    let smscode = this.data.smscode;
    let code = this.data.code;
    if (code != smscode) {
      wx.showToast({
        title: '验证码不正确',
//        image: '../../icon/fail.png'
      })
      return;
    }

    app.http('v1/user/bindMobile', {
      code: this.data.code,
      mobile: this.data.mobile,
      openid: app.globalData.openid,
      name: app.globalData.userInfo.nickName
    }, 'POST')
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          //
          app.globalData.userInfo.mobile = this.data.mobile;
//          wx.setStorageSync('userInfo', app.globalData.userInfo);
          wx.reLaunch({
            url: "/pages/AboutMe/AboutMe"
          });
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})