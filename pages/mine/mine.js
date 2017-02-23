// mine.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    myProfile: [{ "desc": "我的分币", "id": "coin" }, { "desc": "我问", "id": "myQues" }, { "desc": "我听", "id": "myHeared" }],
    newMasters: ["手机号码", "帮助", "结算说明", "关于分答"]
  },
  onLoad() {
    console.log('onLoad')
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
  onOrder() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail'
    })
  }
})