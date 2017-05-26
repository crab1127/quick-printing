//index.js
//获取应用实例
import { createPay, sendPay } from '../../utils/api'
import { json2Form, dateFormat } from '../../utils/util'
const app = getApp()

Page({
  data: {
    id: '',
    sn: '',
    name: '',
    type: '',
    count: '',
    createDate: '',
    pay_amount: '',
    isShow: false
  },
  onLoad: function(option) {
    console.log(option)
    this.option = option
    this.setData({
      id: option.id,
      sn: decodeURIComponent(option.qr_msg),
      name: decodeURIComponent(option.print_type_name),
      count: decodeURIComponent(option.print_count),
      type: decodeURIComponent(option.type),
      createDate: decodeURIComponent(option.create_time)
    })
    this.createPayOrder()
  },
  createPayOrder() {
    createPay(this.data.id, this.data.sn)
      .then(res => {
        this.setData({
          pay_amount: res.pay_amount,
          isShow: true
        })
        this.payInfo = res
      })
      .catch(err => {
        wx.showModal({
          title: '提示',
          content: err.result_message
        })
      })
  },
  onPay() {
    sendPay(this.payInfo)
      .then(res => {
        wx.navigateTo({
          url: '../print/print?' + json2Form(this.option)
        })
      })
  }
})