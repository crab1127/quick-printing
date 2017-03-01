// mine.js
import { PRINT_TYPE } from '../../utils/config'
var app = getApp()
Page({
  data: {
    width: 0,
    height: 0,
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
  onScan() {
    wx.scanCode({
      success: (res) => {
        console.log('scan', res)
      },
      fail: (err) => {
        console.log('扫码失败', err)
      }
    })
  },
  onPreview(e) {
    const id = e.currentTarget.dataset.id
    const currentType = PRINT_TYPE.find(item => id === item.id)
      // 4R，A4，证件, 明星片
    if ([1, 3, 4, 5].indexOf(id) !== -1) {
      wx.chooseImage({
        count: currentType.count, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res)
          wx.navigateTo({
            url: `../preview/preview?id=${id}&imageUrls=${res.tempFilePaths.join(',')}`
          })
        }
      })
    } else
    if (id === 6) {
      wx.showModal({
        title: '提示',
        content: '打印台历'
      })
    } else
    if (id === 2) {
      wx.showModal({
        title: '提示',
        content: '暂时还没开放文档打印功能'
      })
    }

  }
})