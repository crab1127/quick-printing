// mine.js
var app = getApp()
Page({
  data: {
    width: 0,
    height: 0,
    userInfo: {},
    slides: [{
      name: '打印4R照片',
      img: '../../img/slide-2.png'
    }, {
      name: '打印文档',
      img: '../../img/slide-3.png'
    }, {
      name: '打印明信片',
      img: '../../img/slide-4.png'
    }, {
      name: '打印A4照片',
      img: '../../img/slide-5.png'
    }, {
      name: '打印证件照',
      img: '../../img/slide-6.png'
    }, {
      name: '打印台历',
      img: '../../img/slide-7.png'
    }]
  },
  onLoad() {
    app.getUserInfo((userInfo) => {
      //更新数据
      this.setData({
        userInfo: userInfo
      })
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })
      }
    })
  },
  onScan() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log('扫码失败', err)
      }
    })
  },
  onPreview() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        wx.navigateTo({
          url: '../preview/preview?imageUrls=' + res.tempFilePaths.join(',')
        })
      }
    })
  }
})