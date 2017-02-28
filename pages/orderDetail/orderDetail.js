//index.js
//获取应用实例
import { getOrderDetail, delOrder } from '../../utils/api'
const app = getApp()
Page({
  data: {
    base: null,
    detail: null
  },
  onLoad: function(option) {
    console.log(option)
    this.setData({
      base: option
    })
    getOrderDetail(option.id)
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

  }
})