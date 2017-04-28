//index.js
//获取应用实例
import { createPay, sendPay } from '../../utils/api'
import { json2Form, dateFormat } from '../../utils/util'
const app = getApp()

Page({
  data: {
    id: ''
  },
  onLoad: function(option) {
    this.option = option
    this.setData({
      id: option.print_order_id
    })
  },
  onPay() {
    createPay(this.data.id)
      .then(res => {
        console.log(123, res)
        return sendPay(res)
      })
      .then(res => {
        wx.navigateTo({
          url: '../print/print?' + json2Form(this.option)
        })
      })
      .catch(err => {
        console.error(23, err)
      })
  }
})