// mine.js
var app = getApp()
Page({
  data: {
    code: null
  },
  onLoad(option) {
    this.setData({
      code: option.print_code
    })
  },
})