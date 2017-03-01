import { salesNetwork } from '../../utils/api'
Page({
  data: {
    networks: null
  },
  controltap(e) {
    console.log(e.controlId)
    wx.navigateTo({
      url: '../networkMap/networkMap'
    })
  },
  onOpenLocation(e) {
    const { id } = e.currentTarget.dataset
    const { networks } = this.data
    const activeNetwork = networks.find(item => id == item.id)
    if (!activeNetwork.longitude || !activeNetwork.latitude) return;
    wx.openLocation({
      longitude: Number(activeNetwork.longitude),
      latitude: Number(activeNetwork.latitude),
      name: activeNetwork.name,
      address: activeNetwork.address
    })
  },
  onLoad() {
    wx.showNavigationBarLoading()
    salesNetwork()
      .then(res => {
        wx.hideNavigationBarLoading()
        console.log(12345, res)
        this.setData({
          networks: res
        })
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '获取网点信息失败',
          duration: 2000
        })
      })
  }
})