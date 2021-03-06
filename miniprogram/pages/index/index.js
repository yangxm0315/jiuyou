//index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caselist: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: ['jiuyou_top.png', 'jiuyou_top2.jpg','jiuyou_top3.jpg'],
    baseUrl: "https://wx.etgps.cn/file/images/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    var uid = wx.getStorageSync('userid');
    console.log('read storage:'+uid);
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
  getList: function () {
    console.log('load list data.....');
    let that = this;
    app.http('/v1/home/getcaselist', { 
      state: this.data.tabIndex 
    }).then(res => {
      if( res.code==200 )
      {
        that.setData({
          caselist:res.data,
        })
        console.log(that.data.caselist);
      }
    })
  }
})