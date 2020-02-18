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
    isEdit: true,
    list: [],
    startX: 0, //开始坐标
    startY: 0
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
    //
    this.gettitleList();

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
    this.gettitleList()
  },
  gettitleList:function(){
    var that = this;
    if(app.globalData.openid.length==0) {
      return;
    }
    if( this.data.tabIndex==1) {
      app.http('/v1/home/gettitleList', { 
        openid: app.globalData.openid,
        state: this.data.tabIndex 
      })
      .then(res => {
        if (res.code == 200) {
          console.log(res.data);
          var tmp = res.data;
          for(var i=0;i<tmp.length;i++){
            that.data.list.push({
              id: tmp[i]._id,
              title: tmp[i].title,
              isTouchMove: false //默认全隐藏删除
            })
          }
//          console.log(that.data.list);
          that.setData({ 
            list: that.data.list
          });
        }
      })
    }
  },
  addItem: function(){
    console.log('add new item....');
    wx.navigateTo({
      url:'/pages/addItem/addItem'
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.list.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      list: that.data.list
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  delItem: function (e) {
    var idx = e.currentTarget.dataset.index;
    //
    console.log(this.data.list[idx].id);

    app.http('v1/admin/deleteCase', {
      id: this.data.list[idx].id,
    }, 'GET').then(res => {
      if (res.code == 200) {
        console.log(res);
        this.data.list.splice(idx, 1);
        this.setData({
          list: this.data.list
        })
        wx.showToast({
          title: '成功删除',
          icon: 'none'
        })
        //app.globalData.userInfo.mobile = this.data.mobile;
      }
      else {
        console.log(res);
      }
    })
  },
  //跳转
  goDetail(e) {
    var idx = e.currentTarget.dataset.index;
    var url = '/pages/details/index?id=' + this.data.list[idx].id;
    console.log(url);
    wx.navigateTo({
      url: url
    })
  }  
}) 
 
  