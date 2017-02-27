//app.js
const event = require('./utils/event.js')
App({
  event: new event(),
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  onLaunch: function() {
    try {
      wx.clearStorageSync()
    } catch (e) {}
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function(res1) {
          console.log('login', res1)
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})