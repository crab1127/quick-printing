// mine.js
var app = getApp()
Page({
  data: {
    code: null
  },
  onLoad() {

  },
  findMap() {
    wx.switchTab({
      url: '../index/index'
    })
  }
})