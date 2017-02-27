// mine.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    current: 0,
    type: 1,
    imgUrls: []
  },
  onLoad(option) {
    if (!option.imageUrls) {
      wx.navigateTo({
        url: '../index/index'
      })
    }

    const imgUrls = option.imageUrls.split(',')

    // const imgUrls = [{
    //   url: "wxfile://tmp_765166448o6zAJs22dwC_vej-pk7EQJoTUTPw1488003598511.png",
    //   originUrl: "wxfile://tmp_765166448o6zAJs22dwC_vej-pk7EQJoTUTPw1488003598511.png"
    // }]
    const ac = imgUrls.map(item => {
      return {
        'url': item,
        'originUrl': item
      }
    })
    this.setData({
      imgUrls: ac
    })
    app.event.on('img', (data) => {
      const { imgUrls } = this.data
      imgUrls[data.index] = data.data
      this.setData({
        imgUrls: imgUrls
      })
    })
  },
  onEdit() {
    const img = {
      index: this.data.current,
      data: this.data.imgUrls[this.data.current]
    }
    wx.navigateTo({
      url: '../cropper/cropper?img=' + JSON.stringify(img)
    })
  },
  onPrint() {
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