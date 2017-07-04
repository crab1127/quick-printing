// mine.js
import { PRINT_TYPE } from '../../utils/config'
var app = getApp()
Page({
  data: {
    width: 0,
    height: 0,
    current: 0,
    slides: PRINT_TYPE
  },
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })
      }
    })
  },
  onSlideChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  onLeft() {
    const current = this.data.current
    if (current > 0) {
      this.setData({
        current: current - 1
      })
    }
  },
  onRight() {
    const current = this.data.current
    if (current < PRINT_TYPE.length - 1) {
      this.setData({
        current: current + 1
      })
    }
  },
  onPreview(e) {
    console.log(24235352342423)
    const id = parseInt(e.currentTarget.dataset.id)
    const currentType = PRINT_TYPE.find(item => id == item.id)

    // 身份证
    if (id === 7) {
      wx.navigateTo({
        url: `../preview/preview?id=${id}`
      })
    }
    // 4R，A4，证件, 明星片
    if ([1, 2, 3, 4, 5].indexOf(id) !== -1) {
      wx.chooseImage({
        count: currentType.count, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res)
          wx.navigateTo({
            url: `../preview/preview?id=${id}&imageUrls=${res.tempFilePaths.join(',')}`
          })
        }
      })
    }
    // else
    // if (id === 6) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '打印台历'
    //   })
    // } else
    // if (id === 2) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '暂时还没开放文档打印功能'
    //   })
    // }

  }
})