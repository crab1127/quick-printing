// mine.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    current: 0,
    imgUrls: []
  },
  onLoad(option) {
    if (!option.imageUrls) {
      wx.navigateTo({
        url: '../index/index'
      })
    }
    const imageUrls = option.imageUrls.split(',')
    this.setData({
      imgUrls: imageUrls
    })
  },
  onEdit() {

  },
  onPrint() {
    // this.imgUrls.froEach(imgUrl => {
    //   wx.uploadFile({
    //     url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
    //     filePath: imgUrl,
    //     header: {
    //       'content-type': 'multipart/form-data'
    //     },
    //     name: 'file',
    //     success: function(res) {
    //       var data = res.data

    //     }
    //   })
    // })

    wx.navigateTo({
      url: '../print/print'
    })
  },
  onSlideChange(e) {
    this.setData({
      current: e.detail.current
    })
  }
})