//index.js
//获取应用实例
import { getOrderDetail, delOrder } from '../../utils/api'
import { PRINT_TYPE } from '../../utils/config'
const app = getApp()
let currentType

Page({
  data: {
    base: null,
    detail: null,
    width: 0,
    height: 0
  },
  onLoad: function(option) {
    console.log(option)
    const base = JSON.parse(decodeURIComponent(option.ac))

    this.setData({
      base: base
    })

    currentType = PRINT_TYPE.find(item => base.print_type_id == item.type_id) || {
      width: 330,
      height: 480
    }
    this.setImgSize()

    getOrderDetail(base.id)
      .then(res => {
        this.setData({
          detail: res
        })
      })

  },
  onDel: function(e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除订单？',
      success: (res) => {
        if (res.confirm) {
          delOrder(this.data.base.id)
            .then(res => {
              wx.showToast({
                title: '删除订单成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(() => wx.navigateBack(), 1500);
              app.event.emit('delOrder', this.data.base.id)
            })
            .catch(err => {
              wx.showToast({
                title: '删除订单失败, 请重试',
                duration: 2000
              })
            })
        }
      }
    })

  },
  setImgSize() {
    const systemInfo = wx.getSystemInfoSync()

    const width = systemInfo.windowWidth - 40
    const height = systemInfo.windowHeight - 66 - 40
    let imgWidth
    let imgHeith
    if (width / height > currentType.width / currentType.height) {
      imgHeith = height
      imgWidth = height * currentType.width / currentType.height
    } else {
      imgWidth = width
      imgHeith = width * currentType.height / currentType.width
    }
    this.setData({
      width: imgWidth,
      height: imgHeith
    })
  }
})