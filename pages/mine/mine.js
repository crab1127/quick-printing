// mine.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    tabNav: ['全部', '待打印', '以打印'],
    activeTab: 1
  },
  onLoad() {
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      //更新数据
      this.setData({
        userInfo: userInfo
      })
      console.log(userInfo)

    })
  },
  onShow() {
    console.info("show")
  },
  loadProfile(e) {
    console.log(e.target)
  },
  onTabNav(e) {
    const index = e.currentTarget.dataset.index

    this.setData({
      activeTab: index
    })
  },
  onOrder() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail'
    })
  }
})