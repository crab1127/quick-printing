Page({
  data: {
    width: 0,
    height: 0,
    markers: [{
        iconPath: "./location.png",
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50,
        name: '我是谁',
        address: '我在哪'
      }, {
        iconPath: "./location.png",
        id: 1,
        longitude: 113.3245211,
        latitude: 23.10229,
        width: 50,
        height: 50,
        name: '我是谁',
        address: '我在哪'
      },
      {
        iconPath: "./location.png",
        id: 2,
        longitude: 113.324520,
        latitude: 23.10329,
        width: 50,
        height: 50,
        name: '我是谁',
        address: '我在哪'
      }
    ],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#000",
      width: 3,
      // dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: './green_tri.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
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
    const activeMarker = markers[e.markerId]
    wx.openLocation({
      longitude: Number(activeMarker.longitude),
      latitude: Number(activeMarker.latitude),
      name: activeMarker.name,
      address: activeMarker.address
    })
  },
  controltap(e) {
    console.log(e.controlId)
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