// pages/MySetting/MySetting.js
var app = getApp()
Page({
  gotostudy: function (param) {
    if(this.data.index === "" && this.data.chindex === ""){
      console.log(111)
      wx.navigateTo({
        url: '../book/book',
      })
    }else{
      wx.navigateTo({
        url: '../studychoose/studychoose',
      })
    }
  },
  gotociku: function (param) {
    if(this.data.index === "" && this.data.chindex === ""){
      console.log(111)
      wx.navigateTo({
        url: '../book/book',
      })
    }else{
      wx.navigateTo({
        url: '../allThesaurus/allThesaurus',
      })
    }
  },
  gotobook: function (param) {
    wx.navigateTo({
      url: '../book/book',
    })
  },
  gttdt: function (param) {
    if(this.data.index === "" && this.data.chindex === ""){
      console.log(111)
      wx.navigateTo({
        url: '../book/book',
      })
    }else{
      wx.navigateTo({
        url: '../todayThesaurus/dayThesaurus',
      })
    }
  },
  bfb(){
   var a = this.data.book[this.data.index].child_list[this.data.chindex].study/this.data.book[this.data.index].child_list[this.data.chindex].word_num
   var b = 100*a
   this.setData({
     bfb : b.toFixed()
   })
    console.log(this.data.bfb)
  },
  /**
   * 页面的初始数据
   */
  data: {
    bfb:0,
    initial:true,
    qw:0,
    book:[],
    allwords:[],
    resdata:[],
    words: [],
    index:0,
    chindex:0,
    color: "white",
    display: "flex",
    title: "登录验证",
    padding: "450rpx",
    userInfo: {},
    information: true,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
  },
  getUserProfile(e) {
    this.setData({
      title: "首页",
    })
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          information: false,
          color: "#fcdb65",
          padding: "50rpx",
          display: "none"
        })
        wx.showTabBar()
        app.userInfo = res.userInfo
        // console.log(app.userInfo)
        wx.setNavigationBarTitle({
          title: this.data.title
        })
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var value = wx.getStorageSync('allwords')
      
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.getUserProfile();
    wx.request({
      url: 'https://rw.ylapi.cn/reciteword/list.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201',
      data:{},
      success:res=>{
        this.setData({
          resdata:res.data
        })
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
    var click = wx.getStorageSync('click')
    var index1 = wx.getStorageSync('index')
    var chindex1 = wx.getStorageSync('chindex')
    // console.log(chindex1)
    this.setData({
      index:wx.getStorageSync('index'),
      chindex:wx.getStorageSync('chindex'),
      knownum : wx.getStorageSync('know'),
      book:wx.getStorageSync('book'),
      newword : wx.getStorageSync('newword'),
      qw : wx.getStorageSync('qw')
    })
    wx.setStorageSync('qw', this.data.qw)
    if(click == 19){
      this.setData({
        newword : 20
      })
    }
    wx.request({
      url: 'https://rw.ylapi.cn/reciteword/list.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201',
      data:{},
      success:res=>{
        this.setData({
          resdata:res.data
        })
        var index1 = wx.getStorageSync('index')
        var chindex1 = wx.getStorageSync('chindex')
        var classId = res.data.datas[index1].child_list[chindex1].class_id
        var course = wx.getStorageSync('course')
        // console.log(res.data.datas[index1].child_list[chindex1])
        // console.log(wx.getStorageSync('classId'))
        if(wx.getStorageSync('classId')){
          if(wx.getStorageSync('classId') != classId){
            wx.setStorageSync('course', 1)
            wx.setStorageSync('classId', classId)
          }
        }else{
          wx.setStorageSync('classId', classId)
        }
        var course = wx.getStorageSync('course')
    var index = wx.getStorageSync('index')
    var chindex = wx.getStorageSync('chindex')
    var wordBooks = wx.getStorageSync('wordBooks')
    var classId =wx.getStorageSync('classId')
    // console.log(classId);
    // console.log(course);
    wx.request({
          url: `https://rw.ylapi.cn/reciteword/wordlist.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201&class_id=${classId}&course=${course}`,
          data: {},
          success: res => {
            this.setData({
              words: res.data
            })
            wx.setStorageSync('todayword', this.data.words.datas)
            // console.log(res.data)
            // console.log(this.data.words.datas)
            // console.log(this.data.words)
          }
          })
      }
    })

    if(this.data.index !== "" && this.data.chindex !== ""){
      this.setData({
        initial : false
      })
    }else  if(this.data.index === "" && this.data.chindex === ""){
      this.setData({
        initial : true
      })
    }
    this.bfb()
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
  //   bindViewTap: function () {
  //     wx.navigateTo({
  //       url: '../feedback/index'
  //     })
  // }
})