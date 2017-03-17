// mine.js
import { getOrder } from '../../utils/api'
import { json2Form } from '../../utils/util'

var app = getApp()
Page({
  data: {
    userInfo: {},
    tabNav: ['全部', '待打印', '已打印'],
    orderList: [],
    activeOrderList: [],
    activeTab: 0,
    hidden: true,
    page: {
      page_size: 10,
      page_index: 1,
      page_count: null
    },
  },
  requestFlag: false,
  onShow: function() {
    app.getUserInfo((userInfo) => {
      console.log(12, userInfo)

      //更新数据
      this.setData({
        userInfo: userInfo
      })
    })
    this.loadOrder()
  },
  onLoad() {
    // 删除
    app.event.on('delOrder', (id) => {
      const { orderList, activeOrderList } = this.data
      orderList.forEach((item, index) => {
        if (item.id == id) {
          orderList.splice(index, 1)
        }
      })
      activeOrderList.forEach((item, index) => {
        if (item.id == id) {
          activeOrderList.splice(index, 1)
        }
      })
      this.setData({
        orderList,
        activeOrderList
      })
    })

    // 添加
    app.event.on('newOrder', res => {
      const { orderList, activeOrderList, activeTab } = this.data
      orderList.unshift(res)
      if (activeTab == 0 || activeTab == 1) {
        activeOrderList.unshift(res)
      }
      this.setData({
        orderList,
        activeOrderList
      })
    })
  },
  loadOrder() {
    wx.showNavigationBarLoading()
    const { page, orderList } = this.data
    getOrder(page)
      .then(res => {
        wx.hideNavigationBarLoading()

        const newOrderList = orderList.concat(res.print_order_list)

        if (newOrderList.length < res.page_count) {
          this.requestFlag = false
        }
        this.setData({
          hidden: false,
          orderList: newOrderList,
          page: {
            page_size: 10,
            page_index: page.page_index + 1,
            page_count: res.page_count
          }
        })
        this.getActiveOrderList()
      })
  },
  getActiveOrderList() {
    const { activeTab, orderList } = this.data
    let activeOrderList
    if (activeTab === 0) {
      activeOrderList = orderList
    } else
    if (activeTab === 1) {
      activeOrderList = orderList.filter(item => item.print_order_status_id == '101')
    } else
    if (activeTab === 2) {
      activeOrderList = orderList.filter(item => item.print_order_status_id == '102')
    }

    this.setData({
      activeOrderList: activeOrderList
    })
  },
  lower() {
    if (this.requestFlag === false) {
      this.requestFlag = true
      this.setData({
        hidden: true
      })
      setTimeout(this.loadOrder, 3000)
    }
  },
  onTabNav(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      activeTab: index
    })
    this.getActiveOrderList()
  },
  onOrder(e) {
    const id = e.currentTarget.dataset.id
    const orderList = this.data.orderList
    const currentOrder = orderList.find(item => id == item.id)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?ac=' + encodeURIComponent(JSON.stringify(currentOrder))
    })
  }
})