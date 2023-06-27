// pages/MySetting/MySetting.js
var app = getApp()
Page({
  gotoreview(){
    if(this.data.index === "" && this.data.chindex === ""){
      console.log(111)
      wx.navigateTo({
        url: '../book/book',
      })
    }else{
    wx.navigateTo({
      url: '../review/review',
    })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    review:[],
    color: "white",
    padding: "450rpx",
    userInfo: {},
    information: true,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        res.userInfo = app.userInfo
        this.setData({
          userInfo: app.userInfo,
          hasUserInfo: true,
          information: false,
          color: "#fcdb65",
          padding: "50rpx"
        })
        wx.showTabBar()
      }
      
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: "我的"
    })
    if (wx.getUserProfile) {
      this.setData({
        userInfo: app.userInfo,
        hasUserInfo: true,
        information: false,
        color: "#fcdb65",
        padding: "50rpx",
        canIUseGetUserProfile: true
      })
    }
    this.getUserProfile();
    // console.log(this.data.userInfo)
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
    this.setData({
      review : wx.getStorageSync('review'),
      book:wx.getStorageSync('book'),
      index:wx.getStorageSync('index'),
      chindex:wx.getStorageSync('chindex'),
    })
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
    // bindViewTap: function () {
  //     wx.navigateTo({
  //       url: '../feedback/index'
  //     })
  // }
})