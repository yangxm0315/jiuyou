// miniprogram/pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:[],
    imgtext:[],
    title:'',
    user:'',
    cdate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    let that = this;
    wx.setStorageSync('userid', 'yangxm');

    app.http('v1/home/getItem', { id: options.id })
      .then(res => {
        console.log(res.data);
        that.setData({
          title: res.data.title,
          user: res.data.user,
          cdate: res.data.createdate,
          imgurl: res.data.images,
          imgtext: res.data.imgtext
        })
/*
        this.setData({
          data: res.data,
          imgUrls: imgl //字符分割 
        })
*/        
      })
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