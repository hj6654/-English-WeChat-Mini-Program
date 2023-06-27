// pages/todayThesaurus/dayThesaurus.js
const myaudio = wx.createInnerAudioContext();
var app = getApp()

Page({

      /**
       * 页面的初始数据
       */
      data: {
        words: [],
        bookds: [],
        src:[]
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        var course = wx.getStorageSync('course')
        var index = wx.getStorageSync('index')
        var chindex = wx.getStorageSync('chindex')
        var wordBooks = wx.getStorageSync('wordBooks')
        var classId =wx.getStorageSync('classId')
        wx.request({
              url: `https://rw.ylapi.cn/reciteword/wordlist.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201&class_id=${classId}&course=${course}`,
              data: {},
              success: res => {
                for(let i = 0 ; i < res.data.datas.length ; i++){
                  res.data.datas[i].yixue = false
                }
                this.setData({
                  words: res.data
                })
                for(let i = 0;i<res.data.datas.length;i++){
                  this.setData({
                    src : this.data.src.concat(res.data.datas[i].sound)
                  })
                }
                console.log(this.data.words)
              }
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
            console.log(this.data.words.datas)
            wx.setStorageSync('todayword', this.data.words.datas)
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
          play: function (e) {
            var a = e.currentTarget.dataset.idx
            myaudio.src = this.data.src[a]
            console.log(a)
            myaudio.play();
            console.log(myaudio)
            console.log(myaudio.src)
            // console.log(this.myaudio.duration);
            this.setData({ isplay: true });
          },
          // 停止
          stop: function () {
            myaudio.pause();
            this.setData({ isplay: false });
          }
      })