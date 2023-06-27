// pages/allThesaurus/allThesaurus.js
const myaudio = wx.createInnerAudioContext();
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    chindex:0,
    words:[],
    allwords:[],
    wordBooks:[],
    src:[],
    i:0,
    isplay: false,
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


    for (let i = 1; i <= wordBooks.datas[index].child_list[chindex].course_num; i++) {
      wx.request({
        url: `http://rw.ylapi.cn/reciteword/wordlist.u?uid=11988&appkey=60d7aa3430b2efdd9faac8f31b0b0361&class_id=${classId}&course=${i}`,
        data: {},
        success: res => {     
          // console.log(i)
          // console.log(res.data)
          wx.setStorage({
            data: this.data.allwords,
            key: 'allwords',
          })
          this.setData({
            allwords : this.data.allwords.concat(res.data.datas),
          })
          for(let i = 0;i<res.data.datas.length;i++){
            this.setData({
              src : this.data.src.concat(res.data.datas[i].sound)
            })
          }
         
          // console.log(this.data.src)
        },
      })
    }




    this.setData({

    })
    wx.setNavigationBarTitle({
      title: "单词库"
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
    console.assert(this.data.src)
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