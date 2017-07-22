// mine.js
import { PRINT_TYPE } from '../../utils/config'
import { uploadFile } from '../../utils/api'
import { showLoading, hideLoading } from '../../utils/util'
var app = getApp()
Page({
  data: {
    slides: PRINT_TYPE
  },
  onLoad() {},
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
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {

          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function(imgInfo) {
              wx.navigateTo({
                url: `../preview/preview?id=${id}&imageUrl=${encodeURIComponent(res.tempFilePaths[0])}&}&width=${imgInfo.width}&height=${imgInfo.height}`
              })
            }
          })
          
        }
      })
    }
  }
})