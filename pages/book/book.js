// pages/book/book
var app = getApp()
Page({
  gotociku: function (e) {
    // console.log(e)
    var a = e.currentTarget.dataset.idx
    this.setData({
      idx : a
    })
    wx.setStorageSync('index', this.data.idx)
    // console.log(this.data.idx)
    wx.navigateTo({
      url: '../inbook/inbook',
    }) 
  },

  /**
   * 页面的初始数据
   */
  data: {   
    knownum:0,
    book:[],
    idx:0,
    study:0,
    run:0,
    a:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "词库"
    })
    if(wx.getStorageSync('run') == 0){
    wx.request({
      url: 'https://rw.ylapi.cn/reciteword/list.u?uid=11988&appkey=60d7aa3430b2efdd9faac8f31b0b0361',
      data:{},
      success:res=>{
        for(var a=0 ; a < res.data.datas.length; a ++){
          for(var i=0 ; i < res.data.datas[a].child_list.length; i ++){
            res.data.datas[a].child_list[i].study = 0  
            // res.data.datas[a].child_list[i].yixue = false      
          }
        }
        console.log(this.data.run)
          this.setData({
            book:res.data.datas,
            run:1
          })
          wx.setStorageSync('run', this.data.run)
          wx.setStorageSync('book', this.data.book)
        },     
    })
  }


    // this.setData({
    //   knownum : wx.getStorageSync('know')
    // })
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
      book : wx.getStorageSync('book')
    })
    console.log(wx.getStorageSync('book'))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('book', this.data.book)
    console.log(this.data.book)
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