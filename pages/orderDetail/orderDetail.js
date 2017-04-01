//index.js
//获取应用实例
import { getOrderDetail, delOrder, copyOrder } from '../../utils/api'
import { PRINT_TYPE } from '../../utils/config'
const app = getApp()
let currentType

Page({
  data: {
    base: null,
    detail: null,
    width: 0,
    height: 0,
    swiperHeight: 0,
    swiperWidth: 0
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

    // 身份证
    if (base.print_type_id === 303) {
      currentType = {
        width: 750,
        height: 1060
      }
    }

    this.setImgSize()

    getOrderDetail(base.id)
      .then(res => {
        this.setData({
          detail: res
        })
      })

  },
  onCopy() {
    wx.showToast({
      title: '重新获取打印码',
      icon: 'loading',
      duration: 10000
    })
    copyOrder(this.data.base.id)
      .then(res => {
        console.log(res)
        wx.hideToast()
        wx.navigateTo({
          url: '../print/print?print_code=' + res.result_message
        })
      })
      .catch(err => {
        console.log('addoreder-err', err)
        wx.hideToast()
        if (err.result_message) {
          wx.showModal({
            title: '获取打印码失败',
            content: err.result_message
          })
        } else {
          wx.showModal({
            title: '获取打印码失败',
            content: '微信报错：' + err.errMsg
          })
        }
      })
  },
  onDel(e) {
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

    const width = systemInfo.windowWidth
    const height = systemInfo.windowHeight - 66 - 130
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
      swiperHeight: height,
      swiperWidth: systemInfo.windowWidth,
      width: imgWidth,
      height: imgHeith
    })
  }
})