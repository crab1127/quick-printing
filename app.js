//app.js
const event = require('./utils/event.js')
import { login } from './utils/api'
App({
  event: new event(),
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  onLaunch: function() {
    this.login()

  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: function(res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  login(cb) {
    wx.login({
      success: function(res) {
        login(res.code)
          .then(res => {
            console.log(23425252, res)
          })
      }
    })
  },
  globalData: {
    userInfo: null,
    appInfo: null
  }
})