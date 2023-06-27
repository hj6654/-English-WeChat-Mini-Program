// pages/article/article.js
Page({
  goin1:function (param) {
    wx.navigateTo({
      url: '../inarticle/inarticle',
    })
  },
  goin2:function (param) {
    wx.navigateTo({
      url: '../inarticle2/inarticle2',
    })
  },
  goin3:function (param) {
    wx.navigateTo({
      url: '../inarticle3/inarticle2',
    })
  },
  goin4:function (param) {
    wx.navigateTo({
      url: '../inarticle4/inarticle2',
    })
  },
  goin5:function (param) {
    wx.navigateTo({
      url: '../inarticle5/inarticle2',
    })
  },
  goin6:function (param) {
    wx.navigateTo({
      url: '../inarticle6/inarticle2',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "每日文章"
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