// app.js
var hotapp = require('utils/hotapp.js');
App({
  userInfo: {},
  onLaunch() {
    this.onrequestbook()
    this.onrequestword()
    wx.hideTabBar({})
    hotapp.init('hotapp809123421');
    hotapp.setDebug(true);
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.setStorage({
      data: this.userInfo,
      key: 'userInfo',
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  onError: function (msg) {
    //错误日志上传 (版本号：2.0.0，自定义在这里，上传服务器)
    hotapp.onError(msg, '2.0.0', function (err) {
    })
  },

  globalData: {
    userInfo: null,
    hotapp: hotapp
  },

  wordBooks: [],
  words: [],
  allwords: [],
  onrequestbook: function () {
    wx.request({
      url: 'http://rw.ylapi.cn/reciteword/list.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201',
      data: {},
      success: res => {
        for (var i = 0; i < 29; i++) {
          res.data.datas[i].course_num = parseInt(res.data.datas[i].course_num)
        }
        this.wordBooks = res.data
        wx.setStorage({
          data: this.wordBooks,
          key: 'wordBooks',
          success: (res) => {
          },
          fail: (res) => {},
          complete: (res) => {},
        })
        // console.log(this.wordBooks)
        var index1 = wx.getStorageSync('index')
        var chindex1 = wx.getStorageSync('chindex')
        // console.log(index1)
        var classId = this.wordBooks.datas[index1].child_list[chindex1].class_id
      }
    })
  },
  oldDate :0,
  course:1,
  onrequestword: function () {
    var index1 = wx.getStorageSync('index')
    var chindex1 = wx.getStorageSync('chindex')
    if(wx.getStorageSync('oldDate') != 0){
      this.oldDate = wx.getStorageSync('oldDate')
      // console.log(this.oldDate)
    }else{
      wx.setStorageSync('oldDate', new Date().getDate())
    }
    // console.log(new Date().getDate())
    wx.setStorageSync('course', this.course)

    this.course = wx.getStorageSync('course')
    if(new Date().getDate() > this.oldDate){
      wx.setStorageSync('click',0)
      this.course++
    }
    wx.setStorageSync('course', this.course)
    wx.setStorageSync('oldDate', new Date().getDate())
    // console.log(this.course)
    wx.request({
      url: 'http://rw.ylapi.cn/reciteword/list.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201',
      data: {},
      success: res => {
        wx.setStorage({
          data: this.wordBooks,
          key: 'wordBooks',
          success: (res) => {
          },
          fail: (res) => {},
          complete: (res) => {},
        })
        for (var i = 0; i < 29; i++) {
          res.data.datas[i].course_num = parseInt(res.data.datas[i].course_num)
        }
        var index1 = wx.getStorageSync('index')
        var chindex1 = wx.getStorageSync('chindex')
        // console.log(this.wordBooks)
        var classId = this.wordBooks.datas[index1].child_list[chindex1].class_id
        var course_num = this.wordBooks.datas[index1].child_list[chindex1].course_num
        if (this.course > course_num){
          wx.setStorageSync('course', 1)
        }
        // if(wx.getStorageSync('classId')){
        //   if(wx.getStorageSync('classId') != classId){
        //     this.course = 1
        //     wx.setStorageSync('course', 1)
        //   }
        // }else{
        //   wx.setStorageSync('classId', classId)
        // }
        wx.request({
          url: `http://rw.ylapi.cn/reciteword/wordlist.u?uid=12008&appkey=a7a3bf24a23f990792367eb790b8f201&class_id=${classId}&course=${this.course}`,
          data: {},
          success: res => {
            this.words = res.data
            wx.setStorage({
              data: this.words,
              key: 'words',
              success: (res) => {},
              fail: (res) => {},
              complete: (res) => {},
            })
            // console.log(this.words)
          }
        })
      }
    })
  },
})