//app.js
const event = require('./utils/event.js')
import { login } from './utils/api'
App({
  event: new event(),
  onShow: function() {
    console.log('App Show')
    this.login()
  },
  onHide: function() {
    console.log('App Hide')
  },
  onLaunch: function() {
    console.log('App Launch')
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function(res) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail: function(err) {
              wx.showToast({
                title: '获取用户信息失败',
                icon: 'loading',
                duration: 2000
              })
            }
          })
        }
      })
    }
  },
  login(cb) {
    wx.showToast({
      title: '获取用户信息',
      icon: 'loading',
      duration: 10000
    })
    if (wx.getStorageSync('open_id') && wx.getStorageSync('userInfo')) {
      wx.hideToast()
    } else {
      wx.login({
        success: function(res) {
          // 获取用户信息
          wx.getUserInfo({
            success: function(res) {
              wx.setStorageSync('userInfo', res.userInfo)
            },
            fail: function(err) {
              wx.showToast({
                title: '获取用户信息失败',
                icon: 'loading',
                duration: 2000
              })
            }
          })

          // 获取openid
          login(res.code)
            .then(res => {
              wx.hideToast()
            })
            .catch(err => {
              wx.showToast({
                title: '获取用户id失败',
                icon: 'loading',
                duration: 2000
              })
            })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    appInfo: null
  }
})