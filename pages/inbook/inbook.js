// pages/inbook/inbook.js
Page({
  gotoindex: function (e) {
    var a = e.currentTarget.dataset.idx
    this.setData({
      chindex : a
    })
    wx.setStorageSync('chindex', this.data.chindex)
    wx.setStorageSync('click', 0)

  },
  /**
   * 页面的初始数据
   */
  data: {
    knownum:0,
    a:[],
    b:[],
    bookindex:0,
    book:[],
    chindex:0
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
    this.setData({
      book : wx.getStorageSync('book'),
      bookindex : wx.getStorageSync('index'),
      knownum : wx.getStorageSync('know')
    })
    // console.log(book[idx].child_list[index].study)
    // console.log(this.data.book)
    // console.log(this.data)
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