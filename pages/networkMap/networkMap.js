import { salesNetwork } from '../../utils/api'
Page({
  data: {
    width: 0,
    height: 0,
    markers: null,
    controls: [{
      id: 1,
      iconPath: '/img/list.png',
      position: {
        left: 300,
        top: 10,
        width: 40,
        height: 25
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
    const { markers } = this.data
    const activeMarker = markers.find(item => e.markerId == item.id)
    wx.openLocation({
      longitude: Number(activeMarker.longitude),
      latitude: Number(activeMarker.latitude),
      name: activeMarker.name,
      address: activeMarker.address
    })
  },
  controltap(e) {
    wx.navigateTo({
      url: '../networkList/networkList'
    })
  },
  onLoad() {
    wx.showNavigationBarLoading()
    wx.getSystemInfo({
      success: (res) => {

        this.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          'controls[0].position.left': res.windowWidth - 50
        })
      }
    })
    salesNetwork()
      .then(res => {
        wx.hideNavigationBarLoading()
        const networks = res.filter(item => item.longitude && item.latitude)
        console.log(networks)
        this.setData({
          markers: networks
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