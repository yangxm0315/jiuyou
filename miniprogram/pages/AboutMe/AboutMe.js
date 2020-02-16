// miniprogram/pages/AboutMe/AboutMe.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bindMobile: true,
    tabIndex: 1,
    isAdd: true,
    isAdmin: true,
    isEdit: false,
    list: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
  /*  wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  */
    if(app.globalData.role.length>0)
    {
      console.log('user role:' + app.globalData.role);
//      app.userLogin();
      this.setData({bindMobile:false})
    }

    console.log('user role:'+app.globalData.role);
    if( app.globalData.role.indexOf('write')>=0 ){
      this.setData({
        isAdd:true
      })
    }
    else{
      this.setData({
        isAdd: false
      })
    }
    if (app.globalData.role.indexOf('admin')>=0 ){
      this.setData({
        isAdmin: true
      })
    }
    else{
      this.setData({
        isAdmin: false
      })
    }

  },
  bindGetUserInfo(e) {
  //  app.userLogin();
    this.bindMobile();
  },
  bindMobile: function(){
    app.userLogin();
    wx.reLaunch({
      url: "/pages/bindPhone/index"
    });
  },
  userLogout:function(){
    app.globalData.openid = '';
    app.globalData.role = '';
    this.setData({
      bindMobile: true,
      isAdd: false
    })
    //
    wx.setStorageSync('openid', '');
    wx.setStorageSync('role', '')
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

  },

  tabFun(e) {
    return;
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    }) 
    this.getList()
  },
  getList:function(){
    if(app.globalData.openid.length==0) {
      return;
    }
    console.log('load list data.....');

    app.http('/v1/order/list', { state: this.data.tabIndex }).then(res => {
      console.log(res.data);
      this.setData({ list: res.data })
    })
  },
  addItem: function(){
    console.log('add new item....');
    wx.navigateTo({
      url:'/pages/addItem/addItem'
    })
  }
}) 
 
  