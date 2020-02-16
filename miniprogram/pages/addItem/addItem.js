// pages/addItem/addItem.js
Page({
  //#ef8383
  /**
   * 页面的初始数据
   */
  data: {
    textlist:[],
    imglist:[],
    urllist:[],
    firstCon: '',
    imgIndex: 0,
    upIndex: 0,
    test:'',
    hiddenLoading: true
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

  },
  /**
   * 输入监听
   */
  inputCon: function (e) {
    if (0 === e.currentTarget.id - 0) {//第一个文本框的输入监听
      this.data.firstCon = e.detail.value;
    } else {
      this.data.textlist[e.currentTarget.id - 1] = e.detail.value;
    }
  },
  /**
     * 失去焦点监听
     * 根据失去监听的input的位置来判断图片的插入位置
  */
  outBlur: function (e) {
    this.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 删除图片
   */
  deletedImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) {//点击删除图片
/*        
          if (index === 0 && that.data.textlist[index].length>0 ) {//删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.textlist[index];
          } else if (index > 0 && that.data.textlist[index].length>0 ) {
            that.data.textlist[index - 1] = that.data.textlist[index - 1] + that.data.textlist[index];
          }
*/          
          that.data.textlist.splice(index, 1);
          that.data.imglist.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            textlist: that.data.textlist,
            imglist: that.data.imglist
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  addImg: function() {
    var that=this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let temp1 = that.data.imglist;
        let temp2 = that.data.textlist;
        const tempFilePaths = res.tempFilePaths;
        let i = 0;
        for (i = 0; i < tempFilePaths.length; i++) {
          temp1.splice(that.data.imgIndex, 0, tempFilePaths[i]);
          temp2.splice(that.data.imgIndex, 0, '');
          that.data.imgIndex++;
        }
        that.setData({
          imglist:temp1,
          textlist:temp2
        })
      }
    })
  },
  saveItem: function() {
    let that = this;
    if( this.data.firstCon.length<1 )
    {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return;
    }
    if( this.data.imglist.length<1 ) {
      wx.showToast({
        title: '请最少选择一张图片',
        icon: 'none'
      })  
      return;
    }
/*    that.setData({
      hiddenLoading:false
    })
*/    
    this.data.upIndex = 0;
    that.uploadOneByOne();
    //保存到服务器
//    app.http
  },
  uploadOneByOne: function(){
    let app = getApp();
    var that = this;
    var count = that.data.upIndex+1; 
    wx.showLoading({
      title: '正在上传第'+ count + '张',
    })
    wx.uploadFile({
      url: 'https://wx.etgps.cn/api/v1/admin/uploadImage',      //此处换上你的接口地址
      filePath: that.data.imglist[count-1],
      name: 'inputFile',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData: {
        imgurl: 'wx.etgps.cn',                      //跳转地址
        openid: app.globalData.openid,              //名称
      },
      success(res) {
        console.log(res);
        var ret = JSON.parse(res.data);
        if (ret.code == 200) {
          that.data.urllist.push(ret.data.imgfile);
          console.log('success upload file:'+ret.data.imgfile);
          console.log(ret.data.openid);
        }
      },
      fail(res) {
        console.log(res);
      },
      complete(e){
        that.setData({
          upIndex:count,
        })
        if(count==that.data.imglist.length) {
          wx.hideLoading();     //upload finish
          console.log('upload success!total:'+count+'pictures.');
          //save text and title
          app.http('v1/admin/insertCase', {
            title: that.data.firstCon,
            imgtext: that.data.textlist,
            images: that.data.urllist,
            openid: app.globalData.openid,
            user: app.globalData.userInfo.nickName
          }, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
              console.log(res);
              //app.globalData.userInfo.mobile = this.data.mobile;
            }
          })
          wx.navigateBack();
          //end
        } else {
          that.uploadOneByOne();
        }
      }
    })
  }
})