Page({
  data: {
    width: 0,
    height: 0,
    markers: [{
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园zz',
      desc: '我现在的位置'
    }]
  },

  onLoad() {
    console.log('onLoad')
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })
      }
    })

  }
})